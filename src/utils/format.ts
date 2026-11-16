import type { Coin, Era } from '../models/catalog';

/** Locale-grouped integers. Never a currency symbol. */
export function formatCount(value: number): string {
  return value.toLocaleString();
}

export function coinWord(value: number): string {
  return value === 1 ? 'coin' : 'coins';
}

export function countryWord(value: number): string {
  return value === 1 ? 'country' : 'countries';
}

export function formatYear(year: number | null, era: Era): string {
  if (year === null) {
    return 'Year unknown';
  }
  return String(year) + ' ' + era;
}

export function formatCoinDate(coin: Coin): string {
  return formatYear(coin.year, coin.era);
}

/** Chronological order: BCE descends before CE ascends; unknown sorts last. */
export function chronoKey(coin: Coin): number {
  if (coin.year === null) {
    return Number.POSITIVE_INFINITY;
  }
  return coin.era === 'BCE' ? -coin.year : coin.year;
}

export function formatDateLabel(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed.toLocaleDateString();
}
