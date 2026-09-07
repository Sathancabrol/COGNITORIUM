# WATCHTOWER — OSINT / WORLD INTELLIGENCE MASTER SPEC

**Status:** architecture de référence / consolidation des idées discutées  
**Version:** 0.2-draft  
**Scope:** `watchtower-mods/`  
**Branch:** `watchtower/osint-workbench-v0.1`

> Ce document devient la référence conceptuelle centrale pour faire évoluer Watchtower sans casser le cockpit/globe existant. Il rassemble les idées issues de l'audit du dépôt, des recherches OSINT précédentes et de l'étude du produit **3D Urban Scanner** de SGP Store.

---

## 0. Vision en une phrase

**WATCHTOWER doit évoluer d'un globe/cockpit de données live vers un système spatio-informationnel, temporel et cognitif capable de reconstruire un lieu, relier ses données, conserver les preuves, conduire une investigation et présenter le résultat dans un espace de travail humain.**

Le 3D Urban Scanner est une inspiration pour la reconstruction urbaine et les interactions 3D ; il ne constitue pas le modèle cible de Watchtower.

---

# 1. Les 7 primitives fondamentales

Ne pas créer une fonctionnalité indépendante pour chaque idée. La majorité du système doit dériver de sept primitives stables :

1. **ENTITY** — quelque chose dont on parle.
2. **OBSERVATION** — donnée effectivement observée/retrieved.
3. **SOURCE** — origine de l'information.
4. **RELATION** — lien explicite entre deux entités.
5. **EVENT** — changement ou événement situé dans le temps.
6. **QUESTION** — ce que l'enquête cherche à établir.
7. **VALIDATION** — décision humaine sur une observation, relation, hypothèse ou conclusion.

Primitives complémentaires indispensables :

- CLAIM — proposition descriptive portée par une observation.
- HYPOTHESIS — proposition à tester.
- DOCUMENT — artefact source.
- CASE — conteneur d'enquête.
- TASK — travail à effectuer.
- WORKER — capacité automatisée.
- ACTION — opération exécutée par un agent/outil.
- MEASUREMENT — observation quantitative.
- SNAPSHOT — état d'un monde ou d'une enquête à un instant.
- CONTRADICTION — incompatibilité entre observations/claims.
- KNOWLEDGE_GAP — information recherchée mais non établie.

---

# 2. Modèle mental global

```text
                         WATCHTOWER
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   WORLD ENGINE          KNOWLEDGE ENGINE       CASE ENGINE
        │                     │                     │
   2D / 3D / GIS        entities / graph       questions
   terrain / buildings  relations / claims      missions
   objects / flows      evidence / sources      hypotheses
   environment          time / provenance       validation
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                     AGENT ORCHESTRATOR
                              │
             ┌────────────────┼────────────────┐
             │                │                │
           WORKERS           MCP          LOCAL / REMOTE AI
             │                │                │
             └────────────────┼────────────────┘
                              │
                       EVIDENCE ENGINE
                              │
                      HUMAN VALIDATION
                              │
                 ┌────────────┴────────────┐
                 │                         │
           MENTAL PALACE              REPORT / EXPORT
```

---

# 3. World Engine — reconstruction du monde

## 3.1 Concept

Inspiré du 3D Urban Scanner : sélection d'une zone → reconstruction 2D/3D → exploration → mesure → analyse.

Mais Watchtower doit relier chaque objet spatial à une entité informationnelle.

```text
WORLD OBJECT
    ↓
ENTITY
    ↓
OBSERVATIONS
    ↓
SOURCES
    ↓
RELATIONS
    ↓
CASE / GRAPH / TIMELINE
```

## 3.2 Scan de zone

Fonction cible : **SCAN ZONE**.

Entrée : rectangle/polygone/rayon/zone administrative.

Pipeline :

1. géométrie de la zone ;
2. bâtiments ;
3. adresses ;
4. parcelles ;
5. routes ;
6. équipements ;
7. entreprises/établissements ;
8. contexte OSM ;
9. données historiques disponibles ;
10. environnement ;
11. reconstruction 3D ;
12. création/liaison des entités ;
13. indexation dans le graphe.

