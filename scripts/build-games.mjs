#!/usr/bin/env node

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import * as euroleague from './sources/euroleague.mjs';
import * as uefa from './sources/uefa.mjs';
import * as gazzetta from './sources/gazzetta.mjs';
import { byStartAsc, currentSeasonStart, inCurrentSeason } from './lib/time.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const OUT = path.join(ROOT, 'assets', 'games.json');

const SOURCES = [euroleague, gazzetta, uefa];

function dedupeKey(g) {
  return [g.start.slice(0, 10), g.home ? 'H' : 'A', competitionFamily(g.competition)].join('|');
}

function competitionFamily(name) {
  const s = String(name || '').toLowerCase();
  if (s.includes('conference')) return 'conference';
  if (s.includes('europa')) return 'europa';
  if (s.includes('champions')) return 'champions';
  if (s.includes('super league') || s.includes('slgr')) return 'slgr';
  if (s.includes('κυπελλο')) return 'greekcup';
  if (s.includes('euroleague')) return 'euroleague';
  return s;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry');
  const onlyIdx = args.indexOf('--only');
  const only = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

  const selected = only ? SOURCES.filter((s) => s.id === only) : SOURCES;
  if (!selected.length) {
    console.error(`--only: unknown source "${only}". Known: ${SOURCES.map((s) => s.id).join(', ')}`);
    process.exit(2);
  }

  const log = (msg) => process.stdout.write(`${msg}\n`);

  log('\nΠαναθηναϊκός — fixture generator\n');

  const collected = [];
  const results = [];
  let failures = 0;

  for (const source of selected) {
    log(`  ${source.name}`);
    const t0 = Date.now();
    try {
      const games = await source.collect({ log });
      collected.push(...games);
      results.push({
        id: source.id,
        name: source.name,
        games: games.length,
        ok: true,
      });
      log(`      -> ${games.length} games in ${Date.now() - t0}ms\n`);
    } catch (err) {
      failures += 1;
      results.push({ id: source.id, name: source.name, games: 0, ok: false, error: err.message });
      log(`      -> FAILED: ${err.message}\n`);
    }
  }

  const byKey = new Map();
  let dupes = 0;
  for (const g of collected) {
    const key = dedupeKey(g);
    if (byKey.has(key)) {
      dupes += 1;
      continue;
    }
    byKey.set(key, g);
  }

  const seasonStart = currentSeasonStart();
  const all = [...byKey.values()];
  const games = all.filter((g) => inCurrentSeason(g.start)).sort(byStartAsc);
  const dropped = all.length - games.length;
  if (dropped > 0) {
    log(`  ${dropped} fixtures from previous seasons dropped (before ${seasonStart})`);
  }

  const byDay = new Map();
  for (const g of games) {
    const k = g.start.slice(0, 10);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k).push(g);
  }

  const conflicts = [];
  for (const [day, list] of byDay) {
    if (list.length < 2) continue;
    if (!list.some((g) => !g.home)) continue;
    conflicts.push({
      day,
      games: list.map((g) => `${g.start.slice(11)} ${g.home ? 'home' : 'away'} vs ${g.opponent}`),
    });
    list.forEach((g) => {
      g.conflict = true;
    });
  }

  for (const c of conflicts) {
    log(`  ! ${c.day}: impossible double-booking — ${c.games.join(' | ')}`);
  }
  if (conflicts.length) {
    log('    (provisional upstream dates — UEFA normally moves one of these later)');
  }

  const problems = validate(games);
  for (const p of problems) log(`  ! ${p}`);

  const payload = {
    season: seasonLabel(games),
    generatedAt: new Date().toISOString(),
    generator: 'scripts/build-games.mjs',
    notice:
      'Generated file — do not edit by hand. Run `npm run build:games` to refresh.',
    sources: results,
    games: games.map((g, i) => ({
      id: `${g.department}-${g.start.slice(0, 10)}-${g.home ? 'h' : 'a'}-${slug(g.opponent)}`,
      order: i,
      department: g.department,
      sport: g.sport,
      squad: g.squad,
      club: g.club,
      competition: g.competition,
      round: g.round,
      home: g.home,
      opponent: g.opponent,
      venue: g.venue,
      start: g.start,
      timeConfirmed: g.timeConfirmed,
      status: g.status,
      score: g.score,
      conflict: g.conflict === true,
      source: { id: g.sourceId, url: g.sourceUrl },
    })),
  };

  const bySport = games.reduce((a, g) => ((a[g.sport] = (a[g.sport] || 0) + 1), a), {});
  const bySource = games.reduce((a, g) => ((a[g.sourceId] = (a[g.sourceId] || 0) + 1), a), {});

  log('  Σύνοψη');
  log(`    ${games.length} αγώνες (${dupes} διπλόπτυπα αφαιρέθηκαν)`);
  for (const [k, v] of Object.entries(bySport)) log(`      ${k}: ${v}`);
  for (const [k, v] of Object.entries(bySource)) log(`      ${k}: ${v}`);
  log(`    Περίοδος: ${games[0]?.start?.slice(0, 10)} → ${games.at(-1)?.start?.slice(0, 10)}`);

  if (dryRun) {
    log('\n  --dry: nothing written.\n');
  } else if (failures) {
    log(`\n  ${failures} source(s) failed — ${path.relative(ROOT, OUT)} left untouched.\n`);
  } else if (problems.length) {
    log(`\n  ${problems.length} validation problem(s) — ${path.relative(ROOT, OUT)} left untouched.\n`);
  } else {
    await mkdir(path.dirname(OUT), { recursive: true });
    await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    log(`\n  → ${path.relative(ROOT, OUT)} (${(JSON.stringify(payload).length / 1024).toFixed(1)} KB)\n`);
  }

  if (failures) {
    process.exit(1);
  }
  if (problems.length) {
    process.exit(1);
  }
}

function validate(games) {
  const problems = [];

  if (!games.length) {
    problems.push('no fixtures at all');
    return problems;
  }

  for (const g of games) {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(g.start)) {
      problems.push(`${g.sourceId}: bad start "${g.start}" (must be naive YYYY-MM-DDTHH:mm)`);
    }
    if (/[Z+]\d{2}:?\d{2}$/.test(g.start)) {
      problems.push(`${g.sourceId}: start carries a UTC offset: "${g.start}"`);
    }
    if (!g.opponent) problems.push(`${g.sourceId}: fixture with no opponent`);
    if (!g.competition) problems.push(`${g.sourceId}: fixture with no competition`);
  }

  const seasonStart = currentSeasonStart();
  const stale = games.filter((g) => g.start.slice(0, 10) < seasonStart);
  if (stale.length) problems.push(`${stale.length} fixtures predate the season start ${seasonStart}`);

  const sports = new Set(games.map((g) => g.sport));
  if (sports.size < 2) problems.push(`only one sport present (${[...sports].join(', ')})`);

  const horizon = Date.now() + 400 * 24 * 3600e3;
  const tooFar = games.filter((g) => new Date(`${g.start}:00Z`).getTime() > horizon);
  if (tooFar.length) problems.push(`${tooFar.length} fixtures beyond 400 days — wrong season?`);

  return [...new Set(problems)];
}

function seasonLabel(games) {
  const years = games.map((g) => Number(g.start.slice(0, 4)));
  const min = Math.min(...years);
  const max = Math.max(...years);
  return `${min}-${String(max).slice(2)}`;
}

const slug = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 28) || 'x';

main().catch((err) => {
  console.error('\nfixture generator failed:', err);
  process.exit(1);
});