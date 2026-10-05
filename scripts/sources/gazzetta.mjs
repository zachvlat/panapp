import { fetchWithRetry } from '../lib/http.mjs';
import { parseEuropeanDate } from '../lib/time.mjs';
import { competitionLabel, tidyOpponent, SECTIONS } from '../lib/label.mjs';

const URL = 'https://www.gazzetta.gr/gztfeeds/program/team/557/sport/4';

const VENUE_HOME = 'Ολυμπιακό Στάδιο Αθηνών «Σπύρος Λούης» (ΟΑΚΑ)';
const VENUE_HOME_ALT = 'New Philadelphia Arena';

export const id = 'gazzetta-gr';
export const name = 'Gazzetta.gr (πρόγραμμα ΠΑΕ)';

const AWAY_VENUE_LABELS = {
  OAKA: VENUE_HOME,
};

export async function collect({ log = () => {} } = {}) {
  const payload = await fetchWithRetry(URL);

  const rows = Object.keys(payload)
    .filter((k) => /^match_\d+$/.test(k))
    .map((k) => payload[k])
    .filter(Boolean);

  log(`      ${rows.length} programme entries`);

  const games = [];

  for (const m of rows) {
    const start = parseEuropeanDate(m.match_date, m.match_time);
    if (!start) {
      log(`      skipped unparseable date: ${m.match_date} ${m.match_time}`);
      continue;
    }

    const homeIsUs = /Παναθηναϊκ/i.test(m.home_team_name || '');
    const awayIsUs = /Παναθηναϊκ/i.test(m.away_team_name || '');
    if (!homeIsUs && !awayIsUs) continue;

    const opponent = tidyOpponent(homeIsUs ? m.away_team_name : m.home_team_name);
    if (!opponent) continue;

    const played =
      m.home_score !== undefined &&
      m.home_score !== null &&
      m.home_score !== '' &&
      m.away_score !== undefined &&
      m.away_score !== null &&
      m.away_score !== '';

    const timeConfirmed = !/^\s*$/.test(String(m.match_time || ''));

    games.push({
      sourceId: id,
      department: SECTIONS.FOOTBALL.department,
      sport: SECTIONS.FOOTBALL.sport,
      squad: SECTIONS.FOOTBALL.squad,
      club: SECTIONS.FOOTBALL.club,
      competition: competitionLabel(m.league?.name),
      round: null,
      home: homeIsUs,
      opponent,
      venue: homeIsUs ? VENUE_HOME : AWAY_VENUE_LABELS[null] ?? null,
      start,
      timeConfirmed,
      status: played ? 'played' : 'scheduled',
      score: played ? { home: Number(m.home_score), away: Number(m.away_score) } : null,
      sourceUrl: m.match_url ? `https://www.gazzetta.gr${m.match_url}` : URL,
    });
  }

  if (!games.length) throw new Error('Gazzetta returned no usable fixtures');

  return games;
}