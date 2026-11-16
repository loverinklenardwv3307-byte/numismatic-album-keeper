import { useCallback } from 'react';
import { Vibration } from 'react-native';
import { useSettings } from './useCatalog';

/**
 * One short acknowledgement for a committed action. Respects the Settings
 * switch; never fires repeatedly for the same save.
 * Requires android.permission.VIBRATE, declared in AndroidManifest.xml.
 */
export function useFeedback() {
  const settings = useSettings();
  const haptics = settings.hapticsEnabled;

  const acknowledge = useCallback(() => {
    if (!haptics) {
      return;
    }
    Vibration.vibrate(18);
  }, [haptics]);

  return { acknowledge, hapticsEnabled: haptics };
}
