import { COUNTRY_MAX, TITLE_MAX, YEAR_MAX, YEAR_MIN } from '../constants/config';
import type { CoinDraft, FieldErrors } from '../models/catalog';

/** Required fields only. Photos, year, mint mark, grade and notes stay optional. */
export function validateDraft(draft: CoinDraft): FieldErrors {
  const errors: FieldErrors = {};

  const country = draft.countryLabel.trim();
  if (!draft.countryKey || country.length === 0) {
    errors.country = 'Choose a country for this coin.';
  } else if (country.length > COUNTRY_MAX) {
    errors.country = 'Country name is too long.';
  }

  const title = draft.title.trim();
  if (title.length === 0) {
    errors.title = 'Add the coin or denomination.';
  } else if (title.length > TITLE_MAX) {
    errors.title = 'Use at most ' + String(TITLE_MAX) + ' characters.';
  }

  if (draft.yearKnown) {
    if (!Number.isFinite(draft.year) || draft.year < YEAR_MIN || draft.year > YEAR_MAX) {
      errors.year =
        'Year must be between ' + String(YEAR_MIN) + ' and ' + String(YEAR_MAX) + '.';
    }
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export const FIELD_ORDER: Array<keyof FieldErrors> = ['country', 'title', 'year'];

export function firstError(errors: FieldErrors): keyof FieldErrors | null {
  for (const key of FIELD_ORDER) {
    if (errors[key]) {
      return key;
    }
  }
  return null;
}
