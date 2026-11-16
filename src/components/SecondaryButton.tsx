import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { AppIcon } from './icons';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: AppIcon;
  surface?: 'paper' | 'velvet';
  destructive?: boolean;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 48 dp supporting action. Same icon size and gap as PrimaryButton. */
function SecondaryButton({
  label,
  onPress,
  Icon,
  surface = 'paper',
  destructive = false,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const onVelvet = surface === 'velvet';
  const tint = destructive
    ? theme.colors.material.error
    : onVelvet
    ? theme.colors.text.onVelvet
    : theme.colors.material.bronze;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.pressable}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          onVelvet ? styles.shellVelvet : styles.shellPaper,
          destructive ? styles.shellDestructive : null,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={24} color={tint} strokeWidth={2} /> : null}
          <Text numberOfLines={2} style={[styles.label, { color: tint }]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    minHeight: 48,
  },
  shell: {
    width: '100%',
    minHeight: 48,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  shellPaper: {
    backgroundColor: 'rgba(171, 94, 42, 0.08)',
    borderColor: theme.colors.ui.borderBronze,
  },
  shellVelvet: {
    backgroundColor: 'rgba(20, 34, 56, 0.08)',
    borderColor: theme.colors.ui.border,
  },
  shellDestructive: {
    backgroundColor: 'rgba(157, 52, 52, 0.08)',
    borderColor: 'rgba(157, 52, 52, 0.45)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});

export default React.memo(SecondaryButton);
