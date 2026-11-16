import React from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { AppIcon } from './icons';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: AppIcon;
  tone?: 'green' | 'bronze';
  busy?: boolean;
  busyLabel?: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * 56 dp main action. Pressable is the PARENT, the Animated.View is its
 * child, so presses stay reliable on Android release builds.
 */
function PrimaryButton({ label, onPress, Icon, tone = 'green', busy = false, busyLabel }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const green = tone === 'green';
  const colors = green ? [...theme.gradients.action] : [...theme.gradients.bronze];
  const labelColor = green ? theme.colors.text.primary : theme.colors.text.onVelvet;
  const text = busy && busyLabel ? busyLabel : label;

  return (
    <Pressable
      onPress={busy ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      disabled={busy}
      accessibilityRole="button"
      accessibilityState={{ busy }}
      accessibilityLabel={text}
      style={styles.pressable}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          green ? theme.shadows.action : theme.shadows.bronze,
          { transform: [{ scale }], opacity: busy ? 0.85 : 1 },
        ]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}>
          <View style={styles.row}>
            {busy ? (
              <ActivityIndicator size="small" color={labelColor} />
            ) : Icon ? (
              <Icon size={24} color={labelColor} strokeWidth={2.2} />
            ) : null}
            <Text numberOfLines={2} style={[styles.label, { color: labelColor }]}>
              {text}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    minHeight: 56,
  },
  shell: {
    width: '100%',
    minHeight: 56,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  gradient: {
    minHeight: 56,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    letterSpacing: 0.6,
    textAlign: 'center',
  },
});

export default React.memo(PrimaryButton);
