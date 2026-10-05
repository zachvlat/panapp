import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import CalendarGrid, { SPORT_COLORS, SPORT_LABELS } from '../components/CalendarGrid';
import GameCard from '../components/GameCard';
import {
  GREEK_MONTHS,
  formatGreekLongDate,
  parseStart,
  todayParts,
  shiftMonth,
} from '../utils/dates';

import gamesData from '../assets/games.json';

const ALL_GAMES = gamesData.games || [];

const FILTERS = [
  { key: 'all', label: 'Όλα' },
  { key: 'football', label: 'Ποδόσφαιρο' },
  { key: 'basketball', label: 'Μπάσκετ' },
];

export default function CalendarScreen() {
  const { colors } = useTheme();

  const [filter, setFilter] = useState('all');
  const [cursor, setCursor] = useState(() => {
    const t = todayParts();
    return { year: t.year, month: t.month };
  });
  const [selectedKey, setSelectedKey] = useState(null);

  const today = todayParts();
  const todayKey = today.year * 10000 + today.month * 100 + today.day;

  const games = useMemo(
    () => ALL_GAMES.map((g) => ({ ...g, ...parseStart(g.start) })),
    []
  );

  const filtered = useMemo(
    () => (filter === 'all' ? games : games.filter((g) => g.sport === filter)),
    [games, filter]
  );

  const gamesByKey = useMemo(() => {
    const map = new Map();
    filtered.forEach((g) => {
      if (!map.has(g.key)) map.set(g.key, []);
      map.get(g.key).push(g);
    });
    map.forEach((list) => list.sort((a, b) => a.hours - b.hours || a.minutes - b.minutes));
    return map;
  }, [filtered]);

  useEffect(() => {
    if (selectedKey !== null || !filtered.length) return;

    if (gamesByKey.has(todayKey)) {
      setSelectedKey(todayKey);
      return;
    }
    const upcoming = filtered
      .filter((g) => g.status !== 'played')
      .sort((a, b) => a.key - b.key || a.hours - b.hours)[0];
    if (upcoming) {
      setSelectedKey(upcoming.key);
      setCursor({ year: upcoming.year, month: upcoming.month });
    }
  }, [filtered, gamesByKey, selectedKey, todayKey]);

  useEffect(() => {
    if (selectedKey === null) return;
    if (!gamesByKey.has(selectedKey)) {
      setSelectedKey(gamesByKey.has(todayKey) ? todayKey : null);
    }
  }, [gamesByKey, selectedKey, todayKey]);

  const selectedGames = selectedKey !== null ? gamesByKey.get(selectedKey) || [] : [];

  const nextFixture = useMemo(
    () =>
      filtered
        .filter((g) => g.status !== 'played' && g.key >= todayKey)
        .sort((a, b) => a.key - b.key || a.hours - b.hours || a.minutes - b.minutes)[0],
    [filtered, todayKey]
  );

  const goToday = () => {
    setCursor({ year: today.year, month: today.month });
    setSelectedKey(gamesByKey.has(todayKey) ? todayKey : null);
  };

  if (!ALL_GAMES.length) {
    return (
      <View style={styles.center}>
        <Text style={[styles.emptyText, { color: colors.onSurface }]}>
          Δεν υπάρχουν διαθέσιμα παιχνίδια.{'\n'}Τρέξε: npm run build:games
        </Text>
      </View>
    );
  }

  const selectedParts =
    selectedKey !== null
      ? {
          year: Math.floor(selectedKey / 10000),
          month: Math.floor((selectedKey % 10000) / 100),
          day: selectedKey % 100,
        }
      : null;

  const sportsPresent = Object.keys(SPORT_COLORS).filter((s) => filtered.some((g) => g.sport === s));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.primary }]}>Ημερολόγιο</Text>

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? colors.primary : 'transparent',
                  borderColor: active ? colors.primary : colors.onSurface,
                },
              ]}
            >
              <Text style={[styles.filterText, { color: active ? colors.onPrimary : colors.onSurface }]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.monthNav}>
        <Pressable
          onPress={() => setCursor(shiftMonth(cursor.year, cursor.month, -1))}
          style={styles.navButton}
          hitSlop={10}
        >
          <Text style={[styles.navArrow, { color: colors.primary }]}>‹</Text>
        </Pressable>

        <Pressable onPress={goToday} style={styles.monthLabelWrap}>
          <Text style={[styles.monthLabel, { color: colors.onSurface }]}>
            {GREEK_MONTHS[cursor.month - 1]} {cursor.year}
          </Text>
          <Text style={[styles.monthHint, { color: colors.primary }]}>Σήμερα</Text>
        </Pressable>

        <Pressable
          onPress={() => setCursor(shiftMonth(cursor.year, cursor.month, 1))}
          style={styles.navButton}
          hitSlop={10}
        >
          <Text style={[styles.navArrow, { color: colors.primary }]}>›</Text>
        </Pressable>
      </View>

      <CalendarGrid
        year={cursor.year}
        month={cursor.month}
        gamesByKey={gamesByKey}
        selectedKey={selectedKey}
        onSelectDay={setSelectedKey}
        todayKey={todayKey}
        colors={colors}
      />

      {sportsPresent.length > 0 && (
        <View style={styles.legend}>
          {sportsPresent.map((s) => (
            <View key={s} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: SPORT_COLORS[s] }]} />
              <Text style={[styles.legendText, { color: colors.onSurface }]}>
                {SPORT_LABELS[s]}
              </Text>
            </View>
          ))}
        </View>
      )}

      {selectedParts ? (
        <>
          <Text style={[styles.agendaHeading, { color: colors.primary }]}>
            {formatGreekLongDate(selectedParts.year, selectedParts.month, selectedParts.day)}
          </Text>

          {selectedGames.length > 0 ? (
            selectedGames.map((g) => <GameCard key={g.id} game={g} colors={colors} />)
          ) : (
            <View style={[styles.empty, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyText, { color: colors.onSurface }]}>
                Δεν υπάρχουν αγώνες αυτή την ημέρα.
              </Text>
            </View>
          )}
        </>
      ) : null}

      {selectedGames.length === 0 && nextFixture && (
        <>
          <Text style={[styles.agendaHeading, { color: colors.primary }]}>Επόμενος αγώνας</Text>
          <GameCard game={nextFixture} colors={colors} />
        </>
      )}

      {gamesData.generatedAt && (
        <Text style={[styles.footer, { color: colors.onSurface }]}>
          Σεζόν {gamesData.season} · {filtered.length} αγώνες · ενημέρωση{' '}
          {gamesData.generatedAt.slice(0, 10)}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },

  filters: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontWeight: '700' },

  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: { paddingHorizontal: 16, paddingVertical: 4 },
  navArrow: { fontSize: 30, fontWeight: '700', lineHeight: 34 },
  monthLabelWrap: { alignItems: 'center' },
  monthLabel: { fontSize: 18, fontWeight: '700' },
  monthHint: { fontSize: 11, fontWeight: '600' },

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  legendText: { fontSize: 11 },

  agendaHeading: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 10 },
  empty: { padding: 16, borderRadius: 12 },
  emptyText: { fontSize: 14, textAlign: 'center' },

  footer: { fontSize: 11, textAlign: 'center', marginTop: 20 },
});