/**
 * WATCHTOWER — HUB CHANTIER v3 : poste de pilotage complet du conducteur de
 * travaux, de la prospection à la livraison. 100 % gratuit, données locales.
 *
 *  🔍 PROSPECTION — marchés publics BOAMP réels + FILTRES (type, domaine).
 *  📂 DOSSIER    — projets + documents drag & drop (DICT, DUDG, plans…).
 *  🗓 PHASAGE    — zones : dessin libre OU parcelle cadastrale (IGN apicarto),
 *                  modification (dates/nom), suppression, curseur 4D.
 *  💶 GESTION    — budget, inventaire matériel (achat vs location, coûts).
 *  👥 ÉQUIPE     — personnel, hiérarchie par équipes + ressources entreprise
 *                  (plans, BIM, CSV, Excel, images…).
 *  ▶ SIMULATION  — fiche projet éditable (préremplie, import via DOSSIER),
 *                  timelapse phases + budget temps réel + ressources.
 *  🚜 SUIVI      — GPS du chantier & des outils : position temps réel de
 *                  l'inventaire (placement sur carte) + journal des positions.
 *  🕳 SOUS-SOL   — scanner OSM des réseaux enterrés (conduites, câbles,
 *                  drains, tunnels) + vue souterraine (globe translucide).
 */

import * as Cesium from 'cesium';
import { lireProfil } from './intelTwin.js';

const S_ZONES = 'watchtower.chantier.v1';
const S_PROJETS = 'watchtower.projets.v1';
const S_DOCS = 'watchtower.docs.v1';
const S_INV = 'watchtower.inventaire.v1';
const S_EQ = 'watchtower.equipe.v1';
const S_SIM = 'watchtower.sim.v1';

const CSS = `
#wt-chantier { display: flex; flex-direction: column; font-size: 10px; max-height: 56vh; }
#wt-chantier .ongles { display: flex; gap: 3px; padding: 8px 10px 0; flex-wrap: wrap; }
#wt-chantier .ong { cursor: pointer; padding: 5px 7px; font-family: inherit; font-size: 8px; font-weight: 700; letter-spacing: 1px; border-radius: 7px 7px 0 0; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-bottom: none; color: rgba(232,234,237,0.7); }
#wt-chantier .ong.actif { background: rgba(0,212,255,0.12); border-color: #00d4ff; color: #00d4ff; }
#wt-chantier .page { overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 7px; border-top: 1px solid rgba(0,212,255,0.25); }
#wt-chantier .c-btn { cursor: pointer; padding: 8px 10px; border-radius: 8px; font-family: inherit; font-size: 9px; font-weight: 700; letter-spacing: 1px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.4); color: #00d4ff; }
#wt-chantier .c-btn.actif { background: rgba(67,209,122,0.15); border-color: #43d17a; color: #43d17a; }
#wt-chantier .c-btn.mini { padding: 5px 8px; font-size: 8px; }
#wt-chantier .statut { color: rgba(232,234,237,0.55); line-height: 1.6; font-size: 9px; }
#wt-chantier input, #wt-chantier select, #wt-chantier textarea { padding: 7px 9px; background: rgba(0,0,0,0.45); color: inherit; border-radius: 7px; border: 1px solid rgba(255,255,255,0.12); font-family: inherit; font-size: 10px; outline: none; }
#wt-chantier input:focus, #wt-chantier select:focus, #wt-chantier textarea:focus { border-color: #00d4ff; }
#wt-chantier input[type=range] { width: 100%; accent-color: #00d4ff; padding: 0; }
#wt-chantier .ligne { display: flex; gap: 6px; align-items: center; padding: 6px 8px; border-radius: 7px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); line-height: 1.45; }
#wt-chantier .ligne.clic { cursor: pointer; width: 100%; text-align: left; color: inherit; font-family: inherit; font-size: 9.5px; }
#wt-chantier .ligne.clic:hover { border-color: #00d4ff; }
#wt-chantier .sup { cursor: pointer; margin-left: auto; background: none; border: none; color: #f08a8a; font-family: inherit; }
#wt-chantier .mod { cursor: pointer; background: none; border: none; color: #00d4ff; font-family: inherit; }
#wt-chantier .adequat { font-size: 13px; margin-left: auto; }
#wt-chantier .depot { border: 2px dashed rgba(0,212,255,0.4); border-radius: 10px; padding: 13px 10px; text-align: center; color: rgba(232,234,237,0.55); cursor: pointer; }
#wt-chantier .depot.survol { background: rgba(0,212,255,0.08); border-color: #00d4ff; }
#wt-chantier .jauge { height: 7px; border-radius: 4px; background: rgba(255,255,255,0.09); overflow: hidden; }
#wt-chantier .jauge i { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg,#00d4ff,#43d17a); }
#wt-chantier .date { text-align: center; color: #00d4ff; font-weight: 700; letter-spacing: 1px; }
#wt-chantier .rang { display: flex; gap: 5px; }
#wt-chantier .rang > * { flex: 1; min-width: 0; }
#wt-marche-focus { position: fixed; inset: 0; z-index: 2700; display: flex; align-items: center; justify-content: center; background: rgba(4,7,12,0.65); font-family: var(--font-mono, monospace); }
#wt-marche-focus .boite { width: min(520px, 94vw); max-height: 78vh; overflow-y: auto; padding: 16px 18px; background: rgba(8,12,20,0.95); border: 1px solid #00d4ff; border-radius: 14px; color: #e8eaed; font-size: 10px; line-height: 1.7; }
#wt-marche-focus .titre { font-size: 12px; font-weight: 800; margin-bottom: 8px; cursor: move; }
#wt-marche-focus .k { color: rgba(232,234,237,0.5); letter-spacing: 1px; font-size: 8px; }
#wt-marche-focus .actions { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
#wt-marche-focus .actions > * { cursor: pointer; padding: 8px 11px; font-family: inherit; font-size: 9px; font-weight: 700; border-radius: 8px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.45); color: #00d4ff; text-decoration: none; }
`;

