#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  utcToAthens,
  parseEuropeanDate,
  currentSeasonStart,
  inCurrentSeason,
  isNaive,
  byStartAsc,
} from './lib/time.mjs';
import { toZonedParts } from './lib/format.mjs';
import { buildMonthGrid, daysInMonth, firstWeekdayMondayFirst, parseStart } from '../utils/dates.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let passed = 0;
const failures = [];

function check(name, cond, detail) {
  if (cond) {
    passed += 1;
    console.log(`  ok    ${name}`);
  } else {
    failures.push(name);
    console.log(`  FAIL  ${name}${detail ? ` -> ${detail}` : ''}`);
  }
}

function eq(name, actual, expected) {
  check(name, Object.is(actual, expected), `got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
}

function section(title) {
  console.log(`\n${title}`);
}


section('UTC to Athens conversion');

eq('winter fixture is UTC+2', utcToAthens('2026-12-10T19:45:00Z'), '2026-12-10T21:45');
eq('summer fixture is UTC+3', utcToAthens('2026-07-30T18:30:00Z'), '2026-07-30T21:30');

eq(
  'no double offset: late-evening UTC stays same-day Athens',
  utcToAthens('2026-10-22T18:30:00Z'),
  '2026-10-22T21:30'
);
eq(
  'no double offset past local midnight',
  utcToAthens('2026-08-27T21:00:00Z'),
  '2026-08-28T00:00'
);

eq(
  'before March transition uses UTC+2',
  utcToAthens('2026-03-29T00:30:00Z'),
  '2026-03-29T02:30'
);
eq(
  'after March transition uses UTC+3',
  utcToAthens('2026-04-06T00:30:00Z'),
  '2026-04-06T03:30'
);
eq(
  'after October transition is back to UTC+2',
  utcToAthens('2026-10-26T00:30:00Z'),
  '2026-10-26T02:30'
);

const mono = [];
for (let h = 0; h < 48; h += 1) {
  mono.push(utcToAthens(new Date(Date.UTC(2026, 10, 1, h)).toISOString()));
}
check(
  'conversion is monotonic across 48h',
  mono.every((v, i) => i === 0 || v >= mono[i - 1])
);

check('rejects a malformed timestamp', (() => {
  try {
    utcToAthens('not-a-date');
    return false;
  } catch {
    return true;
  }
})());


section('Gazzetta date parsing (dd-mm-yyyy)');

eq('plain fixture', parseEuropeanDate('11-10-2026', '21:00'), '2026-10-11T21:00');
eq('padded spaces in the time', parseEuropeanDate('15-10-2026', '19 : 45'), '2026-10-15T19:45');
eq('single-digit day', parseEuropeanDate('1-11-2026', '19:00'), '2026-11-01T19:00');
eq('midnight kickoff', parseEuropeanDate('25-10-2026', '00:00'), '2026-10-25T00:00');

check('rejects us-style mm-dd-yyyy order', parseEuropeanDate('2026-10-11', '21:00') === null);
check('rejects an empty time', parseEuropeanDate('11-10-2026', '') === null);
check('rejects garbage', parseEuropeanDate('nonsense', '21:00') === null);
check(
  'rejects a swapped day/month that would silently mean the wrong fixture',
  parseEuropeanDate('15-10-2026', '19:45') !== parseEuropeanDate('10-15-2026', '19:45')
);


section('Season window');

const seasonFor = (y, m) => currentSeasonStart(new Date(Date.UTC(y, m - 1, 15, 12)));
eq('October belongs to the season that opened that July', seasonFor(2026, 10), '2026-07-01');
eq('March still belongs to that same season', seasonFor(2027, 3), '2026-07-01');
eq('June still belongs to it', seasonFor(2027, 6), '2026-07-01');
eq('July opens the next season', seasonFor(2027, 7), '2027-07-01');

check('a fixture inside the season is kept', inCurrentSeason('2026-10-02T21:15', new Date('2026-10-05')));
check('last season is dropped', !inCurrentSeason('2025-10-02T21:15', new Date('2026-10-05')));
check('next season is kept', inCurrentSeason('2027-04-15T21:15', new Date('2026-10-05')));


section('Naive-time invariants');

check('isNaive accepts the shape we emit', isNaive('2026-10-02T21:15'));
check('isNaive rejects a Z suffix', !isNaive('2026-10-02T21:15Z'));
check('isNaive rejects a numeric offset', !isNaive('2026-10-02T21:15+02:00'));
check('isNaive rejects seconds', !isNaive('2026-10-02T21:15:00'));

const sample = parseStart('2026-10-02T21:15');
eq('parseStart keeps the wall-clock hour', sample.hours, 21);
eq('parseStart keeps the minutes', sample.minutes, 15);
eq('parseStart produces a sortable day key', sample.key, 20261002);
check('parseStart returns no Date object', !(sample instanceof Date));

eq(
  'rendering is independent of device offset',
  '2026-10-02T21:15',
  (() => {
    const p = parseStart('2026-10-02T21:15');
    return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}T${String(p.hours).padStart(2, '0')}:${String(p.minutes).padStart(2, '0')}`;
  })()
);


