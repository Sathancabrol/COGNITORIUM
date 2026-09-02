/**
 * WATCHTOWER — BÂTI 3D gratuit.
 *
 * Version gratuite des bâtiments 3D : les emprises OpenStreetMap sont
 * EXTRUDÉES en volumes (hauteur = tag OSM `height`, sinon étages × 3,2 m,
 * sinon 8 m). Moins joli que Google 3D photoréaliste (payant), mais gratuit,
 * mondial et sans clé. Les bâtiments publics (mairie, écoles…) ressortent en
 * orange. Charge la zone autour du centre de la vue (rayon 700 m).
 */

import * as Cesium from 'cesium';

const CSS = `
#wt-bati { display: flex; flex-direction: column; gap: 7px; padding: 10px 12px; font-size: 10px; }
#wt-bati .b-btn {
  cursor: pointer; padding: 9px 10px; border-radius: 8px; font-family: inherit;
  font-size: 9.5px; font-weight: 700; letter-spacing: 1px;
  background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.4); color: #00d4ff;
}
#wt-bati .b-btn:hover { background: rgba(0,212,255,0.2); }
#wt-bati .b-btn.eff { border-color: rgba(240,90,90,0.5); color: #f08a8a; background: rgba(240,90,90,0.07); }
#wt-bati .statut { color: rgba(232,234,237,0.55); line-height: 1.6; font-size: 9px; }
`;

const PUBLICS = new Set(['townhall', 'public', 'civic', 'government', 'school', 'hospital', 'church', 'cathedral', 'university', 'fire_station', 'train_station']);

export function initOsmBuildings3D(viewer) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const ds = new Cesium.CustomDataSource('wt-bati3d');
  viewer.dataSources.add(ds);

  const el = document.createElement('div');
  el.id = 'wt-bati';
  el.innerHTML = `
    <button class="b-btn charger" type="button">🏙 CHARGER LES BÂTIMENTS AUTOUR DE LA VUE</button>
    <button class="b-btn eff" type="button">🗑 EFFACER</button>
    <div class="statut">Volumes extrudés depuis OpenStreetMap (gratuit, mondial).
    Hauteur : donnée OSM, sinon étages × 3,2 m, sinon 8 m. Bâtiments publics en orange.
    Équivalent gratuit du 3D Google (qui reste plus beau, en mode payant).</div>`;
  const statut = el.querySelector('.statut');

  async function charger() {
    const c = viewer.camera.positionCartographic;
    if (c.height > 30000) { statut.textContent = '⚠ Zoome davantage (moins de 30 km d\u2019altitude) puis relance.'; return; }
    const lat = Cesium.Math.toDegrees(c.latitude);
    const lon = Cesium.Math.toDegrees(c.longitude);
    statut.textContent = '🔍 Récupération des emprises OSM…';
    try {
      const r = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(`[out:json][timeout:25];way(around:700,${lat},${lon})[building];out geom tags 700;`)}`,
      });
      const d = await r.json();
      const ways = (d?.elements || []).filter((e) => Array.isArray(e.geometry) && e.geometry.length > 2);
      let n = 0;
      for (const w of ways) {
        const plat = [];
        for (const g of w.geometry) plat.push(g.lon, g.lat);
        const tags = w.tags || {};
        const h = parseFloat(tags.height) || (parseFloat(tags['building:levels']) || 0) * 3.2 || 8;
        const publique = PUBLICS.has(tags.building) || tags.amenity;
        ds.entities.add({
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(plat),
            material: (publique ? Cesium.Color.ORANGE : Cesium.Color.CYAN).withAlpha(publique ? 0.75 : 0.55),
            height: 0,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            extrudedHeight: h,
            extrudedHeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            outline: false,
          },
        });
        n += 1;
      }
      statut.textContent = n
        ? `✅ ${n} bâtiments extrudés (publics en orange). Recharge après déplacement pour couvrir une autre zone.`
        : 'Aucune emprise de bâtiment OSM ici.';
    } catch {
      statut.textContent = '⚠ Source OSM saturée — réessaie dans quelques secondes.';
    }
  }

  el.querySelector('.charger').addEventListener('click', charger);
  el.querySelector('.eff').addEventListener('click', () => {
    ds.entities.removeAll();
    statut.textContent = 'Bâtiments effacés.';
  });

  return { element: el, charger, effacer: () => ds.entities.removeAll() };
}
