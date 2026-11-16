import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import BottomTabBar from '../components/BottomTabBar';
import type { RootTab } from '../components/BottomTabBar';
import CountBarRow from '../components/CountBarRow';
import EmptyState from '../components/EmptyState';
import MaterialCard from '../components/MaterialCard';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import { Coins, Plus } from '../components/icons';
import { theme } from '../constants/theme';
import { useCollectionStats } from '../hooks/useCollectionStats';
import { coinWord, countryWord, formatCount } from '../utils/format';

type Props = {
  onOpenAlbum: (albumId: string) => void;
  onStartCataloging: () => void;
  onSelectTab: (tab: RootTab) => void;
};

const SECTIONS = ['summary', 'country', 'era'];

/** Derived from committed records only. Counts are printed, never implied. */
function StatsScreen({ onOpenAlbum, onStartCataloging, onSelectTab }: Props) {
  const stats = useCollectionStats();
  const { collected, countries, byCountry, byEra, largestCountry } = stats;

  const maxEra = useMemo(() => {
    let max = 0;
    for (const bucket of byEra) {
      if (bucket.count > max) {
        max = bucket.count;
      }
    }
    return max;
  }, [byEra]);

  const renderItem = useCallback(
    ({ item }: { item: string }) => {
      if (item === 'summary') {
        return (
          <View>
            <MaterialCard variant="velvet" style={styles.total}>
              <Text style={styles.totalValue}>{formatCount(collected)}</Text>
              <Text style={styles.totalLabel}>{coinWord(collected) + ' recorded'}</Text>
            </MaterialCard>

            {collected > 0 && countries > 0 ? (
              <View style={styles.statsRow}>
                <View style={styles.statSlot}>
                  <StatCard
                    Icon={Coins}
                    value={formatCount(countries)}
                    label={countryWord(countries) + ' represented'}
                    valueColor={theme.colors.material.bronze}
                  />
                </View>
                <View style={styles.statSlot}>
                  <StatCard
                    Icon={Coins}
                    value={formatCount(byEra.length)}
                    label="date groups used"
                    valueColor={theme.colors.material.greenDeep}
                  />
                </View>
              </View>
            ) : (
              <Text style={styles.plainSummary}>
                Add your first coin to start the country and date breakdowns.
              </Text>
            )}
          </View>
        );
      }

      if (item === 'country') {
        if (byCountry.length === 0) {
          return null;
        }
        return (
          <MaterialCard style={styles.card}>
            <Text style={styles.cardTitle}>By country</Text>
            {byCountry.map(row => (
              <CountBarRow
                key={row.albumId}
                id={row.albumId}
                label={row.label}
                count={row.count}
                maxCount={largestCountry}
                onPress={onOpenAlbum}
              />
            ))}
            <View style={styles.divider} />
            <Text style={styles.cardFooter}>
              {'Total ' + formatCount(collected) + ' ' + coinWord(collected)}
            </Text>
          </MaterialCard>
        );
      }

      if (byEra.length === 0) {
        return null;
      }
      return (
        <MaterialCard style={styles.card}>
          <Text style={styles.cardTitle}>By date group</Text>
          <Text style={styles.cardHint}>
            Date buckets from the years you entered, not historical periods.
          </Text>
          {byEra.map(bucket => (
            <CountBarRow
              key={bucket.key}
              id={bucket.key}
              label={bucket.label}
              count={bucket.count}
              maxCount={maxEra}
            />
          ))}
        </MaterialCard>
      );
    },
    [byCountry, byEra, collected, countries, largestCountry, maxEra, onOpenAlbum],
  );

  const keyExtractor = useCallback((item: string) => item, []);

  const empty = useMemo(
    () => (
      <EmptyState
        title="No collection stats yet"
        description="Country and date breakdowns appear once the first coin is recorded."
      />
    ),
    [],
  );

  return (
    <AppShell variant="paper">
      <ScreenHeader title="Collection Stats" subtitle="From your saved records" />

      <FlatList
        data={collected > 0 ? SECTIONS : []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={empty}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.dock}>
        <Text style={styles.dockHint}>Every record is one physical coin</Text>
        <PrimaryButton label="START CATALOGING" onPress={onStartCataloging} Icon={Plus} />
      </View>

      <BottomTabBar active="stats" onSelect={onSelectTab} />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  total: {
    minHeight: 104,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  totalValue: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: theme.colors.text.onVelvet,
    fontVariant: ['tabular-nums'],
  },
  totalLabel: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: theme.colors.material.silver,
  },
  statsRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  statSlot: {
    flex: 1,
  },
  plainSummary: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text.secondary,
  },
  card: {
    marginTop: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  cardHint: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
    marginBottom: 6,
  },
  divider: {
    marginTop: 8,
    marginBottom: 8,
    height: 1,
    backgroundColor: theme.colors.ui.divider,
  },
  cardFooter: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  dock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: theme.colors.ui.paper,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderTopWidth: 1,
    borderColor: theme.colors.ui.borderBronze,
  },
  dockHint: {
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.secondary,
  },
});

export default React.memo(StatsScreen);
