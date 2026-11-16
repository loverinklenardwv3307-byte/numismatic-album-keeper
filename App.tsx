import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import type { RootTab } from './src/components/BottomTabBar';
import { TRANSITION_MS } from './src/constants/config';
import { theme } from './src/constants/theme';
import { rememberAlbum, useSettings } from './src/hooks/useCatalog';
import AlbumScreen from './src/screens/AlbumScreen';
import CoinDetailScreen from './src/screens/CoinDetailScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatsScreen from './src/screens/StatsScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'album'
  | 'game'
  | 'detail'
  | 'gameover'
  | 'stats'
  | 'settings';

const VELVET_SCREENS: Screen[] = ['loader', 'album', 'detail', 'gameover'];

/** Root state machine. No navigation package: one explicit screen key. */
function App() {
  const settings = useSettings();
  const [screen, setScreen] = useState<Screen>('loader');
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [coinId, setCoinId] = useState<string | null>(null);
  const [editingCoinId, setEditingCoinId] = useState<string | null>(null);
  const [savedCoinId, setSavedCoinId] = useState<string | null>(null);

  const fade = useRef(new Animated.Value(1)).current;
  const screenRef = useRef<Screen>(screen);
  screenRef.current = screen;

  const reduceMotion = settings.reduceMotion;

  useEffect(() => {
    fade.setValue(reduceMotion ? 1 : 0);
    if (reduceMotion) {
      return;
    }
    Animated.timing(fade, {
      toValue: 1,
      duration: TRANSITION_MS,
      useNativeDriver: true,
    }).start();
  }, [fade, reduceMotion, screen]);

  const goMenu = useCallback(() => {
    setScreen('menu');
  }, []);

  const handleLoaderDone = useCallback(() => setScreen('menu'), []);

  const openAlbum = useCallback((nextAlbumId: string) => {
    setAlbumId(nextAlbumId);
    rememberAlbum(nextAlbumId);
    setScreen('album');
  }, []);

  const openCoin = useCallback((nextCoinId: string) => {
    setCoinId(nextCoinId);
    setScreen('detail');
  }, []);

  const startCataloging = useCallback(() => {
    setEditingCoinId(null);
    setScreen('game');
  }, []);

  const addToAlbum = useCallback((nextAlbumId: string) => {
    setAlbumId(nextAlbumId);
    setEditingCoinId(null);
    setScreen('game');
  }, []);

  const editCoin = useCallback((nextCoinId: string) => {
    setEditingCoinId(nextCoinId);
    setScreen('game');
  }, []);

  const handleSaved = useCallback((nextCoinId: string) => {
    setSavedCoinId(nextCoinId);
    setEditingCoinId(null);
    setScreen('gameover');
  }, []);

  const cancelForm = useCallback(() => {
    setEditingCoinId(null);
    setScreen(albumId ? 'album' : 'menu');
  }, [albumId]);

  const addAgain = useCallback(() => {
    setEditingCoinId(null);
    setScreen('game');
  }, []);

  const viewSavedCoin = useCallback((nextCoinId: string) => {
    setCoinId(nextCoinId);
    setScreen('detail');
  }, []);

  const backToAlbum = useCallback(() => {
    setScreen(albumId ? 'album' : 'menu');
  }, [albumId]);

  const selectTab = useCallback((next: RootTab) => {
    if (next === 'albums') {
      setScreen('menu');
    } else if (next === 'stats') {
      setScreen('stats');
    } else {
      setScreen('settings');
    }
  }, []);

  // Android hardware back follows the visual hierarchy.
  useEffect(() => {
    const onBack = () => {
      const current = screenRef.current;
      if (current === 'menu' || current === 'loader') {
        return false;
      }
      if (current === 'album' || current === 'stats' || current === 'settings') {
        setScreen('menu');
        return true;
      }
      if (current === 'detail') {
        setScreen('album');
        return true;
      }
      if (current === 'gameover') {
        setScreen(savedCoinId ? 'detail' : 'menu');
        if (savedCoinId) {
          setCoinId(savedCoinId);
        }
        return true;
      }
      setScreen('menu');
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, [savedCoinId]);

  const onVelvet = VELVET_SCREENS.indexOf(screen) >= 0;

  let content: React.ReactNode = null;
  if (screen === 'loader') {
    content = <LoaderScreen onDone={handleLoaderDone} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        onOpenAlbum={openAlbum}
        onStartCataloging={startCataloging}
        onSelectTab={selectTab}
      />
    );
  } else if (screen === 'album' && albumId) {
    content = (
      <AlbumScreen
        albumId={albumId}
        onBack={goMenu}
        onOpenCoin={openCoin}
        onAddCoin={addToAlbum}
      />
    );
  } else if (screen === 'detail' && coinId) {
    content = (
      <CoinDetailScreen
        coinId={coinId}
        onBack={backToAlbum}
        onEdit={editCoin}
        onDeleted={backToAlbum}
      />
    );
  } else if (screen === 'game') {
    content = (
      <GameScreen
        editingCoinId={editingCoinId}
        initialAlbumId={albumId}
        onCancel={cancelForm}
        onGameOver={handleSaved}
      />
    );
  } else if (screen === 'gameover' && savedCoinId) {
    content = (
      <GameOverScreen
        coinId={savedCoinId}
        onAddAgain={addAgain}
        onViewCoin={viewSavedCoin}
        onBackToAlbums={goMenu}
      />
    );
  } else if (screen === 'stats') {
    content = (
      <StatsScreen
        onOpenAlbum={openAlbum}
        onStartCataloging={startCataloging}
        onSelectTab={selectTab}
      />
    );
  } else if (screen === 'settings') {
    content = <SettingsScreen onSelectTab={selectTab} />;
  } else {
    content = (
      <MenuScreen
        onOpenAlbum={openAlbum}
        onStartCataloging={startCataloging}
        onSelectTab={selectTab}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={onVelvet ? 'light-content' : 'dark-content'}
      />
      <Animated.View pointerEvents="box-none" style={[styles.fill, { opacity: fade }]}>
        {content}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.material.velvet,
  },
  fill: {
    flex: 1,
  },
});

export default App;
