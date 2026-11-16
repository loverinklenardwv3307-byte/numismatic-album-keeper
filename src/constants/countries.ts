/** Bundled country list with stable built-in keys. */
export type CountryOption = { key: string; label: string };

export const COUNTRIES: CountryOption[] = [
  { key: 'argentina', label: 'Argentina' },
  { key: 'australia', label: 'Australia' },
  { key: 'austria', label: 'Austria' },
  { key: 'belgium', label: 'Belgium' },
  { key: 'brazil', label: 'Brazil' },
  { key: 'canada', label: 'Canada' },
  { key: 'china', label: 'China' },
  { key: 'czechia', label: 'Czechia' },
  { key: 'denmark', label: 'Denmark' },
  { key: 'egypt', label: 'Egypt' },
  { key: 'finland', label: 'Finland' },
  { key: 'france', label: 'France' },
  { key: 'germany', label: 'Germany' },
  { key: 'greece', label: 'Greece' },
  { key: 'india', label: 'India' },
  { key: 'ireland', label: 'Ireland' },
  { key: 'italy', label: 'Italy' },
  { key: 'japan', label: 'Japan' },
  { key: 'mexico', label: 'Mexico' },
  { key: 'netherlands', label: 'Netherlands' },
  { key: 'norway', label: 'Norway' },
  { key: 'poland', label: 'Poland' },
  { key: 'portugal', label: 'Portugal' },
  { key: 'roman-empire', label: 'Roman Empire' },
  { key: 'south-africa', label: 'South Africa' },
  { key: 'spain', label: 'Spain' },
  { key: 'sweden', label: 'Sweden' },
  { key: 'switzerland', label: 'Switzerland' },
  { key: 'turkiye', label: 'Turkiye' },
  { key: 'united-kingdom', label: 'United Kingdom' },
  { key: 'united-states', label: 'United States' },
];

/** Trim, collapse inner runs of spaces, compare case-insensitively. */
export function normalizeCountryKey(label: string): string {
  return label
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ /g, '-');
}

export function cleanCountryLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ');
}
