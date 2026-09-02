/**
 * WATCHTOWER — MODE INTEL « JUMEAU NUMÉRIQUE » (remplace le HUD intel d'origine).
 *
 * Reproduit la présentation de la maquette de référence :
 *   — bandeau supérieur de KPI : POPULATION · CAPITAL HUMAIN · BONHEUR ·
 *     ÉCONOMIE (étoiles) · RÉSILIENCE · ÉDUCATION · INNOVATION ;
 *   — panneau gauche « CIVILISATION TERRITORIALE » : catégories avec niveaux ;
 *   — panneau droit « CONTEXT PANEL » : population, activité économique,
 *     compétences clés, histogramme, matrice causale.
 *
 * Les indices sont CALCULÉS EN DIRECT à partir de données ouvertes gratuites :
 * population réelle (geo.api.gouv.fr) et densités d'équipements OpenStreetMap
 * (écoles, santé, commerces, services publics, espaces verts) autour du centre
 * de la vue. Sans clé.
 */

import * as Cesium from 'cesium';

const CSS = `
#wt-intel { position: fixed; inset: 0; z-index: 920; pointer-events: none; font-family: var(--font-mono, monospace); color: #e8eaed; }
#wt-intel > * { pointer-events: auto; }
.wti-glass {
  background: linear-gradient(180deg, rgba(14,20,28,0.92), rgba(10,14,22,0.88));
  border: 1px solid rgba(120, 200, 190, 0.22); border-radius: 14px;
  backdrop-filter: blur(10px); box-shadow: 0 6px 24px rgba(0,0,0,0.4);
}
/* ── bandeau KPI ── */
#wti-haut {
  position: absolute; top: 0; left: 0; right: 0; height: 56px;
  display: flex; align-items: stretch; gap: 0; padding: 6px 12px;
  background: linear-gradient(180deg, rgba(8,12,18,0.95), rgba(8,12,18,0.82));
  border-bottom: 1px solid rgba(120,200,190,0.2);
}
#wti-haut .marque { display: flex; align-items: center; gap: 9px; padding-right: 16px; min-width: 220px; }
#wti-haut .marque .cerveau { width: 34px; height: 34px; border-radius: 50%; background: rgba(120,200,190,0.12); border: 1px solid rgba(120,200,190,0.4); display: flex; align-items: center; justify-content: center; font-size: 16px; }
#wti-haut .marque .t1 { font-size: 12px; font-weight: 800; letter-spacing: 1px; }
#wti-haut .marque .t2 { font-size: 8px; color: rgba(232,234,237,0.5); letter-spacing: 1px; }
#wti-haut .kpis { flex: 1; display: flex; align-items: stretch; justify-content: space-evenly; gap: 4px; }
.wti-kpi { display: flex; flex-direction: column; justify-content: center; padding: 2px 12px; border-left: 1px solid rgba(255,255,255,0.07); min-width: 96px; }
.wti-kpi .k { font-size: 8px; letter-spacing: 1px; color: rgba(232,234,237,0.6); display: flex; gap: 5px; align-items: center; }
.wti-kpi .v { font-size: 15px; font-weight: 800; display: flex; gap: 6px; align-items: baseline; }
.wti-kpi .v .fleche { font-size: 11px; }
.wti-kpi .barre { height: 3px; border-radius: 2px; background: rgba(255,255,255,0.09); margin-top: 3px; overflow: hidden; }
.wti-kpi .barre i { display: block; height: 100%; border-radius: 2px; }
.haut { color: #43d17a; } .plat { color: #e8c04a; } .bas { color: #f07a6a; }
/* ── panneau gauche ── */
#wti-gauche { position: absolute; top: 66px; left: 12px; width: 240px; padding: 12px; }
#wti-gauche .titre { font-size: 9px; letter-spacing: 3px; color: #7dd3c8; margin-bottom: 10px; }
.wti-cat { border: 1px solid rgba(120,200,190,0.2); border-radius: 11px; padding: 8px 10px; margin-bottom: 8px; background: rgba(255,255,255,0.025); }
.wti-cat .lg { display: flex; gap: 7px; align-items: center; font-size: 10.5px; font-weight: 700; }
.wti-cat .lg .ic { font-size: 13px; }
.wti-cat .niv { display: flex; gap: 7px; align-items: center; margin-top: 6px; font-size: 8px; color: rgba(232,234,237,0.55); letter-spacing: 1px; }
.wti-cat .niv .barre { flex: 1; height: 5px; border-radius: 3px; background: rgba(255,255,255,0.09); overflow: hidden; }
.wti-cat .niv .barre i { display: block; height: 100%; border-radius: 3px; background: linear-gradient(90deg, #37b7ab, #7de8b0); }
/* ── panneau droit ── */
#wti-droit { position: absolute; top: 66px; right: 12px; width: 264px; padding: 12px; max-height: calc(100vh - 200px); overflow-y: auto; }
#wti-droit .titre { font-size: 9px; letter-spacing: 3px; color: #7dd3c8; margin-bottom: 8px; display: flex; justify-content: space-between; }
#wti-droit .pop { font-size: 20px; font-weight: 800; }
#wti-droit .sous { font-size: 8px; letter-spacing: 1.5px; color: rgba(232,234,237,0.55); margin: 10px 0 4px; }
#wti-droit .jauge { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.09); overflow: hidden; margin: 3px 0 2px; }
#wti-droit .jauge i { display: block; height: 100%; border-radius: 3px; }
#wti-droit canvas { width: 100%; border-radius: 8px; background: rgba(255,255,255,0.03); margin-top: 4px; }
#wti-droit .skill { display: flex; align-items: center; gap: 7px; font-size: 9px; margin: 3px 0; }
#wti-droit .skill .barre { flex: 1; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.09); overflow: hidden; }
#wti-droit .skill .barre i { display: block; height: 100%; }
#wti-analyser {
  position: absolute; top: 66px; left: 50%; transform: translateX(-50%);
  cursor: pointer; padding: 8px 16px; font-family: inherit; font-size: 9px;
  font-weight: 700; letter-spacing: 2px; color: #7dd3c8; border-radius: 9px;
  background: rgba(14,20,28,0.9); border: 1px solid rgba(120,200,190,0.4);
}
#wti-analyser:hover { background: rgba(120,200,190,0.12); }
#wt-intel .note { font-size: 7.5px; color: rgba(232,234,237,0.35); line-height: 1.5; margin-top: 8px; }
`;

