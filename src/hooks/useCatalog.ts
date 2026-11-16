import { useCallback, useSyncExternalStore } from 'react';
import { SAVE_COMMIT_MS } from '../constants/config';
import type { CatalogSnapshot, Coin, CoinDraft, Settings } from '../models/catalog';
import {
  DEFAULT_SETTINGS,
  commitDraft,
  createAlbum,
  deleteCoin,
  nowIso,
} from '../game/catalogLogic';

/**
 * A tiny external store. Screens subscribe through selectors so a single
 * card re-render never pulls in the whole catalog.
 */

function seed(): CatalogSnapshot {
  const germany = createAlbum('Germany', true);
  const unitedStates = createAlbum('United States', true);
  const japan = createAlbum('Japan', true);
  const romanEmpire = createAlbum('Roman Empire', true);
  const stamp = nowIso();

  const coins: Coin[] = [
    {
      id: 'coin-seed-1',
      albumId: germany.id,
      title: '2 euro, Brandenburg Gate',
      year: 2006,
      era: 'CE',
      mintMark: 'J',
      gradeScale: 'simple',
      grade: 'Extremely fine',
      notes: 'Found in change at a market stall in Hamburg. Light cabinet toning on the rim.',
      frontFace: 0,
      backFace: 1,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'coin-seed-2',
      albumId: germany.id,
      title: '1 mark',
      year: 1950,
      era: 'CE',
      mintMark: 'D',
      gradeScale: 'simple',
      grade: 'Very fine',
      notes: '',
      frontFace: 2,
      backFace: 3,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'coin-seed-3',
      albumId: unitedStates.id,
      title: 'Liberty dime',
      year: 1941,
      era: 'CE',
      mintMark: 'S',
      gradeScale: 'numeric',
      grade: 63,
      notes: 'Full bands on the reverse. Kept in the navy mount, never cleaned.',
      frontFace: 0,
      backFace: 1,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'coin-seed-4',
      albumId: unitedStates.id,
      title: 'Wheat cent',
      year: 1919,
      era: 'CE',
      mintMark: '',
      gradeScale: 'simple',
      grade: 'Good',
      notes: '',
      frontFace: 2,
      backFace: null,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'coin-seed-5',
      albumId: japan.id,
      title: '100 yen',
      year: 1964,
      era: 'CE',
      mintMark: '',
      gradeScale: 'simple',
      grade: 'Uncirculated',
      notes: 'Olympic commemorative, kept in its original paper sleeve.',
      frontFace: 1,
      backFace: 0,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'coin-seed-6',
      albumId: romanEmpire.id,
      title: 'Bronze as',
      year: 54,
      era: 'BCE',
      mintMark: '',
      gradeScale: 'simple',
      grade: 'Fair',
      notes: 'Surface worn smooth on one side. Date is the dealer attribution, not verified.',
      frontFace: 3,
      backFace: null,
      createdAt: stamp,
      updatedAt: stamp,
    },
  ];

  return {
    schemaVersion: 1,
    revision: 1,
    albums: [germany, unitedStates, japan, romanEmpire],
    coins,
    settings: { ...DEFAULT_SETTINGS, lastAlbumId: germany.id },
  };
}

let snapshot: CatalogSnapshot = seed();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CatalogSnapshot {
  return snapshot;
}

function setSnapshot(next: CatalogSnapshot) {
  snapshot = next;
  emit();
}

/** Subscribe to one slice only. Slices keep their identity between commits. */
export function useCatalogSelector<T>(selector: (state: CatalogSnapshot) => T): T {
  return useSyncExternalStore(
    subscribe,
    useCallback(() => selector(getSnapshot()), [selector]),
  );
}

const selectAlbums = (state: CatalogSnapshot) => state.albums;
const selectCoins = (state: CatalogSnapshot) => state.coins;
const selectSettings = (state: CatalogSnapshot) => state.settings;
const selectRevision = (state: CatalogSnapshot) => state.revision;

export function useAlbums() {
  return useCatalogSelector(selectAlbums);
}

export function useCoins() {
  return useCatalogSelector(selectCoins);
}

export function useSettings() {
  return useCatalogSelector(selectSettings);
}

export function useRevision() {
  return useCatalogSelector(selectRevision);
}

/** Reads the current state outside of render, for callbacks. */
export function readCatalog(): CatalogSnapshot {
  return snapshot;
}

/**
 * Commits one record. Resolves with the stored coin id only after the
 * snapshot has actually been replaced, so the result screen never claims
 * a save that did not happen.
 */
export function saveCoin(draft: CoinDraft): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      const result = commitDraft(snapshot, draft);
      setSnapshot(result.snapshot);
      resolve(result.coinId);
    }, SAVE_COMMIT_MS);
  });
}

export function removeCoin(coinId: string) {
  setSnapshot(deleteCoin(snapshot, coinId));
}

export function updateSettings(patch: Partial<Settings>) {
  setSnapshot({
    ...snapshot,
    revision: snapshot.revision + 1,
    settings: { ...snapshot.settings, ...patch },
  });
}

export function rememberAlbum(albumId: string | null) {
  if (snapshot.settings.lastAlbumId === albumId) {
    return;
  }
  updateSettings({ lastAlbumId: albumId });
}