const jour = 86400000;
const fmtDate = (t) => new Date(t).toLocaleDateString('fr-FR');
const fmtEuro = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`;
const lireJson = (k, d) => { try { return JSON.parse(window.localStorage.getItem(k)) ?? d; } catch { return d; } };
const ecrireJson = (k, v) => { try { window.localStorage.setItem(k, JSON.stringify(v)); } catch { /* plein */ } };

const PHASES = [
  { nom: 'Installation & études', b: 0.05, d: 0.08, res: [['👷 Chef de chantier', 1, 350, 'jour'], ['🚧 Clôtures + base vie', 1, 4500, 'forfait']] },
  { nom: 'Terrassement', b: 0.15, d: 0.17, res: [['🚜 Pelle mécanique 20t', 1, 650, 'jour · achat ≈ 180 000 €'], ['🚛 Camion 8×4', 2, 480, 'jour'], ['👷 Ouvriers', 4, 280, 'jour']] },
  { nom: 'Gros œuvre / structure', b: 0.30, d: 0.30, res: [['🏗 Grue mobile 60t', 1, 1200, 'jour · achat ≈ 750 000 €'], ['🧱 Équipe maçonnerie', 6, 300, 'jour'], ['🚚 Toupies béton', 3, 950, 'jour']] },
  { nom: 'Second œuvre / VRD', b: 0.30, d: 0.28, res: [['⚡ Équipe réseaux', 4, 320, 'jour'], ['🛠 Compacteur', 1, 380, 'jour · achat ≈ 90 000 €'], ['👷 Ouvriers', 5, 280, 'jour']] },
  { nom: 'Finitions & espaces verts', b: 0.15, d: 0.12, res: [['🌳 Équipe paysage', 3, 290, 'jour'], ['🎨 Finitions', 3, 300, 'jour']] },
  { nom: 'Livraison / OPR', b: 0.05, d: 0.05, res: [['📋 OPC + contrôles', 1, 600, 'jour']] },
];

export function initChantier(viewer) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const ds = new Cesium.CustomDataSource('wt-chantier');
  const dsSol = new Cesium.CustomDataSource('wt-soussol');
  viewer.dataSources.add(ds);
  viewer.dataSources.add(dsSol);

  let zones = lireJson(S_ZONES, []);
  let projets = lireJson(S_PROJETS, []);
  let docs = lireJson(S_DOCS, {});
  let inventaire = lireJson(S_INV, []);
  let equipe = lireJson(S_EQ, []);
  let sims = lireJson(S_SIM, {});
  let modeCarte = null; // {type:'dessin'|'parcelle'|'placer', ...}
  let suiviId = null; let marqueurEngin = null; let dateCourante = Date.now();

  const el = document.createElement('div');
  el.id = 'wt-chantier';
  el.innerHTML = `
    <div class="ongles">
      <button class="ong actif" data-p="prospection" type="button">🔍 PROSPEC.</button>
      <button class="ong" data-p="dossier" type="button">📂 DOSSIER</button>
      <button class="ong" data-p="phasage" type="button">🗓 PHASAGE</button>
      <button class="ong" data-p="gestion" type="button">💶 GESTION</button>
      <button class="ong" data-p="equipe" type="button">👥 ÉQUIPE</button>
      <button class="ong" data-p="simulation" type="button">▶ SIMUL.</button>
      <button class="ong" data-p="suivi" type="button">🚜 SUIVI</button>
      <button class="ong" data-p="soussol" type="button">🕳 SOUS-SOL</button>
    </div>
    <div class="page"></div>`;
  const page = el.querySelector('.page');

  // ═════════ dépôt de fichiers réutilisable (DOSSIER + ÉQUIPE) ═════════
  function zoneDepot(cle, conteneur) {
    const bloc = document.createElement('div');
    bloc.innerHTML = `<div class="depot">📥 Glisser-déposer (plans, BIM, CSV, Excel, images…) ou cliquer</div>
      <input type="file" multiple style="display:none" />
      <div class="fl" style="display:flex;flex-direction:column;gap:3px;margin-top:4px"></div>`;
    const depot = bloc.querySelector('.depot');
    const inputF = bloc.querySelector('input');
    const fl = bloc.querySelector('.fl');
    const rendre = () => {
      fl.innerHTML = '';
      (docs[cle] || []).forEach((fi, j) => {
        const ic = fi.type?.startsWith('image') ? '🖼' : fi.type?.includes('pdf') ? '📄'
          : /sheet|excel|csv/.test(fi.type || '') || /\.(csv|xlsx?)$/i.test(fi.nom) ? '📊'
            : /\.(ifc|bim|dwg|dxf)$/i.test(fi.nom) ? '🏗' : '📎';
        const l = document.createElement('div');
        l.className = 'ligne';
        l.innerHTML = `<span>${ic}</span><span>${fi.nom} <small style="color:rgba(232,234,237,0.4)">${(fi.taille / 1024).toFixed(0)} Ko</small></span>
          ${fi.data ? '<a class="dl" style="cursor:pointer;color:#00d4ff;margin-left:auto">⬇</a>' : '<small style="margin-left:auto;color:rgba(232,234,237,0.4)">méta</small>'}
          <button class="sup">✕</button>`;
        l.querySelector('.dl')?.addEventListener('click', () => {
          const a = document.createElement('a'); a.href = fi.data; a.download = fi.nom; a.click();
        });
        l.querySelector('.sup').addEventListener('click', () => {
          docs[cle].splice(j, 1); ecrireJson(S_DOCS, docs); rendre();
        });
        fl.appendChild(l);
      });
    };
    const ajouter = (files) => {
      docs[cle] = docs[cle] || [];
      for (const f of files) {
        const meta = { nom: f.name, type: f.type, taille: f.size };
        docs[cle].push(meta);
        if (f.size < 900 * 1024) {
          const lecteur = new FileReader();
          lecteur.onload = () => { meta.data = lecteur.result; ecrireJson(S_DOCS, docs); rendre(); };
          lecteur.readAsDataURL(f);
        }
      }
      ecrireJson(S_DOCS, docs); rendre();
    };
    depot.addEventListener('click', () => inputF.click());
    inputF.addEventListener('change', () => ajouter(inputF.files));
    depot.addEventListener('dragover', (e) => { e.preventDefault(); depot.classList.add('survol'); });
    depot.addEventListener('dragleave', () => depot.classList.remove('survol'));
    depot.addEventListener('drop', (e) => { e.preventDefault(); depot.classList.remove('survol'); ajouter(e.dataTransfer.files); });
    rendre();
    conteneur.appendChild(bloc);
  }

  // ═════════ prospection ═════════
  function adequation() {
    const p = lireProfil();
    const capacite = Number(p.capacite) || 2;
    const enCours = String(p.projets || '').split('\n').filter(Boolean).length + projets.length;
    const marge = capacite - enCours;
    if (marge >= 2) return ['🟢↑', 'capacité disponible'];
    if (marge >= 0) return ['🟠→', 'planning serré'];
    return ['🔴↓', 'planning saturé (profil INTEL)'];
  }

  function ficheMarche(f) {
    document.getElementById('wt-marche-focus')?.remove();
    const [ad, adTxt] = adequation();
    const focus = document.createElement('div');
    focus.id = 'wt-marche-focus';
    const objet = f.objet || f.objet_complet || 'Avis de marché public';
    const lien = f.url_avis || (f.idweb ? `https://www.boamp.fr/pages/avis/?q=idweb:%22${f.idweb}%22` : 'https://www.boamp.fr');
    focus.innerHTML = `
      <div class="boite">
        <div class="titre">📋 ${String(objet).slice(0, 160)}</div>
        <div><span class="k">ACHETEUR</span><br>${f.nomacheteur || f.acheteur || '—'}</div>
        <div><span class="k">PARUTION</span> ${f.dateparution || '—'} · <span class="k">LIMITE</span> ${f.datelimitereponse || f.date_limite_reponse || '—'}</div>
        <div><span class="k">TYPE</span> ${f.famille || f.type_marche || f.nature || '—'} · <span class="k">DÉPT</span> ${f.code_departement || '—'}</div>
        <div><span class="k">BUDGET</span> ${f.montant ? fmtEuro(Number(f.montant)) : 'non publié (voir DCE)'}</div>
        <div><span class="k">ADÉQUATION</span> <span style="font-size:14px">${ad}</span> ${adTxt}</div>
        <div style="margin-top:6px;color:rgba(232,234,237,0.55)">DCE (règlement, plans, DICT/DUDG…) via l'avis officiel ;
        dépose ensuite les fichiers dans 📂 DOSSIER — ils alimenteront la fiche projet de ▶ SIMULATION.</div>
        <div class="actions">
          <a href="${lien}" target="_blank" rel="noopener">📄 AVIS + DCE ↗</a>
          <button class="ajouter" type="button">📌 AJOUTER À MES PROJETS</button>
          <button class="fermer" type="button" style="border-color:rgba(255,255,255,0.2);color:rgba(232,234,237,0.6)">FERMER</button>
        </div>
      </div>`;
    document.body.appendChild(focus);
    import('./draggable.js').then((m) => m.rendreDeplacable(focus.querySelector('.boite'), focus.querySelector('.titre'))).catch(() => {});
    focus.querySelector('.fermer').addEventListener('click', () => focus.remove());
    focus.addEventListener('click', (e) => { if (e.target === focus) focus.remove(); });
    focus.querySelector('.ajouter').addEventListener('click', () => {
      projets.push({ nom: String(objet).slice(0, 80), source: 'BOAMP', date: Date.now() });
      ecrireJson(S_PROJETS, projets);
      focus.remove();
      rendrePage('dossier');
    });
  }

  async function prospecter() {
    const statut = page.querySelector('.statut');
    const liste = page.querySelector('.resultats');
    const zone = page.querySelector('.zone').value;
    const type = page.querySelector('.f-type').value;
    const domaine = page.querySelector('.f-domaine').value;
    const motcle = page.querySelector('.f-mot').value.trim();
    liste.innerHTML = '';
    statut.textContent = '🛰 Localisation de la commune visée…';
    try {
      const c = viewer.camera.positionCartographic;
      const lat = Cesium.Math.toDegrees(c.latitude);
      const lon = Cesium.Math.toDegrees(c.longitude);
      const commune = await fetch(`https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,codeDepartement`).then((r) => r.json()).then((d) => d?.[0]);
      if (!commune) { statut.textContent = '⚠ Zone hors France — BOAMP couvre les marchés français.'; return; }
      const q = [zone === 'commune' ? commune.nom : '', domaine, motcle].filter(Boolean).join(' ');
      let url = `https://boamp-datadila.opendatasoft.com/api/records/1.0/search/?dataset=boamp&q=${encodeURIComponent(q)}&rows=15&sort=dateparution`;
      if (zone === 'departement') url += `&refine.code_departement=${commune.codeDepartement}`;
      if (type) url += `&refine.famille=${encodeURIComponent(type)}`;
      statut.textContent = `🔍 BOAMP — ${zone === 'commune' ? commune.nom : `dépt ${commune.codeDepartement}`}${type ? ` · ${type}` : ''}${domaine ? ` · ${domaine}` : ''}…`;
      const d = await fetch(url).then((r) => r.json());
      let recs = d?.records || [];
      if (!recs.length && type) {
        // certains portails n'ont pas la facette famille : retombe sans filtre
        const d2 = await fetch(url.replace(/&refine\.famille=[^&]*/, '')).then((r) => r.json());
        recs = d2?.records || [];
      }
      statut.textContent = recs.length ? `📋 ${recs.length} avis (BOAMP · DILA, gratuit) — clic = fiche focus :`
        : 'Aucun avis avec ces filtres. Élargis la zone ou retire un filtre.';
      const [ad] = adequation();
      for (const rec of recs) {
        const f = rec.fields || {};
        const objet = f.objet || f.objet_complet || 'Avis de marché';
        const b = document.createElement('button');
        b.className = 'ligne clic';
        b.innerHTML = `<span>📋</span><span>${String(objet).slice(0, 90)}…<br>
          <small style="color:rgba(232,234,237,0.5)">${(f.nomacheteur || f.acheteur || '').slice(0, 50)} · ${f.dateparution || ''}</small></span>
          <span class="adequat">${ad}</span>`;
        b.addEventListener('click', () => ficheMarche(f));
        liste.appendChild(b);
      }
    } catch { statut.textContent = '⚠ BOAMP injoignable — réessaie dans quelques secondes.'; }
  }

  // ═════════ carte : zones + inventaire ═════════
  function redessinerCarte() {
    const garder = marqueurEngin;
    ds.entities.removeAll();
    if (garder) marqueurEngin = ds.entities.add(garder);
    for (const z of zones) {
      const coul = dateCourante < z.debut ? Cesium.Color.fromCssColorString('#8a8f98').withAlpha(0.45)
        : dateCourante > z.fin ? Cesium.Color.fromCssColorString('#43d17a').withAlpha(0.55)
          : Cesium.Color.fromCssColorString('#f0a63c').withAlpha(0.6);
      ds.entities.add({
        polygon: { hierarchy: Cesium.Cartesian3.fromDegreesArray(z.coords), material: coul, outline: true, outlineColor: Cesium.Color.WHITE.withAlpha(0.5), heightReference: Cesium.HeightReference.CLAMP_TO_GROUND },
      });
    }
    for (const it of inventaire) {
      if (!it.pos) continue;
      ds.entities.add({
        position: Cesium.Cartesian3.fromDegrees(it.pos.lon, it.pos.lat),
        point: { pixelSize: 9, color: Cesium.Color.ORANGE, outlineColor: Cesium.Color.BLACK, outlineWidth: 2, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND },
        label: { text: `${it.ic || '🛠'} ${it.nom}`, font: '11px JetBrains Mono, monospace', fillColor: Cesium.Color.ORANGE, showBackground: true, pixelOffset: new Cesium.Cartesian2(0, -16), heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Infinity },
      });
    }
  }

  // ═════════ pages ═════════
  function rendrePage(p) {
    el.querySelectorAll('.ong').forEach((o) => o.classList.toggle('actif', o.dataset.p === p));
    page.innerHTML = '';

    if (p === 'prospection') {
      page.innerHTML = `
        <div class="statut">🎯 Vise ta commune, règle les FILTRES, lance : avis de marchés publics
        RÉELS (BOAMP · DILA). Flèche = adéquation avec ta capacité (PROFIL du mode INTEL).</div>
        <div class="rang">
          <select class="zone"><option value="commune">📍 Ma commune</option><option value="departement">🗺 Département</option></select>
          <select class="f-type"><option value="">Tous types</option><option>TRAVAUX</option><option>SERVICES</option><option>FOURNITURES</option></select>
        </div>
        <div class="rang">
          <select class="f-domaine"><option value="">Tous domaines</option><option>voirie</option><option>bâtiment</option><option>terrassement</option><option>réseaux</option><option>assainissement</option><option>aménagement</option><option>rénovation</option><option>éclairage</option><option>espaces verts</option><option>démolition</option></select>
          <input class="f-mot" placeholder="Mot-clé libre (ex : parking)" />
        </div>
        <button class="c-btn lancer" type="button">🔍 CHERCHER LES MARCHÉS</button>
        <div class="resultats" style="display:flex;flex-direction:column;gap:4px"></div>`;
      page.querySelector('.lancer').addEventListener('click', prospecter);
    }

    if (p === 'dossier') {
      page.innerHTML = `
        <div class="statut">📂 Projets & documents (DICT, DUDG, plans, devis…). Locaux à ton appareil.</div>
        <div class="rang"><input class="np" placeholder="Nouveau projet (nom)" /><button class="c-btn cp mini" type="button">➕</button></div>
        <div class="lprojets" style="display:flex;flex-direction:column;gap:6px"></div>`;
      const lp = page.querySelector('.lprojets');
      const rendreProjets = () => {
        lp.innerHTML = projets.length ? '' : '<div class="statut">Aucun projet — ajoute-en un, ou 📌 depuis PROSPECTION.</div>';
        projets.forEach((pr, i) => {
          const bloc = document.createElement('div');
          bloc.style.cssText = 'border:1px solid rgba(0,212,255,0.25);border-radius:9px;padding:7px 9px;display:flex;flex-direction:column;gap:5px';
          bloc.innerHTML = `<div style="display:flex;gap:6px;align-items:center"><b>🏗 ${pr.nom}</b>
            <small style="color:rgba(232,234,237,0.45)">${pr.source || 'manuel'}</small>
            <button class="sup">✕</button></div>`;
          bloc.querySelector('.sup').addEventListener('click', () => {
            projets.splice(i, 1); ecrireJson(S_PROJETS, projets); rendreProjets();
          });
          zoneDepot(pr.nom, bloc);
          lp.appendChild(bloc);
        });
      };
      rendreProjets();
      page.querySelector('.cp').addEventListener('click', () => {
        const nom = page.querySelector('.np').value.trim();
        if (!nom) return;
        projets.push({ nom, source: 'manuel', date: Date.now() });
        ecrireJson(S_PROJETS, projets);
        page.querySelector('.np').value = '';
        rendreProjets();
      });
    }

    if (p === 'phasage') {
      page.innerHTML = `
        <div class="rang">
          <button class="c-btn nouv" type="button">✏ DESSIN LIBRE</button>
          <button class="c-btn parc" type="button">📐 PARCELLE CADASTRALE</button>
        </div>
        <button class="c-btn fin" type="button" style="display:none">✔ TERMINER LA ZONE</button>
        <div class="forme" style="display:none;flex-direction:column;gap:5px">
          <input class="f-nom" placeholder="Nom de la zone (ex : Terrassement lot A)" />
          <div class="rang"><input class="f-debut" type="date" /><input class="f-fin" type="date" /></div>
          <button class="c-btn sauver" type="button">💾 ENREGISTRER LA ZONE</button>
        </div>
        <input type="range" min="0" max="100" value="50" /><div class="date">—</div>
        <div class="liste" style="display:flex;flex-direction:column;gap:4px"></div>
        <div class="statut">✏ dessin libre : clics = sommets. 📐 parcelle : un clic sur une parcelle
        récupère sa géométrie EXACTE au cadastre (IGN apicarto, gratuit). ✎ = modifier une zone.
        Curseur 4D : gris = à venir · orange = en cours · vert = terminé.</div>`;
      const curseur = page.querySelector('input[type=range]');
      const forme = page.querySelector('.forme');
      let enEdition = null;
      const ouvrirForme = (z) => {
        forme.style.display = 'flex';
        const auj = new Date();
        page.querySelector('.f-nom').value = z?.nom || '';
        page.querySelector('.f-debut').value = new Date(z?.debut || auj).toISOString().slice(0, 10);
        page.querySelector('.f-fin').value = new Date(z?.fin || auj.getTime() + 30 * jour).toISOString().slice(0, 10);
      };
      const majTemps = () => {
        const t0 = zones.length ? Math.min(...zones.map((z) => z.debut)) - 5 * jour : Date.now() - 15 * jour;
        const t1 = zones.length ? Math.max(...zones.map((z) => z.fin)) + 5 * jour : Date.now() + 45 * jour;
        dateCourante = t0 + ((t1 - t0) * Number(curseur.value)) / 100;
        page.querySelector('.date').textContent = `📅 ${fmtDate(dateCourante)}`;
        redessinerCarte();
        const liste = page.querySelector('.liste');
        liste.innerHTML = '';
        zones.forEach((z, i) => {
          const etat = dateCourante < z.debut ? '⏳ à venir' : dateCourante > z.fin ? '✅ terminé' : '🚧 en cours';
          const l = document.createElement('div');
          l.className = 'ligne';
          l.innerHTML = `<span>🏗</span><span>${z.nom}<br><small style="color:rgba(232,234,237,0.5)">${fmtDate(z.debut)} → ${fmtDate(z.fin)} · ${etat}${z.parcelle ? ' · 📐 cadastre' : ''}</small></span>
            <button class="mod" title="Modifier">✎</button><button class="sup">✕</button>`;
          l.querySelector('.mod').addEventListener('click', () => { enEdition = i; ouvrirForme(z); });
          l.querySelector('.sup').addEventListener('click', () => {
            zones.splice(i, 1); ecrireJson(S_ZONES, zones); majTemps();
          });
          liste.appendChild(l);
        });
      };
      curseur.addEventListener('input', majTemps);
      page.querySelector('.nouv').addEventListener('click', () => {
        modeCarte = { type: 'dessin', coords: [] };
        window.__wtDessin = true;
        page.querySelector('.fin').style.display = '';
        page.querySelector('.statut').textContent = '🖊 Clique sur la carte pour poser les sommets, puis TERMINER.';
      });
      page.querySelector('.parc').addEventListener('click', () => {
        modeCarte = { type: 'parcelle' };
        window.__wtDessin = true;
        page.querySelector('.statut').textContent = '📐 Clique sur une parcelle (zoome bien) — géométrie cadastrale IGN.';
      });
      page.querySelector('.fin').addEventListener('click', () => {
        if (!modeCarte || (modeCarte.coords || []).length < 6) { page.querySelector('.statut').textContent = '⚠ Minimum 3 sommets.'; return; }
        page.querySelector('.fin').style.display = 'none';
        enEdition = null;
        ouvrirForme(null);
      });
      page.querySelector('.sauver').addEventListener('click', () => {
        const nom = page.querySelector('.f-nom').value.trim() || `Zone ${zones.length + 1}`;
        const debut = new Date(page.querySelector('.f-debut').value || Date.now()).getTime();
        const fin = new Date(page.querySelector('.f-fin').value || Date.now() + 30 * jour).getTime();
        if (enEdition != null) {
          Object.assign(zones[enEdition], { nom, debut, fin: Math.max(fin, debut + jour) });
          enEdition = null;
        } else {
          zones.push({ nom, debut, fin: Math.max(fin, debut + jour), coords: modeCarte.coords, parcelle: modeCarte.type === 'parcelle' });
        }
        ecrireJson(S_ZONES, zones);
        modeCarte = null; window.__wtDessin = false;
        forme.style.display = 'none';
        majTemps();
      });
      // callback parcelle → ouvre la forme quand la géométrie arrive
      el.dataset.phasageActif = '1';
      el._surParcelle = (coords) => {
        modeCarte = { type: 'parcelle', coords };
        enEdition = null;
        ouvrirForme(null);
        page.querySelector('.statut').textContent = `📐 Parcelle récupérée (${coords.length / 2} sommets) — nomme et date la zone.`;
      };
      majTemps();
    }

    if (p === 'gestion') {
      const rendreGestion = () => {
        const coutLoc = inventaire.filter((i) => i.mode === 'location').reduce((a, b) => a + (Number(b.cout) || 0), 0);
        const coutAchat = inventaire.filter((i) => i.mode === 'achat').reduce((a, b) => a + (Number(b.cout) || 0), 0);
        page.innerHTML = `
          <div class="statut">💶 Inventaire matériel & budget. Location = €/jour · Achat = € investis.
          Les éléments d'inventaire apparaissent dans 🚜 SUIVI pour le placement GPS.</div>
          <div class="ligne"><span>📊 BUDGET</span><span style="margin-left:auto">location <b>${fmtEuro(coutLoc)}/j</b> · parc acheté <b>${fmtEuro(coutAchat)}</b></span></div>
          <div class="rang"><input class="i-nom" placeholder="Matériel (ex : Pelle 20t)" /><select class="i-ic"><option>🚜</option><option>🏗</option><option>🚛</option><option>🛠</option><option>⚡</option><option>📦</option></select></div>
          <div class="rang">
            <select class="i-mode"><option value="location">Location (€/j)</option><option value="achat">Achat (€)</option></select>
            <input class="i-cout" type="number" placeholder="Coût" />
            <button class="c-btn mini aj" type="button">➕</button>
          </div>
          <div class="linv" style="display:flex;flex-direction:column;gap:3px"></div>`;
        const linv = page.querySelector('.linv');
        inventaire.forEach((it, i) => {
          const l = document.createElement('div');
          l.className = 'ligne';
          l.innerHTML = `<span>${it.ic}</span><span>${it.nom}<br><small style="color:rgba(232,234,237,0.5)">${it.mode} · ${fmtEuro(Number(it.cout) || 0)}${it.mode === 'location' ? '/j' : ''} · ${it.pos ? `📍 posé ${fmtDate(it.pos.t)}` : 'non localisé'}</small></span>
            <button class="sup">✕</button>`;
          l.querySelector('.sup').addEventListener('click', () => {
            inventaire.splice(i, 1); ecrireJson(S_INV, inventaire); rendreGestion(); redessinerCarte();
          });
          linv.appendChild(l);
        });
        page.querySelector('.aj').addEventListener('click', () => {
          const nom = page.querySelector('.i-nom').value.trim();
          if (!nom) return;
          inventaire.push({ nom, ic: page.querySelector('.i-ic').value, mode: page.querySelector('.i-mode').value, cout: page.querySelector('.i-cout').value, logs: [] });
          ecrireJson(S_INV, inventaire);
          rendreGestion();
        });
      };
      rendreGestion();
    }

    if (p === 'equipe') {
      const rendreEq = () => {
        page.innerHTML = `
          <div class="statut">👥 Personnel de l'entreprise — hiérarchie par équipes. + 🗄 ressources
          entreprise (plans types, BIM, CSV, Excel, images…).</div>
          <div class="rang"><input class="e-nom" placeholder="Nom" /><input class="e-role" placeholder="Rôle (ex : chef d'équipe)" /></div>
          <div class="rang"><input class="e-equipe" placeholder="Équipe (ex : Équipe VRD)" /><button class="c-btn mini aj" type="button">➕</button></div>
          <div class="leq" style="display:flex;flex-direction:column;gap:5px"></div>
          <div class="statut" style="margin-top:4px">🗄 RESSOURCES ENTREPRISE :</div>
          <div class="ress"></div>`;
        const leq = page.querySelector('.leq');
        const parEquipe = {};
        for (const m of equipe) (parEquipe[m.equipe || 'Sans équipe'] = parEquipe[m.equipe || 'Sans équipe'] || []).push(m);
        for (const [eq, membres] of Object.entries(parEquipe)) {
          const bloc = document.createElement('div');
          bloc.style.cssText = 'border:1px solid rgba(0,212,255,0.2);border-radius:9px;padding:6px 8px';
          const chefs = membres.filter((m) => /chef|direct|conduct|responsable/i.test(m.role || ''));
          const autres = membres.filter((m) => !chefs.includes(m));
          bloc.innerHTML = `<b>🛡 ${eq}</b> <small style="color:rgba(232,234,237,0.45)">(${membres.length})</small>
            ${chefs.map((m) => `<div class="ligne" style="margin-top:3px"><span>⭐</span><span>${m.nom} — ${m.role}</span><button class="sup" data-n="${m.nom}">✕</button></div>`).join('')}
            ${autres.map((m) => `<div class="ligne" style="margin-top:3px;margin-left:12px"><span>👷</span><span>${m.nom} — ${m.role || 'ouvrier'}</span><button class="sup" data-n="${m.nom}">✕</button></div>`).join('')}`;
          bloc.querySelectorAll('.sup').forEach((b) => b.addEventListener('click', () => {
            equipe = equipe.filter((m) => m.nom !== b.dataset.n);
            ecrireJson(S_EQ, equipe); rendreEq();
          }));
          leq.appendChild(bloc);
        }
        if (!equipe.length) leq.innerHTML = '<div class="statut">Personne — ajoute ton premier collaborateur (⭐ = rôle contenant « chef », « responsable »…).</div>';
        page.querySelector('.aj').addEventListener('click', () => {
          const nom = page.querySelector('.e-nom').value.trim();
          if (!nom) return;
          equipe.push({ nom, role: page.querySelector('.e-role').value.trim(), equipe: page.querySelector('.e-equipe').value.trim() });
          ecrireJson(S_EQ, equipe); rendreEq();
        });
        zoneDepot('_RESSOURCES_ENTREPRISE', page.querySelector('.ress'));
      };
      rendreEq();
    }

    if (p === 'simulation') {
      const rendreSim = () => {
        const noms = ['DÉMO — Parking-passerelle cinéma', ...projets.map((x) => x.nom)];
        const sel = sims.__sel && noms.includes(sims.__sel) ? sims.__sel : noms[0];
        const fiche = sims[sel] || { budget: 850000, duree: 120, notes: '' };
        const fichiers = (docs[sel] || []).length;
        page.innerHTML = `
          <div class="statut">▶ FICHE PROJET : préremplie, modifiable à la main, enrichie par les
          documents importés dans 📂 DOSSIER (dossiers de marché, DCE…).</div>
          <select class="s-projet">${noms.map((n) => `<option${n === sel ? ' selected' : ''}>${n}</option>`).join('')}</select>
          <div class="rang">
            <input class="s-budget" type="number" value="${fiche.budget}" title="Budget (€)" />
            <input class="s-duree" type="number" value="${fiche.duree}" title="Durée (jours)" />
          </div>
          <textarea class="s-notes" rows="2" placeholder="Notes projet (contraintes, accès, aléas…)">${fiche.notes || ''}</textarea>
          <div class="ligne"><span>📂</span><span>${fichiers} document(s) importé(s) pour ce projet</span>
            <button class="c-btn mini imp" style="margin-left:auto" type="button">📥 IMPORTER</button></div>
          <input type="range" min="0" max="100" value="25" />
          <div class="date">—</div>
          <div class="s-phase" style="font-weight:700;color:#00d4ff"></div>
          <div class="jauge"><i></i></div>
          <div class="s-budgetl"></div>
          <div class="s-res" style="display:flex;flex-direction:column;gap:3px"></div>`;
        const maj = () => {
          const budget = Number(page.querySelector('.s-budget').value) || 850000;
          const duree = Number(page.querySelector('.s-duree').value) || 120;
          sims[sel] = { budget, duree, notes: page.querySelector('.s-notes').value };
          sims.__sel = sel;
          ecrireJson(S_SIM, sims);
          const pct = Number(page.querySelector('input[type=range]').value) / 100;
          const jr = Math.round(duree * pct);
          let cumD = 0; let cumB = 0; let phase = PHASES[0]; let debutPhase = 0;
          for (const ph of PHASES) {
            if (pct <= cumD + ph.d || ph === PHASES[PHASES.length - 1]) { phase = ph; debutPhase = cumD; break; }
            cumD += ph.d; cumB += ph.b;
          }
          const av = Math.min(1, Math.max(0, (pct - debutPhase) / phase.d));
          const alea = pct > 0.5 ? 1.04 : 1;
          const depense = (cumB + phase.b * av) * budget * alea;
          page.querySelector('.date').textContent = `📅 JOUR ${jr} / ${duree}`;
          page.querySelector('.s-phase').textContent = `⛏ ${phase.nom} (${Math.round(av * 100)} %)`;
          page.querySelector('.jauge i').style.width = `${Math.round(pct * 100)}%`;
          page.querySelector('.s-budgetl').innerHTML = `💶 <b>${fmtEuro(depense)}</b> / ${fmtEuro(budget)}${alea > 1 ? ' <span style="color:#f0a63c">(+4 % aléas)</span>' : ''}`;
          const res = page.querySelector('.s-res');
          res.innerHTML = '';
          for (const [nomR, n, cout, unite] of phase.res) {
            const l = document.createElement('button');
            l.className = 'ligne clic';
            l.innerHTML = `<span>${nomR}</span><span style="margin-left:auto">× ${n} · ${fmtEuro(cout)}/${unite.split(' ')[0]}</span>`;
            l.addEventListener('click', () => {
              const jp = Math.round(duree * phase.d);
              window.alert(`${nomR}\n\nQuantité : ${n}\nCoût : ${fmtEuro(cout)} / ${unite}\nPhase ≈ ${jp} j → coût phase ${fmtEuro(n * cout * (unite.startsWith('jour') ? jp : 1))}\n\nBenchmark : location rentable < ~120 j/an d'usage, sinon achat. Vue 3D : 🏙 BÂTI 3D sur la zone.`);
            });
            res.appendChild(l);
          }
        };
        page.querySelector('.s-projet').addEventListener('change', (e) => { sims.__sel = e.target.value; ecrireJson(S_SIM, sims); rendreSim(); });
        page.querySelector('.imp').addEventListener('click', () => rendrePage('dossier'));
        page.querySelector('input[type=range]').addEventListener('input', maj);
        page.querySelector('.s-budget').addEventListener('input', maj);
        page.querySelector('.s-duree').addEventListener('input', maj);
        page.querySelector('.s-notes').addEventListener('input', maj);
        maj();
      };
      rendreSim();
    }

    if (p === 'suivi') {
      const rendreSuivi = () => {
        page.innerHTML = `
          <div class="statut">🚜 GPS temps réel : ta position (appareil) + POSITION DES OUTILS de
          l'inventaire (💶 GESTION). 📍 PLACER = clic sur la carte ; chaque placement est daté dans le
          JOURNAL → position relative des ressources dans la journée.</div>
          <button class="c-btn engin" type="button">${suiviId != null ? '⏹ ARRÊTER MON SUIVI' : '📡 SUIVRE MA POSITION'}</button>
          <div class="louts" style="display:flex;flex-direction:column;gap:4px"></div>`;
        const louts = page.querySelector('.louts');
        if (!inventaire.length) louts.innerHTML = '<div class="statut">Inventaire vide — ajoute du matériel dans 💶 GESTION.</div>';
        inventaire.forEach((it) => {
          const l = document.createElement('div');
          l.className = 'ligne';
          const derniers = (it.logs || []).slice(-3).reverse()
            .map((g) => `<br><small style="color:rgba(232,234,237,0.4)">· ${new Date(g.t).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ${g.txt}</small>`).join('');
          l.innerHTML = `<span>${it.ic}</span><span>${it.nom} — ${it.pos ? '📍 localisé' : 'non localisé'}${derniers}</span>
            <button class="c-btn mini placer" style="margin-left:auto" type="button">📍 PLACER</button>`;
          l.querySelector('.placer').addEventListener('click', () => {
            modeCarte = { type: 'placer', item: it };
            window.__wtDessin = true;
            page.querySelector('.statut').textContent = `📍 Clique sur la carte pour poser « ${it.nom} ».`;
          });
          louts.appendChild(l);
        });
        const btnEngin = page.querySelector('.engin');
        btnEngin.classList.toggle('actif', suiviId != null);
        btnEngin.addEventListener('click', () => {
          if (suiviId != null) {
            navigator.geolocation.clearWatch(suiviId); suiviId = null;
            if (marqueurEngin) { ds.entities.remove(marqueurEngin); marqueurEngin = null; }
            rendreSuivi(); return;
          }
          if (!navigator.geolocation) return;
          suiviId = navigator.geolocation.watchPosition((pos) => {
            const pt = Cesium.Cartesian3.fromDegrees(pos.coords.longitude, pos.coords.latitude);
            if (!marqueurEngin) {
              marqueurEngin = ds.entities.add({
                position: pt,
                point: { pixelSize: 11, color: Cesium.Color.YELLOW, outlineColor: Cesium.Color.BLACK, outlineWidth: 2, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND },
                label: { text: '📡 MOI', font: '12px JetBrains Mono, monospace', fillColor: Cesium.Color.YELLOW, showBackground: true, pixelOffset: new Cesium.Cartesian2(0, -18), heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Infinity },
              });
            } else marqueurEngin.position = pt;
          }, () => {}, { enableHighAccuracy: true, maximumAge: 3000 });
          rendreSuivi();
        });
      };
      // rafraîchi après placement
      el._apresPlacement = rendreSuivi;
      rendreSuivi();
    }

    if (p === 'soussol') {
      page.innerHTML = `
        <div class="statut">🕳 CE QU'IL Y A SOUS TES PIEDS — réseaux enterrés référencés dans
        OpenStreetMap : 🔵 conduites/eau · 🟤 drains/égouts · 🟡 électricité · ⚪ tunnels/télécom.
        Rayon 600 m autour du centre de la vue.</div>
        <button class="c-btn scan" type="button">🔍 SCANNER LE SOUS-SOL</button>
        <button class="c-btn trans" type="button">🌐 VUE SOUTERRAINE (globe translucide)</button>
        <button class="c-btn eff" type="button" style="border-color:rgba(240,90,90,0.5);color:#f08a8a">🗑 EFFACER</button>
        <div class="res statut"></div>
        <div class="statut">⚠ IMPORTANT : OSM est INDICATIF. Avant travaux, la position exacte des
        réseaux vient de la déclaration DT-DICT obligatoire (reseaux-et-canalisations.ineris.fr,
        gratuit) — dépose les réponses dans 📂 DOSSIER.</div>`;
      const res = page.querySelector('.res');
      page.querySelector('.scan').addEventListener('click', async () => {
        const c = viewer.camera.positionCartographic;
        if (c.height > 20000) { res.textContent = '⚠ Zoome davantage (moins de 20 km).'; return; }
        const lat = Cesium.Math.toDegrees(c.latitude);
        const lon = Cesium.Math.toDegrees(c.longitude);
        res.textContent = '🔍 Scan des réseaux enterrés (OSM)…';
        try {
          const r = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(`[out:json][timeout:25];(
              way(around:600,${lat},${lon})[man_made=pipeline];
              way(around:600,${lat},${lon})[power][location=underground];
              way(around:600,${lat},${lon})[power=cable];
              way(around:600,${lat},${lon})[waterway~"drain|ditch"];
              way(around:600,${lat},${lon})[tunnel=yes];
              way(around:600,${lat},${lon})[telecom];
            );out geom 300;`)}`,
          });
          const d = await r.json();
          dsSol.entities.removeAll();
          let n = 0;
          for (const w of (d?.elements || [])) {
            if (!Array.isArray(w.geometry) || w.geometry.length < 2) continue;
            const t = w.tags || {};
            const coul = t.man_made === 'pipeline' || /water/.test(t.substance || '') ? '#00a2ff'
              : t.waterway ? '#a0763c' : t.power ? '#e8c04a' : t.telecom ? '#c9c9c9' : '#9a9aa5';
            const plat = [];
            for (const g of w.geometry) plat.push(g.lon, g.lat);
            dsSol.entities.add({
              polyline: { positions: Cesium.Cartesian3.fromDegreesArray(plat), width: 3, material: Cesium.Color.fromCssColorString(coul).withAlpha(0.9), clampToGround: true },
            });
            n += 1;
          }
          res.textContent = n ? `✅ ${n} tronçons enterrés tracés (couleur = type de réseau).`
            : 'Aucun réseau enterré référencé ici dans OSM (⇒ DT-DICT indispensable).';
        } catch { res.textContent = '⚠ Source saturée — réessaie.'; }
      });
      page.querySelector('.trans').addEventListener('click', (e) => {
        const g = viewer.scene.globe;
        const actif = !g.translucency.enabled;
        g.translucency.enabled = actif;
        g.translucency.frontFaceAlpha = actif ? 0.45 : 1;
        e.target.classList.toggle('actif', actif);
      });
      page.querySelector('.eff').addEventListener('click', () => { dsSol.entities.removeAll(); res.textContent = 'Effacé.'; });
    }
  }

  // ═════════ clics carte : dessin / parcelle / placement ═════════
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(async (click) => {
    if (!modeCarte) return;
    const cart = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
    if (!cart) return;
    const c = Cesium.Cartographic.fromCartesian(cart);
    const lo = Cesium.Math.toDegrees(c.longitude);
    const la = Cesium.Math.toDegrees(c.latitude);
    if (modeCarte.type === 'dessin') {
      modeCarte.coords.push(lo, la);
      ds.entities.add({ position: Cesium.Cartesian3.fromDegrees(lo, la), point: { pixelSize: 7, color: Cesium.Color.ORANGE, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND } });
    } else if (modeCarte.type === 'parcelle') {
      try {
        const r = await fetch(`https://apicarto.ign.fr/api/cadastre/parcelle?geom=${encodeURIComponent(JSON.stringify({ type: 'Point', coordinates: [lo, la] }))}`);
        const d = await r.json();
        const geo = d?.features?.[0]?.geometry;
        let anneau = null;
        if (geo?.type === 'Polygon') anneau = geo.coordinates[0];
        if (geo?.type === 'MultiPolygon') anneau = geo.coordinates[0]?.[0];
        if (anneau?.length > 2) {
          const coords = [];
          for (const pt of anneau) coords.push(pt[0], pt[1]);
          el._surParcelle?.(coords);
        }
      } catch { /* apicarto indisponible */ }
    } else if (modeCarte.type === 'placer') {
      const it = modeCarte.item;
      it.pos = { lon: lo, lat: la, t: Date.now() };
      it.logs = it.logs || [];
      it.logs.push({ t: Date.now(), txt: `posé à ${la.toFixed(4)}, ${lo.toFixed(4)}` });
      if (it.logs.length > 40) it.logs = it.logs.slice(-40);
      ecrireJson(S_INV, inventaire);
      modeCarte = null; window.__wtDessin = false;
      redessinerCarte();
      el._apresPlacement?.();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  for (const o of el.querySelectorAll('.ong')) o.addEventListener('click', () => rendrePage(o.dataset.p));
  rendrePage('prospection');
  redessinerCarte();

  return { element: el };
}