async function overpass(req) {
  const r = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(`[out:json][timeout:25];${req}`)}`,
  });
  return (await r.json())?.elements || [];
}

const fleche = (v) => (v >= 60 ? ['↑', 'haut'] : v >= 40 ? ['→', 'plat'] : ['↓', 'bas']);
const cbar = (v) => (v >= 60 ? '#43d17a' : v >= 40 ? '#e8c04a' : '#f07a6a');

export function initIntelTwin(viewer) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // remplace TOTALEMENT le HUD intel d'origine
  document.getElementById('intel-hud')?.style.setProperty('display', 'none', 'important');

  const root = document.createElement('div');
  root.id = 'wt-intel';
  root.classList.add('wt-dock-cache'); // replié par défaut, ouvert via le dock
  root.innerHTML = `
    <div id="wti-haut">
      <div class="marque">
        <div class="cerveau">🧠</div>
        <div><div class="t1">— DIGITAL TWIN</div><div class="t2">Living Digital, France</div></div>
      </div>
      <div class="kpis"></div>
    </div>
    <button id="wti-analyser" type="button">⟳ ANALYSER LA VUE</button>
    <div id="wti-gauche" class="wti-glass">
      <div class="titre">CIVILISATION TERRITORIALE</div>
      <div class="cats"></div>
      <div class="note">Indices calculés en direct depuis les données ouvertes
      (population INSEE via geo.gouv.fr · densités d'équipements OpenStreetMap,
      rayon 1,2 km). Gratuit, sans clé.</div>
    </div>
    <div id="wti-droit" class="wti-glass">
      <div class="titre"><span>CONTEXT PANEL</span><span style="color:#43d17a">TRENDS ↗</span></div>
      <div class="sous">POPULATION</div>
      <div class="pop">—</div>
      <div class="sous">ACTIVITÉ ÉCONOMIQUE</div>
      <div class="jauge eco"><i style="background:linear-gradient(90deg,#37b7ab,#7de8b0)"></i></div>
      <div class="sous">COMPÉTENCES CLÉS</div>
      <div class="skills"></div>
      <div class="sous">ÉQUIPEMENTS PAR CATÉGORIE</div>
      <canvas class="histo" width="240" height="90"></canvas>
      <div class="sous">CAUSAL MATRIX</div>
      <canvas class="matrice" width="240" height="110"></canvas>
    </div>`;
  document.body.appendChild(root);

  const zoneKpis = root.querySelector('.kpis');
  const zoneCats = root.querySelector('.cats');

  function rendreKpis(kpis) {
    zoneKpis.innerHTML = '';
    for (const k of kpis) {
      const [f, cl] = k.etoiles ? ['→', 'plat'] : fleche(k.val);
      const d = document.createElement('div');
      d.className = 'wti-kpi';
      d.innerHTML = `
        <div class="k">${k.ic} ${k.nom}</div>
        <div class="v">${k.etoiles ? '★'.repeat(k.etoiles) + '☆'.repeat(5 - k.etoiles) : k.texte || `${k.val}%`}
          <span class="fleche ${cl}">${f}</span></div>
        <div class="barre"><i style="width:${k.etoiles ? k.etoiles * 20 : Math.min(100, k.val)}%;background:${cbar(k.etoiles ? k.etoiles * 20 : k.val)}"></i></div>`;
      zoneKpis.appendChild(d);
    }
  }

  function rendreCats(cats) {
    zoneCats.innerHTML = '';
    for (const c of cats) {
      const d = document.createElement('div');
      d.className = 'wti-cat';
      d.innerHTML = `
        <div class="lg"><span class="ic">${c.ic}</span>${c.nom}</div>
        <div class="niv">NIVEAU ${Math.max(1, Math.ceil(c.val / 25))}
          <div class="barre"><i style="width:${Math.min(100, c.val)}%"></i></div></div>`;
      zoneCats.appendChild(d);
    }
  }

  function rendreHisto(canvas, series) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const max = Math.max(1, ...series.map((s) => s.n));
    const lb = canvas.width / series.length;
    series.forEach((s, i) => {
      const h = Math.max(3, (s.n / max) * 58);
      ctx.fillStyle = s.c;
      ctx.fillRect(i * lb + 8, 68 - h, lb - 16, h);
      ctx.fillStyle = 'rgba(232,234,237,0.7)';
      ctx.font = '9px monospace'; ctx.textAlign = 'center';
      ctx.fillText(String(s.n), i * lb + lb / 2, 66 - h);
      ctx.fillText(s.l, i * lb + lb / 2, 82);
    });
  }

  function rendreMatrice(canvas, scores) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const noms = ['Écologie', 'Économie', 'Éducation', 'Santé', 'Services'];
    const cols = ['#43d17a', '#e8c04a', '#37b7ab', '#c084fc', '#f0a63c'];
    const g = noms.map((_, i) => ({ x: 78, y: 16 + i * 20 }));
    const dte = noms.map((_, i) => ({ x: 190, y: 16 + i * 20 }));
    for (let i = 0; i < noms.length; i += 1) {
      for (let j = 0; j < noms.length; j += 1) {
        if ((i + j + scores[i]) % 3 !== 0) continue;
        ctx.strokeStyle = `${cols[i]}55`;
        ctx.beginPath(); ctx.moveTo(g[i].x + 5, g[i].y); ctx.lineTo(dte[j].x - 5, dte[j].y); ctx.stroke();
      }
    }
    noms.forEach((n, i) => {
      ctx.fillStyle = cols[i];
      ctx.beginPath(); ctx.arc(g[i].x, g[i].y, 4, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(dte[i].x, dte[i].y, 4, 0, 7); ctx.fill();
      ctx.font = '8px monospace'; ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(232,234,237,0.75)';
      ctx.fillText(n, g[i].x - 9, g[i].y + 3);
    });
  }

  let analyseEnCours = false;
  async function analyser() {
    if (analyseEnCours) return;
    analyseEnCours = true;
    const btn = root.querySelector('#wti-analyser');
    btn.textContent = '⟳ ANALYSE…';
    try {
      const c = viewer.camera.positionCartographic;
      const lat = Cesium.Math.toDegrees(c.latitude);
      const lon = Cesium.Math.toDegrees(c.longitude);

      const [commune, elements] = await Promise.all([
        fetch(`https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,population,codesPostaux`).then((r) => r.json()).then((d) => d?.[0]).catch(() => null),
        overpass(`(
          node(around:1200,${lat},${lon})[amenity~"school|college|kindergarten|university"];
          node(around:1200,${lat},${lon})[amenity~"hospital|pharmacy|doctors|clinic"];
          node(around:1200,${lat},${lon})[shop];
          node(around:1200,${lat},${lon})[amenity~"townhall|police|fire_station|post_office|library|community_centre"];
          node(around:1200,${lat},${lon})[leisure~"park|garden|playground|sports_centre"];
        );out tags 500;`).catch(() => []),
      ]);

      let ecoles = 0; let sante = 0; let commerces = 0; let services = 0; let vert = 0;
      for (const e of elements) {
        const t = e.tags || {};
        if (/school|college|kindergarten|university/.test(t.amenity || '')) ecoles += 1;
        else if (/hospital|pharmacy|doctors|clinic/.test(t.amenity || '')) sante += 1;
        else if (t.shop) commerces += 1;
        else if (t.amenity) services += 1;
        else if (t.leisure) vert += 1;
      }

      const iEdu = Math.min(100, ecoles * 12);
      const iSante = Math.min(100, sante * 8);
      const iEco = Math.min(100, commerces * 3);
      const iRes = Math.min(100, services * 12);
      const iInno = Math.min(100, Math.round((iEdu + iEco) / 2.4));
      const iBonheur = Math.min(100, 38 + vert * 5 + Math.round(iSante / 5));
      const iCapital = Math.round((iEdu + iSante) / 2);

      root.querySelector('.marque .t1').textContent = `${(commune?.nom || 'ZONE').toUpperCase()} DIGITAL TWIN`;
      root.querySelector('.marque .t2').textContent = commune ? `Living Digital, France · ${commune.codesPostaux?.[0] || ''}` : 'Living Digital';
      root.querySelector('.pop').innerHTML = commune
        ? `${(commune.population || 0).toLocaleString('fr-FR')} <span class="haut" style="font-size:12px">↑</span>` : '—';

      rendreKpis([
        { ic: '👥', nom: 'Population', texte: commune ? (commune.population || 0).toLocaleString('fr-FR') : '—', val: 60 },
        { ic: '🧠', nom: 'Capital humain', val: iCapital },
        { ic: '😊', nom: 'Bonheur', val: iBonheur },
        { ic: '💰', nom: 'Économie', etoiles: Math.max(1, Math.min(5, Math.ceil(iEco / 20))) },
        { ic: '🛡', nom: 'Résilience', val: iRes },
        { ic: '🎓', nom: 'Éducation', val: iEdu },
        { ic: '🚀', nom: 'Innovation', val: iInno },
      ]);
      rendreCats([
        { ic: '👥', nom: 'Population', val: Math.min(100, Math.round(Math.log10(Math.max(10, commune?.population || 10)) * 20)) },
        { ic: '🎓', nom: 'Éducation', val: iEdu },
        { ic: '💼', nom: 'Emplois & commerces', val: iEco },
        { ic: '🏥', nom: 'Santé', val: iSante },
        { ic: '🏛', nom: 'Services publics', val: iRes },
      ]);
      const skills = [
        ['Développement', iEco, '#37b7ab'], ['Compétences', iCapital, '#c084fc'], ['Innovation', iInno, '#e8c04a'],
      ];
      root.querySelector('.skills').innerHTML = skills.map(([n, v, col], i) =>
        `<div class="skill"><span>${i + 1}. ${n}</span><div class="barre"><i style="width:${v}%;background:${col}"></i></div></div>`).join('');
      root.querySelector('.jauge.eco i').style.width = `${iEco}%`;
      rendreHisto(root.querySelector('.histo'), [
        { l: 'Écoles', n: ecoles, c: '#37b7ab' }, { l: 'Santé', n: sante, c: '#c084fc' },
        { l: 'Commerce', n: commerces, c: '#e8c04a' }, { l: 'Services', n: services, c: '#f0a63c' },
        { l: 'Vert', n: vert, c: '#43d17a' },
      ]);
      rendreMatrice(root.querySelector('.matrice'), [vert, commerces, ecoles, sante, services]);
      btn.textContent = '⟳ ANALYSER LA VUE';
    } catch {
      btn.textContent = '⚠ SOURCE SATURÉE — RÉESSAYER';
    }
    analyseEnCours = false;
  }

  root.querySelector('#wti-analyser').addEventListener('click', analyser);

  // à l'ouverture via le dock : lancer l'analyse + décaler la boussole sous le bandeau
  let dejaAnalyse = false;
  new MutationObserver(() => {
    const ouvert = !root.classList.contains('wt-dock-cache');
    const boussole = document.getElementById('wt-boussole');
    if (boussole) boussole.style.top = ouvert ? '62px' : '10px';
    if (ouvert && !dejaAnalyse) { dejaAnalyse = true; analyser(); }
  }).observe(root, { attributes: true, attributeFilter: ['class'] });

  return { analyser };
}
