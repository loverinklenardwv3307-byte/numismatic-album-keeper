import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TAB_BAR_HEIGHT } from '../constants/config';
import { theme } from '../constants/theme';
import { BarChart3, Layers, SettingsIcon } from './icons';
import type { AppIcon } from './icons';

export type RootTab = 'albums' | 'stats' | 'settings';

type Props = {
  active: RootTab;
  onSelect: (tab: RootTab) => void;
};

const TABS: Array<{ key: RootTab; label: string; Icon: AppIcon }> = [
  { key: 'albums', label: 'Albums', Icon: Layers },
  { key: 'stats', label: 'Stats', Icon: BarChart3 },
  { key: 'settings', label: 'Settings', Icon: SettingsIcon },
];

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type SlotProps = {
  tab: { key: RootTab; label: string; Icon: AppIcon };
  active: boolean;
  onSelect: (tab: RootTab) => void;
};

const TabSlot = React.memo(function TabSlot({ tab, active, onSelect }: SlotProps) {
  const handlePress = useCallback(() => onSelect(tab.key), [onSelect, tab.key]);
  const tint = active ? theme.colors.material.bronze : theme.colors.text.tertiary;
  const Icon = tab.Icon;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
      style={styles.slot}>
      <View style={styles.slotInner}>
        <Icon size={24} color={tint} strokeWidth={active ? 2.4 : 1.8} />
        <Text numberOfLines={1} style={[styles.label, { color: tint }]}>
          {tab.label}
        </Text>
      </View>
      {active ? <View style={styles.marker} /> : null}
    </Pressable>
  );
});

/** Three equal root destinations, each at least 48 x 56 dp. */
function BottomTabBar({ active, onSelect }: Props) {
  return (
    <View style={styles.root} accessibilityRole="tablist">
      {TABS.map(tab => (
        <TabSlot key={tab.key} tab={tab} active={tab.key === active} onSelect={onSelect} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    minHeight: TAB_BAR_HEIGHT,
    paddingBottom: 6,
    paddingTop: 6,
    backgroundColor: theme.colors.ui.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.borderBronze,
  },
  slot: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  marker: {
    position: 'absolute',
    bottom: 0,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.material.bronze,
  },
});

export default React.memo(BottomTabBar);