Le scan doit être progressif, cacheable et interrompable.

## 3.3 Building Explorer

Une fiche bâtiment doit pouvoir représenter :

- identité interne ;
- adresse ;
- coordonnées ;
- commune ;
- parcelle ;
- empreinte ;
- hauteur ;
- niveaux ;
- toiture ;
- volumes ;
- usages connus ;
- établissements ;
- entreprises ;
- transactions disponibles ;
- documents ;
- archives ;
- historique ;
- observations ;
- hypothèses ;
- contradictions ;
- sources ;
- analyses spatiales ;
- analyses temporelles.

Chaque champ doit pouvoir remonter vers sa provenance.

## 3.4 Intérieur 3D : trois niveaux de réalité

Le système doit séparer :

### OBSERVÉ

Plan, photo, scan ou donnée explicitement disponible.

### ESTIMÉ / INFERÉ

Géométrie ou organisation calculée à partir de données indirectes.

### HYPOTHÉTIQUE / SIMULÉ

Structure proposée pour exploration ou simulation, sans prétendre décrire le réel.

Cette distinction est obligatoire dans l'interface et les exports.

## 3.5 X-Ray / étage / coupe

Vues à prévoir :

- solide ;
- transparent ;
- X-Ray ;
- étage isolé ;
- coupe verticale ;
- vue éclatée ;
- plan 2D ;
- vue nadir ;
- vue libre ;
- comparaison de snapshots temporels.

## 3.6 Création manuelle du monde

Fonction **CREATE WORLD OBJECT** :

- dessiner bâtiment ;
- dessiner terrain ;
- dessiner pièce ;
- dessiner route ;
- dessiner zone ;
- importer une géométrie ;
- générer une représentation 3D ;
- transformer le résultat en entité Watchtower.

Toute géométrie manuelle doit être marquée comme `USER_CREATED` et ne doit pas être confondue avec une donnée officielle.

---

# 4. Measurement Engine

Toute mesure utile doit pouvoir devenir une `OBSERVATION`.

Mesures :

- distance ;
- hauteur ;
- surface ;
- périmètre ;
- azimut ;
- angle ;
- pente ;
- rayon ;
- distance entre entités ;
- temps de parcours ;
- visibilité ;
- couverture ;
- exposition solaire.

Exemple conceptuel :

```json
{
  "type": "OBSERVATION",
  "subject": "building_42",
  "property": "distance_to_road",
  "value": 17.4,
  "unit": "m",
  "method": "3d_measurement",
  "observedAt": "...",
  "source": "watchtower_user"
}
```

---

# 5. Visibility Engine

Inspiré de la fonction de ligne de vue du 3D Urban Scanner.

Une visibilité n'est pas un simple effet graphique : elle devient une relation calculée.

```text
LOCATION_A --CAN_SEE--> BUILDING_B
```

Métadonnées :

- distance ;
- azimut ;
- élévation ;
- obstacles ;
- terrain ;
- hauteur d'observation ;
- date/heure ;
- modèle utilisé ;
- résolution ;
- résultat ;
- limites ;
- source/donnée géométrique.

Le système doit pouvoir distinguer `VISIBLE`, `BLOCKED`, `PARTIAL`, `UNKNOWN`.

---

# 6. Environmental Engine

Couches envisagées :

- météo ;
- vent ;
- température ;
- humidité ;
- pression ;
- soleil ;
- ombres ;
- terrain ;
- végétation ;
- bruit ;
- pollution ;
- risques environnementaux disponibles ;
- inondation ;
- incendie ;
- événements naturels.

Le temps est premier-class : les conditions doivent être associées à un instant ou intervalle.

---

# 7. Solar / Shadow Engine

Capacités :

- trajectoire solaire ;
- angle solaire ;
- ombres projetées ;
- durée d'exposition ;
- comparaison saisonnière ;
- potentiel photovoltaïque si les données nécessaires existent.

