# Plan de convergence (câblage des dépôts)

**Statut :** `PROPOSED` · 2026-09-05

But : transformer 8 dépôts éclatés en **une plateforme cohérente**, sans
réécrire ce qui existe.

---

## Carte des dépendances cible

```
            ┌─────────────────────────────────────────────┐
            │              CORE (base unique)             │
            │  PostgreSQL + pgvector + AGE + PostGIS      │
            └───────┬───────────┬───────────┬─────────────┘
                    │           │           │
   ┌────────────────┼───────────┼───────────┼──────────────┐
   ▼                ▼           ▼           ▼              ▼
HCSM            ETAT-DE-LART  proto       reaserch-      watchtower
(modèle +      (connaissances (UI +     engine (preuves (monde 3D)
validator)     42 champs,     profils,  + vérif)        + chantier)
               app FastAPI)   ROME)                        ▲
   ▲                                                       │
   └──────── learning/ (CLE) ──────────────────────────────┘
```

## Câblages (qui consomme quoi)

| # | Lien | Direction | Moyen | Phase |
| --- | --- | --- | --- | --- |
| 1 | HCSM → Core | vocabulaire + validation | ontologie YAML + `validator/` en garde-fou serveur | 1 |
| 2 | ETAT-DE-LART → Core | connaissances sourcées | migration CSV 42 champs → table `knowledge` | 1 |
| 3 | proto → Core | profils, compétences, preuves | adapter `types.ts` → schéma unifié | 1-2 |
| 4 | reaserch-engine → Core | preuves/vérification | backend qui alimente les `evidence` des nœuds | 2 |
| 5 | CLE → Core | apprentissage | persistance Skill Graph côté serveur (fini localStorage) | 2 |
| 6 | watchtower → Core | monde / territoire | brancher `Place`/`Project` sur PostGIS | 3 |
| 7 | proto ↔ watchtower | profil T0 + géo | intelTwin « carte cognitive T0 » ← contrat HCSM | 3 |
| 8 | animation-chronos → CLE | onboarding/narration | pattern révélation progressive | 2 (option) |

## Règles de convergence

1. **Ne rien réécrire** : chaque dépôt garde son rôle ; on ajoute des adaptateurs.
2. **Une donnée, une source** : supprimer les 3 doublons (bases de connaissances,
   état cognitif, code Watchtower) en nommant un propriétaire par donnée.
3. **Contrat avant code** : chaque lien = un schéma d'échange versionné.
4. **Provenance partout** : chaque nœud importé conserve sa source d'origine.

## Ordre de travail (dépendances)

1. Schéma unifié (Core) — `data-model.md`.
2. Base unique + migrations (SQL).
3. Adaptateur proto (le plus de valeur : profils + ROME).
4. Câblage reaserch-engine (preuves) puis CLE.
5. Publication Watchtower + PostGIS (Phase 3).
