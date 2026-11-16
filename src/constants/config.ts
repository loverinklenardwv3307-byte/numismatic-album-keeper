/** Tunables for NumismaticAlbumKeeper. */

/** Branded splash length. Fixed at 8000 ms by the factory rules - do not shorten. */
export const LOADER_DURATION_MS = 8000;

/** Shared screen-to-screen fade. */
export const TRANSITION_MS = 180;

/** Press feedback. */
export const PRESS_SCALE = 0.98;
export const PRESS_IN_MS = 80;

/** Minimum touch target in dp. */
export const MIN_TARGET = 48;

/** Fixed chrome sizes. */
export const HEADER_TOP_PAD = 44;
export const HEADER_HEIGHT = 64;
export const TAB_BAR_HEIGHT = 64;

/** Form limits. */
export const TITLE_MAX = 80;
export const COUNTRY_MAX = 60;
export const MINT_MARK_MAX = 16;
export const NOTES_MAX = 2000;
export const YEAR_MIN = 1;
export const YEAR_MAX = 9999;

/** Saving simulation guard - the commit is local and near-instant. */
export const SAVE_COMMIT_MS = 420;

/** Transient confirmation message lifetime. */
export const STATUS_MS = 3000;

/** Board / preview geometry. */
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;
