# 02 — proto-cognitorium (l'app « audit du capital cognitif »)

**Rôle :** prototype applicatif central — « système de représentation dynamique
et d'audit du capital cognitif : traçabilité des preuves, décomposition par
missions, passerelles ROME, courbe d'oubli et validation humaine »
(`metadata.json`).
**Maturité :** le dépôt le plus avancé (prototype fonctionnel, non produit).
**Dépôt :** `Sathancabrol/proto-cognitorium`.

## Stack

React 19 · TypeScript 5.8 · Vite 6 · Express 4 (`server.ts`) · `@google/genai`
^2.4 (Gemini côté serveur) · three ^0.185 · Tailwind 4 · lucide-react · motion ·
canvas-confetti · bun.lock (gestionnaire Bun). Persistance `localStorage`.

## Structure

```
proto-cognitorium/
├── server.ts (511)            # Express + schéma Gemini (relatedSkills, matchingSkillIds)
├── index.html, package.json, tsconfig.json, vite.config.ts, metadata.json
├── .env.example               # GEMINI_API_KEY= (seule variable)
├── .gitignore                 # node_modules, dist, *.log, .env* (sauf .env.example)
├── ANALYSE_RAW.md (308)       # analyse des documents bruts
├── CONSOLIDATION.md (117)     # consolidation moteur ROME + profils
├── docs/ANALYSE_VERSIONS.md   # cartographie Git (branches, merges, historique)
├── raw/                       # documents sources (~60 fichiers, surtout PDF/XLSX/DOCX)
│   ├── Cognitorium — Système de représentation multimodale.md (1233)  ← doc fondateur
│   ├── CV (Näthan, Amélie, Gianni, Pierre…), rapports, chantiers, questionnaires
│   └── noeud neurono.html + READMEnoeudneurono.md
├── scripts/build_rome_data.py (182)  # génère src/data/romeData.ts depuis XLSX
└── src/
    ├── main.tsx, App.tsx (514), index.css, types.ts (344)
    ├── data/                  # profils + catalogues + référentiel
    ├── components/            # ~25 composants + atlas/ lab/ savoirs/ ui/
    └── utils/                 # 9 moteurs
```

## Modèle de données (`src/types.ts`)

- **`NodeCategory`** (10) : `experience`, `formation`, `research_project`,
  `task`, `skill_tech`, `skill_transversal`, `skill_relational`,
  `capacity_cognitive`, `knowledge`, `horizon_job`.
- **`VerificationStatus`** : `verified | pending | inferred | rejected`.
- **`InferenceType`** : `explicite | inference_forte | inference_a_valider`.
- **`EvidenceItem`** : source (`cv|declaration|project|diploma|ai_inference|
  peer_review|validation_humaine|exp|attest`), `confidenceScore`,
  `sourceDocument`, `sourcePage`, `date`, `volumeMetric`.
- **`BaseNode`** : provenance (`verificationStatus`, `confidenceScore`,
  `inferenceType`, `evidence[]`, `verifiedAt`, `verifiedBy`, `metrics`).
- **`SkillNode`** : `baseMastery`, `acquiredYear`, `lastPracticedYear`,
  `halfLifeYears`, `decayFactor`, `isReactivated`, `transferabilityScore`.
- **`CapacityNode`** : niveau (`fondamental|avancé|expert`),
  `cognitiveDimension` (5 axes : Raisonnement & Analyse · Coordination &
  Systémique · Adaptabilité & Imprévus · Spatial & Abstraction · Humain & Médiation).
- **`KnowledgeNode`** : `domain`, `decayRate` (lent/moyen/rapide).
- **`HorizonJobNode`** : `romeCode`, `matchScore`, `isDirectlyExercised`…

## Les 9 moteurs (`src/utils/`)