Toute estimation doit être marquée comme modèle et non comme mesure directe.

---

# 8. Flow / Path / Simulation Engine

Inspiré de la fonction d'évacuation du 3D Urban Scanner mais généralisé.

Cas :

- déplacement ;
- accessibilité ;
- évacuation ;
- flux ;
- livraison ;
- inspection ;
- maintenance ;
- visite ;
- parcours hypothétique.

```text
START → NODE → NODE → NODE → DESTINATION
```

Sorties possibles :

- chemin ;
- distance ;
- durée estimée ;
- obstacles ;
- alternatives ;
- hypothèses de modèle.

Une simulation n'est jamais présentée comme un événement observé.

---

# 9. Occupation / activity model

Le système peut représenter une **occupation estimée** mais ne doit pas inventer une présence réelle.

États :

- OBSERVED ;
- ESTIMATED ;
- SIMULATED ;
- UNKNOWN.

Exemple :

```text
building
 ├─ capacité estimée : 80
 ├─ occupation estimée : 35–55
 ├─ période : 14:00–18:00
 └─ confiance : faible
```

Les données personnelles et les inférences sensibles doivent rester soumises aux politiques de confidentialité et aux validations humaines.

---

# 10. Knowledge Engine

## 10.1 Entity model

Types initiaux :

`BUILDING`, `ADDRESS`, `PARCEL`, `LOCATION`, `PERSON`, `ORGANIZATION`, `COMPANY`, `DOMAIN`, `EMAIL`, `USERNAME`, `DOCUMENT`, `IMAGE`, `VEHICLE`, `AIRCRAFT`, `SHIP`, `EVENT`, `SOURCE`, `PROPERTY`, `LAND`, `ROAD`, `INFRASTRUCTURE`, `CAMERA`, `AIRPORT`, `PORT`, `STATION`, `SCHOOL`, `HOSPITAL`, `PUBLIC_BODY`, `ASSOCIATION`, `CONTRACT`, `TRANSACTION`, `LEGAL_CASE`, `REGISTRY_RECORD`, `PUBLICATION`, `NEWS_ARTICLE`, `VIDEO`, `AUDIO`, `POST`, `COMMENT`, `PHOTO`, `FILE`, `ROLE`, `EMPLOYMENT`, `ADDRESS_HISTORY`, `MISSION`, `OBSERVATION`, `CLAIM`, `HYPOTHESIS`.

Les types peuvent évoluer, mais les identifiants internes doivent rester stables.

## 10.2 Identité

Ne jamais utiliser un nom, une adresse ou un username comme identifiant canonique.

```text
internalId
canonicalType
aliases
attributes
externalIds
validity
provenance
resolutionStatus
```

## 10.3 Entity resolution

La résolution d'entité doit produire un **candidate match** explicable, pas une identité certaine automatique.

Critères possibles :

- nom ;
- adresse ;
- coordonnées ;
- identifiant externe ;
- domaine ;
- dates ;
- organisation ;
- contexte ;
- cohérence géographique.

Sorties : `MATCH`, `POSSIBLE_MATCH`, `CONFLICT`, `UNKNOWN`.

---

# 11. Temporal Engine

Le temps est une dimension native.

Attributs recommandés :

- `observedAt` ;
- `publishedAt` ;
- `retrievedAt` ;
- `validFrom` ;
- `validTo` ;
- `eventTime` ;
- `snapshotId`.

Objectif : pouvoir répondre à :

> « Que savait Watchtower de cette entité à telle date ? »

et :

> « Quelle était la situation probable de ce lieu à cette époque ? »

Les rôles et relations temporelles doivent être modélisés comme des faits datés, pas comme des champs statiques.

Exemple :

```text
COMPANY --HAS_ROLE--> PERSON
role = CEO
validFrom = 2022
validTo = 2025
source = registry_x
```

---

# 12. Source Engine

Une source n'est pas une preuve par elle-même.

Chaîne de provenance :

