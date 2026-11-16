import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { Minus, Plus } from './icons';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 48 dp decrement and increment around a large tabular value. */
function Stepper({ label, value, min, max, step = 1, onChange }: Props) {
  const decrement = useCallback(() => {
    onChange(Math.max(min, value - step));
  }, [max, min, onChange, step, value]);

  const increment = useCallback(() => {
    onChange(Math.min(max, value + step));
  }, [max, min, onChange, step, value]);

  return (
    <View style={styles.row}>
      <Pressable
        onPress={decrement}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={'Decrease ' + label}
        style={styles.control}>
        <Minus size={24} color={theme.colors.material.bronze} strokeWidth={2.4} />
      </Pressable>

      <View style={styles.valueBox}>
        <Text style={styles.value}>{String(value)}</Text>
        <Text numberOfLines={1} style={styles.caption}>
          {label}
        </Text>
      </View>

      <Pressable
        onPress={increment}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={'Increase ' + label}
        style={styles.control}>
        <Plus size={24} color={theme.colors.material.bronze} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  control: {
    width: 48,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderBronze,
    backgroundColor: 'rgba(171, 94, 42, 0.08)',
  },
  valueBox: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  value: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.text.tertiary,
  },
});

export default React.memo(Stepper);
