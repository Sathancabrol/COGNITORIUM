/**
 * WATCHTOWER — MODE CHANTIER (v0 gratuite).
 *
 * Première version gratuite du mode chantier 4D demandé :
 *   ➕ ZONES : dessine des zones directement sur la carte (clics = sommets,
 *      bouton TERMINER = fermeture du polygone), nom + dates début/fin ;
 *   ⏱ PHASAGE 4D : curseur temporel — chaque zone se colore selon son état
 *      à la date choisie : gris = pas commencé · orange = en cours ·
 *      vert = terminé ;
 *   🚜 GPS ENGIN : suit TON appareil en direct (partage de localisation du
 *      navigateur) comme un engin sur le chantier. Le suivi multi-engins
 *      (boîtiers Traccar) et l'import BIM/IFC restent en feuille de route.
 * Tout est mémorisé en local. Gratuit, sans clé.
 */

import * as Cesium from 'cesium';

const STORE = 'watchtower.chantier.v1';

const CSS = `
#wt-chantier { display: flex; flex-direction: column; gap: 7px; padding: 10px 12px; font-size: 10px; }
#wt-chantier .c-btn {
  cursor: pointer; padding: 8px 10px; border-radius: 8px; font-family: inherit;
  font-size: 9px; font-weight: 700; letter-spacing: 1px;
  background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.4); color: #00d4ff;
}
#wt-chantier .c-btn.actif { background: rgba(67,209,122,0.15); border-color: #43d17a; color: #43d17a; }
#wt-chantier .statut { color: rgba(232,234,237,0.55); line-height: 1.6; font-size: 9px; }
#wt-chantier .forme { display: none; flex-direction: column; gap: 5px; }
#wt-chantier .forme.on { display: flex; }
#wt-chantier input {
  padding: 7px 9px; background: rgba(0,0,0,0.45); color: inherit; border-radius: 7px;
  border: 1px solid rgba(255,255,255,0.12); font-family: inherit; font-size: 10px; outline: none;
}
#wt-chantier input:focus { border-color: #00d4ff; }
#wt-chantier .zone-ligne {
  display: flex; gap: 6px; align-items: center; padding: 5px 8px; border-radius: 7px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); line-height: 1.4;
}
#wt-chantier .zone-ligne .sup { cursor: pointer; margin-left: auto; background: none; border: none; color: #f08a8a; font-family: inherit; }
#wt-chantier .temps { display: flex; flex-direction: column; gap: 3px; }
#wt-chantier .temps input[type=range] { width: 100%; accent-color: #00d4ff; padding: 0; }
#wt-chantier .temps .date { text-align: center; color: #00d4ff; font-weight: 700; letter-spacing: 1px; }
`;

const jour = 86400000;
const fmtDate = (t) => new Date(t).toLocaleDateString('fr-FR');

function lire() { try { return JSON.parse(window.localStorage.getItem(STORE)) || []; } catch { return []; } }
function ecrire(z) { try { window.localStorage.setItem(STORE, JSON.stringify(z)); } catch { /* plein */ } }