```text
SOURCE
 ↓
DOCUMENT / RESPONSE
 ↓
EXTRACTION
 ↓
OBSERVATION
 ↓
CLAIM
 ↓
RELATION / INFERENCE
```

Métadonnées minimales d'une source :

- id ;
- nom ;
- organisation ;
- URL/API ;
- pays ;
- catégorie ;
- licence ;
- conditions de réutilisation ;
- couverture géographique ;
- couverture temporelle ;
- fréquence de mise à jour ;
- autorité ;
- précision ;
- fraîcheur ;
- automatisation ;
- données personnelles ;
- niveau de risque ;
- rate limit/quota ;
- coût ;
- authentification ;
- date de dernière vérification ;
- état de santé ;
- adaptateur ;
- version du contrat.

## 12.1 Indépendance des sources

Deux sites qui recopient la même donnée ne constituent pas nécessairement deux confirmations indépendantes.

Le modèle doit pouvoir stocker :

`sourceIndependenceGroup`.

---

# 13. Evidence Engine

## 13.1 États de connaissance

```text
FACT
INFERENCE
HYPOTHESIS
UNKNOWN
```

Et pour les inconnues :

```text
NOT_SEARCHED
SEARCHED_NO_RESULT
CONFLICTED
INACCESSIBLE
OUT_OF_SCOPE
REDACTED
```

## 13.2 Force d'évidence

Ne pas utiliser un unique « score de vérité » magique.

Décomposer :

- identité ;
- qualité source ;
- autorité ;
- indépendance ;
- fraîcheur ;
- adéquation temporelle ;
- adéquation géographique ;
- contexte ;
- cohérence ;
- contradiction.

Un score global, s'il existe pour l'interface, doit rester explicable par ces composantes.

## 13.3 Contradictions

Une contradiction devient un objet de travail.

```text
CLAIM A
  │
  └── CONTRADICTS ── CLAIM B
```

Le système doit proposer une résolution basée sur :

1. temporalité ;
2. autorité de la source ;
3. fraîcheur ;
4. précision ;
5. indépendance ;
6. contexte.

Il ne doit pas choisir silencieusement.

---

# 14. Question Engine

Une question est un objet du système.

```text
QUESTION
 ↓
INTERPRETATION
 ↓
OBJECTIVES
 ↓
SUBTASKS
 ↓
SOURCES
 ↓
WORKERS
 ↓
OBSERVATIONS
 ↓
CROSS-CHECK
 ↓
ANSWER
```

Chaque réponse doit exposer :

- éléments établis ;
- éléments contradictoires ;
- hypothèses ;
- inconnues ;
- sources ;
- limites ;
- validation humaine.

---

# 15. Case Engine

Le `CASE` devient le conteneur de l'enquête.

```text
CASE
├── metadata
├── objectives
├── questions
├── entities
├── observations
├── claims
├── relations
├── events
├── hypotheses
├── contradictions
├── knowledgeGaps
├── sources
├── timeline
├── notes
├── tasks
├── actions
├── validations
├── snapshots
├── exports
└── auditLog
```

Format cible : `.wtcase.json`.

Le format doit être versionné et portable.

---

# 16. Investigation Planner

Le planner transforme une question en plan contrôlable.

```text
QUESTION
 → PLAN
 → CAPABILITIES
 → SOURCE SELECTION
 → WORKER EXECUTION
 → NORMALIZATION
 → CROSS-CHECK
 → GRAPH UPDATE
 → VALIDATION
 → NEXT BEST ACTION
```

Le planner doit privilégier les actions :

- légales ;
- autorisées ;
- peu coûteuses ;
- réversibles ;
- informatives ;
- respectueuses de la vie privée.

---

# 17. Worker architecture

Chaque worker doit déclarer :

- id ;
- version ;
- capacités ;
- entrées ;
- sorties ;
- sources utilisées ;
- restrictions ;
- coût ;
- quota ;
- timeout ;
- cache ;
- niveau de risque ;
- besoin de validation ;
- provenance produite.

Contrat :

