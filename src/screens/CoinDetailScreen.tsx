import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import CoinFaceMount from '../components/CoinFaceMount';
import ConfirmationDialog from '../components/ConfirmationDialog';
import IconButton from '../components/IconButton';
import MaterialCard from '../components/MaterialCard';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SegmentedControl from '../components/SegmentedControl';
import { ArrowLeft, Layers, Pencil, Trash2 } from '../components/icons';
import { formatGrade } from '../constants/grades';
import { theme } from '../constants/theme';
import { albumById, coinById } from '../game/catalogLogic';
import { removeCoin, useAlbums, useCoins } from '../hooks/useCatalog';
import { formatCoinDate } from '../utils/format';

type Props = {
  coinId: string;
  onBack: () => void;
  onEdit: (coinId: string) => void;
  onDeleted: () => void;
};

const SCREEN_W = Dimensions.get('window').width;
const PANEL = Math.min(SCREEN_W - 32, 340);

const FACES = [
  { key: 'front', label: 'Front' },
  { key: 'back', label: 'Back' },
];

const SECTIONS = ['photo', 'data'];

type FieldProps = { label: string; value: string };

const Field = React.memo(function Field({ label, value }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
});

/** The photo focused album page for one record. */
function CoinDetailScreen({ coinId, onBack, onEdit, onDeleted }: Props) {
  const coins = useCoins();
  const albums = useAlbums();
  const [face, setFace] = useState('front');
  const [confirming, setConfirming] = useState(false);

  const coin = coinById(coins, coinId);
  const album = coin ? albumById(albums, coin.albumId) : null;

  const handleEdit = useCallback(() => onEdit(coinId), [coinId, onEdit]);
  const openConfirm = useCallback(() => setConfirming(true), []);
  const closeConfirm = useCallback(() => setConfirming(false), []);
  const handleDelete = useCallback(() => {
    setConfirming(false);
    removeCoin(coinId);
    onDeleted();
  }, [coinId, onDeleted]);

  const renderItem = useCallback(
    ({ item }: { item: string }) => {
      if (!coin) {
        return null;
      }
      if (item === 'photo') {
        const showFront = face === 'front';
        const selected = showFront ? coin.frontFace : coin.backFace;
        return (
          <View style={styles.photoBlock}>
            <View style={styles.segmentWrap}>
              <SegmentedControl
                segments={FACES}
                selectedKey={face}
                onSelect={setFace}
                surface="velvet"
              />
            </View>
            <CoinFaceMount
              face={selected}
              label={showFront ? 'Front' : 'Back'}
              size={PANEL}
              emptyText={showFront ? 'No front photo' : 'No back photo'}
            />
          </View>
        );
      }

      return (
        <MaterialCard style={styles.dataCard}>
          <Text style={styles.coinTitle}>{coin.title}</Text>
          <Text style={styles.coinCountry}>
            {album ? album.countryLabel : 'Country not recorded'}
          </Text>
          <View style={styles.divider} />
          <Field label="DATE" value={formatCoinDate(coin)} />
          <Field
            label="MINT MARK"
            value={coin.mintMark.length > 0 ? coin.mintMark : 'Not recorded'}
          />
          <Field label="CONDITION" value={formatGrade(coin.gradeScale, coin.grade)} />
          <Field
            label="NOTES"
            value={coin.notes.length > 0 ? coin.notes : 'No notes yet'}
          />
        </MaterialCard>
      );
    },
    [album, coin, face],
  );

  const keyExtractor = useCallback((item: string) => item, []);

  const content = useMemo(() => (coin ? SECTIONS : []), [coin]);

  return (
    <AppShell variant="velvet">
      <ScreenHeader
        surface="velvet"
        title="Coin Detail"
        subtitle={album ? album.countryLabel : undefined}
        leftSlot={
          <IconButton Icon={ArrowLeft} onPress={onBack} label="Back to album" tone="velvet" />
        }
        rightSlot={
          <IconButton
            Icon={Trash2}
            onPress={openConfirm}
            label="Delete coin"
            tone="velvet"
          />
        }
      />

      <FlatList
        data={content}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.dock}>
        <PrimaryButton label="EDIT COIN" onPress={handleEdit} Icon={Pencil} />
        <View style={styles.secondarySpacing}>
          <SecondaryButton label="BACK TO ALBUM" onPress={onBack} Icon={Layers} />
        </View>
      </View>

      <ConfirmationDialog
        visible={confirming}
        title="Delete coin?"
        message={
          coin
            ? 'This removes ' + coin.title + ' and its saved artwork from the album.'
            : 'This removes the record from the album.'
        }
        safeActionLabel="KEEP COIN"
        onSafeAction={closeConfirm}
        confirmLabel="DELETE COIN"
        onConfirm={handleDelete}
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
    alignItems: 'center',
  },
  photoBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  segmentWrap: {
    width: PANEL,
    marginBottom: 12,
  },
  dataCard: {
    width: PANEL,
    padding: 16,
  },
  coinTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  coinCountry: {
    marginTop: 4,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
  divider: {
    marginVertical: 12,
    height: 1,
    backgroundColor: theme.colors.ui.divider,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: theme.colors.text.tertiary,
  },
  fieldValue: {
    marginTop: 2,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
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
  secondarySpacing: {
    marginTop: 10,
  },
});

export default React.memo(CoinDetailScreen);