export function initChantier(viewer) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const ds = new Cesium.CustomDataSource('wt-chantier');
  viewer.dataSources.add(ds);

  let zones = lire();
  let dessin = null; // {coords:[], points:[entités]}
  let suiviId = null;
  let marqueurEngin = null;
  let dateCourante = Date.now();

  const el = document.createElement('div');
  el.id = 'wt-chantier';
  el.innerHTML = `
    <button class="c-btn nouv" type="button">➕ NOUVELLE ZONE (clics sur la carte)</button>
    <button class="c-btn fin" type="button" style="display:none">✔ TERMINER LA ZONE</button>
    <div class="forme">
      <input class="f-nom" placeholder="Nom de la zone (ex : Terrassement lot A)" />
      <input class="f-debut" type="date" />
      <input class="f-fin" type="date" />
      <button class="c-btn sauver" type="button">💾 ENREGISTRER LA ZONE</button>
    </div>
    <div class="temps">
      <input type="range" min="0" max="100" value="50" />
      <div class="date">—</div>
    </div>
    <div class="liste"></div>
    <button class="c-btn engin" type="button">🚜 SUIVRE MA POSITION (ENGIN GPS)</button>
    <div class="statut">Phasage 4D : gris = à venir · orange = en cours · vert = terminé à la
    date du curseur. Multi-engins (Traccar) et BIM/IFC : feuille de route (docs/SOURCES-FR.md).</div>`;

  const btnNouv = el.querySelector('.nouv');
  const btnFin = el.querySelector('.fin');
  const forme = el.querySelector('.forme');
  const curseur = el.querySelector('input[type=range]');
  const lblDate = el.querySelector('.date');
  const liste = el.querySelector('.liste');
  const statut = el.querySelector('.statut');

  function bornes() {
    if (!zones.length) { const t = Date.now(); return [t - 15 * jour, t + 45 * jour]; }
    return [Math.min(...zones.map((z) => z.debut)) - 5 * jour, Math.max(...zones.map((z) => z.fin)) + 5 * jour];
  }

  function couleur(z) {
    if (dateCourante < z.debut) return Cesium.Color.fromCssColorString('#8a8f98').withAlpha(0.45);
    if (dateCourante > z.fin) return Cesium.Color.fromCssColorString('#43d17a').withAlpha(0.55);
    return Cesium.Color.fromCssColorString('#f0a63c').withAlpha(0.6);
  }
  const etat = (z) => (dateCourante < z.debut ? '⏳ à venir' : dateCourante > z.fin ? '✅ terminé' : '🚧 en cours');

  function redessiner() {
    ds.entities.removeAll();
    for (const z of zones) {
      ds.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(z.coords),
          material: couleur(z), outline: true,
          outlineColor: Cesium.Color.WHITE.withAlpha(0.5),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: `${z.nom}\n${etat(z)}`, font: '12px JetBrains Mono, monospace',
          fillColor: Cesium.Color.WHITE, showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString('#0a0a0f').withAlpha(0.7),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, disableDepthTestDistance: Infinity,
        },
        position: Cesium.Cartesian3.fromDegrees(
          z.coords.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0) / (z.coords.length / 2),
          z.coords.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0) / (z.coords.length / 2),
        ),
      });
    }
    liste.innerHTML = '';
    for (const z of zones) {
      const l = document.createElement('div');
      l.className = 'zone-ligne';
      l.innerHTML = `<span>🏗</span><span>${z.nom}<br><small style="color:rgba(232,234,237,0.5)">${fmtDate(z.debut)} → ${fmtDate(z.fin)} · ${etat(z)}</small></span>
        <button class="sup" title="Supprimer">✕</button>`;
      l.querySelector('.sup').addEventListener('click', () => {
        zones = zones.filter((x) => x !== z); ecrire(zones); redessiner();
      });
      liste.appendChild(l);
    }
  }

  function majTemps() {
    const [t0, t1] = bornes();
    dateCourante = t0 + ((t1 - t0) * Number(curseur.value)) / 100;
    lblDate.textContent = `📅 ${fmtDate(dateCourante)}`;
    redessiner();
  }
  curseur.addEventListener('input', majTemps);

  // ── dessin de zone ──
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((click) => {
    if (!dessin) return;
    const cart = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
    if (!cart) return;
    const c = Cesium.Cartographic.fromCartesian(cart);
    dessin.coords.push(Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude));
    dessin.points.push(ds.entities.add({
      position: Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)),
      point: { pixelSize: 7, color: Cesium.Color.ORANGE, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND },
    }));
    statut.textContent = `🖊 ${dessin.coords.length / 2} sommets — clique encore, puis TERMINER.`;
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  btnNouv.addEventListener('click', () => {
    dessin = { coords: [], points: [] };
    window.__wtDessin = true; // la FICHE LIEU ignore les clics pendant le dessin
    btnNouv.style.display = 'none'; btnFin.style.display = '';
    statut.textContent = '🖊 Clique sur la carte pour poser les sommets de la zone.';
  });
  btnFin.addEventListener('click', () => {
    if (!dessin || dessin.coords.length < 6) { statut.textContent = '⚠ Il faut au moins 3 sommets.'; return; }
    btnFin.style.display = 'none';
    forme.classList.add('on');
    const auj = new Date();
    el.querySelector('.f-debut').value = auj.toISOString().slice(0, 10);
    el.querySelector('.f-fin').value = new Date(auj.getTime() + 30 * jour).toISOString().slice(0, 10);
    statut.textContent = 'Nomme la zone et fixe les dates, puis ENREGISTRER.';
  });
  el.querySelector('.sauver').addEventListener('click', () => {
    const nom = el.querySelector('.f-nom').value.trim() || `Zone ${zones.length + 1}`;
    const debut = new Date(el.querySelector('.f-debut').value || Date.now()).getTime();
    const fin = new Date(el.querySelector('.f-fin').value || Date.now() + 30 * jour).getTime();
    zones.push({ nom, debut, fin: Math.max(fin, debut + jour), coords: dessin.coords });
    ecrire(zones);
    dessin = null; window.__wtDessin = false;
    forme.classList.remove('on'); btnNouv.style.display = '';
    el.querySelector('.f-nom').value = '';
    statut.textContent = '✅ Zone enregistrée. Le curseur temporel anime le phasage.';
    majTemps();
  });

  // ── GPS engin (ton appareil) ──
  const btnEngin = el.querySelector('.engin');
  btnEngin.addEventListener('click', () => {
    if (suiviId != null) {
      navigator.geolocation.clearWatch(suiviId); suiviId = null;
      btnEngin.classList.remove('actif');
      btnEngin.textContent = '🚜 SUIVRE MA POSITION (ENGIN GPS)';
      if (marqueurEngin) { ds.entities.remove(marqueurEngin); marqueurEngin = null; }
      return;
    }
    if (!navigator.geolocation) { statut.textContent = 'Géolocalisation indisponible.'; return; }
    suiviId = navigator.geolocation.watchPosition((pos) => {
      const p = Cesium.Cartesian3.fromDegrees(pos.coords.longitude, pos.coords.latitude);
      if (!marqueurEngin) {
        marqueurEngin = ds.entities.add({
          position: p,
          point: { pixelSize: 11, color: Cesium.Color.YELLOW, outlineColor: Cesium.Color.BLACK, outlineWidth: 2, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND },
          label: { text: '🚜 ENGIN 1 (moi)', font: '12px JetBrains Mono, monospace', fillColor: Cesium.Color.YELLOW, showBackground: true, pixelOffset: new Cesium.Cartesian2(0, -18), heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Infinity },
        });
      } else marqueurEngin.position = p;
    }, () => { statut.textContent = '🚫 Localisation refusée.'; }, { enableHighAccuracy: true, maximumAge: 3000 });
    btnEngin.classList.add('actif');
    btnEngin.textContent = '⏹ ARRÊTER LE SUIVI';
  });

  majTemps();
  return { element: el };
}