```text
INPUT
 entity / task / scope / constraints

OUTPUT
 observations
 sources
 timestamps
 confidence components
 evidence type
 errors
 provenance
```

Un worker retourne des observations structurées, pas une conclusion opaque.

---

# 18. Source workers prioritaires

## France / public data

1. BAN / Géoplateforme — adresse.
2. Cadastre / Géoplateforme — parcelles/géométrie.
3. SIRENE — entreprises/établissements.
4. BODACC — annonces commerciales/juridiques.
5. DVF+ — transactions, avec restrictions explicites.
6. INPI / RNE — registre national.
7. OSM / Overpass — contexte cartographique.
8. Wayback — historique public du Web.

## Local / fichiers fournis

- ExifTool / Exiv2 ;
- OCR ;
- analyse de documents ;
- extraction de métadonnées.

## OSINT optionnel

- Maigret ;
- Sherlock ;
- WhatsMyName ;
- SpiderFoot ;
- Amass uniquement dans des périmètres autorisés.

Les outils d'identité sont des moteurs de découverte de candidats, jamais des preuves d'identité.

---

# 19. Cache / reproductibilité

Chaque récupération doit pouvoir conserver :

- source ;
- endpoint/requête ;
- paramètres ;
- timestamp ;
- hash de réponse ;
- version du worker ;
- version de source si disponible ;
- durée ;
- résultat ;
- expiration ;
- statut.

Objectif : pouvoir reproduire une enquête et comparer deux exécutions.

---

# 20. Modes d'exécution

```text
ONLINE
OFFLINE
DEGRADED
LOCAL_ONLY
```

Le cas doit rester exploitable même sans connexion.

---

# 21. Privacy / governance / sécurité

Classes d'accès :

`PUBLIC`, `LOCAL`, `AUTHENTICATED`, `SENSITIVE`, `RESTRICTED`, `ACTIVE`.

Risques :

`LOW`, `MEDIUM`, `HIGH`, `BLOCKED`.

Règles :

- public ne signifie pas réutilisation illimitée ;
- conserver les licences/conditions ;
- limiter la collecte au besoin de l'enquête ;
- minimiser les données personnelles ;
- ne pas produire automatiquement des profils sensibles ;
- ne pas contourner authentification, CAPTCHA ou contrôle d'accès ;
- reconnaissance active uniquement avec autorisation ;
- human gate pour opérations sensibles ;
- toute donnée dérivée doit conserver sa provenance.

---

# 22. Agent / AI layer

L'IA doit être un orchestrateur et un assistant explicable, pas une autorité.

Chaque action importante peut exposer :

```text
ACTION
WHY
SOURCE
EXPECTED RESULT
ACTUAL RESULT
NEXT STEP
```

## Local-first

Politique entre :

- Ollama/local model ;
- modèle distant ;
- modèle spécialisé ;
- aucun modèle.

Décision selon :

- confidentialité ;
- coût ;
- latence ;
- qualité ;
- disponibilité ;
- taille du contexte.

---

# 23. MCP capability layer

Capacités envisagées :

```text
watchtower.ban.resolve
watchtower.cadastre.lookup
watchtower.sirene.search
watchtower.bodacc.search
watchtower.dvf.search
watchtower.rne.lookup
watchtower.osm.query
watchtower.archive.search
watchtower.case.create
watchtower.case.addObservation
watchtower.case.addRelation
watchtower.graph.findPath
watchtower.graph.findContradictions
watchtower.evidence.verify
watchtower.entity.resolveCandidate
watchtower.world.scanZone
watchtower.world.measure
watchtower.world.lineOfSight
```

MCP ne doit pas supprimer les politiques de sécurité : chaque capability passe par le registry et ses gates.

---

# 24. UI / cognitive workspace

## 24.1 Vues principales

- Globe ;
- carte 2D ;
- terrain 3D ;
- bâtiment ;
- graphe ;
- timeline ;
- evidence graph ;
- source inspector ;
- entity fiche ;
- case panel ;
- contradiction queue ;
- validation queue ;
- task queue ;
- worker monitor ;
- budget/quota ;
- report builder.

