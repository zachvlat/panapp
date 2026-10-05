const formatterCache = new Map();

function partsFormatter(timeZone) {
  let f = formatterCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    formatterCache.set(timeZone, f);
  }
  return f;
}

export function toZonedParts(date, timeZone = 'Europe/Athens') {
  const parts = partsFormatter(timeZone).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return (
    `${get('year')}-${get('month')}-${get('day')}` +
    `T${get('hour')}:${get('minute')}:${get('second')}`
  );
}

export function zonedTime(date, timeZone = 'Europe/Athens') {
  return toZonedParts(date, timeZone).slice(11, 16);
}