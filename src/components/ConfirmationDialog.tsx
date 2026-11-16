import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import SecondaryButton from './SecondaryButton';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  safeActionLabel: string;
  onSafeAction: () => void;
  confirmLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
};

/** The safe action is always first. */
function ConfirmationDialog({
  visible,
  title,
  message,
  safeActionLabel,
  onSafeAction,
  confirmLabel,
  onConfirm,
  destructive = false,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onSafeAction}
      statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <SecondaryButton label={safeActionLabel} onPress={onSafeAction} />
            <SecondaryButton
              label={confirmLabel}
              onPress={onConfirm}
              destructive={destructive}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.ui.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.bg.primary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 20,
    ...theme.shadows.card,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  message: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
  actions: {
    marginTop: 20,
    gap: 10,
  },
});

export default React.memo(ConfirmationDialog);
