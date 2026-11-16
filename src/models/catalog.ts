import type { GradeScale } from '../constants/grades';

export type Era = 'CE' | 'BCE';

export type Album = {
  id: string;
  countryKey: string;
  countryLabel: string;
  builtIn: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Coin = {
  id: string;
  albumId: string;
  title: string;
  year: number | null;
  era: Era;
  mintMark: string;
  gradeScale: GradeScale;
  grade: string | number | null;
  notes: string;
  frontFace: number | null;
  backFace: number | null;
  createdAt: string;
  updatedAt: string;
};

export type Settings = {
  defaultGradeScale: GradeScale;
  hapticsEnabled: boolean;
  reduceMotion: boolean;
  lastAlbumId: string | null;
};

export type CatalogSnapshot = {
  schemaVersion: 1;
  revision: number;
  albums: Album[];
  coins: Coin[];
  settings: Settings;
};

/** Values the Add Coin form owns before a commit. */
export type CoinDraft = {
  editingCoinId: string | null;
  countryKey: string | null;
  countryLabel: string;
  title: string;
  yearKnown: boolean;
  year: number;
  era: Era;
  mintMark: string;
  gradeScale: GradeScale;
  grade: string | number | null;
  notes: string;
  frontFace: number | null;
  backFace: number | null;
};

export type FieldErrors = {
  country?: string;
  title?: string;
  year?: string;
};
