import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const TRACK = {
  false: 'rgba(197, 205, 214, 0.75)',
  true: 'rgba(40, 224, 110, 0.55)',
};

/** 56 dp switch row. The whole row is the target, not just the switch. */
function SwitchRow({ label, description, value, onValueChange }: Props) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={TRACK}
        thumbColor={value ? theme.colors.material.green : theme.colors.bg.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  text: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  description: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
  },
});

export default React.memo(SwitchRow);
