import React, { useCallback, useMemo } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import AlbumCard from '../components/AlbumCard';
import AppShell from '../components/AppShell';
import BottomTabBar from '../components/BottomTabBar';
import type { RootTab } from '../components/BottomTabBar';
import EmptyState from '../components/EmptyState';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import StatCard from '../components/StatCard';
import ScreenHeader from '../components/ScreenHeader';
import { Coins, Plus } from '../components/icons';
import { theme } from '../constants/theme';
import { useAlbums, useCoins } from '../hooks/useCatalog';
import type { Album } from '../models/catalog';
import { coinWord, countryWord, formatCount } from '../utils/format';

type Props = {
  onOpenAlbum: (albumId: string) => void;
  onStartCataloging: () => void;
  onSelectTab: (tab: RootTab) => void;
};

type Row = {
  album: Album;
  count: number;
  faces: number[];
};

/** Albums root, M4 asymmetric editorial composition. */
function MenuScreen({ onOpenAlbum, onStartCataloging, onSelectTab }: Props) {
  const albums = useAlbums();
  const coins = useCoins();

  const rows = useMemo<Row[]>(() => {
    const byAlbum = new Map<string, { count: number; faces: number[] }>();
    for (const album of albums) {
      byAlbum.set(album.id, { count: 0, faces: [] });
    }
    for (const coin of coins) {
      const entry = byAlbum.get(coin.albumId);
      if (!entry) {
        continue;
      }
      entry.count += 1;
      if (entry.faces.length < 3 && coin.frontFace !== null) {
        entry.faces.push(coin.frontFace);
      }
    }
    return albums
      .map(album => {
        const entry = byAlbum.get(album.id);
        return {
          album,
          count: entry ? entry.count : 0,
          faces: entry ? entry.faces : [],
        };
      })
      .sort((a, b) => a.album.countryLabel.localeCompare(b.album.countryLabel));
  }, [albums, coins]);

  const collected = coins.length;
  const countries = rows.reduce((sum, row) => (row.count > 0 ? sum + 1 : sum), 0);

  const renderItem = useCallback(
    ({ item }: { item: Row }) => (
      <AlbumCard
        albumId={item.album.id}
        countryLabel={item.album.countryLabel}
        coinCount={item.count}
        previewFaces={item.faces}
        onOpen={onOpenAlbum}
      />
    ),
    [onOpenAlbum],
  );

  const keyExtractor = useCallback((item: Row) => item.album.id, []);

  const header = useMemo(
    () => (
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text style={styles.heroLine}>Your coins,</Text>
            <Text style={styles.heroLine}>well kept.</Text>
          </View>
          <View style={styles.heroArt}>
            <Image source={assets.sprite5} style={styles.heroImage} resizeMode="contain" />
          </View>
        </View>

        <Text style={styles.heroCaption}>Browse by country. Remember every detail.</Text>
        <View style={styles.rule} />

        {collected > 0 && countries > 0 ? (
          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Coins}
                value={formatCount(collected)}
                label={coinWord(collected) + ' recorded'}
                valueColor={theme.colors.material.bronze}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Coins}
                value={formatCount(countries)}
                label={countryWord(countries)}
                valueColor={theme.colors.material.greenDeep}
              />
            </View>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>COUNTRY ALBUMS</Text>
      </View>
    ),
    [collected, countries],
  );

  const empty = useMemo(
    () => (
      <EmptyState
        title="Start with your first coin"
        description="Add a country, two coin faces and the details you know."
      />
    ),
    [],
  );

  return (
    <AppShell variant="paper">
      <ScreenHeader
        title="Albums"
        subtitle="Kept on this device"
        rightSlot={<IconButton Icon={Plus} onPress={onStartCataloging} label="New coin" />}
      />

      <FlatList
        data={rows}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        windowSize={7}
        removeClippedSubviews
      />

      <View style={styles.dock}>
        <Text style={styles.dockHint}>
          {formatCount(collected) +
            ' ' +
            coinWord(collected) +
            ' in ' +
            formatCount(countries) +
            ' ' +
            countryWord(countries)}
        </Text>
        <PrimaryButton label="START CATALOGING" onPress={onStartCataloging} Icon={Plus} />
      </View>

      <BottomTabBar active="albums" onSelect={onSelectTab} />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  hero: {
    paddingTop: 20,
    paddingBottom: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroText: {
    flex: 1,
  },
  heroLine: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: theme.colors.text.primary,
  },
  heroArt: {
    width: 88,
    height: 88,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(20, 34, 56, 0.08)',
    borderWidth: 1,
    borderColor: theme.colors.ui.borderBronze,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 68,
    height: 68,
  },
  heroCaption: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text.secondary,
  },
  rule: {
    marginTop: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.material.bronze,
    opacity: 0.35,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  statSlot: {
    flex: 1,
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.4,
    color: theme.colors.text.tertiary,
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
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
});

export default React.memo(MenuScreen);
