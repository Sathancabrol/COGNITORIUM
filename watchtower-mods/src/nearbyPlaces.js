/**
 * WATCHTOWER — AUTOUR : lieux de ton entourage.
 *
 * Deux modes, 100 % gratuits, sans clé :
 *   📡 ME LOCALISER — partage de localisation du navigateur (permission à
 *      accorder ; jamais envoyée à un serveur tiers, on interroge seulement
 *      des APIs ouvertes avec les coordonnées).
 *   🎯 AUTOUR DU CENTRE DE LA VUE — pas de permission nécessaire.
 *
 * Sources : geo.api.gouv.fr (commune, France) + Overpass/OpenStreetMap
 * (points d'intérêt à moins de 3 km : restos, pharmacies, gares, plages…).
 */

import * as Cesium from 'cesium';

const CSS = `
#wt-autour { display: flex; flex-direction: column; max-height: 46vh; font-size: 10px; }
#wt-autour .actions { display: flex; gap: 6px; padding: 10px 12px 6px; }
#wt-autour .act {
  flex: 1; cursor: pointer; padding: 8px 6px; font-family: inherit;
  font-size: 9px; font-weight: 700; letter-spacing: 1px; border-radius: 8px;
  background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.4); color: #00d4ff;
}
#wt-autour .act:hover { background: rgba(0,212,255,0.2); }
#wt-autour .statut { padding: 2px 12px 6px; color: rgba(232,234,237,0.55); line-height: 1.5; }
#wt-autour .liste { overflow-y: auto; padding: 0 8px 10px; display: flex; flex-direction: column; gap: 4px; }
#wt-autour .lieu {
  cursor: pointer; text-align: left; padding: 7px 9px; border-radius: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: inherit; font-family: inherit; font-size: 10px; line-height: 1.45;
  display: flex; gap: 8px; align-items: center;
}
#wt-autour .lieu:hover { border-color: #00d4ff; background: rgba(0,212,255,0.08); }
#wt-autour .lieu .dist { margin-left: auto; color: #00d4ff; white-space: nowrap; }
`;

const ICONES = {
  restaurant: '🍽', fast_food: '🍔', cafe: '☕', bar: '🍺', pharmacy: '💊',
  hospital: '🏥', townhall: '🏛', marketplace: '🛒', fuel: '⛽', bakery: '🥖',
  supermarket: '🛒', beach: '🏖', attraction: '⭐', viewpoint: '👁', museum: '🖼',
  hotel: '🛏', camp_site: '⛺', station: '🚉', bus_station: '🚌', harbour: '⚓', marina: '⚓',
};

function distM(lat1, lon1, lat2, lon2) {
  const R = 6371000; const rad = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2
    + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
const fmtDist = (m) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);

async function chercherAutour(lat, lon) {
  const requete = `[out:json][timeout:20];(
    node(around:3000,${lat},${lon})[tourism~"attraction|viewpoint|museum|hotel|camp_site"];
    node(around:3000,${lat},${lon})[amenity~"restaurant|fast_food|cafe|bar|pharmacy|hospital|townhall|marketplace|fuel"];
    node(around:3000,${lat},${lon})[shop~"bakery|supermarket"];
    node(around:3000,${lat},${lon})[natural=beach];
    node(around:4000,${lat},${lon})[railway=station];
  );out 40;`;
  const r = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(requete)}`,
  });
  const d = await r.json();
  const lieux = (d?.elements || [])
    .filter((e) => e.tags?.name)
    .map((e) => {
      const type = e.tags.tourism || e.tags.amenity || e.tags.shop || e.tags.natural || e.tags.railway || '';
      return { nom: e.tags.name, type, lat: e.lat, lon: e.lon, dist: distM(lat, lon, e.lat, e.lon) };
    })
    .sort((a, b) => a.dist - b.dist);
  // dédoublonnage par nom
  const vus = new Set();
  return lieux.filter((l) => (vus.has(l.nom) ? false : vus.add(l.nom))).slice(0, 20);
}

async function communeFR(lat, lon) {
  try {
    const r = await fetch(`https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,codesPostaux,population`);
    const d = await r.json();
    return d?.[0] || null;
  } catch { return null; }
}

/** Initialise le panneau AUTOUR. Retourne {element}. */
export function initNearbyPlaces(viewer) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.id = 'wt-autour';
  el.innerHTML = `
    <div class="actions">
      <button class="act loc" type="button">📡 ME LOCALISER</button>
      <button class="act vue" type="button">🎯 AUTOUR DU CENTRE</button>
    </div>
    <div class="statut">Partage de localisation : gratuit, permission navigateur,
    coordonnées envoyées uniquement aux APIs ouvertes (OSM / geo.gouv.fr).</div>
    <div class="liste"></div>`;
  const statut = el.querySelector('.statut');
  const liste = el.querySelector('.liste');

  function voler(lon, lat, alt = 900) {
    viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt), duration: 2.5 });
  }

  async function explorer(lat, lon, origine) {
    statut.textContent = `🔍 Recherche des lieux autour ${origine}…`;
    liste.innerHTML = '';
    const [commune, lieux] = await Promise.all([
      communeFR(lat, lon),
      chercherAutour(lat, lon).catch(() => null),
    ]);
    let entete = origine;
    if (commune) entete = `${commune.nom} (${commune.codesPostaux?.[0] || ''}) · ${(commune.population || 0).toLocaleString('fr-FR')} hab.`;
    if (!lieux) { statut.textContent = `📍 ${entete} — points d'intérêt indisponibles (réseau/Overpass saturé, réessaie).`; return; }
    statut.textContent = `📍 ${entete} — ${lieux.length} lieux à proximité (clic = y voler) :`;
    for (const l of lieux) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lieu';
      b.innerHTML = `<span>${ICONES[l.type] || '📌'}</span><span>${l.nom}</span><span class="dist">${fmtDist(l.dist)}</span>`;
      b.addEventListener('click', () => voler(l.lon, l.lat, 600));
      liste.appendChild(b);
    }
    if (lieux.length === 0) statut.textContent = `📍 ${entete} — aucun lieu nommé trouvé dans un rayon de 3 km.`;
  }

  el.querySelector('.loc').addEventListener('click', () => {
    if (!navigator.geolocation) { statut.textContent = 'Géolocalisation non disponible dans ce navigateur.'; return; }
    statut.textContent = '📡 Demande de localisation… (accepte la permission du navigateur)';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        voler(lon, lat, 1800);
        explorer(lat, lon, 'de ta position');
      },
      (err) => {
        statut.textContent = err.code === 1
          ? '🚫 Permission refusée — autorise la localisation dans le navigateur, ou utilise « AUTOUR DU CENTRE ».'
          : `Localisation impossible (${err.message}). Utilise « AUTOUR DU CENTRE ».`;
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 },
    );
  });

  el.querySelector('.vue').addEventListener('click', () => {
    const c = viewer.camera.positionCartographic;
    explorer(Cesium.Math.toDegrees(c.latitude), Cesium.Math.toDegrees(c.longitude), 'du centre de la vue');
  });

  return { element: el };
}
