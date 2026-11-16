import React, { useCallback } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { faceSource } from '../assets';
import { formatGrade } from '../constants/grades';
import type { GradeScale } from '../constants/grades';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { ImageIcon } from './icons';

type Props = {
  coinId: string;
  title: string;
  dateLabel: string;
  gradeScale: GradeScale;
  grade: string | number | null;
  frontFace: number | null;
  width: number;
  onOpen: (coinId: string) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Fixed 1:1 photo frame plus an intrinsic cream label strip. */
function CoinCard({
  coinId,
  title,
  dateLabel,
  gradeScale,
  grade,
  frontFace,
  width,
  onOpen,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const handlePress = useCallback(() => onOpen(coinId), [coinId, onOpen]);
  const source = faceSource(frontFace);
  const inner = Math.round(width * 0.62);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={title + ', ' + dateLabel}
      style={[styles.pressable, { width }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.card, { width, transform: [{ scale }] }]}>
        <View style={[styles.mount, { height: width }]}>
          {source ? (
            <Image
              source={source}
              style={{ width: inner, height: inner }}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.empty}>
              <ImageIcon size={24} color={theme.colors.material.silver} strokeWidth={1.8} />
              <Text numberOfLines={2} style={styles.emptyText}>
                No front photo
              </Text>
            </View>
          )}
        </View>
        <View style={styles.strip}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.meta}>
            {dateLabel}
          </Text>
          <Text numberOfLines={1} style={styles.grade}>
            {formatGrade(gradeScale, grade)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: 12,
  },
  card: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.ui.paper,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.card,
  },
  mount: {
    width: '100%',
    backgroundColor: theme.colors.material.velvetRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.onVelvetMuted,
    textAlign: 'center',
  },
  strip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  meta: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  grade: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
  },
});

export default React.memo(CoinCard);
