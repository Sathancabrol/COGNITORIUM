/**
 * WATCHTOWER — HUB CHANTIER : le poste de pilotage du conducteur de travaux.
 *
 * Méthodologie A→Z, chaque étape = un onglet :
 *  1. 🔍 PROSPECTION — marchés publics RÉELS (BOAMP/DILA, gratuit sans clé)
 *     dans la commune visée et alentour, rayon réglable ; flèche de couleur =
 *     adéquation avec TA capacité (profil INTEL : capacité vs projets en
 *     cours) ; fiche focus par marché ; ajout à mes projets en 1 clic.
 *  2. 📂 DOSSIER — documents par projet (DICT, DUDG, plans…) en glisser-
 *     déposer, aperçu, téléchargement. Stockés en local sur ton appareil.
 *  3. 🗓 PHASAGE — zones dessinées sur la carte + curseur temporel 4D
 *     (gris = à venir · orange = en cours · vert = terminé).
 *  4. ▶ SIMULATION — timelapse d'un chantier type : jour par jour, phases,
 *     budget consommé en temps réel, ressources (engins/équipes) avec
 *     benchmark location vs achat, aléas météo injectés.
 *  5. 🚜 SUIVI — engin GPS en direct (ton appareil).
 */

import * as Cesium from 'cesium';
import { lireProfil } from './intelTwin.js';

const STORE_ZONES = 'watchtower.chantier.v1';
const STORE_PROJETS = 'watchtower.projets.v1';
const STORE_DOCS = 'watchtower.docs.v1';

const CSS = `
#wt-chantier { display: flex; flex-direction: column; font-size: 10px; max-height: 52vh; }
#wt-chantier .ongles { display: flex; gap: 3px; padding: 8px 10px 0; flex-wrap: wrap; }
#wt-chantier .ong { cursor: pointer; padding: 6px 8px; font-family: inherit; font-size: 8px; font-weight: 700; letter-spacing: 1px; border-radius: 7px 7px 0 0; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-bottom: none; color: rgba(232,234,237,0.7); }
#wt-chantier .ong.actif { background: rgba(0,212,255,0.12); border-color: #00d4ff; color: #00d4ff; }
#wt-chantier .page { overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 7px; border-top: 1px solid rgba(0,212,255,0.25); }
#wt-chantier .c-btn { cursor: pointer; padding: 8px 10px; border-radius: 8px; font-family: inherit; font-size: 9px; font-weight: 700; letter-spacing: 1px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.4); color: #00d4ff; }
#wt-chantier .c-btn.actif { background: rgba(67,209,122,0.15); border-color: #43d17a; color: #43d17a; }
#wt-chantier .statut { color: rgba(232,234,237,0.55); line-height: 1.6; font-size: 9px; }
#wt-chantier input, #wt-chantier select { padding: 7px 9px; background: rgba(0,0,0,0.45); color: inherit; border-radius: 7px; border: 1px solid rgba(255,255,255,0.12); font-family: inherit; font-size: 10px; outline: none; }
#wt-chantier input:focus { border-color: #00d4ff; }
#wt-chantier input[type=range] { width: 100%; accent-color: #00d4ff; padding: 0; }
#wt-chantier .ligne { display: flex; gap: 6px; align-items: center; padding: 6px 8px; border-radius: 7px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); line-height: 1.45; }
#wt-chantier .ligne.clic { cursor: pointer; width: 100%; text-align: left; color: inherit; font-family: inherit; font-size: 9.5px; }
#wt-chantier .ligne.clic:hover { border-color: #00d4ff; }
#wt-chantier .ligne .sup { cursor: pointer; margin-left: auto; background: none; border: none; color: #f08a8a; font-family: inherit; }
#wt-chantier .adequat { font-size: 13px; margin-left: auto; }
#wt-chantier .depot { border: 2px dashed rgba(0,212,255,0.4); border-radius: 10px; padding: 16px 10px; text-align: center; color: rgba(232,234,237,0.55); cursor: pointer; }
#wt-chantier .depot.survol { background: rgba(0,212,255,0.08); border-color: #00d4ff; }
#wt-chantier .jauge { height: 7px; border-radius: 4px; background: rgba(255,255,255,0.09); overflow: hidden; }
#wt-chantier .jauge i { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg,#00d4ff,#43d17a); }
#wt-chantier .date { text-align: center; color: #00d4ff; font-weight: 700; letter-spacing: 1px; }
/* fiche focus marché */
#wt-marche-focus { position: fixed; inset: 0; z-index: 2700; display: flex; align-items: center; justify-content: center; background: rgba(4,7,12,0.65); font-family: var(--font-mono, monospace); }
#wt-marche-focus .boite { width: min(520px, 94vw); max-height: 78vh; overflow-y: auto; padding: 16px 18px; background: rgba(8,12,20,0.95); border: 1px solid #00d4ff; border-radius: 14px; color: #e8eaed; font-size: 10px; line-height: 1.7; }
#wt-marche-focus .titre { font-size: 12px; font-weight: 800; margin-bottom: 8px; }
#wt-marche-focus .k { color: rgba(232,234,237,0.5); letter-spacing: 1px; font-size: 8px; }
#wt-marche-focus .actions { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
#wt-marche-focus .actions > * { cursor: pointer; padding: 8px 11px; font-family: inherit; font-size: 9px; font-weight: 700; border-radius: 8px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.45); color: #00d4ff; text-decoration: none; }
`;

