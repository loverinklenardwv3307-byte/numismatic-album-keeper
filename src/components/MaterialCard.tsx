import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  variant?: 'paper' | 'velvet' | 'inset';
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/** Raised paper or velvet surface - the middle of the three depth layers. */
function MaterialCard({ variant = 'paper', style, children }: Props) {
  return (
    <View
      style={[
        styles.base,
        variant === 'paper' ? styles.paper : null,
        variant === 'velvet' ? styles.velvet : null,
        variant === 'inset' ? styles.inset : null,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
  },
  paper: {
    backgroundColor: theme.colors.ui.paper,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.card,
  },
  velvet: {
    backgroundColor: theme.colors.ui.velvetSurface,
    borderColor: 'rgba(197, 205, 214, 0.35)',
    ...theme.shadows.card,
  },
  inset: {
    backgroundColor: 'rgba(20, 34, 56, 0.06)',
    borderColor: theme.colors.ui.borderBronze,
  },
});

export default React.memo(MaterialCard);
