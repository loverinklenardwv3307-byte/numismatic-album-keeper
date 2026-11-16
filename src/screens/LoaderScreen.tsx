import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import AppShell from '../components/AppShell';
import { LOADER_DURATION_MS } from '../constants/config';
import { theme } from '../constants/theme';

type Props = {
  onDone: () => void;
};

const TRACK_W = 184;

/**
 * The branded opening. Deliberately the darkest composition in the app so it
 * never reads as the cream Albums screen.
 */
function LoaderScreen({ onDone }: Props) {
  const emblem = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  // width is a layout property, so this one stays on the JS driver.
  const progress = useRef(new Animated.Value(0)).current;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(emblem, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(80),
        Animated.timing(title, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.timing(progress, {
      toValue: TRACK_W,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => doneRef.current(), LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [emblem, progress, title]);

  const emblemStyle = {
    opacity: emblem,
    transform: [
      {
        scale: emblem.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }),
      },
    ],
  };

  return (
    <AppShell variant="loader">
      <View style={styles.tint} />
      <View style={styles.stitchLeft} />
      <View style={styles.stitchRight} />

      <View style={styles.center}>
        <Animated.View style={[styles.emblem, emblemStyle]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={{ opacity: title }}>
          <Text style={styles.brand}>Numismatic</Text>
          <Text style={styles.brand}>Album</Text>
          <Text style={styles.brand}>Keeper</Text>
          <Text style={styles.tagline}>Every coin has a place</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: progress }]} />
        </View>
        <Text style={styles.loadingLabel}>Opening your albums</Text>
        <Text style={styles.loadingSub}>LOADING</Text>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 34, 56, 0.88)',
  },
  stitchLeft: {
    position: 'absolute',
    left: 24,
    top: 80,
    bottom: 80,
    width: 1,
    backgroundColor: 'rgba(197, 205, 214, 0.30)',
  },
  stitchRight: {
    position: 'absolute',
    right: 24,
    top: 80,
    bottom: 80,
    width: 1,
    backgroundColor: 'rgba(197, 205, 214, 0.30)',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emblem: {
    width: 144,
    height: 144,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(28, 48, 75, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(197, 205, 214, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 112,
    height: 112,
  },
  brand: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
    color: theme.colors.text.onVelvet,
  },
  tagline: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: theme.colors.material.silver,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 64,
  },
  track: {
    width: TRACK_W,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.material.velvetRaised,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.material.green,
  },
  loadingLabel: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.material.silver,
  },
  loadingSub: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 2,
    color: 'rgba(197, 205, 214, 0.65)',
  },
});

export default React.memo(LoaderScreen);
