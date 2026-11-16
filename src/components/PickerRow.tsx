import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { ChevronDown, TriangleAlert } from './icons';
import type { AppIcon } from './icons';

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
  Icon?: AppIcon;
  error?: string;
  required?: boolean;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 56 dp selector row that opens a sheet. */
function PickerRow({ label, value, placeholder, onPress, Icon, error, required }: Props) {
  const filled = value.length > 0;
  const invalid = Boolean(error);

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{required ? label + ' *' : label}</Text>
      <Pressable
        onPress={onPress}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={label + ', ' + (filled ? value : 'not selected')}
        style={[styles.row, invalid ? styles.rowError : null]}>
        {Icon ? (
          <Icon size={24} color={theme.colors.material.bronze} strokeWidth={2} />
        ) : null}
        <Text
          numberOfLines={1}
          style={[styles.value, filled ? null : styles.valuePlaceholder]}>
          {filled ? value : placeholder ?? 'Choose'}
        </Text>
        <ChevronDown size={24} color={theme.colors.text.secondary} strokeWidth={2} />
      </Pressable>
      {error ? (
        <View style={styles.errorRow}>
          <TriangleAlert size={16} color={theme.colors.material.error} strokeWidth={2.2} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  rowError: {
    borderColor: theme.colors.material.error,
    borderWidth: 2,
  },
  value: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
  valuePlaceholder: {
    color: theme.colors.text.tertiary,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.material.error,
  },
});

export default React.memo(PickerRow);
