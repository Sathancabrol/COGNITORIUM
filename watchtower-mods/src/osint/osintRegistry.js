/**
 * WATCHTOWER OSINT source registry.
 *
 * The registry describes capabilities, not permissions. Adapters must still
 * enforce source terms, rate limits and human-validation gates.
 * @module osint/osintRegistry
 */

export const OSINT_SOURCES = Object.freeze([
  { id: 'ban', name: 'Géoplateforme / BAN', kind: 'geocoding', access: 'api', cost: 'free', automation: 'yes', personalData: 'possible', risk: 'low', note: 'Address geocoding / reverse geocoding' },
  { id: 'cadastre', name: 'Cadastre / Géoplateforme', kind: 'land', access: 'api', cost: 'free', automation: 'yes', personalData: 'low', risk: 'low', note: 'Parcel and cadastral geometry' },
  { id: 'dvf', name: 'DVF+', kind: 'real-estate', access: 'open-data', cost: 'free', automation: 'yes', personalData: 'restricted', risk: 'medium', note: 'Transactions; never expose re-identifying views' },
  { id: 'sirene', name: 'SIRENE', kind: 'companies', access: 'open-data', cost: 'free', automation: 'yes', personalData: 'restricted', risk: 'medium', note: 'Establishments and enterprise identifiers' },
  { id: 'bodacc', name: 'BODACC', kind: 'companies', access: 'api', cost: 'free', automation: 'yes', personalData: 'possible', risk: 'low', note: 'Commercial/legal announcements' },
  { id: 'rnes', name: 'INPI / RNE', kind: 'companies', access: 'api', cost: 'free', automation: 'yes', personalData: 'possible', risk: 'medium', note: 'National business register data' },
  { id: 'osm', name: 'OpenStreetMap / Overpass', kind: 'maps', access: 'api', cost: 'free', automation: 'yes', personalData: 'low', risk: 'low', note: 'Mapped objects and tags' },
  { id: 'wayback', name: 'Internet Archive / Wayback', kind: 'archives', access: 'web', cost: 'free', automation: 'yes', personalData: 'possible', risk: 'low', note: 'Historical public web snapshots' },
  { id: 'metadata', name: 'ExifTool / Exiv2', kind: 'documents', access: 'local', cost: 'free', automation: 'yes', personalData: 'possible', risk: 'medium', note: 'Metadata extraction from supplied files' },
  { id: 'username', name: 'Maigret / Sherlock / WhatsMyName', kind: 'identity-candidates', access: 'local/web', cost: 'free', automation: 'yes', personalData: 'high', risk: 'high', note: 'Candidate discovery only; never identity proof' },
]);

export function getOsintSource(id) {
  return OSINT_SOURCES.find((source) => source.id === id) || null;
}

export function listOsintSources(filter = {}) {
  return OSINT_SOURCES.filter((source) => Object.entries(filter).every(([key, value]) => source[key] === value));
}
