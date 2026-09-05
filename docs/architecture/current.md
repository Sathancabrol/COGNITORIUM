# Architecture actuelle (as-is)

**Statut :** `REFERENCE` · synthèse de `docs/etat-des-lieux/` · 2026-09-05

---

## Vue d'ensemble

```
                    COGNITORIUM (écosystème, 8 dépôts)
     ┌──────────────┬──────────┬───────────────┬──────────────┬───────────┐
     │              │          │               │              │           │
proto-cognitorium  HCSM   reaserch-engine  ETAT-DE-LART   watchtower-mods  (3 dépôts
 (React+Gemini)   (modèle)  (preuves)      (connaissances) (Cesium 3D)     vides/annexes)
     │                                                          │
  5 niveaux graphe                                          globe + chantier
  épistémique · decay                                       + intelTwin
  ROME matching · profils                                    (delta : 38 modules
  localStorage                                              upstream manquants)
```

## Par couche de la vision

| Couche | Implémentation actuelle | Persistance | Matière |
| --- | --- | --- | --- |
| HUMAN | proto (profils, compétences, capacités, preuves) | localStorage | partiel |
| KNOWLEDGE | 3 bases séparées (proto atlas, ETAT-DE-LART CSV, HCSM YAML) | fichiers / SQLite | éclaté |
| WORLD | watchtower-mods (Cesium : lieux, chantier, 4D) | localStorage | proto avancé |
| WORLD GRAPH | fragments (intelTwin, ficheLieu, chantier) | localStorage | fragments |
| SKILL GRAPH | implicite dans proto ; concepts dans CLE | localStorage | partiel |
| CLE | COGNITORIUM/learning (2 PoC) | localStorage | PoC |
| PREUVES | reaserch-engine (orchestrateur, graphe d'évidence) | JSON (JsonRunStore) | v0.1 |
| MÉMOIRE | éclatée (localStorage / JSON / SQLite) | — | éclatée |
| DESIGN / SIMULATION / CAD / FAB | néant | — | à construire |
| AGENTS | 1 agent recherche (reaserch-engine) | JSON | v0.1 |

## Goulots d'étranglement identifiés

1. **Aucun câblage** inter-dépôts (HCSM ↔ proto ↔ CLE ↔ reaserch ↔ Watchtower).
2. **Pas de modèle de données unifié** — 3 schémas (types.ts, ontologie YAML,
   CSV 42 champs).
3. **Mémoire non partagée** — rien ne survit à une conversation/un navigateur.
4. **Fournisseur LLM non abstrait** (Gemini en dur dans proto).
5. **Pas de CI/CD ni tests** hors reaserch-engine et validateur HCSM.
6. **Données personnelles en dépôt public** (proto `raw/`) — cf. audit sécurité.

## Actifs à préserver (ne pas réimplémenter)

- échelle épistémique (`epistemics.ts`) + validateur HCSM ;
- moteur ROME explicable + données générées ;
- courbe d'oubli (`decay.ts`) ;
- orchestrateur provider-agnostique (reaserch-engine) ;
- Watchtower (globe gratuit + modules métier) ;
- CLE (pédagogie par résolution de problèmes) ;
- FastAPI + SQLite (ETAT-DE-LART) — premier backend persistant.

*Voir `docs/etat-des-lieux/09-synthese.md` pour les doublons et la matrice.*
