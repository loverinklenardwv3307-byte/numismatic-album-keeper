import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { COIN_FACES } from '../assets';
import AppShell from '../components/AppShell';
import CoinFaceMount from '../components/CoinFaceMount';
import ConfirmationDialog from '../components/ConfirmationDialog';
import FormField from '../components/FormField';
import IconButton from '../components/IconButton';
import InlineStatus from '../components/InlineStatus';
import MaterialCard from '../components/MaterialCard';
import OptionSheet from '../components/OptionSheet';
import type { SheetOption } from '../components/OptionSheet';
import PickerRow from '../components/PickerRow';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SegmentedControl from '../components/SegmentedControl';
import Stepper from '../components/Stepper';
import SwitchRow from '../components/SwitchRow';
import { ArrowLeft, Globe, Info, Save } from '../components/icons';
import { MINT_MARK_MAX, NOTES_MAX, TITLE_MAX, YEAR_MAX, YEAR_MIN } from '../constants/config';
import { COUNTRIES } from '../constants/countries';
import { NOT_GRADED, NUMERIC_MAX, NUMERIC_MIN, SIMPLE_GRADES, formatGrade } from '../constants/grades';
import type { GradeScale } from '../constants/grades';
import { theme } from '../constants/theme';
import { albumById, coinById, draftFromCoin, emptyDraft, findDuplicate } from '../game/catalogLogic';
import { firstError, hasErrors, validateDraft } from '../game/validation';
import { readCatalog, saveCoin, useAlbums, useCoins, useSettings } from '../hooks/useCatalog';
import type { CoinDraft, FieldErrors } from '../models/catalog';

type Props = {
  editingCoinId: string | null;
  initialAlbumId: string | null;
  onCancel: () => void;
  onGameOver: (coinId: string) => void;
};

type SheetKind = 'country' | 'grade' | 'front' | 'back';

const SECTIONS = ['faces', 'identification', 'condition', 'notes'];

const SCALES = [
  { key: 'simple', label: 'Simple' },
  { key: 'numeric', label: 'Numeric 1-70' },
];

const ERAS = [
  { key: 'CE', label: 'CE' },
  { key: 'BCE', label: 'BCE' },
];

const NO_FACE = 'none';

function buildInitialDraft(
  editingCoinId: string | null,
  initialAlbumId: string | null,
): CoinDraft {
  const snapshot = readCatalog();
  const coin = coinById(snapshot.coins, editingCoinId);
  if (coin) {
    return draftFromCoin(coin, albumById(snapshot.albums, coin.albumId));
  }
  const draft = emptyDraft(snapshot.settings);
  const album = albumById(snapshot.albums, initialAlbumId ?? snapshot.settings.lastAlbumId);
  if (album) {
    draft.countryKey = album.countryKey;
    draft.countryLabel = album.countryLabel;
  }
  return draft;
}

