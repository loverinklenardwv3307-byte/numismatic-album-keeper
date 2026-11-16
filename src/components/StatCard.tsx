import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { AppIcon } from './icons';

type Props = {
  Icon: AppIcon;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * One design everywhere. Every card in a row shares the SAME Icon and is
 * told apart by valueColor, the number and the label - never by three
 * differently shaped raster sprites.
 * width is 100%, never flex:1 inside a flex:1 slot.
 */
function StatCard({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon size={22} color={valueColor} strokeWidth={2.4} />
      </View>
      <Text numberOfLines={1} style={[styles.value, { color: valueColor }]}>
        {value}
      </Text>
      <Text numberOfLines={2} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: theme.colors.ui.paper,
    ...theme.shadows.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default React.memo(StatCard);