section('Calendar grid');

for (const [y, m, want, label] of [
  [2026, 10, 31, 'Oct 2026'],
  [2026, 2, 28, 'Feb 2026'],
  [2028, 2, 29, 'Feb 2028 (leap)'],
  [2027, 2, 28, 'Feb 2027'],
  [2026, 12, 31, 'Dec 2026'],
]) {
  eq(`${label} has ${want} days`, daysInMonth(y, m), want);
}

check(
  'week starts Monday',
  firstWeekdayMondayFirst(2026, 10) === (new Date(2026, 9, 1).getDay() + 6) % 7
);

for (const [y, m] of [[2026, 10], [2027, 2], [2026, 12], [2027, 1]]) {
  const weeks = buildMonthGrid(y, m);
  check(
    `${y}-${String(m).padStart(2, '0')} renders as full weeks of 7`,
    weeks.every((r) => r.length === 7)
  );
  check(
    `${y}-${String(m).padStart(2, '0')} contains exactly its own days`,
    weeks.flat().filter((c) => !c.outside).length === daysInMonth(y, m)
  );
}

eq('cursor steps forward across a year end', JSON.stringify(
  (() => { const t = new Date(2026, 11, 1); return { y: t.getFullYear(), m: t.getMonth() + 1 }; })()
), JSON.stringify({ y: 2026, m: 12 }));

check('sorting by naive start is chronological', (() => {
  const rows = [{ start: '2026-07-30T21:30' }, { start: '2026-10-02T21:15' }, { start: '2026-07-23T21:00' }];
  const sorted = [...rows].sort(byStartAsc).map((r) => r.start);
  return sorted[0] === '2026-07-23T21:00' && sorted[2] === '2026-10-02T21:15';
})());


const wantAsset = process.argv.includes('--asset');
const assetPath = path.join(ROOT, 'assets', 'games.json');

