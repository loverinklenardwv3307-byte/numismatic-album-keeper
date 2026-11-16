import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, FlatList, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import CoinFaceMount from '../components/CoinFaceMount';
import IconButton from '../components/IconButton';
import MaterialCard from '../components/MaterialCard';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import { Check, Coins, House, Plus } from '../components/icons';
import { formatGrade } from '../constants/grades';
import { theme } from '../constants/theme';
import { albumById, coinById } from '../game/catalogLogic';
import { useAlbums, useCoins } from '../hooks/useCatalog';
import { useFeedback } from '../hooks/useFeedback';
import { coinWord, countryWord, formatCoinDate, formatCount } from '../utils/format';

type Props = {
  coinId: string;
  onAddAgain: () => void;
  onViewCoin: (coinId: string) => void;
  onBackToAlbums: () => void;
};

const BODY = ['receipt'];

/** The committed-save confirmation. A separate route, not a game result. */
function GameOverScreen({ coinId, onAddAgain, onViewCoin, onBackToAlbums }: Props) {
  const coins = useCoins();
  const albums = useAlbums();
  const { acknowledge } = useFeedback();

  const seal = useRef(new Animated.Value(0)).current;
  const acknowledged = useRef(false);

  const coin = coinById(coins, coinId);
  const album = coin ? albumById(albums, coin.albumId) : null;

  const collected = coins.length;
  const countries = new Set(coins.map(item => item.albumId)).size;

  useEffect(() => {
    Animated.timing(seal, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    if (!acknowledged.current) {
      acknowledged.current = true;
      acknowledge();
    }
  }, [acknowledge, seal]);

  const handleView = useCallback(() => onViewCoin(coinId), [coinId, onViewCoin]);
  const keyExtractor = useCallback((item: string) => item, []);

  const sealStyle = {
    opacity: seal,
    transform: [{ scale: seal.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
  };

  return (
    <AppShell variant="receipt">
      <View style={styles.ring} />

      <ScreenHeader
        surface="velvet"
        title="Coin saved"
        subtitle="Stored on this device"
        leftSlot={
          <IconButton
            Icon={House}
            onPress={onBackToAlbums}
            label="Back to albums"
            tone="velvet"
          />
        }
      />

      <FlatList
        data={BODY}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <View style={styles.bodyInner}>
        <Animated.View style={[styles.seal, sealStyle]}>
          <Check size={44} color={theme.colors.material.green} strokeWidth={3} />
        </Animated.View>

        <Text style={styles.heading}>Coin saved</Text>

        <MaterialCard style={styles.receipt}>
          <View style={styles.receiptRow}>
            <CoinFaceMount
              face={coin ? coin.frontFace : null}
              label="Front"
              size={88}
              emptyText="No artwork"
            />
            <View style={styles.receiptText}>
              <Text numberOfLines={2} style={styles.coinTitle}>
                {coin ? coin.title : 'Coin record'}
              </Text>
              <Text numberOfLines={1} style={styles.coinMeta}>
                {album ? album.countryLabel : 'Country not recorded'}
              </Text>
              <Text numberOfLines={1} style={styles.coinMeta}>
                {coin ? formatCoinDate(coin) : 'Year unknown'}
              </Text>
              <Text numberOfLines={1} style={styles.coinGrade}>
                {coin ? formatGrade(coin.gradeScale, coin.grade) : 'Not graded'}
              </Text>
            </View>
          </View>
        </MaterialCard>

        {collected > 0 && countries > 0 ? (
          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Coins}
                value={formatCount(collected)}
                label={coinWord(collected) + ' recorded'}
                valueColor={theme.colors.material.greenDeep}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Coins}
                value={formatCount(countries)}
                label={countryWord(countries)}
                valueColor={theme.colors.material.bronze}
              />
            </View>
          </View>
        ) : null}
          </View>
        )}
      />

      <View style={styles.dock}>
        <PrimaryButton label="ADD AGAIN" onPress={onAddAgain} Icon={Plus} />
        <View style={styles.secondaryRow}>
          <View style={styles.secondarySlot}>
            <SecondaryButton label="VIEW COIN" onPress={handleView} />
          </View>
          <View style={styles.secondarySlot}>
            <SecondaryButton label="ALBUMS" onPress={onBackToAlbums} />
          </View>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    top: 96,
    alignSelf: 'center',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(197, 205, 214, 0.28)',
  },
  list: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  bodyInner: {
    alignItems: 'center',
  },
  seal: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(20, 34, 56, 0.72)',
    borderWidth: 2,
    borderColor: theme.colors.material.silver,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    marginTop: 16,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: theme.colors.text.onVelvet,
    textAlign: 'center',
  },
  receipt: {
    marginTop: 20,
    width: '100%',
    maxWidth: 420,
    padding: 16,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  receiptText: {
    flex: 1,
  },
  coinTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  coinMeta: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  coinGrade: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 420,
  },
  statSlot: {
    flex: 1,
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
  secondaryRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  secondarySlot: {
    flex: 1,
  },
});

export default React.memo(GameOverScreen);
