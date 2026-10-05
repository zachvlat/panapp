import { fetchWithRetry } from '../lib/http.mjs';
import { trimSeconds } from '../lib/time.mjs';
import { competitionLabel, roundLabel, tidyOpponent, SECTIONS } from '../lib/label.mjs';

const TEAM_CODE = 'PAN';

function currentSeasonCodes(now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const primary = month >= 7 ? year : year - 1;
  return { primary: `E${primary}`, fallback: `E${primary - 1}` };
}

const VENUE_LABELS = {
  'TELEKOM CENTER ATHENS': 'ΤΕLEKOM CENTER ΑΘΗΝΑ',
  'PEACE AND FRIENDSHIP STADIUM': 'ΣΤΑΔΙΟ ΕΙΡΗΝΗΣ-ΦΙΛΙΑΣ',
};

const venueLabel = (raw) => {
  const name = String(raw || '').trim();
  return VENUE_LABELS[name.toUpperCase()] || name || null;
};

export const id = 'euroleague-api';
export const name = 'EuroLeague (api-live.euroleague.net)';

export async function collect({ log = () => {} } = {}) {
  const games = [];
  const { primary, fallback } = currentSeasonCodes();
  const queried = [];

  for (const seasonCode of [primary, fallback]) {
    const url =
      `https://api-live.euroleague.net/v2/competitions/E/seasons/${seasonCode}` +
      `/games?teamCode=${TEAM_CODE}`;

    let payload;
    try {
      payload = await fetchWithRetry(url);
    } catch (err) {
      log(`      ${seasonCode}: skipped (${err.message})`);
      continue;
    }

    const rows = Array.isArray(payload) ? payload : payload?.data || [];
    const ours = rows.filter(
      (g) => g.local?.club?.code === TEAM_CODE || g.road?.club?.code === TEAM_CODE
    );
    queried.push({ seasonCode, rows: rows.length, ours: ours.length });

    if (!ours.length) {
      log(`      ${seasonCode}: ${rows.length} games, none ours`);
      continue;
    }

    log(`      ${seasonCode}: ${ours.length} games`);
    if (queried.filter((q) => q.ours > 0).length > 1) break;

    for (const g of ours) {
      const isHome = g.local?.club?.code === TEAM_CODE;
      const other = isHome ? g.road : g.local;

      const opponent = tidyOpponent(other?.club?.editorialName || other?.club?.name);
      if (!opponent) continue;

      const start = trimSeconds(g.localDate || g.date);
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(start)) continue;

      games.push({
        sourceId: id,
        department: SECTIONS.BASKETBALL.department,
        sport: SECTIONS.BASKETBALL.sport,
        squad: SECTIONS.BASKETBALL.squad,
        club: SECTIONS.BASKETBALL.club,
        competition: competitionLabel('EuroLeague Basketball'),
        round: roundLabel(g.phaseType?.name),
        home: isHome,
        opponent,
        venue: isHome ? venueLabel(g.venue?.name) : null,
        start,
        timeConfirmed: Boolean(g.confirmedDate && g.confirmedHour),
        status: g.played ? 'played' : 'scheduled',
        score:
          g.played && typeof g.local?.score === 'number' && typeof g.road?.score === 'number'
            ? { home: g.local.score, away: g.road.score }
            : null,
        sourceUrl:
          `https://api-live.euroleague.net/v2/competitions/E/seasons/${seasonCode}` +
          `/games?teamCode=${TEAM_CODE}`,
      });
    }
  }

  if (!games.length) {
    throw new Error('no EuroLeague season returned any Panathinaikos games');
  }

  return games;
}