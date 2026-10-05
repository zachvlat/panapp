import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { formatKickoff, parseStart } from '../utils/dates';
import { SPORT_COLORS, SPORT_LABELS } from './CalendarGrid';

const CLUB_LABELS = {
  PAE: 'ΠΑΕ',
  KAE: 'ΚΑΕ',
};

const SQUAD_LABELS = {
  men: 'Ανδρικό',
  women: 'Γυναικείο',
};

export default function GameCard({ game, colors }) {
  const { hours, minutes } = parseStart(game.start);
  const kickoff = formatKickoff(hours, minutes, game.timeConfirmed);
  const accent = SPORT_COLORS[game.sport] || colors.primary;
  const isPlayed = game.status === 'played';
  const score = game.score;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderLeftColor: accent,
          opacity: isPlayed ? 0.6 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: accent }]}>
          <Text style={styles.badgeText}>{SPORT_LABELS[game.sport] || game.sport}</Text>
        </View>

        <View style={styles.headerMeta}>
          <Text style={[styles.club, { color: colors.onSurface }]}>
            {CLUB_LABELS[game.club] || game.club}
            {game.squad ? ` · ${SQUAD_LABELS[game.squad] || game.squad}` : ''}
            {' · '}
            {game.home ? 'Εντός' : 'Εκτός'}
          </Text>
        </View>

        {isPlayed && score ? (
          <Text style={[styles.kickoff, { color: colors.onSurface }]}>
            {score.home}-{score.away}
          </Text>
        ) : (
          <Text
            style={[
              styles.kickoff,
              {
                color: game.timeConfirmed ? colors.primary : 'rgba(255,255,255,0.45)',
              },
            ]}
          >
            {kickoff}
          </Text>
        )}
      </View>

      <Text style={[styles.opponent, { color: colors.onSurface }]} numberOfLines={2}>
        <Text style={{ color: accent }}>
          {game.home ? game.opponent : 'Παναθηναϊκός'}
        </Text>
        {' – '}
        <Text style={{ color: accent }}>
          {game.home ? 'Παναθηναϊκός' : game.opponent}
        </Text>
      </Text>

      <Text style={[styles.competition, { color: colors.primary }]} numberOfLines={1}>
        {game.competition}
        {game.round ? ` · ${game.round}` : ''}
      </Text>

      {game.home && game.venue ? (
        <Pressable
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(game.venue)}`
            )
          }
        >
          <Text style={[styles.venue, { color: colors.onSurface }]} numberOfLines={2}>
            📍 {game.venue}
          </Text>
        </Pressable>
      ) : (
        <Text style={[styles.venueMuted, { color: colors.onSurface }]} numberOfLines={1}>
          📍 Έδρα {game.opponent}
        </Text>
      )}

      <View style={styles.footer}>
        {isPlayed ? (
          <Text style={[styles.flag, { color: colors.onSurface }]}>Διεξήχθη</Text>
        ) : (
          <Text style={[styles.flag, { color: colors.primary }]}>Αναμονή</Text>
        )}
        {!game.timeConfirmed && <Text style={[styles.flag, { color: colors.onSurface }]}>Ώρα προς διευκρίνιση</Text>}
        {!game.home && <Text style={[styles.flag, { color: colors.onSurface }]}>Εκτός έδρας</Text>}
        {}
        {game.conflict && (
          <Text style={[styles.flag, { color: '#FFB300' }]}>Πιθανή μετακίνηση</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  headerMeta: {
    flex: 1,
    marginLeft: 8,
  },
  club: {
    fontSize: 11,
    fontWeight: '600',
  },
  kickoff: {
    fontSize: 18,
    fontWeight: '700',
  },
  opponent: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  competition: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  venue: {
    fontSize: 12,
    marginTop: 2,
    textDecorationLine: 'underline',
  },
  venueMuted: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  flag: {
    fontSize: 11,
    fontWeight: '600',
  },
});