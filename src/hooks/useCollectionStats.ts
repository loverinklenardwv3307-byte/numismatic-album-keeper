import { useMemo } from 'react';
import { countryCounts, eraBuckets } from '../game/catalogLogic';
import type { CountryCount, EraBucket } from '../game/catalogLogic';
import { useAlbums, useCoins } from './useCatalog';

export type CollectionStats = {
  collected: number;
  countries: number;
  byCountry: CountryCount[];
  byEra: EraBucket[];
  largestCountry: number;
};

/** Derived from committed records only. Drafts never enter these totals. */
export function useCollectionStats(): CollectionStats {
  const albums = useAlbums();
  const coins = useCoins();

  return useMemo(() => {
    const byCountry = countryCounts(albums, coins).filter(row => row.count > 0);
    const byEra = eraBuckets(coins);
    let largest = 0;
    for (const row of byCountry) {
      if (row.count > largest) {
        largest = row.count;
      }
    }
    return {
      collected: coins.length,
      countries: byCountry.length,
      byCountry,
      byEra,
      largestCountry: largest,
    };
  }, [albums, coins]);
}
