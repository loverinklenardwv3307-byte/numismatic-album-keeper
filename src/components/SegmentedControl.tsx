import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export type Segment = {
  key: string;
  label: string;
};

type Props = {
  segments: Segment[];
  selectedKey: string;
  onSelect: (key: string) => void;
  surface?: 'paper' | 'velvet';
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type SegProps = {
  segment: Segment;
  selected: boolean;
  onSelect: (key: string) => void;
  onVelvet: boolean;
};

const SegmentButton = React.memo(function SegmentButton({
  segment,
  selected,
  onSelect,
  onVelvet,
}: SegProps) {
  const handlePress = useCallback(() => onSelect(segment.key), [onSelect, segment.key]);
  const activeText = onVelvet ? theme.colors.text.onVelvet : theme.colors.text.primary;
  const idleText = onVelvet ? theme.colors.text.onVelvetMuted : theme.colors.text.secondary;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={segment.label}
      style={styles.slot}>
      <View
        style={[
          styles.pill,
          selected ? (onVelvet ? styles.pillActiveVelvet : styles.pillActivePaper) : null,
        ]}>
        <Text
          numberOfLines={1}
          style={[styles.label, { color: selected ? activeText : idleText }]}>
          {segment.label}
        </Text>
      </View>
    </Pressable>
  );
});

/** Two or three segments, each with a 48 dp touch height. */
function SegmentedControl({ segments, selectedKey, onSelect, surface = 'paper' }: Props) {
  const onVelvet = surface === 'velvet';
  return (
    <View style={[styles.root, onVelvet ? styles.rootVelvet : styles.rootPaper]}>
      {segments.map(segment => (
        <SegmentButton
          key={segment.key}
          segment={segment}
          selected={segment.key === selectedKey}
          onSelect={onSelect}
          onVelvet={onVelvet}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  rootPaper: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderColor: theme.colors.ui.border,
  },
  rootVelvet: {
    backgroundColor: 'rgba(20, 34, 56, 0.45)',
    borderColor: 'rgba(197, 205, 214, 0.35)',
  },
  slot: {
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  pill: {
    minHeight: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pillActivePaper: {
    backgroundColor: 'rgba(171, 94, 42, 0.16)',
    borderWidth: 1,
    borderColor: theme.colors.material.bronze,
  },
  pillActiveVelvet: {
    backgroundColor: 'rgba(197, 205, 214, 0.20)',
    borderWidth: 1,
    borderColor: theme.colors.material.silver,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default React.memo(SegmentedControl);
