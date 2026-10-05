import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  GREEK_DAY_INITIALS,
  buildMonthGrid,
  daysInMonth,
} from '../utils/dates';

export const SPORT_COLORS = {
  football: '#4CAF50',
  basketball: '#FF9800',
};

export const SPORT_LABELS = {
  football: 'Ποδόσφαιρο',
  basketball: 'Μπάσκετ',
};

const MAX_DOTS = 3;

export default function CalendarGrid({
  year,
  month,
  gamesByKey,
  selectedKey,
  onSelectDay,
  todayKey,
  colors,
}) {
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const inMonthTotal = daysInMonth(year, month);

  return (
    <View>
      <View style={styles.weekHeader}>
        {GREEK_DAY_INITIALS.map((initial, i) => (
          <Text key={initial + i} style={[styles.weekHeaderCell, { color: colors.primary }]}>
            {initial}
          </Text>
        ))}
      </View>

      {weeks.map((week, w) => (
        <View key={w} style={styles.week}>
          {week.map((cell, c) => {
            const key = cell.year * 10000 + cell.month * 100 + cell.day;
            const games = gamesByKey.get(key) || [];
            const isSelected = key === selectedKey;
            const isToday = key === todayKey;
            const inMonth = !cell.outside;

            const sports = [];
            games.forEach((g) => {
              if (!sports.includes(g.sport)) sports.push(g.sport);
            });

            return (
              <Pressable
                key={key}
                disabled={!inMonth}
                onPress={() => onSelectDay(key)}
                style={styles.cellWrap}
              >
                <View
                  style={[
                    styles.cell,
                    { backgroundColor: isSelected ? colors.primary : 'transparent' },
                    isToday && !isSelected && { borderColor: colors.primary, borderWidth: 1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.cellDay,
                      {
                        color: isSelected
                          ? colors.onPrimary
                          : !inMonth
                            ? 'rgba(255,255,255,0.22)'
                            : colors.onSurface,
                      },
                    ]}
                  >
                    {cell.day}
                  </Text>

                  <View style={styles.dots}>
                    {sports.slice(0, MAX_DOTS).map((sport, i) => (
                      <View
                        key={sport + i}
                        style={[
                          styles.dot,
                          {
                            backgroundColor: isSelected ? colors.onPrimary : SPORT_COLORS[sport],
                            borderColor: isSelected ? colors.primary : 'transparent',
                          },
                        ]}
                      />
                    ))}
                    {games.length > MAX_DOTS && (
                      <Text
                        style={[
                          styles.more,
                          { color: isSelected ? colors.onPrimary : colors.onSurface },
                        ]}
                      >
                        +{games.length - MAX_DOTS}
                      </Text>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      {}
      <Text style={styles.accessibleMonth}>
        {`${inMonthTotal} ημέρες`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  week: {
    flexDirection: 'row',
  },
  cellWrap: {
    flex: 1,
    padding: 2,
  },
  cell: {
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellDay: {
    fontSize: 14,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    minHeight: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginHorizontal: 1,
    borderWidth: 1,
  },
  more: {
    fontSize: 9,
    marginLeft: 1,
  },
  accessibleMonth: {
    display: 'none',
  },
});