# 001 — Audit de sécurité (état des lieux 2026-09-05)

**Type :** audit sécurité · **Statut :** `REFERENCE` (à maintenir)

---

## 1. Secrets / credentials

| Point | État | Action |
| --- | --- | --- |
| Fichier `raw/identifiants_cognitorium*.json` (proto) | **purgé** — absent des instantanés (vérifié) | ✅ |
| `.patch` `raw/01a0389d-*.patch` (12 k l.) | **aucun secret** (vérifié : contient du code/CSV bénin, une app FastAPI) | surveiller |
| Historique Git du proto (le fichier a existé) | trace possible | **rotation** des identifiants concernés |
| `GEMINI_API_KEY` (proto) | via `.env` (gitignoré), `.env.example` vide | ✅ passer par env + permissions |
| Clés navigateur Watchtower (Google/Cesium/OpenAI…) | `localStorage` | accepté (docs) ; restriction côté fournisseur obligatoire |
| `ALLOW_FRAMING=1` (Watchtower) | désactive les en-têtes anti-iframe | réservé aux previews intégrées (déjà documenté) |

Recommandation : scanner les dépôts avec **gitleaks / truffleHog** en CI ; garder
`.gitignore` strict (`.env*`, `raw/identifiants*`, `*.key`, `*.pem`).

## 2. ⚠️ Données personnelles (GDPR) — risque majeur

`proto-cognitorium/raw/` (dépôt **public**) contient de **vraies données
personnelles** : CV nominatifs (Näthan Cabrol, Amélie Cruagnes, Gianni Ducoeur,
Pierre DENIAUD), rapports de stage, **questionnaires d'information**, documents
chantier, relevés. Conséquences :

- exposition publique de tiers (les autres CV) **sans consentement documenté** ;
- données sensibles (santé ? réponses aux questionnaires) potentiellement.

Actions recommandées (priorité) :
1. **Passer `raw/` hors du dépôt public** (stockage privé : coffre, drive, ou
   repo privé) ou **pseudonymiser/anonymiser** avant publication ;
2. rédiger une **notice de traitement** (bases légales, finalités, durées) ;
3. documenter le **consentement** des personnes concernées ;
4. les **profils dérivés** (`src/data/*Profile.ts`) contiennent des extraits →
   vérifier qu'ils ne contiennent ni coordonnées ni données sensibles.

## 3. Application (proto + Watchtower)

- proto : validation des entrées du distiller IA (schéma Gemini), statut
  `pending` → validation humaine (✅) ; pas d'auth multi-utilisateur (à prévoir).
- Watchtower : proxy serveur **avec protection SSRF, caps de réponse, erreurs
  assainies** (hérité de l'upstream ✅) ; partage LAN = coupure des surfaces de
  clés (✅) ; throttles par IP (`GEV_RATELIMIT_*`) — à activer si partage.
- reaserch-engine : pas de réseau par défaut (✅), providers injectés.

## 4. Multi-tenant & isolation (cible)

- Auth (OIDC à évaluer), permissions par projet/organisation (commune), séparation
  des espaces, rate-limiting, audit log des accès, sauvegardes chiffrées.

## 5. Registre sécurité (à alimenter en continu)

| Menace | Gravité | Statut |
| --- | --- | --- |
| Exfiltration de données personnelles (raw/) | critique | action immédiate §2 |
| Secrets historiques Git | élevée | rotation |
| SSRF via proxies | moyenne | déjà protégé (Watchtower) |
| Hallucinations présentées comme faits | élevée | garde-fous épistémique + validateur HCSM |
| Injection de prompts via import CV | moyenne | schéma + validation humaine |

*Liens : `constitution/07-risks.md` · `audits/internal/001-audit-global.md` §10.*
