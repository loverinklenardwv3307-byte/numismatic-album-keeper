import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { Check, TriangleAlert } from './icons';

type Props = {
  message: string;
  severity: 'success' | 'error';
};

/** Text first. The icon repeats the meaning, colour never carries it alone. */
function InlineStatus({ message, severity }: Props) {
  const success = severity === 'success';
  const tint = success ? theme.colors.material.greenDeep : theme.colors.material.error;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.root,
        { borderColor: tint, backgroundColor: success ? 'rgba(40, 224, 110, 0.12)' : 'rgba(157, 52, 52, 0.12)' },
      ]}>
      {success ? (
        <Check size={24} color={tint} strokeWidth={2.6} />
      ) : (
        <TriangleAlert size={24} color={tint} strokeWidth={2.4} />
      )}
      <Text style={[styles.text, { color: tint }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});

export default React.memo(InlineStatus);
