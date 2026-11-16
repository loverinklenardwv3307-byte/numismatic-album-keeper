import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../constants/theme';
import { TriangleAlert } from './icons';

type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
};

/** Accessible input with inline validation. Errors are text, never colour alone. */
function FormField({
  label,
  value,
  onChange,
  placeholder,
  helper,
  error,
  required = false,
  maxLength,
  multiline = false,
  keyboardType = 'default',
}: Props) {
  const invalid = Boolean(error);
  const counter = maxLength ? String(value.length) + ' / ' + String(maxLength) : '';

  return (
    <View style={styles.root}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{required ? label + ' *' : label}</Text>
        {counter ? <Text style={styles.counter}>{counter}</Text> : null}
      </View>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        maxLength={maxLength}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? 'top' : 'center'}
        accessibilityLabel={label}
        style={[
          styles.input,
          multiline ? styles.inputMultiline : null,
          invalid ? styles.inputError : null,
        ]}
      />

      {error ? (
        <View style={styles.errorRow}>
          <TriangleAlert size={16} color={theme.colors.material.error} strokeWidth={2.2} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
  },
  counter: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
    fontVariant: ['tabular-nums'],
  },
  input: {
    minHeight: 56,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
  inputMultiline: {
    minHeight: 112,
    paddingTop: 12,
  },
  inputError: {
    borderColor: theme.colors.material.error,
    borderWidth: 2,
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
  helper: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
  },
});

export default React.memo(FormField);
