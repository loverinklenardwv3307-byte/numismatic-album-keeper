import { cleanCountryLabel, normalizeCountryKey } from '../constants/countries';
import { NOT_GRADED } from '../constants/grades';
import type { Album, CatalogSnapshot, Coin, CoinDraft, Settings } from '../models/catalog';

let idCounter = 0;
export function makeId(prefix: string): string {
  idCounter += 1;
  return prefix + '-' + Date.now().toString(36) + '-' + idCounter.toString(36);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export const DEFAULT_SETTINGS: Settings = {
  defaultGradeScale: 'simple',
  hapticsEnabled: true,
  reduceMotion: false,
  lastAlbumId: null,
};

/** Exactly one album per normalized country key. */
export function findAlbumByCountry(albums: Album[], countryKey: string): Album | null {
  for (const album of albums) {
    if (album.countryKey === countryKey) {
      return album;
    }
  }
  return null;
}

export function albumById(albums: Album[], id: string | null): Album | null {
  if (!id) {
    return null;
  }
  for (const album of albums) {
    if (album.id === id) {
      return album;
    }
  }
  return null;
}

export function coinById(coins: Coin[], id: string | null): Coin | null {
  if (!id) {
    return null;
  }
  for (const coin of coins) {
    if (coin.id === id) {
      return coin;
    }
  }
  return null;
}

export function coinsInAlbum(coins: Coin[], albumId: string): Coin[] {
  return coins.filter(coin => coin.albumId === albumId);
}

export function countCoins(coins: Coin[], albumId: string): number {
  let total = 0;
  for (const coin of coins) {
    if (coin.albumId === albumId) {
      total += 1;
    }
  }
  return total;
}

export function createAlbum(countryLabel: string, builtIn: boolean): Album {
  const label = cleanCountryLabel(countryLabel);
  const stamp = nowIso();
  return {
    id: makeId('album'),
    countryKey: normalizeCountryKey(label),
    countryLabel: label,
    builtIn,
    createdAt: stamp,
    updatedAt: stamp,
  };
}

/**
 * Commits one draft into the snapshot: creates the album when needed,
 * then inserts or updates exactly one coin. Pure, returns a new snapshot.
 */
export function commitDraft(
  snapshot: CatalogSnapshot,
  draft: CoinDraft,
): { snapshot: CatalogSnapshot; coinId: string } {
  const stamp = nowIso();
  const label = cleanCountryLabel(draft.countryLabel);
  const key = draft.countryKey || normalizeCountryKey(label);

  let albums = snapshot.albums;
  let album = findAlbumByCountry(albums, key);
  if (album === null) {
    const created: Album = {
      id: makeId('album'),
      countryKey: key,
      countryLabel: label,
      builtIn: false,
      createdAt: stamp,
      updatedAt: stamp,
    };
    album = created;
    albums = albums.concat([created]);
  } else {
    const target = album.id;
    albums = albums.map(item => (item.id === target ? { ...item, updatedAt: stamp } : item));
  }

  const base = {
    albumId: album.id,
    title: draft.title.trim(),
    year: draft.yearKnown ? draft.year : null,
    era: draft.era,
    mintMark: draft.mintMark.trim(),
    gradeScale: draft.gradeScale,
    grade: draft.grade === NOT_GRADED ? null : draft.grade,
    notes: draft.notes.trim(),
    frontFace: draft.frontFace,
    backFace: draft.backFace,
    updatedAt: stamp,
  };

  let coins: Coin[];
  let coinId: string;

  const existing = coinById(snapshot.coins, draft.editingCoinId);
  if (existing !== null) {
    coinId = existing.id;
    coins = snapshot.coins.map(coin => (coin.id === coinId ? { ...coin, ...base } : coin));
  } else {
    coinId = makeId('coin');
    const created: Coin = { id: coinId, createdAt: stamp, ...base };
    coins = [created].concat(snapshot.coins);
  }

  return {
    snapshot: {
      ...snapshot,
      revision: snapshot.revision + 1,
      albums,
      coins,
      settings: { ...snapshot.settings, lastAlbumId: album.id },
    },
    coinId,
  };
}

export function deleteCoin(snapshot: CatalogSnapshot, coinId: string): CatalogSnapshot {
  return {
    ...snapshot,
    revision: snapshot.revision + 1,
    coins: snapshot.coins.filter(coin => coin.id !== coinId),
  };
}

/** Matching country, normalized title, date and mint mark. Never blocks a save. */
export function findDuplicate(
  coins: Coin[],
  albumId: string | null,
  draft: CoinDraft,
): Coin | null {
  if (!albumId) {
    return null;
  }
  const title = draft.title.trim().toLowerCase();
  if (title.length === 0) {
    return null;
  }
  const year = draft.yearKnown ? draft.year : null;
  const mint = draft.mintMark.trim().toLowerCase();
  for (const coin of coins) {
    if (coin.id === draft.editingCoinId) {
      continue;
    }
    if (
      coin.albumId === albumId &&
      coin.title.trim().toLowerCase() === title &&
      coin.year === year &&
      (year === null || coin.era === draft.era) &&
      coin.mintMark.trim().toLowerCase() === mint
    ) {
      return coin;
    }
  }
  return null;
}

export type EraBucket = {
  key: string;
  label: string;
  count: number;
};

const BUCKETS: Array<{ key: string; label: string; test: (coin: Coin) => boolean }> = [
  { key: 'bce', label: 'BCE', test: c => c.year !== null && c.era === 'BCE' },
  {
    key: 'pre1800',
    label: '1 to 1799 CE',
    test: c => c.year !== null && c.era === 'CE' && c.year < 1800,
  },
  {
    key: 'c19',
    label: '1800 to 1899',
    test: c => c.year !== null && c.era === 'CE' && c.year >= 1800 && c.year < 1900,
  },
  {
    key: 'c20',
    label: '1900 to 1999',
    test: c => c.year !== null && c.era === 'CE' && c.year >= 1900 && c.year < 2000,
  },
  {
    key: 'c21',
    label: '2000 onward',
    test: c => c.year !== null && c.era === 'CE' && c.year >= 2000,
  },
  { key: 'unknown', label: 'Unknown date', test: c => c.year === null },
];

/** Every coin lands in exactly one bucket; the buckets sum to the collected total. */
export function eraBuckets(coins: Coin[]): EraBucket[] {
  return BUCKETS.map(bucket => ({
    key: bucket.key,
    label: bucket.label,
    count: coins.reduce((sum, coin) => (bucket.test(coin) ? sum + 1 : sum), 0),
  })).filter(bucket => bucket.count > 0);
}

export type CountryCount = {
  albumId: string;
  label: string;
  count: number;
};

export function countryCounts(albums: Album[], coins: Coin[]): CountryCount[] {
  const rows = albums.map(album => ({
    albumId: album.id,
    label: album.countryLabel,
    count: countCoins(coins, album.id),
  }));
  rows.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.label.localeCompare(b.label);
  });
  return rows;
}

export function emptyDraft(settings: Settings): CoinDraft {
  return {
    editingCoinId: null,
    countryKey: null,
    countryLabel: '',
    title: '',
    yearKnown: false,
    year: new Date().getFullYear(),
    era: 'CE',
    mintMark: '',
    gradeScale: settings.defaultGradeScale,
    grade: null,
    notes: '',
    frontFace: null,
    backFace: null,
  };
}

export function draftFromCoin(coin: Coin, album: Album | null): CoinDraft {
  return {
    editingCoinId: coin.id,
    countryKey: album ? album.countryKey : null,
    countryLabel: album ? album.countryLabel : '',
    title: coin.title,
    yearKnown: coin.year !== null,
    year: coin.year === null ? new Date().getFullYear() : coin.year,
    era: coin.era,
    mintMark: coin.mintMark,
    gradeScale: coin.gradeScale,
    grade: coin.grade,
    notes: coin.notes,
    frontFace: coin.frontFace,
    backFace: coin.backFace,
  };
}