/** The core workspace: Add Coin / Edit Coin, G1 classic stack. */
function GameScreen({ editingCoinId, initialAlbumId, onCancel, onGameOver }: Props) {
  const albums = useAlbums();
  const coins = useCoins();
  const settings = useSettings();

  const [draft, setDraft] = useState<CoinDraft>(() =>
    buildInitialDraft(editingCoinId, initialAlbumId),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sheet, setSheet] = useState<SheetKind | null>(null);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  // In-flight guard: repeated Save taps must create exactly one record.
  const inFlight = useRef(false);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const editing = editingCoinId !== null;
  const dirty =
    draft.title.trim().length > 0 || draft.notes.trim().length > 0 || draft.frontFace !== null;

  const patch = useCallback((next: Partial<CoinDraft>) => {
    setDraft(current => ({ ...current, ...next }));
  }, []);

  const countryOptions = useMemo<SheetOption[]>(() => {
    const seen = new Set<string>();
    const options: SheetOption[] = [];
    for (const album of albums) {
      if (!seen.has(album.countryKey)) {
        seen.add(album.countryKey);
        options.push({ key: album.countryKey, label: album.countryLabel, caption: 'In your albums' });
      }
    }
    for (const country of COUNTRIES) {
      if (!seen.has(country.key)) {
        seen.add(country.key);
        options.push({ key: country.key, label: country.label });
      }
    }
    return options;
  }, [albums]);

  const gradeOptions = useMemo<SheetOption[]>(() => {
    if (draft.gradeScale === 'numeric') {
      const options: SheetOption[] = [{ key: NOT_GRADED, label: NOT_GRADED }];
      for (let value = NUMERIC_MAX; value >= NUMERIC_MIN; value -= 1) {
        options.push({ key: String(value), label: String(value) + ' / ' + String(NUMERIC_MAX) });
      }
      return options;
    }
    return SIMPLE_GRADES.map(label => ({ key: label, label }));
  }, [draft.gradeScale]);

  const faceOptions = useMemo<SheetOption[]>(
    () =>
      [{ key: NO_FACE, label: 'No artwork recorded' }].concat(
        COIN_FACES.map(face => ({ key: String(face.id), label: face.label })),
      ),
    [],
  );

  const closeSheet = useCallback(() => setSheet(null), []);
  const openCountry = useCallback(() => setSheet('country'), []);
  const openGrade = useCallback(() => setSheet('grade'), []);
  const openFront = useCallback(() => setSheet('front'), []);
  const openBack = useCallback(() => setSheet('back'), []);
  const toggleHelp = useCallback(() => setShowHelp(current => !current), []);

  const handleSheetSelect = useCallback(
    (key: string) => {
      const kind = sheet;
      setSheet(null);
      if (kind === 'country') {
        const option = countryOptions.find(item => item.key === key);
        patch({ countryKey: key, countryLabel: option ? option.label : key });
        setErrors(current => ({ ...current, country: undefined }));
        return;
      }
      if (kind === 'grade') {
        patch({ grade: key === NOT_GRADED ? null : draftRef.current.gradeScale === 'numeric' ? Number(key) : key });
        return;
      }
      const value = key === NO_FACE ? null : Number(key);
      if (kind === 'front') {
        patch({ frontFace: value });
      } else if (kind === 'back') {
        patch({ backFace: value });
      }
    },
    [countryOptions, patch, sheet],
  );

  const handleScale = useCallback(
    (key: string) => {
      // Changing the scale clears only its grade; every other field is kept.
      patch({ gradeScale: key as GradeScale, grade: null });
    },
    [patch],
  );

  const handleEra = useCallback((key: string) => patch({ era: key as 'CE' | 'BCE' }), [patch]);
  const handleYear = useCallback((value: number) => patch({ year: value }), [patch]);
  const handleTitle = useCallback((value: string) => patch({ title: value }), [patch]);
  const handleMint = useCallback((value: string) => patch({ mintMark: value }), [patch]);
  const handleNotes = useCallback((value: string) => patch({ notes: value }), [patch]);
  const handleYearKnown = useCallback(
    (value: boolean) => patch({ yearKnown: value }),
    [patch],
  );

  const handleSave = useCallback(() => {
    if (inFlight.current) {
      return;
    }
    const current = draftRef.current;
    const found = validateDraft(current);
    setErrors(found);
    if (hasErrors(found)) {
      setFailure('');
      return;
    }

    inFlight.current = true;
    setFailure('');
    setSaving(true);

    saveCoin(current)
      .then(coinId => {
        inFlight.current = false;
        setSaving(false);
        onGameOver(coinId);
      })
      .catch(() => {
        inFlight.current = false;
        setSaving(false);
        setFailure('Could not save. Your changes are still here.');
      });
  }, [onGameOver]);

  const requestCancel = useCallback(() => {
    if (dirty && !editing) {
      setDiscarding(true);
      return;
    }
    onCancel();
  }, [dirty, editing, onCancel]);

  const keepEditing = useCallback(() => setDiscarding(false), []);
  const discard = useCallback(() => {
    setDiscarding(false);
    onCancel();
  }, [onCancel]);

  const album = draft.countryKey
    ? albums.find(item => item.countryKey === draft.countryKey) ?? null
    : null;
  const duplicate = findDuplicate(coins, album ? album.id : null, draft);

  const gradeLabel = formatGrade(draft.gradeScale, draft.grade);
  const firstBad = firstError(errors);

  const renderItem = useCallback(
    ({ item }: { item: string }) => {
      if (item === 'faces') {
        return (
          <MaterialCard style={styles.card}>
            <Text style={styles.cardTitle}>Coin faces</Text>
            <Text style={styles.cardHint}>
              Pick the artwork that matches each side. Both are optional.
            </Text>
            <View style={styles.faceRow}>
              <View style={styles.faceSlot}>
                <CoinFaceMount
                  face={draft.frontFace}
                  label="Front"
                  size={112}
                  emptyText="Add front"
                />
                <View style={styles.faceAction}>
                  <SecondaryButton label="FRONT" onPress={openFront} />
                </View>
              </View>
              <View style={styles.faceSlot}>
                <CoinFaceMount
                  face={draft.backFace}
                  label="Back"
                  size={112}
                  emptyText="Add back"
                />
                <View style={styles.faceAction}>
                  <SecondaryButton label="BACK" onPress={openBack} />
                </View>
              </View>
            </View>
          </MaterialCard>
        );
      }

      if (item === 'identification') {
        return (
          <MaterialCard style={styles.card}>
            <Text style={styles.cardTitle}>Identification</Text>

            <PickerRow
              label="Country"
              required
              Icon={Globe}
              value={draft.countryLabel}
              placeholder="Choose a country"
              onPress={openCountry}
              error={errors.country}
            />

            <View style={styles.gap}>
              <FormField
                label="Coin / denomination"
                required
                value={draft.title}
                onChange={handleTitle}
                placeholder="For example, 2 euro"
                helper="Example only, never saved as a default."
                maxLength={TITLE_MAX}
                error={errors.title}
              />
            </View>

            <View style={styles.gap}>
              <SwitchRow
                label="Year known"
                description="Leave off to store an unknown date."
                value={draft.yearKnown}
                onValueChange={handleYearKnown}
              />
            </View>

            {draft.yearKnown ? (
              <View style={styles.gap}>
                <Stepper
                  label="year"
                  value={draft.year}
                  min={YEAR_MIN}
                  max={YEAR_MAX}
                  onChange={handleYear}
                />
                <View style={styles.eraRow}>
                  <SegmentedControl
                    segments={ERAS}
                    selectedKey={draft.era}
                    onSelect={handleEra}
                  />
                </View>
                {errors.year ? (
                  <Text style={styles.errorText}>{errors.year}</Text>
                ) : null}
              </View>
            ) : null}

            <View style={styles.gap}>
              <FormField
                label="Mint mark"
                value={draft.mintMark}
                onChange={handleMint}
                placeholder="Optional"
                maxLength={MINT_MARK_MAX}
              />
            </View>

            {duplicate ? (
              <View style={styles.gap}>
                <InlineStatus
                  severity="error"
                  message={'A similar coin is already in this album: ' + duplicate.title}
                />
              </View>
            ) : null}
          </MaterialCard>
        );
      }

      if (item === 'condition') {
        return (
          <MaterialCard style={styles.card}>
            <Text style={styles.cardTitle}>Condition</Text>
            <Text style={styles.cardHint}>
              Grades are your own notes. Changing the scale clears only the grade.
            </Text>
            <SegmentedControl
              segments={SCALES}
              selectedKey={draft.gradeScale}
              onSelect={handleScale}
            />
            <View style={styles.gap}>
              <PickerRow
                label="Grade"
                value={gradeLabel}
                placeholder={NOT_GRADED}
                onPress={openGrade}
              />
            </View>
          </MaterialCard>
        );
      }

      return (
        <MaterialCard style={styles.card}>
          <Text style={styles.cardTitle}>Notes</Text>
          <FormField
            label="Provenance, variants, visible wear"
            value={draft.notes}
            onChange={handleNotes}
            placeholder="Optional"
            maxLength={NOTES_MAX}
            multiline
          />
        </MaterialCard>
      );
    },
    [
      draft.backFace,
      draft.countryLabel,
      draft.era,
      draft.frontFace,
      draft.gradeScale,
      draft.mintMark,
      draft.notes,
      draft.title,
      draft.year,
      draft.yearKnown,
      duplicate,
      errors.country,
      errors.title,
      errors.year,
      gradeLabel,
      handleEra,
      handleMint,
      handleNotes,
      handleScale,
      handleTitle,
      handleYear,
      handleYearKnown,
      openBack,
      openCountry,
      openFront,
      openGrade,
    ],
  );

  const keyExtractor = useCallback((item: string) => item, []);

  const header = useMemo(() => {
    if (!showHelp) {
      return null;
    }
    return (
      <MaterialCard variant="inset" style={styles.help}>
        <Text style={styles.helpText}>
          Front and back are the two sides of the coin. Date, mint mark, grade and notes are
          optional; only country and denomination are required.
        </Text>
      </MaterialCard>
    );
  }, [showHelp]);

  const sheetTitle =
    sheet === 'country'
      ? 'Country'
      : sheet === 'grade'
      ? 'Condition'
      : sheet === 'front'
      ? 'Front artwork'
      : 'Back artwork';

  const sheetOptions =
    sheet === 'country' ? countryOptions : sheet === 'grade' ? gradeOptions : faceOptions;

  const sheetSelected =
    sheet === 'country'
      ? draft.countryKey
      : sheet === 'grade'
      ? draft.grade === null
        ? NOT_GRADED
        : String(draft.grade)
      : sheet === 'front'
      ? draft.frontFace === null
        ? NO_FACE
        : String(draft.frontFace)
      : draft.backFace === null
      ? NO_FACE
      : String(draft.backFace);

  return (
    <AppShell variant="paper">
      <ScreenHeader
        title={editing ? 'Edit Coin' : 'Add Coin'}
        subtitle={
          firstBad ? 'Check the highlighted field' : settings.defaultGradeScale === 'numeric' ? 'Numeric grading' : 'Simple grading'
        }
        leftSlot={<IconButton Icon={ArrowLeft} onPress={requestCancel} label="Back" />}
        rightSlot={<IconButton Icon={Info} onPress={toggleHelp} label="Help" />}
      />

      <FlatList
        data={SECTIONS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={header}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />

      <View style={styles.dock}>
        {failure ? (
          <View style={styles.statusWrap}>
            <InlineStatus severity="error" message={failure} />
          </View>
        ) : null}
        <Text style={styles.dockHint}>
          {saving ? 'Saving coin' : 'Country and denomination are required'}
        </Text>
        <PrimaryButton
          label={editing ? 'SAVE CHANGES' : 'SAVE COIN'}
          busyLabel="SAVING COIN"
          busy={saving}
          onPress={handleSave}
          Icon={Save}
        />
        <View style={styles.cancelWrap}>
          <SecondaryButton label="CANCEL" onPress={requestCancel} />
        </View>
      </View>

      <OptionSheet
        visible={sheet !== null}
        title={sheetTitle}
        options={sheetOptions}
        selectedKey={sheetSelected}
        onSelect={handleSheetSelect}
        onClose={closeSheet}
      />

      <ConfirmationDialog
        visible={discarding}
        title="Discard changes?"
        message="This draft has details that have not been saved yet."
        safeActionLabel="KEEP EDITING"
        onSafeAction={keepEditing}
        confirmLabel="DISCARD"
        onConfirm={discard}
        destructive
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 6,
  },
  cardHint: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.tertiary,
    marginBottom: 12,
  },
  faceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  faceSlot: {
    flex: 1,
    alignItems: 'center',
  },
  faceAction: {
    width: '100%',
    marginTop: 10,
  },
  gap: {
    marginTop: 12,
  },
  eraRow: {
    marginTop: 10,
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.material.error,
  },
  help: {
    padding: 14,
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  dock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: theme.colors.ui.paper,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderTopWidth: 1,
    borderColor: theme.colors.ui.borderBronze,
  },
  statusWrap: {
    marginBottom: 10,
  },
  dockHint: {
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.secondary,
  },
  cancelWrap: {
    marginTop: 10,
  },
});

export default React.memo(GameScreen);