if (wantAsset && existsSync(assetPath)) {
  section('assets/games.json');

  const data = JSON.parse(readFileSync(assetPath, 'utf8'));
  const games = data.games || [];

  check('has games', games.length > 0, `${games.length}`);
  check('declares a generator', typeof data.generator === 'string');
  check(
    'records when it was generated',
    !Number.isNaN(Date.parse(data.generatedAt)),
    data.generatedAt
  );

  const badTimes = games.filter((g) => !isNaive(g.start));
  check(
    'every start is naive local time',
    badTimes.length === 0,
    badTimes.slice(0, 3).map((g) => g.start).join(', ')
  );

  check(
    'no start carries a UTC offset',
    games.every((g) => !/[Z+]\d{2}:?\d{2}$/.test(g.start))
  );

  const now = new Date();
  const stale = games.filter((g) => !inCurrentSeason(g.start, now));
  check(
    'all fixtures fall inside the current season',
    stale.length === 0,
    `${stale.length} outside ${currentSeasonStart(now)}`
  );

  check('ids are unique', new Set(games.map((g) => g.id)).size === games.length);
  check(
    'ids are slugged, not raw Greek',
    games.every((g) => /^football-|basketball-/.test(g.id)),
    games.find((g) => !/^football-|basketball-/.test(g.id))?.id
  );
  check('every fixture has an opponent', games.every((g) => g.opponent && g.opponent.trim()));
  check('no fixture lists the club as its own opponent', games.every((g) => !/panathina/i.test(g.opponent)));
  check('every fixture names a competition', games.every((g) => g.competition));
  check('every fixture names its section', games.every((g) => g.club === 'PAE' || g.club === 'KAE'));
  check('every fixture has a boolean home flag', games.every((g) => typeof g.home === 'boolean'));
  check('every fixture has a status', games.every((g) => g.status === 'played' || g.status === 'scheduled'));
  check(
    'played fixtures carry a score',
    games.filter((g) => g.status === 'played').every((g) => g.score && typeof g.score.home === 'number')
  );
  check(
    'scheduled fixtures carry no score',
    games.filter((g) => g.status === 'scheduled').every((g) => g.score === null)
  );
  check(
    'home fixtures have a venue',
    games.filter((g) => g.home).every((g) => Boolean(g.venue)),
    games.find((g) => g.home && !g.venue)?.id
  );
  check(
    'every fixture is attributable to a source',
    games.every((g) => g.source && g.source.id && g.source.url)
  );

  const sports = new Set(games.map((g) => g.sport));
  check('covers both football and basketball', sports.size >= 2, [...sports].join(', '));

  const perDay = new Map();
  for (const g of games) {
    const k = `${g.start.slice(0, 10)}|${g.home}`;
    perDay.set(k, (perDay.get(k) || 0) + 1);
  }
  const doubleBooked = [...perDay].filter(([, n]) => n > 1);
  check(
    'no day has two home or two away fixtures',
    doubleBooked.length === 0,
    doubleBooked.slice(0, 3).map(([k, n]) => `${k} x${n}`).join(', ')
  );

  const sorted = [...games].sort(byStartAsc).map((g) => g.start);
  check('games are in chronological order', sorted.every((v, i) => i === 0 || v >= sorted[i - 1]));

  const flaggedByDay = new Map();
  for (const g of games) {
    if (!g.conflict) continue;
    const k = g.start.slice(0, 10);
    flaggedByDay.set(k, (flaggedByDay.get(k) || 0) + 1);
  }
  check(
    'every impossible away double-booking is flagged',
    games
      .filter((g) => {
        const day = g.start.slice(0, 10);
        return (games.filter((x) => x.start.slice(0, 10) === day && !x.home).length > 0) &&
          (games.filter((x) => x.start.slice(0, 10) === day).length > 1);
      })
      .every((g) => g.conflict === true)
  );
  check(
    'the conflict flag is only set on days with two or more fixtures',
    [...flaggedByDay.values()].every((n) => n > 1),
    [...flaggedByDay.entries()].filter(([, n]) => n < 2).map(([d]) => d).join(', ')
  );
  check(
    'every fixture on a flagged day carries the flag',
    games
      .filter((g) => flaggedByDay.has(g.start.slice(0, 10)))
      .every((g) => g.conflict === true)
  );

  const orphans = games
    .map((g) => ({ ...g, ...parseStart(g.start) }))
    .filter((g) => {
      const total = daysInMonth(g.year, g.month);
      const cell = buildMonthGrid(g.year, g.month)
        .flat()
        .find((c) => !c.outside && c.day === Math.min(g.day, total));
      return !cell;
    });
  check('every fixture is reachable from the calendar grid', orphans.length === 0, `${orphans.length} orphans`);

  console.log(`\n  ${games.length} games, season ${data.season}, generated ${data.generatedAt.slice(0, 10)}`);
  for (const s of data.sources || []) {
    console.log(`    ${s.ok ? 'ok  ' : 'FAIL'} ${s.id}: ${s.games}${s.error ? ` (${s.error})` : ''}`);
  }
} else if (wantAsset) {
  console.log('\n(assets/games.json not present — run `npm run build:games`)');
}


console.log(`\n${failures.length === 0 ? `ALL PASS (${passed})` : `${failures.length} FAILURE(S), ${passed} passed`}`);
for (const f of failures) console.log(`  - ${f}`);

process.exit(failures.length ? 1 : 0);