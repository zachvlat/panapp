import { toZonedParts } from './format.mjs';

export const ZONE = 'Europe/Athens';

const NAIVE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export function trimSeconds(iso) {
  return String(iso).slice(0, 16);
}

export const isNaive = (s) => NAIVE.test(String(s || ''));

export function utcToAthens(dateTimeUtc) {
  const instant = new Date(dateTimeUtc);
  if (Number.isNaN(instant.getTime())) throw new Error(`bad UTC timestamp: ${dateTimeUtc}`);
  return trimSeconds(toZonedParts(instant, ZONE));
}

export function parseEuropeanDate(dateStr, timeStr) {
  const d = String(dateStr || '').trim();
  const m = d.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!m) return null;

  const [, dd, mm, yyyy] = m;
  const t = String(timeStr || '')
    .replace(/\s/g, '')
    .match(/^(\d{1,2}):(\d{2})$/);
  if (!t) return null;
  const [, hh, min] = t;

  return `${yyyy}-${pad(mm)}-${pad(dd)}T${pad(hh)}:${min}`;
}

const pad = (n) => String(n).padStart(2, '0');

export function currentSeasonStart(now = new Date()) {
  const { year, month } = seasonalParts(now);
  const startYear = month >= 7 ? year : year - 1;
  return `${startYear}-07-01`;
}

export function inCurrentSeason(start, now = new Date()) {
  return String(start).slice(0, 10) >= currentSeasonStart(now);
}

export function seasonalParts(now = new Date()) {
  const parts = toZonedParts(now, ZONE);
  return { year: Number(parts.slice(0, 4)), month: Number(parts.slice(5, 7)) };
}

export function byStartAsc(a, b) {
  if (a.start === b.start) return (a.order ?? 0) - (b.order ?? 0);
  return a.start < b.start ? -1 : 1;
}

export function isoToday(now = new Date()) {
  return toZonedParts(now, ZONE).slice(0, 10);
}