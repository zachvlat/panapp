export const GREEK_MONTHS = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος',
  'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος',
  'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος',
];

export const GREEK_DAYS_LONG = [
  'Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη',
  'Πέμπτη', 'Παρασκευή', 'Σάββατο',
];

export const GREEK_DAY_INITIALS = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'];

export function parseStart(start) {
  const [datePart, timePart] = String(start || '').split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = (timePart || '00:00').split(':').map(Number);

  return {
    year,
    month,
    day,
    hours: Number.isFinite(hours) ? hours : 0,
    minutes: Number.isFinite(minutes) ? minutes : 0,
    key: year * 10000 + month * 100 + day,
  };
}

export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function firstWeekdayMondayFirst(year, month) {
  return (new Date(year, month - 1, 1).getDay() + 6) % 7;
}

export function buildMonthGrid(year, month) {
  const total = daysInMonth(year, month);
  const lead = firstWeekdayMondayFirst(year, month);
  const cells = [];

  const clampDay = (d) => (d > total ? total : d);

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevTotal = daysInMonth(prevYear, prevMonth);

  for (let i = lead; i > 0; i -= 1) {
    cells.push({ year: prevYear, month: prevMonth, day: prevTotal - i + 1, outside: true });
  }
  for (let d = 1; d <= total; d += 1) {
    cells.push({ year, month, day: clampDay(d), outside: false });
  }
  let trailing = (7 - (cells.length % 7)) % 7;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  for (let d = 1; d <= trailing; d += 1) {
    cells.push({ year: nextYear, month: nextMonth, day: d, outside: true });
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function formatKickoff(hours, minutes, timeConfirmed) {
  if (!timeConfirmed) return 'TBA';
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatGreekDate(year, month, day) {
  return `${day} ${GREEK_MONTHS[month - 1]}`;
}

export function formatGreekLongDate(year, month, day) {
  const weekday = GREEK_DAYS_LONG[new Date(year, month - 1, day).getDay()];
  return `${weekday} ${day} ${GREEK_MONTHS[month - 1]} ${year}`;
}

export function todayParts() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export function shiftMonth(year, month, delta) {
  const zeroBased = month - 1 + delta;
  const y = year + Math.floor(zeroBased / 12);
  const m = ((zeroBased % 12) + 12) % 12;
  return { year: y, month: m + 1 };
}