/**
 * WARM_EARTHY preset with the NumismaticAlbumKeeper brief overrides.
 * The `name` field is the preset identifier and must never be renamed.
 */
export const theme = {
  name: 'warm-earthy',

  colors: {
    // paper / cream catalog pages
    bg: {
      primary: '#F6F1ED',
      secondary: '#DDD8B0',
      tertiary: '#E8DDC4',
      accent: '#D8C9A8',
    },
    // material tokens from the brief
    material: {
      bronze: '#AB5E2A',
      bronzeDark: '#743C1F',
      velvet: '#142238',
      velvetRaised: '#1C304B',
      silver: '#C5CDD6',
      green: '#28E06E',
      greenDeep: '#24C963',
      error: '#9D3434',
    },
    text: {
      primary: '#241D18',
      secondary: '#66584E',
      tertiary: '#76685B',
      onVelvet: '#F6F1ED',
      onVelvetMuted: '#C5CDD6',
    },
    ui: {
      border: 'rgba(197, 205, 214, 0.55)',
      borderBronze: 'rgba(171, 94, 42, 0.20)',
      divider: '#E8DDC4',
      overlay: 'rgba(20, 34, 56, 0.60)',
      paper: 'rgba(246, 241, 237, 0.96)',
      velvetSurface: 'rgba(28, 48, 75, 0.96)',
    },
  },

  gradients: {
    paper: ['#F6F1ED', '#DDD8B0'] as const,
    velvet: ['#142238', '#1C304B'] as const,
    loader: ['#142238', '#1C304B'] as const,
    action: ['#28E06E', '#24C963'] as const,
    bronze: ['#AB5E2A', '#743C1F'] as const,
    receipt: ['#AB5E2A', '#142238'] as const,
  },

  typography: {
    hero: { fontSize: 40, lineHeight: 44, fontWeight: '700' as const, letterSpacing: -0.5 },
    display: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const, letterSpacing: -0.3 },
    heading: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
    cardTitle: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
    button: { fontSize: 16, lineHeight: 24, fontWeight: '700' as const },
    secondary: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
    meta: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  },

  radius: { sm: 10, md: 14, lg: 16, xl: 18, full: 999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  shadows: {
    card: {
      shadowColor: '#743C1F',
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 8,
      elevation: 2,
    },
    action: {
      shadowColor: '#28E06E',
      shadowOpacity: 0.18,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 8,
      elevation: 2,
    },
    bronze: {
      shadowColor: '#743C1F',
      shadowOpacity: 0.22,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 8,
      elevation: 2,
    },
  },

  animation: {
    spring: { tension: 140, friction: 18 },
    duration: { fast: 150, base: 180, slow: 200 },
  },
};

export type Theme = typeof theme;
