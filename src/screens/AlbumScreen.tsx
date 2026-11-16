import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import CoinCard from '../components/CoinCard';
import EmptyState from '../components/EmptyState';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SegmentedControl from '../components/SegmentedControl';
import { ArrowLeft, Plus } from '../components/icons';
import { theme } from '../constants/theme';
import { albumById } from '../game/catalogLogic';
import { useAlbums, useCoins } from '../hooks/useCatalog';
import type { Coin } from '../models/catalog';
import { chronoKey, coinWord, formatCoinDate, formatCount } from '../utils/format';

type Props = {
  albumId: string;
  onBack: () => void;
  onOpenCoin: (coinId: string) => void;
  onAddCoin: (albumId: string) => void;
};

type SortKey = 'recent' | 'yearAsc' | 'title';

const SORTS = [
  { key: 'recent', label: 'Recent' },
  { key: 'yearAsc', label: 'Year' },
  { key: 'title', label: 'A - Z' },
];

const SCREEN_W = Dimensions.get('window').width;
const PADDING = 16;
const GAP = 12;
const COLUMNS = 2;
const CARD_W = Math.floor((Math.min(SCREEN_W, 600) - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

/** One country album: navy page, coin mounts, dock with ADD COIN. */
function AlbumScreen({ albumId, onBack, onOpenCoin, onAddCoin }: Props) {
  const albums = useAlbums();
  const coins = useCoins();
  const [sort, setSort] = useState<SortKey>('recent');

  const album = albumById(albums, albumId);

  const data = useMemo(() => {
    const mine = coins.filter(coin => coin.albumId === albumId);
    const sorted = mine.slice();
    if (sort === 'yearAsc') {
      sorted.sort((a, b) => chronoKey(a) - chronoKey(b));
    } else if (sort === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return sorted;
  }, [albumId, coins, sort]);

  const handleSort = useCallback((key: string) => setSort(key as SortKey), []);
  const handleAdd = useCallback(() => onAddCoin(albumId), [albumId, onAddCoin]);

  const renderItem = useCallback(
    ({ item }: { item: Coin }) => (
      <CoinCard
        coinId={item.id}
        title={item.title}
        dateLabel={formatCoinDate(item)}
        gradeScale={item.gradeScale}
        grade={item.grade}
        frontFace={item.frontFace}
        width={CARD_W}
        onOpen={onOpenCoin}
      />
    ),
    [onOpenCoin],
  );

  const keyExtractor = useCallback((item: Coin) => item.id, []);

  const countryLabel = album ? album.countryLabel : 'Album';

  const header = useMemo(
    () => (
      <View style={styles.filterBar}>
        <Text style={styles.filterLabel}>SORT BY</Text>
        <SegmentedControl
          segments={SORTS}
          selectedKey={sort}
          onSelect={handleSort}
          surface="velvet"
        />
      </View>
    ),
    [handleSort, sort],
  );

  const empty = useMemo(
    () => (
      <EmptyState
        surface="velvet"
        title="This album is ready"
        description={'Add your first coin from ' + countryLabel + '.'}
      />
    ),
    [countryLabel],
  );

  return (
    <AppShell variant="velvet">
      <View style={styles.stitchLeft} />
      <View style={styles.stitchRight} />

      <ScreenHeader
        surface="velvet"
        title={countryLabel}
        subtitle={formatCount(data.length) + ' ' + coinWord(data.length) + ' collected'}
        leftSlot={
          <IconButton Icon={ArrowLeft} onPress={onBack} label="Back to albums" tone="velvet" />
        }
      />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={COLUMNS}
        columnWrapperStyle={styles.column}
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
        <Text style={styles.dockHint}>Records and artwork stay on this device</Text>
        <PrimaryButton label="ADD COIN" onPress={handleAdd} Icon={Plus} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  stitchLeft: {
    position: 'absolute',
    left: 12,
    top: 120,
    bottom: 120,
    width: 1,
    backgroundColor: 'rgba(197, 205, 214, 0.22)',
  },
  stitchRight: {
    position: 'absolute',
    right: 12,
    top: 120,
    bottom: 120,
    width: 1,
    backgroundColor: 'rgba(197, 205, 214, 0.22)',
  },
  listContent: {
    paddingHorizontal: PADDING,
    paddingTop: 16,
    paddingBottom: 16,
  },
  column: {
    gap: GAP,
  },
  filterBar: {
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.4,
    color: theme.colors.text.onVelvetMuted,
  },
  dock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
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

export default React.memo(AlbumScreen);
