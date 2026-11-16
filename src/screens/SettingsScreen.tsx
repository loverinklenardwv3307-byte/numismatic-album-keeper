import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import BottomTabBar from '../components/BottomTabBar';
import type { RootTab } from '../components/BottomTabBar';
import MaterialCard from '../components/MaterialCard';
import ScreenHeader from '../components/ScreenHeader';
import SwitchRow from '../components/SwitchRow';
import { Check } from '../components/icons';
import type { GradeScale } from '../constants/grades';
import { theme } from '../constants/theme';
import { updateSettings, useSettings } from '../hooks/useCatalog';

type Props = {
  onSelectTab: (tab: RootTab) => void;
};

const SECTIONS = ['grading', 'feedback', 'storage', 'about'];

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type RadioProps = {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

const RadioRow = React.memo(function RadioRow({
  label,
  description,
  selected,
  onPress,
}: RadioProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={[styles.radio, selected ? styles.radioSelected : null]}>
      <View style={styles.radioText}>
        <Text style={styles.radioLabel}>{label}</Text>
        <Text style={styles.radioDescription}>{description}</Text>
      </View>
      <View style={[styles.marker, selected ? styles.markerOn : null]}>
        {selected ? (
          <Check size={22} color={theme.colors.material.green} strokeWidth={3} />
        ) : null}
      </View>
    </Pressable>
  );
});

/** Preferences for new records. Existing grades keep their own scale. */
function SettingsScreen({ onSelectTab }: Props) {
  const settings = useSettings();

  const setScale = useCallback((scale: GradeScale) => {
    updateSettings({ defaultGradeScale: scale });
  }, []);

  const chooseSimple = useCallback(() => setScale('simple'), [setScale]);
  const chooseNumeric = useCallback(() => setScale('numeric'), [setScale]);

  const setHaptics = useCallback((value: boolean) => {
    updateSettings({ hapticsEnabled: value });
  }, []);

  const setReduceMotion = useCallback((value: boolean) => {
    updateSettings({ reduceMotion: value });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: string }) => {
      if (item === 'grading') {
        return (
          <MaterialCard style={styles.card}>
            <Text style={styles.cardTitle}>Default grading scale</Text>
            <Text style={styles.cardHint}>
              Used for new coins. Existing grades keep their original scale.
            </Text>
            <RadioRow
              label="Simple condition"
              description="Not graded through Uncirculated"
              selected={settings.defaultGradeScale === 'simple'}
              onPress={chooseSimple}
            />
            <RadioRow
              label="Numeric 1 to 70"
              description="Not graded, or an integer grade"
              selected={settings.defaultGradeScale === 'numeric'}
              onPress={chooseNumeric}
            />
          </MaterialCard>
        );
      }

      if (item === 'feedback') {
        return (
          <MaterialCard style={styles.card}>
            <Text style={styles.cardTitle}>Feedback</Text>
            <SwitchRow
              label="Haptic feedback"
              description="One short pulse when a coin is saved."
              value={settings.hapticsEnabled}
              onValueChange={setHaptics}
            />
            <SwitchRow
              label="Reduce motion"
              description="Replaces springs and translations with a plain fade."
              value={settings.reduceMotion}
              onValueChange={setReduceMotion}
            />
          </MaterialCard>
        );
      }

      if (item === 'storage') {
        return (
          <MaterialCard style={styles.card}>
            <Text style={styles.cardTitle}>Saved on this device</Text>
            <Text style={styles.body}>
              Albums, coin records and artwork choices work offline. Nothing is uploaded, and
              uninstalling the app removes them.
            </Text>
          </MaterialCard>
        );
      }

      return (
        <MaterialCard style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.body}>Numismatic Album Keeper</Text>
          <Text style={styles.meta}>com.numismatic.albumkeeper</Text>
          <Text style={styles.meta}>Version 1.0</Text>
        </MaterialCard>
      );
    },
    [chooseNumeric, chooseSimple, setHaptics, setReduceMotion, settings],
  );

  const keyExtractor = useCallback((item: string) => item, []);
  const data = useMemo(() => SECTIONS, []);

  return (
    <AppShell variant="paper">
      <ScreenHeader title="Settings" subtitle="Preferences for new records" />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <BottomTabBar active="settings" onSelect={onSelectTab} />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  cardHint: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
  },
  body: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
  },
  radio: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  radioSelected: {
    borderColor: theme.colors.material.bronze,
    borderWidth: 2,
    backgroundColor: 'rgba(171, 94, 42, 0.08)',
  },
  radioText: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  radioDescription: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(197, 205, 214, 0.20)',
  },
  markerOn: {
    borderColor: theme.colors.material.green,
    backgroundColor: 'rgba(40, 224, 110, 0.14)',
  },
});

export default React.memo(SettingsScreen);
