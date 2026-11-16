import React, { useCallback } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { faceSource } from '../assets';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { coinWord, formatCount } from '../utils/format';
import { BookOpen } from './icons';

type Props = {
  albumId: string;
  countryLabel: string;
  coinCount: number;
  previewFaces: number[];
  onOpen: (albumId: string) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** A real country album: bronze spine, cream face, up to three thumbnails. */
function AlbumCard({ albumId, countryLabel, coinCount, previewFaces, onOpen }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const handlePress = useCallback(() => onOpen(albumId), [albumId, onOpen]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={
        countryLabel + ', ' + formatCount(coinCount) + ' ' + coinWord(coinCount)
      }
      style={styles.pressable}>
      <Animated.View pointerEvents="box-none" style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.spine} />
        <View style={styles.body}>
          <View style={styles.textCol}>
            <Text numberOfLines={2} style={styles.country}>
              {countryLabel}
            </Text>
            <Text numberOfLines={1} style={styles.count}>
              {formatCount(coinCount) + ' ' + coinWord(coinCount) + ' collected'}
            </Text>
          </View>

          {previewFaces.length > 0 ? (
            <View style={styles.previewRow}>
              {previewFaces.map((face, index) => {
                const source = faceSource(face);
                return (
                  <View key={albumId + '-preview-' + String(index)} style={styles.previewMount}>
                    {source ? (
                      <Image source={source} style={styles.previewImage} resizeMode="contain" />
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyMount}>
              <BookOpen size={22} color={theme.colors.material.silver} strokeWidth={1.8} />
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    minHeight: 96,
    marginBottom: 12,
  },
  card: {
    width: '100%',
    minHeight: 96,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.ui.paper,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    flexDirection: 'row',
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  spine: {
    width: 6,
    backgroundColor: theme.colors.material.bronze,
  },
  body: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textCol: {
    flex: 1,
  },
  country: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  count: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  previewRow: {
    flexDirection: 'row',
    gap: 6,
  },
  previewMount: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.material.velvetRaised,
    borderWidth: 1,
    borderColor: 'rgba(197, 205, 214, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: 30,
    height: 30,
  },
  emptyMount: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(20, 34, 56, 0.08)',
    borderWidth: 1,
    borderColor: theme.colors.ui.borderBronze,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(AlbumCard);
