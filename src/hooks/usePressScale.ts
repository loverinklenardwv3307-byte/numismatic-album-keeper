import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { PRESS_IN_MS, PRESS_SCALE } from '../constants/config';
import { theme } from '../constants/theme';
import { useSettings } from './useCatalog';

/**
 * Press feedback for a Pressable PARENT with an Animated.View CHILD.
 * transform only, so useNativeDriver stays safe on Android release.
 */
export function usePressScale(target: number = PRESS_SCALE) {
  const settings = useSettings();
  const reduceMotion = settings.reduceMotion;
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (reduceMotion) {
      return;
    }
    Animated.timing(scale, {
      toValue: target,
      duration: PRESS_IN_MS,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, scale, target]);

  const onPressOut = useCallback(() => {
    if (reduceMotion) {
      return;
    }
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.spring.tension,
      friction: theme.animation.spring.friction,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, scale]);

  return { scale, onPressIn, onPressOut };
}
