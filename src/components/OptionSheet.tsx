import React, { useCallback } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { Check } from './icons';

export type SheetOption = {
  key: string;
  label: string;
  caption?: string;
};

type Props = {
  visible: boolean;
  title: string;
  options: SheetOption[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onClose: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type RowProps = {
  option: SheetOption;
  selected: boolean;
  onSelect: (key: string) => void;
};

const OptionRow = React.memo(function OptionRow({ option, selected, onSelect }: RowProps) {
  const handlePress = useCallback(() => onSelect(option.key), [onSelect, option.key]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={option.label}
      style={[styles.row, selected ? styles.rowSelected : null]}>
      <View style={styles.rowText}>
        <Text numberOfLines={2} style={styles.rowLabel}>
          {option.label}
        </Text>
        {option.caption ? (
          <Text numberOfLines={1} style={styles.rowCaption}>
            {option.caption}
          </Text>
        ) : null}
      </View>
      {selected ? (
        <Check size={24} color={theme.colors.material.green} strokeWidth={2.6} />
      ) : null}
    </Pressable>
  );
});

/** Bottom sheet list. Rows are 56 dp, the backdrop closes it. */
function OptionSheet({ visible, title, options, selectedKey, onSelect, onClose }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: SheetOption }) => (
      <OptionRow option={item} selected={item.key === selectedKey} onSelect={onSelect} />
    ),
    [onSelect, selectedKey],
  );

  const keyExtractor = useCallback((item: SheetOption) => item.key, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Close"
          accessibilityRole="button"
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <View style={styles.grip} />
          <Text style={styles.title}>{title}</Text>
          <FlatList
            data={options}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.list}
            initialNumToRender={12}
            keyboardShouldPersistTaps="handled"
          />
          <Pressable
            onPress={onClose}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={styles.close}>
            <Text style={styles.closeText}>CLOSE</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.ui.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '82%',
    backgroundColor: theme.colors.bg.primary,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  grip: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.ui.border,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 10,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  rowSelected: {
    borderColor: theme.colors.material.bronze,
    borderWidth: 2,
    backgroundColor: 'rgba(171, 94, 42, 0.08)',
  },
  rowText: {
    flex: 1,
    paddingVertical: 10,
  },
  rowLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  rowCaption: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
  },
  close: {
    marginTop: 8,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderBronze,
    backgroundColor: 'rgba(171, 94, 42, 0.08)',
  },
  closeText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.material.bronze,
  },
});

export default React.memo(OptionSheet);
