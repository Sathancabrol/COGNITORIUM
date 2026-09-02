/**
 * WATCHTOWER — UI épurée.
 *
 * L'écran d'origine est très chargé. Ce module réduit l'interface à
 * l'essentiel : la barre du bas (LOCATION · VOICE · VISUEL) reste visible,
 * tout le reste devient des ICÔNES à développer, regroupées dans un rail
 * vertical à gauche. Chaque icône ouvre/ferme son panneau ; l'état est
 * mémorisé (localStorage). Par défaut : tout replié = écran propre.
 */

const ETAT_KEY = 'watchtower.uiEpuree.v1';

/** Panneaux repliables en icônes : id élément → icône + libellé français. */
const PANNEAUX = [
  { cible: 'intel-hud', icone: '🧠', libelle: 'HUD Intel' },
  { cible: 'pp-toggles', icone: '🎚', libelle: 'Réglages visuels' },
  { cible: 'param-slider-panel', icone: '🎛', libelle: 'Paramètres avancés' },
  { cible: 'top-center-actions', icone: '⚙', libelle: 'Actions (partager, reset…)' },
  { cible: 'wt-panel', icone: '🗼', libelle: 'Panneau Watchtower (FR)' },
];

const CSS = `
#wt-rail {
  position: fixed; left: 10px; top: 88px; z-index: 940;
  display: flex; flex-direction: column; gap: 7px;
}
.wt-rail-btn {
  width: 40px; height: 40px; cursor: pointer; font-size: 17px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  background: var(--glass-bg, rgba(12,12,20,0.75));
  border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
  border-radius: 10px; backdrop-filter: blur(8px);
  transition: border-color 150ms ease, background 150ms ease;
  position: relative;
}
.wt-rail-btn:hover { border-color: var(--accent, #00d4ff); }
.wt-rail-btn.ouvert {
  border-color: rgba(67, 209, 122, 0.6); background: rgba(67, 209, 122, 0.12);
  box-shadow: 0 0 10px rgba(67, 209, 122, 0.18);
}
.wt-rail-btn .bulle {
  position: absolute; left: 47px; top: 50%; transform: translateY(-50%);
  white-space: nowrap; pointer-events: none; opacity: 0;
  font-family: var(--font-mono, monospace); font-size: 9px; letter-spacing: 1px;
  color: var(--text-primary, #e8eaed);
  background: rgba(10,10,15,0.9); border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
  border-radius: 6px; padding: 4px 8px; transition: opacity 120ms ease;
}
.wt-rail-btn:hover .bulle { opacity: 1; }
.wt-cache { display: none !important; }
`;

function lireEtat() {
  try { return JSON.parse(window.localStorage.getItem(ETAT_KEY)) || {}; } catch { return {}; }
}
function ecrireEtat(etat) {
  try { window.localStorage.setItem(ETAT_KEY, JSON.stringify(etat)); } catch { /* plein */ }
}

/** Initialise l'UI épurée. À appeler APRÈS la création de tous les panneaux. */
export function initCleanUi() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const rail = document.createElement('div');
  rail.id = 'wt-rail';
  document.body.appendChild(rail);

  const etat = lireEtat();

  for (const p of PANNEAUX) {
    const cible = document.getElementById(p.cible);
    if (!cible) continue;
    const ouvert = etat[p.cible] === true; // défaut : replié (écran épuré)
    if (!ouvert) cible.classList.add('wt-cache');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `wt-rail-btn${ouvert ? ' ouvert' : ''}`;
    btn.innerHTML = `${p.icone}<span class="bulle">${p.libelle}</span>`;
    btn.setAttribute('aria-pressed', String(ouvert));
    btn.addEventListener('click', () => {
      const visible = !cible.classList.contains('wt-cache');
      cible.classList.toggle('wt-cache', visible);
      btn.classList.toggle('ouvert', !visible);
      btn.setAttribute('aria-pressed', String(!visible));
      const e2 = lireEtat();
      e2[p.cible] = !visible;
      ecrireEtat(e2);
    });
    rail.appendChild(btn);
  }

  return { rail };
}
