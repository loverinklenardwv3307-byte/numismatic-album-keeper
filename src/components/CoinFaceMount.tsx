import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { faceSource } from '../assets';
import { theme } from '../constants/theme';
import { ImageIcon } from './icons';

type Props = {
  face: number | null;
  label: string;
  size: number;
  emptyText?: string;
};

/**
 * Navy velvet mount. Transparent sprite is contained at its natural bounds -
 * no oversized cropping wrapper, no bubble around the object.
 */
function CoinFaceMount({ face, label, size, emptyText }: Props) {
  const source = faceSource(face);
  const inner = Math.round(size * 0.74);

  return (
    <View
      style={[styles.mount, { width: size, height: size }]}
      accessible
      accessibilityLabel={
        source ? label + ' artwork recorded' : label + ', ' + (emptyText ?? 'no artwork')
      }>
      <View style={styles.grain} />
      {source ? (
        <Image
          source={source}
          style={{ width: inner, height: inner }}
          resizeMode="contain"
          fadeDuration={160}
        />
      ) : (
        <View style={styles.empty}>
          <ImageIcon size={24} color={theme.colors.material.silver} strokeWidth={1.8} />
          <Text numberOfLines={2} style={styles.emptyText}>
            {emptyText ?? 'No artwork'}
          </Text>
        </View>
      )}
      <View style={styles.tag}>
        <Text numberOfLines={1} style={styles.tagText}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mount: {
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.material.velvetRaised,
    borderWidth: 1,
    borderColor: 'rgba(197, 205, 214, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(246, 241, 237, 0.05)',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.onVelvetMuted,
    textAlign: 'center',
  },
  tag: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.material.bronzeDark,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.text.onVelvet,
  },
});

export default React.memo(CoinFaceMount);
