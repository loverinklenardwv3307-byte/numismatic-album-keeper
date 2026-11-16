import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { AppIcon } from './icons';

type Props = {
  Icon: AppIcon;
  onPress: () => void;
  label: string;
  tone?: 'paper' | 'velvet';
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 48x48 header / overflow control. Explicit size, never intrinsic. */
function IconButton({ Icon, onPress, label, tone = 'paper' }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  const velvet = tone === 'velvet';

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
          styles.plate,
          velvet ? styles.plateVelvet : styles.platePaper,
          { transform: [{ scale }] },
        ]}>
        <Icon
          size={24}
          color={velvet ? theme.colors.material.silver : theme.colors.material.bronze}
          strokeWidth={2}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  platePaper: {
    backgroundColor: 'rgba(171, 94, 42, 0.08)',
    borderColor: theme.colors.ui.borderBronze,
  },
  plateVelvet: {
    backgroundColor: 'rgba(197, 205, 214, 0.10)',
    borderColor: theme.colors.ui.border,
  },
});

export default React.memo(IconButton);
