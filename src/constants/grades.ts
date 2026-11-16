export type GradeScale = 'simple' | 'numeric';

/** Simple condition labels, in display order. User-entered, never converted. */
export const SIMPLE_GRADES = [
  'Not graded',
  'Poor',
  'Fair',
  'Good',
  'Very good',
  'Fine',
  'Very fine',
  'Extremely fine',
  'About uncirculated',
  'Uncirculated',
];

export const NUMERIC_MIN = 1;
export const NUMERIC_MAX = 70;

export const NOT_GRADED = 'Not graded';

/** Renders the stored grade together with its own saved scale. */
export function formatGrade(scale: GradeScale, value: string | number | null): string {
  if (value === null || value === NOT_GRADED) {
    return NOT_GRADED;
  }
  if (scale === 'numeric') {
    return 'Numeric: ' + String(value) + '/' + String(NUMERIC_MAX);
  }
  return String(value);
}
