import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HEADER_HEIGHT, HEADER_TOP_PAD } from '../constants/config';
import { theme } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  surface?: 'paper' | 'velvet';
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

/**
 * The one header in the app. Every screen passes different slots instead of
 * writing its own markup, so padding and type never drift between screens.
 */
function ScreenHeader({ title, subtitle, surface = 'paper', leftSlot, rightSlot }: Props) {
  const onVelvet = surface === 'velvet';
  return (
    <View style={[styles.root, onVelvet ? styles.rootVelvet : styles.rootPaper]}>
      <View style={styles.row}>
        {leftSlot ? <View style={styles.side}>{leftSlot}</View> : null}
        <View style={[styles.center, leftSlot ? styles.centerInset : null]}>
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              { color: onVelvet ? theme.colors.text.onVelvet : theme.colors.text.primary },
            ]}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                {
                  color: onVelvet
                    ? theme.colors.text.onVelvetMuted
                    : theme.colors.text.secondary,
                },
              ]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {rightSlot ? <View style={styles.side}>{rightSlot}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: HEADER_TOP_PAD,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  rootPaper: {
    backgroundColor: theme.colors.ui.paper,
    borderBottomColor: theme.colors.ui.borderBronze,
  },
  rootVelvet: {
    backgroundColor: theme.colors.ui.velvetSurface,
    borderBottomColor: 'rgba(197, 205, 214, 0.25)',
  },
  row: {
    minHeight: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    minWidth: 48,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    paddingRight: 8,
  },
  centerInset: {
    paddingLeft: 8,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});

export default React.memo(ScreenHeader);