| Fichier | Rôle |
| --- | --- |
| `decay.ts` (99) | courbe d'oubli Ebbinghaus : vitalité, demi-vie, plancher 35 %, effort de réactivation |
| `epistemics.ts` (124) | échelle épistémique 5 niveaux (fait → … → conclusion psy, jamais auto) |
| `graphDimensions.ts` (255) | strates 3D 0-4, modes 2D/3D/timeline/4D, caméra orbitale |
| `romeMatching.ts` (361) | matching ROME explicable (index par jeton, flou ≥60 %, stopwords) |
| `nodeVisualDescriptor.ts` (308) | symbole/couleur/badge/vitalité par type de nœud |
| `metiersGraphData.ts` (606) | données du graphe métiers |
| `rpgCartography.ts` (294) | gamification (quêtes, trésors, XP, tampons) |
| `resourceSearch.ts` (169) | recherche par intention dans le catalogue de ressources |
| `toolVisuals.ts` (101) | visuels des outils |

## Composants (`src/components/`)

- **Représentation** : `NetworkGraph` (2 545, graphe 3D/2D three.js),
  `TemporalNetworkGraph` (659, timeline 4D + lecture/pause), `TreeView` (424),
  `TableView` (335), `MetiersGraph` (938), `DecayTimeline` (261).
- **Profil & preuves** : `NodeInspectorModal` (594, niveau épistémique + preuves
  structurées), `CognitiveSignature` (535, badges épistémiques + garde-fou),
  `ValidationCenterModal` (267, humain valide/rejette l'IA),
  `ExperienceDistillerModal` (568, IA propose `pending`),
  `QuickAddNodeModal` (536), `OnboardingModal` (505, choix/création de profil).
- **Orientation** : `HorizonsBridge` (587, « pourquoi / il manque quoi /
  formations »), `DashboardView` (651, « prochaine étape » calculée).
- **Savoirs** : `PsyRefView` (494, hiérarchie des preuves, journaux),
  `PsychologyAtlasView` (236), `ExperimentStudio` (493, expériences cognitives +
  posters + démos), `ResourcesView` (578, catalogue de ressources),
  `MesEvaluationsView` (423, 7 types d'évaluations), `MetacogLoopView` (282,
  boucle métacognitive Zimmerman), `GraphLegendModal` (1 337),
  `MotionCreateButton` (456), `Header` (277).
- **Atlas** : `ConstellationAtlas` (363), `DisciplineGraph` (1 205),
  `TreeCoverFlow` (256).
- **Lab** : `LabDemos` (991, démos en direct : Stroop, etc.).
- **Savoirs/UI** : `NodeRelated` (73), `TopicGraph` (106), `ViewModeBar` (31),
  `CoverFlowCarousel` (502), `ToolVisual` (53).

## Données (`src/data/`)

- Profils réels : `nathanProfile` (1 709 l.), `gianniProfile` (1 103),
  `pierreProfile` (856), `amelieProfile` (706), `studentProfile` (218),
  `transitionProfile` (214), `initialData` (55).
- Référentiels : `romeData` (23 686, généré — 1 911 fiches + 17 920 compétences
  + FORMACODE), `psychologyAtlas` (742), `psyRefLibrary` (561),
  `psyRefSources` (402), `experimentCatalog` (784), `evaluationsCatalog` (275),
  `savoirsResources` (1 397), `savoirsOutilsCatalog` (220), `savoirsLinks` (131).

## Points forts (réutilisables tels quels)

- L'**échelle épistémique** (`epistemics.ts`) = le garde-fou HCSM appliqué en code.
- Le **moteur ROME explicable** = la passerelle orientation (Phase 2).
- La **courbe d'oubli** = la dimension temporelle du Skill Graph.
- Le **modèle de preuves** (`types.ts`) = le squelette du Core (Phase 1).

## Gaps / TODO (issus de `CONSOLIDATION.md` et `docs/ANALYSE_VERSIONS.md`)

- Persistance `localStorage` ; schéma SQL (`01_cognitorium_schema_ddl.sql`)
  **non branché** (la table `rome_import`/`rome_fiche` est prête).
- Bundle `romeData.ts` 5,4 Mo (lazy-loading à faire).
- Questionnaire des 10 biais non intégré.
- Matching ROME = indice de proximité, pas une garantie (correctement affiché).
- Un ancien fichier `identifiants_cognitorium*.json` a existé mais **a été
  purgé** — plus aucun secret en clair dans l'instantané actuel (vérifié).
- Pas de tests, pas de CI, pas de Docker.
- Divergence Git historique : une branche « avancée » (`arena/01a034f2`) non
  mergée contient le moteur ROME + 6 profils (voir `docs/ANALYSE_VERSIONS.md`).
