import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';

type Props = {
  id: string;
  label: string;
  count: number;
  maxCount: number;
  onPress?: (id: string) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 48 dp row. The integer is printed, so length is never the only cue. */
function CountBarRow({ id, label, count, maxCount, onPress }: Props) {
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(id);
    }
  }, [id, onPress]);

  const ratio = maxCount > 0 ? Math.max(0.08, count / maxCount) : 0.08;
  const percent = Math.round(ratio * 100);
  const fillWidth: DimensionValue = (String(percent) + '%') as DimensionValue;

  const body = (
    <View style={styles.inner}>
      <View style={styles.labelRow}>
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
        <Text style={styles.count}>{String(count)}</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={[...theme.gradients.bronze]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: fillWidth }]}
        />
      </View>
    </View>
  );

  if (!onPress) {
    return <View style={styles.row}>{body}</View>;
  }

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label + ', ' + String(count) + ' coins'}
      style={styles.row}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  inner: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  count: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.material.bronze,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(197, 205, 214, 0.45)',
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    borderRadius: 5,
  },
});

export default React.memo(CountBarRow);
