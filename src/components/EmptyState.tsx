import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';

type Props = {
  title: string;
  description: string;
  size?: number;
  surface?: 'paper' | 'velvet';
  children?: React.ReactNode;
};

/** A substantial material composition, never a blank region. */
function EmptyState({ title, description, size = 144, surface = 'paper', children }: Props) {
  const onVelvet = surface === 'velvet';
  return (
    <View style={styles.root}>
      <View style={[styles.mount, { width: size + 32, height: size + 32 }]}>
        <Image
          source={assets.sprite5}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </View>
      <Text
        style={[
          styles.title,
          { color: onVelvet ? theme.colors.text.onVelvet : theme.colors.text.primary },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.description,
          { color: onVelvet ? theme.colors.text.onVelvetMuted : theme.colors.text.secondary },
        ]}>
        {description}
      </Text>
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  mount: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(20, 34, 56, 0.08)',
    borderWidth: 1,
    borderColor: theme.colors.ui.borderBronze,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 320,
  },
  actions: {
    marginTop: 16,
    width: '100%',
    maxWidth: 320,
  },
});

export default React.memo(EmptyState);
