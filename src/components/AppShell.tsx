import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';

export type ShellVariant = 'paper' | 'velvet' | 'loader' | 'receipt';

type Props = {
  variant: ShellVariant;
  children: React.ReactNode;
};

const GRADIENTS: Record<ShellVariant, { colors: string[]; opacity: number; angle: boolean }> = {
  // cream catalog pages
  paper: { colors: [...theme.gradients.paper], opacity: 0.96, angle: true },
  // navy album interiors
  velvet: { colors: [...theme.gradients.velvet], opacity: 0.94, angle: false },
  // splash: the darkest composition in the app
  loader: { colors: [...theme.gradients.loader], opacity: 0.93, angle: false },
  // saved receipt: bronze into navy, unlike every other screen
  receipt: { colors: [...theme.gradients.receipt], opacity: 0.94, angle: true },
};

/**
 * The one background in the app: bg_game under a screen specific tint.
 * Three layers everywhere - material backdrop, gradient tint, content surfaces.
 */
function AppShell({ variant, children }: Props) {
  const spec = GRADIENTS[variant];
  return (
    <ImageBackground source={assets.bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={spec.colors}
        start={spec.angle ? { x: 0, y: 0 } : { x: 0.5, y: 0 }}
        end={spec.angle ? { x: 1, y: 1 } : { x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: spec.opacity }]}
      />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.material.velvet,
  },
  content: {
    flex: 1,
  },
});

export default React.memo(AppShell);
