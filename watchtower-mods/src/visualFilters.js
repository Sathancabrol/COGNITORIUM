/**
 * WATCHTOWER — FILTRES DE VUE.
 *
 * Modes d'affichage supplémentaires appliqués au rendu de la carte, en plus
 * des visual presets d'origine : vision nocturne, thermique, nuit, N&B, etc.
 * Implémentés en filtres GPU CSS sur le conteneur Cesium — instantanés,
 * gratuits, cumulables avec n'importe quel fond de carte. Choix mémorisé.
 */

const ETAT_KEY = 'watchtower.filtre.v1';

const FILTRES = [
  { id: 'aucun', label: '✳ NORMAL', css: 'none' },
  { id: 'nuit', label: '🌙 NUIT', css: 'brightness(0.62) saturate(0.8) hue-rotate(-10deg)' },
  { id: 'nocturne', label: '🟢 VISION NOCTURNE', css: 'grayscale(1) brightness(1.25) sepia(1) hue-rotate(65deg) saturate(4.5) contrast(1.1)' },
  { id: 'thermique', label: '🔥 THERMIQUE', css: 'saturate(2.6) hue-rotate(180deg) contrast(1.35) brightness(1.05)' },
  { id: 'nb', label: '⬛ NOIR & BLANC', css: 'grayscale(1) contrast(1.2)' },
  { id: 'sepia', label: '🟤 ARCHIVE', css: 'sepia(0.85) contrast(1.05) brightness(0.95)' },
  { id: 'tactique', label: '🎯 TACTIQUE', css: 'contrast(1.45) saturate(0.55) brightness(0.9) hue-rotate(160deg)' },
  { id: 'vif', label: '🔆 CONTRASTE+', css: 'contrast(1.35) saturate(1.45)' },
];

const CSS = `
#wt-filtres { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px; font-size: 10px; }
#wt-filtres .f-btn {
  cursor: pointer; text-align: left; padding: 8px 10px; border-radius: 8px;
  font-family: inherit; font-size: 9.5px; font-weight: 700; letter-spacing: 1px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: rgba(232,234,237,0.85);
}
#wt-filtres .f-btn:hover { border-color: #00d4ff; }
#wt-filtres .f-btn.actif { background: rgba(0,212,255,0.14); border-color: #00d4ff; color: #00d4ff; box-shadow: 0 0 10px rgba(0,212,255,0.2); }
#wt-filtres .note { color: rgba(232,234,237,0.4); font-size: 8px; line-height: 1.6; }
`;

/** Initialise les filtres. Retourne {element, appliquer}. */
export function initVisualFilters() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const conteneur = document.getElementById('cesiumContainer');
  const el = document.createElement('div');
  el.id = 'wt-filtres';

  let actif = 'aucun';
  try { actif = window.localStorage.getItem(ETAT_KEY) || 'aucun'; } catch { /* défaut */ }

  function appliquer(id) {
    const f = FILTRES.find((x) => x.id === id) || FILTRES[0];
    actif = f.id;
    if (conteneur) conteneur.style.filter = f.css === 'none' ? '' : f.css;
    try { window.localStorage.setItem(ETAT_KEY, actif); } catch { /* plein */ }
    for (const b of el.querySelectorAll('.f-btn')) b.classList.toggle('actif', b.dataset.id === actif);
  }

  for (const f of FILTRES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'f-btn';
    b.dataset.id = f.id;
    b.textContent = f.label;
    b.addEventListener('click', () => appliquer(f.id));
    el.appendChild(b);
  }
  const note = document.createElement('div');
  note.className = 'note';
  note.textContent = 'Filtres GPU appliqués au rendu — cumulables avec tous les fonds de carte et les visual presets d\u2019origine (barre VISUEL).';
  el.appendChild(note);

  appliquer(actif); // restaure le choix mémorisé

  return { element: el, appliquer };
}