const jour = 86400000;
const fmtDate = (t) => new Date(t).toLocaleDateString('fr-FR');
const fmtEuro = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`;

const lireJson = (k, defaut) => { try { return JSON.parse(window.localStorage.getItem(k)) ?? defaut; } catch { return defaut; } };
const ecrireJson = (k, v) => { try { window.localStorage.setItem(k, JSON.stringify(v)); } catch { /* plein */ } };

/** Phases types d'un chantier (part budget / part durée) + ressources benchmark. */
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
  viewer.dataSources.add(ds);

  let zones = lireJson(STORE_ZONES, []);
  let projets = lireJson(STORE_PROJETS, []);
  let docs = lireJson(STORE_DOCS, {});
  let dessin = null; let suiviId = null; let marqueurEngin = null; let dateCourante = Date.now();

  const el = document.createElement('div');
  el.id = 'wt-chantier';
  el.innerHTML = `
    <div class="ongles">
      <button class="ong actif" data-p="prospection" type="button">🔍 PROSPECTION</button>
      <button class="ong" data-p="dossier" type="button">📂 DOSSIER</button>
      <button class="ong" data-p="phasage" type="button">🗓 PHASAGE</button>
      <button class="ong" data-p="simulation" type="button">▶ SIMULATION</button>
      <button class="ong" data-p="suivi" type="button">🚜 SUIVI</button>
    </div>
    <div class="page"></div>`;
  const page = el.querySelector('.page');

  // ═════════ 1 · PROSPECTION (BOAMP réel) ═════════
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
        <div><span class="k">PARUTION</span> ${f.dateparution || '—'} · <span class="k">LIMITE DE RÉPONSE</span> ${f.datelimitereponse || f.date_limite_reponse || '—'}</div>
        <div><span class="k">TYPE</span> ${f.famille || f.type_marche || f.nature || '—'} · <span class="k">DÉPT</span> ${f.code_departement || f.dc || '—'}</div>
        <div><span class="k">BUDGET</span> ${f.montant ? fmtEuro(Number(f.montant)) : 'non publié (voir DCE)'}</div>
        <div><span class="k">ADÉQUATION AVEC TES RESSOURCES</span> <span style="font-size:14px">${ad}</span> ${adTxt}</div>
        <div style="margin-top:6px;color:rgba(232,234,237,0.55)">Documentation (DCE : règlement, plans, DUDG/DICT le cas échéant) :
        téléchargeable via l'avis officiel ci-dessous, puis dépose les fichiers dans l'onglet 📂 DOSSIER pour tout centraliser ici.</div>
        <div class="actions">
          <a href="${lien}" target="_blank" rel="noopener">📄 AVIS OFFICIEL + DCE ↗</a>
          <button class="ajouter" type="button">📌 AJOUTER À MES PROJETS</button>
          <button class="fermer" type="button" style="border-color:rgba(255,255,255,0.2);color:rgba(232,234,237,0.6)">FERMER</button>
        </div>
      </div>`;
    document.body.appendChild(focus);
    focus.querySelector('.fermer').addEventListener('click', () => focus.remove());
    focus.addEventListener('click', (e) => { if (e.target === focus) focus.remove(); });
    focus.querySelector('.ajouter').addEventListener('click', () => {
      projets.push({ nom: String(objet).slice(0, 80), source: 'BOAMP', date: Date.now() });
      ecrireJson(STORE_PROJETS, projets);
      focus.remove();
      rendrePage('dossier');
    });
  }

  async function prospecter(zone) {
    const statut = page.querySelector('.statut');
    statut.textContent = '🛰 Localisation de la commune visée…';
    const liste = page.querySelector('.resultats');
    liste.innerHTML = '';
    try {
      const c = viewer.camera.positionCartographic;
      const lat = Cesium.Math.toDegrees(c.latitude);
      const lon = Cesium.Math.toDegrees(c.longitude);
      const commune = await fetch(`https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,codeDepartement`).then((r) => r.json()).then((d) => d?.[0]);
      if (!commune) { statut.textContent = '⚠ Zone hors France — BOAMP couvre les marchés publics français.'; return; }
      const q = zone === 'commune' ? commune.nom : '';
      const filtreDept = zone === 'commune' ? '' : `&refine.code_departement=${commune.codeDepartement}`;
      statut.textContent = `🔍 Marchés publics — ${zone === 'commune' ? commune.nom : `département ${commune.codeDepartement}`}…`;
      const r = await fetch(`https://boamp-datadila.opendatasoft.com/api/records/1.0/search/?dataset=boamp&q=${encodeURIComponent(q)}&rows=15&sort=dateparution${filtreDept}`);
      const d = await r.json();
      const recs = d?.records || [];
      statut.textContent = recs.length
        ? `📋 ${recs.length} avis BOAMP (source officielle DILA, gratuite) — clic = fiche focus :`
        : 'Aucun avis récent trouvé. Élargis à « département » ou vise une autre commune.';
      const [ad] = adequation();
      for (const rec of recs) {
        const f = rec.fields || {};
        const objet = f.objet || f.objet_complet || 'Avis de marché';
        const b = document.createElement('button');
        b.className = 'ligne clic';
        b.innerHTML = `<span>📋</span><span>${String(objet).slice(0, 90)}…<br>
          <small style="color:rgba(232,234,237,0.5)">${(f.nomacheteur || f.acheteur || '').slice(0, 50)} · ${f.dateparution || ''}</small></span>
          <span class="adequat" title="adéquation planning (profil INTEL)">${ad}</span>`;
        b.addEventListener('click', () => ficheMarche(f));
        liste.appendChild(b);
      }
    } catch { statut.textContent = '⚠ BOAMP injoignable — réessaie dans quelques secondes.'; }
  }

  // ═════════ pages ═════════
  function rendrePage(p) {
    el.querySelectorAll('.ong').forEach((o) => o.classList.toggle('actif', o.dataset.p === p));
    page.innerHTML = '';

    if (p === 'prospection') {
      page.innerHTML = `
        <div class="statut">🎯 Vise ta commune sur la carte (ou reste où tu es), choisis la zone de recherche,
        et lance : avis de marchés publics RÉELS (BOAMP · DILA · gratuit, sans clé). La flèche colorée
        indique l'adéquation avec ta capacité (onglet PROFIL du mode INTEL).</div>
        <div style="display:flex;gap:6px">
          <select class="zone" style="flex:1"><option value="commune">📍 Ma commune (vue actuelle)</option>
          <option value="departement">🗺 Tout le département</option></select>
          <button class="c-btn lancer" type="button">🔍 CHERCHER</button>
        </div>
        <div class="resultats" style="display:flex;flex-direction:column;gap:4px"></div>`;
      page.querySelector('.lancer').addEventListener('click', () => prospecter(page.querySelector('.zone').value));
    }

    if (p === 'dossier') {
      page.innerHTML = `
        <div class="statut">📂 Mes projets & documents (DICT, DUDG, plans, devis…). Glisse-dépose les
        fichiers : stockés en LOCAL sur ton appareil, aperçu et téléchargement à la demande.</div>
        <div style="display:flex;gap:6px">
          <input class="np" placeholder="Nouveau projet (nom)" style="flex:1" />
          <button class="c-btn cp" type="button">➕</button>
        </div>
        <div class="lprojets" style="display:flex;flex-direction:column;gap:4px"></div>`;
      const lp = page.querySelector('.lprojets');
      const rendreProjets = () => {
        lp.innerHTML = '';
        if (!projets.length) lp.innerHTML = '<div class="statut">Aucun projet — ajoute-en un, ou 📌 depuis la PROSPECTION.</div>';
        projets.forEach((pr, i) => {
          const bloc = document.createElement('div');
          bloc.style.cssText = 'border:1px solid rgba(0,212,255,0.25);border-radius:9px;padding:7px 9px;display:flex;flex-direction:column;gap:5px';
          const fichiers = docs[pr.nom] || [];
          bloc.innerHTML = `
            <div style="display:flex;gap:6px;align-items:center"><b>🏗 ${pr.nom}</b>
            <small style="color:rgba(232,234,237,0.45)">${pr.source || 'manuel'}</small>
            <button class="sup" style="cursor:pointer;margin-left:auto;background:none;border:none;color:#f08a8a;font-family:inherit">✕</button></div>
            <div class="depot">📥 Glisser-déposer des fichiers ici (ou cliquer)</div>
            <input type="file" multiple style="display:none" />
            <div class="fl" style="display:flex;flex-direction:column;gap:3px"></div>`;
          const fl = bloc.querySelector('.fl');
          const rendreFichiers = () => {
            fl.innerHTML = '';
            for (const [j, fi] of (docs[pr.nom] || []).entries()) {
              const l = document.createElement('div');
              l.className = 'ligne';
              l.innerHTML = `<span>${fi.type?.startsWith('image') ? '🖼' : fi.type?.includes('pdf') ? '📄' : '📎'}</span>
                <span>${fi.nom} <small style="color:rgba(232,234,237,0.4)">${(fi.taille / 1024).toFixed(0)} Ko</small></span>
                ${fi.data ? '<a class="dl" style="cursor:pointer;color:#00d4ff;margin-left:auto">⬇</a>' : '<small style="margin-left:auto;color:rgba(232,234,237,0.4)">méta seule (trop gros)</small>'}
                <button class="supf" style="cursor:pointer;background:none;border:none;color:#f08a8a;font-family:inherit">✕</button>`;
              l.querySelector('.dl')?.addEventListener('click', () => {
                const a = document.createElement('a'); a.href = fi.data; a.download = fi.nom; a.click();
              });
              l.querySelector('.supf').addEventListener('click', () => {
                docs[pr.nom].splice(j, 1); ecrireJson(STORE_DOCS, docs); rendreFichiers();
              });
              fl.appendChild(l);
            }
          };
          rendreFichiers();
          const depot = bloc.querySelector('.depot');
          const inputF = bloc.querySelector('input[type=file]');
          const ajouterFichiers = (files) => {
            for (const f of files) {
              const meta = { nom: f.name, type: f.type, taille: f.size };
              docs[pr.nom] = docs[pr.nom] || [];
              if (f.size < 900 * 1024) {
                const lecteur = new FileReader();
                lecteur.onload = () => {
                  meta.data = lecteur.result;
                  ecrireJson(STORE_DOCS, docs);
                  rendreFichiers();
                };
                lecteur.readAsDataURL(f);
                docs[pr.nom].push(meta);
              } else { docs[pr.nom].push(meta); }
            }
            ecrireJson(STORE_DOCS, docs);
            rendreFichiers();
          };
          depot.addEventListener('click', () => inputF.click());
          inputF.addEventListener('change', () => ajouterFichiers(inputF.files));
          depot.addEventListener('dragover', (e) => { e.preventDefault(); depot.classList.add('survol'); });
          depot.addEventListener('dragleave', () => depot.classList.remove('survol'));
          depot.addEventListener('drop', (e) => {
            e.preventDefault(); depot.classList.remove('survol');
            ajouterFichiers(e.dataTransfer.files);
          });
          bloc.querySelector('.sup').addEventListener('click', () => {
            projets.splice(i, 1); ecrireJson(STORE_PROJETS, projets); rendreProjets();
          });
          lp.appendChild(bloc);
        });
      };
      rendreProjets();
      page.querySelector('.cp').addEventListener('click', () => {
        const nom = page.querySelector('.np').value.trim();
        if (!nom) return;
        projets.push({ nom, source: 'manuel', date: Date.now() });
        ecrireJson(STORE_PROJETS, projets);
        page.querySelector('.np').value = '';
        rendreProjets();
      });
    }

    if (p === 'phasage') {
      page.innerHTML = `
        <button class="c-btn nouv" type="button">➕ NOUVELLE ZONE (clics sur la carte)</button>
        <button class="c-btn fin" type="button" style="display:none">✔ TERMINER LA ZONE</button>
        <div class="forme" style="display:none;flex-direction:column;gap:5px">
          <input class="f-nom" placeholder="Nom de la zone (ex : Terrassement lot A)" />
          <input class="f-debut" type="date" /><input class="f-fin" type="date" />
          <button class="c-btn sauver" type="button">💾 ENREGISTRER LA ZONE</button>
        </div>
        <input type="range" min="0" max="100" value="50" /><div class="date">—</div>
        <div class="liste" style="display:flex;flex-direction:column;gap:4px"></div>
        <div class="statut">Curseur 4D : gris = à venir · orange = en cours · vert = terminé.</div>`;
      const curseur = page.querySelector('input[type=range]');
      const majTemps = () => {
        const t0 = zones.length ? Math.min(...zones.map((z) => z.debut)) - 5 * jour : Date.now() - 15 * jour;
        const t1 = zones.length ? Math.max(...zones.map((z) => z.fin)) + 5 * jour : Date.now() + 45 * jour;
        dateCourante = t0 + ((t1 - t0) * Number(curseur.value)) / 100;
        page.querySelector('.date').textContent = `📅 ${fmtDate(dateCourante)}`;
        redessinerZones();
        const liste = page.querySelector('.liste');
        liste.innerHTML = '';
        for (const z of zones) {
          const etat = dateCourante < z.debut ? '⏳ à venir' : dateCourante > z.fin ? '✅ terminé' : '🚧 en cours';
          const l = document.createElement('div');
          l.className = 'ligne';
          l.innerHTML = `<span>🏗</span><span>${z.nom}<br><small style="color:rgba(232,234,237,0.5)">${fmtDate(z.debut)} → ${fmtDate(z.fin)} · ${etat}</small></span>
            <button class="sup">✕</button>`;
          l.querySelector('.sup').addEventListener('click', () => {
            zones = zones.filter((x) => x !== z); ecrireJson(STORE_ZONES, zones); majTemps();
          });
          liste.appendChild(l);
        }
      };
      curseur.addEventListener('input', majTemps);
      page.querySelector('.nouv').addEventListener('click', () => {
        dessin = { coords: [] };
        window.__wtDessin = true;
        page.querySelector('.nouv').style.display = 'none';
        page.querySelector('.fin').style.display = '';
        page.querySelector('.statut').textContent = '🖊 Clique sur la carte pour poser les sommets.';
      });
      page.querySelector('.fin').addEventListener('click', () => {
        if (!dessin || dessin.coords.length < 6) { page.querySelector('.statut').textContent = '⚠ Minimum 3 sommets.'; return; }
        page.querySelector('.fin').style.display = 'none';
        const forme = page.querySelector('.forme');
        forme.style.display = 'flex';
        const auj = new Date();
        page.querySelector('.f-debut').value = auj.toISOString().slice(0, 10);
        page.querySelector('.f-fin').value = new Date(auj.getTime() + 30 * jour).toISOString().slice(0, 10);
      });
      page.querySelector('.sauver').addEventListener('click', () => {
        const nom = page.querySelector('.f-nom').value.trim() || `Zone ${zones.length + 1}`;
        const debut = new Date(page.querySelector('.f-debut').value || Date.now()).getTime();
        const fin = new Date(page.querySelector('.f-fin').value || Date.now() + 30 * jour).getTime();
        zones.push({ nom, debut, fin: Math.max(fin, debut + jour), coords: dessin.coords });
        ecrireJson(STORE_ZONES, zones);
        dessin = null; window.__wtDessin = false;
        page.querySelector('.forme').style.display = 'none';
        page.querySelector('.nouv').style.display = '';
        majTemps();
      });
      majTemps();
    }

    if (p === 'simulation') {
      page.innerHTML = `
        <div class="statut">▶ Timelapse d'un chantier type (ex : parking-passerelle devant le cinéma) —
        phases inférées par méthodologie de conduite de travaux, budget consommé jour par jour,
        ressources et benchmark location/achat. Règle budget & durée puis déplace le curseur.</div>
        <div style="display:flex;gap:6px">
          <input class="s-budget" type="number" value="850000" title="Budget total (€)" style="flex:1" />
          <input class="s-duree" type="number" value="120" title="Durée (jours)" style="width:70px" />
        </div>
        <input type="range" min="0" max="100" value="25" />
        <div class="date">—</div>
        <div class="s-phase" style="font-weight:700;color:#00d4ff"></div>
        <div class="jauge"><i></i></div>
        <div class="s-budgetl"></div>
        <div class="s-res" style="display:flex;flex-direction:column;gap:3px"></div>
        <div class="statut">📡 Le suivi par imagerie satellite récente : gratuit via Sentinel-2 (compte
        Copernicus gratuit, ~tous les 5 jours, 10 m) — couple-le avec 🏙 BÂTI 3D et le fond IGN Ortho
        pour comparer prévu/réel et affûter la logistique.</div>`;
      const maj = () => {
        const budget = Number(page.querySelector('.s-budget').value) || 850000;
        const duree = Number(page.querySelector('.s-duree').value) || 120;
        const pct = Number(page.querySelector('input[type=range]').value) / 100;
        const jr = Math.round(duree * pct);
        // phase courante + budget cumulé (aléa météo : +4 % après mi-chantier)
        let cumD = 0; let cumB = 0; let phase = PHASES[0]; let debutPhase = 0;
        for (const ph of PHASES) {
          if (pct <= cumD + ph.d || ph === PHASES[PHASES.length - 1]) { phase = ph; debutPhase = cumD; break; }
          cumD += ph.d; cumB += ph.b;
        }
        const avancePhase = Math.min(1, Math.max(0, (pct - debutPhase) / phase.d));
        const alea = pct > 0.5 ? 1.04 : 1;
        const depense = (cumB + phase.b * avancePhase) * budget * alea;
        page.querySelector('.date').textContent = `📅 JOUR ${jr} / ${duree}`;
        page.querySelector('.s-phase').textContent = `⛏ PHASE : ${phase.nom} (${Math.round(avancePhase * 100)} %)`;
        page.querySelector('.jauge i').style.width = `${Math.round(pct * 100)}%`;
        page.querySelector('.s-budgetl').innerHTML = `💶 Budget consommé : <b>${fmtEuro(depense)}</b> / ${fmtEuro(budget)}
          ${alea > 1 ? ' <span style="color:#f0a63c">(+4 % aléas météo/retards intégrés)</span>' : ''}`;
        const res = page.querySelector('.s-res');
        res.innerHTML = '<div class="statut">Ressources mobilisées (clic = fiche coût) :</div>';
        for (const [nomR, n, cout, unite] of phase.res) {
          const l = document.createElement('button');
          l.className = 'ligne clic';
          l.innerHTML = `<span>${nomR}</span><span style="margin-left:auto">× ${n} · ${fmtEuro(cout)}/${unite.split(' ')[0]}</span>`;
          l.addEventListener('click', () => {
            const joursPhase = Math.round(duree * phase.d);
            window.alert(`${nomR}\n\nQuantité : ${n}\nCoût unitaire : ${fmtEuro(cout)} / ${unite}\nDurée de la phase : ~${joursPhase} j\nCoût phase : ${fmtEuro(n * cout * (unite.startsWith('jour') ? joursPhase : 1))}\n\nBenchmark : la location est rentable sous ~120 j/an d'utilisation ; au-delà, étudier l'achat (voir mention « achat ≈ » si dispo). Vue 3D du modèle : active 🏙 BÂTI 3D et zoome sur le chantier.`);
          });
          res.appendChild(l);
        }
      };
      page.querySelector('input[type=range]').addEventListener('input', maj);
      page.querySelector('.s-budget').addEventListener('input', maj);
      page.querySelector('.s-duree').addEventListener('input', maj);
      maj();
    }

    if (p === 'suivi') {
      page.innerHTML = `
        <button class="c-btn engin" type="button">🚜 SUIVRE MA POSITION (ENGIN GPS)</button>
        <div class="statut">Ton appareil devient l'engin n°1, suivi en direct sur la carte (partage de
        localisation gratuit). Multi-engins : boîtiers GPS + serveur Traccar open source (feuille de route).</div>`;
      const btnEngin = page.querySelector('.engin');
      btnEngin.classList.toggle('actif', suiviId != null);
      if (suiviId != null) btnEngin.textContent = '⏹ ARRÊTER LE SUIVI';
      btnEngin.addEventListener('click', () => {
        if (suiviId != null) {
          navigator.geolocation.clearWatch(suiviId); suiviId = null;
          btnEngin.classList.remove('actif');
          btnEngin.textContent = '🚜 SUIVRE MA POSITION (ENGIN GPS)';
          if (marqueurEngin) { ds.entities.remove(marqueurEngin); marqueurEngin = null; }
          return;
        }
        if (!navigator.geolocation) return;
        suiviId = navigator.geolocation.watchPosition((pos) => {
          const pt = Cesium.Cartesian3.fromDegrees(pos.coords.longitude, pos.coords.latitude);
          if (!marqueurEngin) {
            marqueurEngin = ds.entities.add({
              position: pt,
              point: { pixelSize: 11, color: Cesium.Color.YELLOW, outlineColor: Cesium.Color.BLACK, outlineWidth: 2, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND },
              label: { text: '🚜 ENGIN 1 (moi)', font: '12px JetBrains Mono, monospace', fillColor: Cesium.Color.YELLOW, showBackground: true, pixelOffset: new Cesium.Cartesian2(0, -18), heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Infinity },
            });
          } else marqueurEngin.position = pt;
        }, () => {}, { enableHighAccuracy: true, maximumAge: 3000 });
        btnEngin.classList.add('actif');
        btnEngin.textContent = '⏹ ARRÊTER LE SUIVI';
      });
    }
  }

  function redessinerZones() {
    // conserve le marqueur engin, redessine les zones
    const garder = marqueurEngin;
    ds.entities.removeAll();
    if (garder) { marqueurEngin = ds.entities.add(garder); }
    for (const z of zones) {
      const coul = dateCourante < z.debut ? Cesium.Color.fromCssColorString('#8a8f98').withAlpha(0.45)
        : dateCourante > z.fin ? Cesium.Color.fromCssColorString('#43d17a').withAlpha(0.55)
          : Cesium.Color.fromCssColorString('#f0a63c').withAlpha(0.6);
      ds.entities.add({
        polygon: { hierarchy: Cesium.Cartesian3.fromDegreesArray(z.coords), material: coul, outline: true, outlineColor: Cesium.Color.WHITE.withAlpha(0.5), heightReference: Cesium.HeightReference.CLAMP_TO_GROUND },
      });
    }
  }

  // clics de dessin (partagé avec l'onglet PHASAGE)
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((click) => {
    if (!dessin) return;
    const cart = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
    if (!cart) return;
    const c = Cesium.Cartographic.fromCartesian(cart);
    const lo = Cesium.Math.toDegrees(c.longitude);
    const la = Cesium.Math.toDegrees(c.latitude);
    dessin.coords.push(lo, la);
    ds.entities.add({ position: Cesium.Cartesian3.fromDegrees(lo, la), point: { pixelSize: 7, color: Cesium.Color.ORANGE, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND } });
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  for (const o of el.querySelectorAll('.ong')) o.addEventListener('click', () => rendrePage(o.dataset.p));
  rendrePage('prospection');
  redessinerZones();

  return { element: el };
}
