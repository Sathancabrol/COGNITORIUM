import { OSINT_SOURCES } from './osintRegistry.js';
import { createObservation } from './osintEvidence.js';
import { createInvestigation, addEntity, addRelation } from './osintCase.js';

const DEMO = {
  id: 'building_demo_frontignan',
  type: 'BUILDING',
  label: 'Bâtiment sélectionné',
  address: 'Exemple — recherche à confirmer',
};

const DEMO_OBSERVATIONS = [
  createObservation({ entityId: DEMO.id, claim: 'Adresse résolue par une source géographique publique', type: 'FACT', sourceId: 'ban', method: 'adapter:ban', confidence: 1 }),
  createObservation({ entityId: DEMO.id, claim: 'Une parcelle cadastrale correspond à la position sélectionnée', type: 'FACT', sourceId: 'cadastre', method: 'adapter:cadastre', confidence: 1 }),
  createObservation({ entityId: DEMO.id, claim: 'Une transaction immobilière est associée à la zone', type: 'FACT', sourceId: 'dvf', method: 'adapter:dvf', confidence: 1 }),
  createObservation({ entityId: DEMO.id, claim: 'Le site web semble correspondre à une entité SIRENE', type: 'INFERENCE', sourceId: 'sirene', method: 'cross-source-match', confidence: 0.78 }),
  createObservation({ entityId: DEMO.id, claim: 'Le propriétaire réel du bâtiment est identifié', type: 'UNKNOWN', sourceId: null, method: 'not-established' }),
];

function css() {
  if (document.getElementById('wt-osint-style')) return;
  const style = document.createElement('style');
  style.id = 'wt-osint-style';
  style.textContent = `
    #wt-osint{position:fixed;right:22px;top:96px;width:min(430px,calc(100vw - 44px));max-height:calc(100vh - 118px);overflow:auto;z-index:1200;background:rgba(8,11,15,.96);border:1px solid rgba(255,255,255,.16);box-shadow:0 20px 60px rgba(0,0,0,.45);backdrop-filter:blur(14px);color:#e8edf2;font:12px Inter,system-ui,sans-serif;display:none}
    #wt-osint.open{display:block}.wt-o-head{padding:15px 16px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center}.wt-o-title{font:600 13px 'JetBrains Mono',monospace;letter-spacing:.08em}.wt-o-kicker{font-size:10px;opacity:.55}.wt-o-body{padding:14px 16px}.wt-o-actions{display:flex;gap:8px;margin-bottom:12px}.wt-o-btn{background:#111820;border:1px solid #34404d;color:#e8edf2;padding:8px 10px;cursor:pointer}.wt-o-btn:hover{border-color:#8ea0b2}.wt-o-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.wt-o-card{padding:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.025)}.wt-o-label{font-size:9px;opacity:.5;text-transform:uppercase}.wt-o-value{margin-top:4px}.wt-o-obs{border-left:2px solid #6d7f90;padding:8px 10px;margin:7px 0;background:rgba(255,255,255,.025)}.wt-o-obs[data-type=FACT]{border-left-color:#8fb3a0}.wt-o-obs[data-type=INFERENCE]{border-left-color:#c7ad73}.wt-o-obs[data-type=HYPOTHESIS]{border-left-color:#b57d7d}.wt-o-obs[data-type=UNKNOWN]{border-left-color:#66717c}.wt-o-type{font:600 9px 'JetBrains Mono',monospace;opacity:.7}.wt-o-source{font-size:10px;opacity:.55;margin-top:4px}.wt-o-status{padding:8px 10px;background:rgba(120,140,160,.08);margin-bottom:10px}.wt-o-footer{font-size:10px;line-height:1.45;opacity:.55;margin-top:12px}
  `;
  document.head.appendChild(style);
}

function render(investigation) {
  const root = document.getElementById('wt-osint');
  if (!root) return;
  const obs = investigation.observations;
  root.querySelector('[data-osint-content]').innerHTML = `
    <div class="wt-o-status">HUMAN-IN-THE-LOOP · les hypothèses ne deviennent jamais automatiquement des faits.</div>
    <div class="wt-o-actions"><button class="wt-o-btn" data-demo>ANALYSE DÉMO</button><button class="wt-o-btn" data-export>EXPORT JSON</button></div>
    <div class="wt-o-grid">
      <div class="wt-o-card"><div class="wt-o-label">Entité</div><div class="wt-o-value">${investigation.entities[0]?.type || '—'}</div></div>
      <div class="wt-o-card"><div class="wt-o-label">Observations</div><div class="wt-o-value">${obs.length}</div></div>
    </div>
    <div class="wt-o-label">ÉVIDENCES</div>
    ${obs.map((o) => `<div class="wt-o-obs" data-type="${o.type}"><div class="wt-o-type">${o.type}</div><div>${o.claim}</div><div class="wt-o-source">source: ${o.sourceId || 'aucune'} · confiance: ${o.confidence == null ? '—' : Math.round(o.confidence * 100) + '%'}</div></div>`).join('')}
    <div class="wt-o-label" style="margin-top:14px">SOURCES DISPONIBLES</div>
    <div class="wt-o-grid">${OSINT_SOURCES.slice(0, 6).map(s => `<div class="wt-o-card"><div>${s.name}</div><div class="wt-o-source">${s.cost} · ${s.automation} · risque ${s.risk}</div></div>`).join('')}</div>
    <div class="wt-o-footer">Cette V0.1 fournit le contrat de données et l'interface. Les connecteurs réseau sont séparés afin de pouvoir appliquer licence, quotas, RGPD, restrictions de réutilisation et validation humaine source par source.</div>`;
  root.querySelector('[data-demo]').onclick = () => runDemo();
  root.querySelector('[data-export]').onclick = () => {
    const blob = new Blob([JSON.stringify(investigation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${investigation.id}.json`; a.click(); URL.revokeObjectURL(url);
  };
}

function runDemo() {
  const investigation = createInvestigation({ title: 'Démonstration — analyse de bâtiment' });
  addEntity(investigation, DEMO);
  DEMO_OBSERVATIONS.forEach(o => investigation.observations.push(o));
  addRelation(investigation, { from: DEMO.id, to: 'source:ban', predicate: 'geocoded-by', evidenceType: 'FACT' });
  addRelation(investigation, { from: DEMO.id, to: 'source:dvf', predicate: 'observed-in', evidenceType: 'FACT' });
  render(investigation);
}

export function initOsintWorkbench() {
  css();
  if (!document.getElementById('wt-osint')) {
    const root = document.createElement('aside');
    root.id = 'wt-osint';
    root.innerHTML = `<div class="wt-o-head"><div><div class="wt-o-kicker">INVESTIGATION WORKBENCH</div><div class="wt-o-title">WATCHTOWER / OSINT</div></div><button class="wt-o-btn" data-close aria-label="Fermer">×</button></div><div class="wt-o-body" data-osint-content></div>`;
    document.body.appendChild(root);
    root.querySelector('[data-close]').onclick = () => root.classList.remove('open');
  }
  const trigger = document.createElement('button');
  trigger.id = 'wt-osint-trigger';
  trigger.className = 'wt-o-btn';
  trigger.textContent = 'OSINT';
  trigger.title = 'Ouvrir le poste d’enquête OSINT';
  Object.assign(trigger.style, { position: 'fixed', right: '22px', bottom: '22px', zIndex: 1199 });
  trigger.onclick = () => { document.getElementById('wt-osint').classList.add('open'); runDemo(); };
  document.body.appendChild(trigger);
  render(createInvestigation({ title: 'Nouvelle enquête' }));
}