## 24.2 Toolbox sémantique

- loupe/search ;
- map/spatial ;
- clock/temporal ;
- fiche/entity ;
- thread/relation ;
- document/source ;
- camera/image/video ;
- marker/annotation ;
- scale/comparison ;
- verification ;
- graph ;
- history.

---

# 25. Mental Palace / Cognitorium layer

Le palais mental n'est pas seulement une visualisation décorative.

Il doit devenir une méthode d'organisation cognitive :

- pièces = contextes ;
- objets = entités ;
- murs = relations ;
- tableaux = questions ;
- fils = preuves/relation ;
- archives = temporalité ;
- zones = thèmes ;
- positions = importance, certitude, chronologie ou catégorie selon le mode choisi.

Une entité doit pouvoir exister simultanément :

- sur la carte ;
- dans le graphe ;
- dans la timeline ;
- dans le palais mental ;
- dans la fiche.

Ce sont des vues différentes d'une même donnée canonique.

---

# 26. Knowledge gaps / Next Best Action

Le système doit afficher ce qui manque.

Exemples :

```text
UNKNOWN
├── address not confirmed
├── historical activity unresolved
├── source conflict
└── entity match uncertain
```

Puis proposer la prochaine action la plus utile :

- faible coût ;
- faible risque ;
- forte valeur informative ;
- facilement réversible.

---

# 27. Anomaly Engine

Détecter les divergences :

- adresse ;
- nom ;
- date ;
- coordonnées ;
- activité ;
- statut ;
- géométrie ;
- historique ;
- source ;
- relation.

Une anomalie crée une **QUESTION**, jamais une accusation.

---

# 28. Comparison Engine

Comparer deux entités, deux lieux ou deux snapshots :

```text
MATCH
DIFFERENCE
UNKNOWN
CONTRADICTION
NEW
REMOVED
CHANGED
```

Cas particulièrement utile :

- bâtiment 2020 vs 2026 ;
- entreprise avant/après ;
- quartier avant/après ;
- deux sources ;
- deux hypothèses ;
- deux scénarios.

---

# 29. Reporting

Le rapport final doit contenir :

1. objet ;
2. question ;
3. périmètre ;
4. méthodologie ;
5. sources ;
6. faits ;
7. observations ;
8. relations ;
9. chronologie ;
10. correspondances ;
11. hypothèses ;
12. contradictions ;
13. inconnues ;
14. analyses spatiales ;
15. analyses 3D ;
16. validations humaines ;
17. limites ;
18. annexes ;
19. provenance détaillée.

Principe : **aucune affirmation importante sans chemin de provenance.**

---

# 30. Audit trail

La question centrale de Watchtower doit pouvoir être :

> « Pourquoi dis-tu cela ? »

Réponse traçable :

```text
CLAIM
 ↓
OBSERVATION
 ↓
EXTRACTION
 ↓
DOCUMENT / RESPONSE
 ↓
SOURCE
 ↓
QUERY / PARAMETERS
 ↓
WORKER VERSION
 ↓
RETRIEVED AT
```

---

# 31. Budget / resource governor

Suivre :

- appels API ;
- quotas ;
- CPU ;
- GPU ;
- stockage ;
- temps ;
- tokens LLM ;
- taille des données ;
- fréquence des refresh.

Le planner doit pouvoir arbitrer qualité/coût/temps.

---

# 32. Architecture des données cible

```text
CASE
 │
 ├── ENTITY*
 │    ├── attributes
 │    ├── aliases
 │    ├── externalIds
 │    └── temporalValidity
 │
 ├── OBSERVATION*
 │    ├── claim
 │    ├── evidenceType
 │    ├── method
 │    ├── provenance
 │    └── validation
 │
 ├── SOURCE*
 │
 ├── RELATION*
 │    ├── predicate
 │    ├── temporalValidity
 │    └── evidence
 │
 ├── EVENT*
 ├── QUESTION*
 ├── HYPOTHESIS*
 ├── CONTRADICTION*
 ├── KNOWLEDGE_GAP*
 ├── TASK*
 ├── ACTION*
 ├── SNAPSHOT*
 └── AUDIT_LOG*
```

