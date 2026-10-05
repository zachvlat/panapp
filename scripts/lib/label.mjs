export const SECTIONS = {
  FOOTBALL: {
    department: 'football',
    sport: 'football',
    squad: 'men',
    club: 'PAE',
  },
  BASKETBALL: {
    department: 'basketball',
    sport: 'basketball',
    squad: 'men',
    club: 'KAE',
  },
};

const COMPETITIONS = {
  'UEFA Conference League': 'Conference League',
  'UEFA Europa League': 'Europa League',
  'UEFA Champions League': 'Champions League',
  UECL: 'Conference League',
  UEL: 'Europa League',
  UCL: 'Champions League',

  'Stoiximan Super League': 'Super League',
  'Κύπελλο Ελλάδας': 'Κύπελλο Ελλάδας',
  'UEFA ECL': 'Conference League',

  'EuroLeague Basketball': 'EuroLeague',
};

const ROUNDS = {
  'Regular Season': 'Κανονική σεζόν',
  'Playoffs': 'Playoffs',
  'Final Four': 'Final Four',

  QUALIFYING: 'Προκριματικοί γύροι',
  PLAYOFF: 'Playoffs',
  LEAGUE_PHASE: 'League Phase',
  KNOCKOUT: 'Knockout',
  'Second qualifying round': '2ος προκριματικός γύρος',
  'Third qualifying round': '3ος προκριματικός γύρος',
  'Play-off round': 'Play-off',
  'Group stage': 'Φάση ομίλων',
  'Knockout phase': 'Φάση νοκ-άουτ',

  SLGR: 'Super League',
};

const LEG_SUFFIX = {
  FIRST_LEG: ' (1ος αγώνας)',
  SECOND_LEG: ' (2ος αγώνας)',
};

export const competitionLabel = (name) => COMPETITIONS[name] || name || 'Αγώνας';
export const roundLabel = (name) => ROUNDS[name] || name || '';
export const legSuffix = (type) => LEG_SUFFIX[type] || '';

export function tidyOpponent(raw) {
  let name = String(raw || '').trim();

  if (/panathina/i.test(name)) return null;

  name = name
    .replace(/^FC\s+/i, '')
    .replace(/^CF\s+/i, '')
    .replace(/^Π\.\s*Α\.\s*Ο\.\s*/u, '')
    .replace(/^Α\.\s*Ο\.\s*/u, '')
    .replace(/\s+(FC|CF|AC|BC|SC)\b/gi, '')
    .replace(/\bAKTOR\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return name || null;
}