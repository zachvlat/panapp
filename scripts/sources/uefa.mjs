import { fetchWithRetry, pause } from '../lib/http.mjs';
import { utcToAthens } from '../lib/time.mjs';
import { competitionLabel, roundLabel, legSuffix, tidyOpponent, SECTIONS } from '../lib/label.mjs';

const BASE = 'https://match.uefa.com/v5/matches';
const PAGE = 100;
const MAX_PAGES = 25;

const PAN_ID = '50084';

const COMPETITIONS = [
  { id: '2019', key: 'UECL', fallback: 'UEFA Conference League' },
  { id: '1', key: 'UCL', fallback: 'UEFA Champions League' },
  { id: '2', key: 'UEL', fallback: 'UEFA Europa League' },
];

function currentSeasonYears(now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 7 ? year + 1 : year;
}

const STADIUM_LABELS = {
  'Olympic Athletic Center of Athens "Spyros Louis"': 'Ολυμπιακό Στάδιο Αθηνών «Σπύρος Λούης» (ΟΑΚΑ)',
};

export const id = 'uefa-v5';
export const name = 'UEFA (match.uefa.com v5)';

export async function collect({ log = () => {} } = {}) {
  const panId = await resolveTeamId(log);

  const games = [];
  const seen = new Set();

  const seasonYear = currentSeasonYears();
  for (const comp of COMPETITIONS) {
    let found = 0;
    let offset = 0;

    for (let page = 0; page < MAX_PAGES; page += 1) {
      const url =
        `${BASE}?offset=${offset}&limit=${PAGE}` +
        `&competitionId=${comp.id}&seasonYear=${seasonYear}`;

      let rows;
      try {
        rows = await fetchWithRetry(url);
      } catch (err) {
        log(`      ${comp.key} ${seasonYear} offset=${offset}: ${err.message}`);
        break;
      }

      const list = (Array.isArray(rows) ? rows : rows?.matches || []).filter(Boolean);
      if (!list.length) break;

      for (const m of list) {
        if (m.homeTeam?.id !== panId && m.awayTeam?.id !== panId) continue;
        const game = normalize(m, comp, seasonYear);
        if (!game) continue;
        if (seen.has(game.sourceUrl)) continue;
        seen.add(game.sourceUrl);
        games.push(game);
        found += 1;
      }

      if (list.length < PAGE) break;
      offset += PAGE;
      await pause(350);
    }

    if (found) log(`      ${comp.key} ${seasonYear}: ${found} matches`);
  }

  if (!games.length) throw new Error('UEFA returned no Panathinaikos matches');

  return games;
}

function normalize(m, comp, seasonYear) {
  const home = m.homeTeam?.id === PAN_ID;
  const start = m.kickOffTime?.dateTime ? utcToAthens(m.kickOffTime.dateTime) : null;
  if (!start) return null;

  const opponent = tidyOpponent(home ? m.awayTeam?.internationalName : m.homeTeam?.internationalName);
  if (!opponent) return null;

  const roundName = roundLabel(m.round?.metaData?.name || '');
  const suffix = legSuffix(m.matchday?.type);

  const stadiumEn = m.stadium?.translations?.name?.EN || m.stadium?.translations?.name?.en || '';
  const venue = home
    ? STADIUM_LABELS[stadiumEn] || stadiumEn || null
    : null;

  const status = String(m.status || '').toUpperCase();
  const played = status === 'FINISHED' || status === 'EXTRA_TIME' || status === 'PENALTIES';
  const total = m.score?.total;

  return {
    sourceId: id,
    department: SECTIONS.FOOTBALL.department,
    sport: SECTIONS.FOOTBALL.sport,
    squad: SECTIONS.FOOTBALL.squad,
    club: SECTIONS.FOOTBALL.club,
    competition: competitionLabel(m.competition?.metaData?.name || comp.fallback),
    round: [roundName, suffix].filter(Boolean).join('') || null,
    home,
    opponent,
    venue,
    start,
    timeConfirmed: status !== 'POSTPONED' && status !== 'CANCELLED' && Boolean(m.kickOffTime?.dateTime),
    status: played ? 'played' : 'scheduled',
    score:
      played && typeof total?.home === 'number' && typeof total?.away === 'number'
        ? { home: total.home, away: total.away }
        : null,
    sourceUrl: `${BASE}?matchId=${m.id}`,
    seasonYear,
  };
}

async function resolveTeamId(log) {
  try {
    const seed = await fetchWithRetry(`${BASE}?matchId=2048796`);
    const m = (Array.isArray(seed) ? seed : seed?.matches || [])[0];
    const id_ = m?.homeTeam?.id;
    if (id_) {
      log(`      team id resolved: ${id_}`);
      return id_;
    }
  } catch (err) {
    log(`      team id lookup failed (${err.message}); falling back to ${PAN_ID}`);
  }
  return PAN_ID;
}