---

# 33. Roadmap consolidée

## Phase 0 — Foundations

- [x] vocabulaire FACT/INFERENCE/HYPOTHESIS/UNKNOWN ;
- [x] première registry source ;
- [x] état local ;
- [x] export JSON ;
- [x] workbench isolé ;
- [ ] schéma canonique versionné ;
- [ ] Entity / Observation / Source / Relation / Event / Question / Validation ;
- [ ] provenance complète ;
- [ ] temporalité ;
- [ ] contradiction ;
- [ ] knowledge gaps.

## Phase 1 — Evidence & Case Core

- [ ] `.wtcase.json` ;
- [ ] audit log ;
- [ ] validation workflow ;
- [ ] confidence components ;
- [ ] source independence ;
- [ ] snapshots ;
- [ ] reproducibility ;
- [ ] privacy export profiles.

## Phase 2 — Knowledge Graph

- [ ] graphe canonique ;
- [ ] evidence graph ;
- [ ] temporal graph ;
- [ ] paths ;
- [ ] clusters ;
- [ ] candidate entity resolution ;
- [ ] contradictions.

## Phase 3 — World / Spatial Engine

- [ ] Cesium selection → entity ;
- [ ] building/address/parcel/location adapters ;
- [ ] zone scan ;
- [ ] 3D building explorer ;
- [ ] measurement ;
- [ ] visibility ;
- [ ] temporal snapshots ;
- [ ] environment ;
- [ ] solar/shadow ;
- [ ] flow/path ;
- [ ] manual world objects.

## Phase 4 — Public-data workers

- [ ] BAN ;
- [ ] Cadastre ;
- [ ] SIRENE ;
- [ ] BODACC ;
- [ ] DVF+ ;
- [ ] RNE ;
- [ ] OSM ;
- [ ] Wayback.

## Phase 5 — Investigation Engine

- [ ] planner ;
- [ ] worker registry ;
- [ ] cache ;
- [ ] rate-limit governor ;
- [ ] next-best-action ;
- [ ] anomaly engine ;
- [ ] comparison engine ;
- [ ] report builder.

## Phase 6 — AI / MCP

- [ ] MCP capabilities ;
- [ ] Ollama adapter ;
- [ ] remote model adapter ;
- [ ] explainable agent actions ;
- [ ] structured extraction ;
- [ ] agent planner.

## Phase 7 — Mental Palace

- [ ] rooms ;
- [ ] evidence wall ;
- [ ] entity objects ;
- [ ] relation threads ;
- [ ] timeline wall ;
- [ ] snapshots ;
- [ ] investigation replay.

## Phase 8 — Production

- [ ] offline/local-only ;
- [ ] import/export ;
- [ ] permissions ;
- [ ] collaboration ;
- [ ] case merge ;
- [ ] retention policies ;
- [ ] encrypted local storage if needed ;
- [ ] reproducible reports.

---

# 34. Priorités d'implémentation

**Ne pas connecter immédiatement toutes les sources.**

Ordre recommandé :

```text
CANONICAL MODEL
      ↓
EVIDENCE + CASE CORE
      ↓
TEMPORAL + PROVENANCE
      ↓
GRAPH
      ↓
CESIUM ↔ ENTITY
      ↓
BUILDING / WORLD ENGINE
      ↓
WORKERS
      ↓
PLANNER
      ↓
AI / MCP
      ↓
MENTAL PALACE
```

Le principe directeur est : **solidifier le modèle avant de multiplier les connecteurs.**

---

# 35. Ce que l'étude 3D Urban Scanner apporte

Le produit étudié met particulièrement en avant :

