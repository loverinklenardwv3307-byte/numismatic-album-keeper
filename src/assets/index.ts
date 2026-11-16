/**
 * Re-export of the factory asset contract. Only these file names exist.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'),
  sprite2: require('../../assets/sprite_2.png'),
  sprite3: require('../../assets/sprite_3.png'),
  sprite4: require('../../assets/sprite_4.png'),
  sprite5: require('../../assets/sprite_5.png'),
  buttonRect: require('../../assets/button_rect.png'),
  buttonRound: require('../../assets/button_round.png'),
};

/**
 * The four illustrative coin faces a record can carry.
 * sprite_1/2 are the silver obverse+reverse, sprite_3/4 the bronze pair.
 */
export const COIN_FACES = [
  { id: 0, label: 'Silver obverse', source: assets.sprite1 },
  { id: 1, label: 'Silver reverse', source: assets.sprite2 },
  { id: 2, label: 'Bronze obverse', source: assets.sprite3 },
  { id: 3, label: 'Bronze reverse', source: assets.sprite4 },
];

export function faceSource(index: number | null) {
  if (index === null || index < 0 || index >= COIN_FACES.length) {
    return null;
  }
  return COIN_FACES[index].source;
}

export function faceLabel(index: number | null) {
  if (index === null || index < 0 || index >= COIN_FACES.length) {
    return '';
  }
  return COIN_FACES[index].label;
}