- cartographie 3D urbaine ;
- scan d'une zone ;
- reconstruction de bâtiments ;
- génération/visualisation d'intérieurs ;
- vues X-Ray ;
- étage par étage ;
- mesures ;
- ligne de vue ;
- occupation ;
- évacuation ;
- météo ;
- étude solaire ;
- dessin manuel ;
- rapports PDF.

**Interprétation Watchtower :** ces fonctionnalités sont à traiter comme des capacités du `WORLD ENGINE`, puis à relier au `KNOWLEDGE ENGINE` et au `CASE ENGINE`, plutôt que comme un produit séparé.

Source produit : https://sgpstore.net/products/3d-urban-scanner?variant=57986733867340

---

# 36. Sources et références

## Produit étudié

- SGP Store — 3D Urban Scanner : https://sgpstore.net/products/3d-urban-scanner?variant=57986733867340
- SGP Store — catalogue / contexte produit : https://sgpstore.net/

## Cadre juridique / données publiques

- CNIL — Comment réutiliser les données diffusées : https://www.cnil.fr/fr/comment-reutiliser-les-donnees-diffusees
- CNIL — Cadre juridique applicable à la publication en ligne et à la réutilisation des données des administrations : https://www.cnil.fr/fr/cadre-juridique-applicable-donnees-administrations
- Légifrance — Code pénal, article 323-1 : https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000047052655/

## Sources de données à privilégier

- Géoplateforme / IGN — https://geoservices.ign.fr/
- Adresse Nationale / BAN — https://adresse.data.gouv.fr/
- data.gouv.fr — https://www.data.gouv.fr/
- INSEE / SIRENE — https://www.insee.fr/fr/information/6056305
- BODACC — https://www.bodacc.fr/
- INPI / RNE — https://data.inpi.fr/
- OpenStreetMap — https://www.openstreetmap.org/
- Overpass API — https://overpass-api.de/
- Internet Archive / Wayback Machine — https://web.archive.org/

## Outils OSINT / analyse

- Bellingcat Toolkit — https://bellingcat.gitbook.io/toolkit
- SpiderFoot — https://github.com/smicallef/spiderfoot
- Maigret — https://github.com/soxoj/maigret
- Sherlock — https://github.com/sherlock-project/sherlock
- Amass — https://github.com/owasp-amass/amass
- ExifTool — https://exiftool.org/

---

# 37. Garde-fous non négociables

WATCHTOWER ne doit pas :

- contourner une authentification ;
- contourner une mesure de contrôle d'accès ;
- lancer une reconnaissance active non autorisée ;
- présenter une inférence comme un fait ;
- fusionner automatiquement deux personnes sur des indices faibles ;
- transformer l'open data en index personnel sans politique de minimisation ;
- supprimer la provenance derrière une réponse IA ;
- traiter plusieurs copies d'une même donnée comme des confirmations indépendantes ;
- transformer une anomalie en accusation ;
- confondre une simulation 3D avec une observation réelle.

La présence d'une donnée en accès public n'élimine pas les obligations de protection des données ni les conditions de réutilisation. La CNIL rappelle notamment que la réutilisation de données personnelles publiques constitue elle-même un traitement soumis au RGPD. L'article 323-1 du Code pénal interdit l'accès ou le maintien frauduleux dans un système de traitement automatisé de données. Voir les sources officielles ci-dessus.

---

# 38. Critère de réussite architectural

Une fonctionnalité Watchtower est considérée correctement intégrée si elle peut répondre à ces cinq questions :

1. **Qu'est-ce que c'est ?** → ENTITY.
2. **D'où vient cette information ?** → SOURCE / PROVENANCE.
3. **Quand est-elle vraie/observée ?** → TEMPORAL MODEL.
4. **Pourquoi Watchtower la croit-elle ?** → EVIDENCE / VALIDATION.
5. **Comment cette information s'insère-t-elle dans l'enquête ?** → CASE / GRAPH / QUESTION.

Si une fonctionnalité 3D, OSINT, IA ou cartographique ne peut pas se rattacher à ces primitives, elle doit rester une vue ou un outil auxiliaire, pas devenir une nouvelle base de vérité parallèle.
