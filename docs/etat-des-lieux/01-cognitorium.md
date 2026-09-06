# 01 — Dépôt racine : COGNITORIUM

**Rôle :** vitrine / agrégateur + 2 sous-projets actifs (`learning/`,
`watchtower-mods/`). Décrit par son README comme « outils de visualisation
cognitive — cognitive tool visualization ».
**Maturité :** PoC.
**Dépôt :** `Sathancabrol/COGNITORIUM`.

## Structure

```
COGNITORIUM/
├── README.md                  # vitrine : Learning Engine PoC v0.1
├── *.png / *.jpg (~18 Mo)     # images générées (illustrations, non fonctionnelles)
├── learning/                  # Cognitorium Learning Engine (CLE) — PoC
│   ├── ARCHITECTURE.md        # modèle CLE (5 moteurs + boucle)
│   ├── index.html             # menu des PoC
│   ├── learning-engine.js     # scénario « turboréacteur » (statique)
│   ├── money-poc.html         # PoC « Comprendre l'argent » (UI)
│   ├── money-poc.js           # PoC argent (9 niveaux, données)
│   ├── money-poc.css          # vide (0 ligne)
│   └── styles.css             # 1 ligne (stub)
└── watchtower-mods/           # fork « Watchtower » de gods-eye-view
    ├── README.md              # doc fork + README upstream
    ├── SOURCES-FR.md          # catalogue sources FR gratuites
    ├── APPLIQUER.md           # procédure de reconstruction du dépôt
    ├── index.html             # page racine (925 l.)
    ├── vite.config.js         # proxy serveur dev + defines (7 821 l.)
    └── src/                   # 57 modules + voice/ (delta sur l'upstream)
```

## `learning/` — Cognitorium Learning Engine (CLE)

### Modèle (ARCHITECTURE.md)

Pipeline : `Situation → Problème → Action → Conséquence → Nouveau problème →
Découverte → Formalisation → Transfert → Évaluation → mise à jour du Skill Graph`.
Le savoir **émerge** de la résolution de problèmes, il n'est pas exposé d'abord.

5 moteurs :
- **Scenario Engine** — orchestration des situations pédagogiques ;
- **Challenge Engine** — contraintes, choix, erreurs, conséquences, difficulté ;
- **Cognitive Engine** — opérations cognitives mobilisées (descriptif, non clinique) ;
- **Skill Graph Engine** — état des concepts (découvert/compris/appliqué/transféré/maîtrisé/fragile) ;
- **Adaptive Learning Loop** — adaptation du défi suivant.

### PoC 1 — « Construis un turboréacteur » (`learning-engine.js`, 15 l.)

Scénario statique en 6 étapes (Situation/Problème/Découverte/Synthèse) avec
choix binaires et graphe latéral de concepts (Ventilation → Aubes directrices →
Compresseur → Combustion → Turbine → Tuyère).

### PoC 2 — « Comprendre l'argent » (`money-poc.js`, 20 l. de données)

9 niveaux : troc → double coïncidence → monnaie → prix → épargne → crédit →
intérêt → inflation → investissement. Feedback explicatif, concepts associés,
liens previous/next, anneau de « compréhension » (En construction → Émergence →
Structuration → Intégration), question de transfert notée lexicalement,
sauvegarde `localStorage` (`cognitorium-money-poc`).

## `watchtower-mods/` — interface « monde » 3D gratuite

Fork de `bilawalsidhu/gods-eye-view` (commit upstream `65bc522`). Principe :
**chaque fonction payante a un équivalent gratuit sans clé**.

> ⚠️ **Point de structure capital** : `watchtower-mods/src/` est un **delta**.
> 38 modules sont importés mais **absents** du dépôt (ils viennent de
> l'upstream) : tout `src/data/*` (manager, flights, militaryFlights,
> earthquakes, satellites, rocketLaunches, traffic, cctv, radio, bikeshare,
> aisLiveVessels, militaryInstallations, militaryAwareness, localLayers,
> layerState, dataCredits, detection, detectionPolicy, geoid, groundFloor,
> meshFloorSampler, militaryAwarenessEngine, regionalBrief, tr3bRegistry,
> trackedReadout), `src/scenes/director.js`, `src/annotations/*`,
> `src/overlays/worldOverlay.js`, `src/styles/*` (anime/noir/retro/snow/
> surveillance/thermal), `src/voice/gevRealtime.js` + `gevActions.js`,
> `src/gevActions.js`. La procédure `APPLIQUER.md` documente la reconstruction.

### Équivalents gratuits (tableau du README)

| Fonction | Payant | Gratuit (ce fork) |
| --- | --- | --- |
| Globe 3D photoréaliste | Google Maps | Esri satellite |
| Carte routière | — | CARTO Voyager (OSM) |
| Recherche de lieux | Google Geocoding | Photon → Nominatim |
| Commandes vocales | OpenAI Realtime | Web Speech FR/EN |
| Feux actifs | NASA FIRMS | NASA EONET |
| Navires | AISStream | couche désactivée proprement |
| Trafic | TomTom | couche dégradée proprement |

### Inventaire détaillé `src/` (fichier → rôle)

**Cœur / bootstrap**
- `main.js` (497) — câblage : ouvre la start gate, choisit le fond de carte,
  enregistre les couches de données, monte les modules Watchtower.
- `startGate.js` (468) — écran MODE GRATUIT / MODE PAYANT (clés mémorisées
  localStorage, pré-validées au démarrage).
- `keySetup.js` (350) — panneau « POWER UP » (clés via `/api/setup`, écrit `.env`,
  redémarre le serveur dev).
- `mapStackController.js` (547) — commutation fond de carte (Google 3D / Esri /
  OSM / ion / Bing).
- `mapStartup.js` (51) — choix du meilleur fond au démarrage (google-direct /
  google-ion / osm).
- `mapStackChips.js` (145) — puces de sélection du fond.
- `paywallGate.js` (144) — garde-fou MODE GRATUIT (boîte « OBTENIR MA CLÉ ↗ »).

**Navigation / caméra**
- `cameraVerbs.js` (1 157) — verbes caméra (fly_route, orbite, cadrage…).
- `camera.js` (76) — presets de lieux (Austin par défaut).
- `orbit.js` (91) — contrôleur d'orbite (touche O).
- `navigationPolicy.js` (135) — politique de propriété caméra.
- `worldFocus.js` (83) — transfert caméra vers une cible de couche.
- `minimap.js` (172) — mini-carte (second viewer Cesium).
- `logoGaze.js` (151) — animation du logo.

**HUD / cockpit / style**
- `hud.js` (858) — HUD « reconnaissance » (MGRS, GSD, NIIRS, horodatage).
- `frenchHud.js` (53) — traduction FR du HUD (dictionnaire).
- `hudLocality.js` (54) — ligne « NEAR <lieu> » du HUD.
- `hudSummaryResponse.js` (35) — résumé HUD sans clé (pas d'échec HTTP).
- `cockpitMath.js` (326) / `cockpitTracking.js` (92) / `cockpitUtilityLayout.js`
  (79) / `cockpitVisionPolicy.js` (44) — maths, transaction d'entrée, layout,
  modes de vision du cockpit.
- `cockpitCloudEffects.js` (530) — nuages volumétriques météo du cockpit.
- `visualFilters.js` (114) — filtres GPU CSS (nuit, thermique, N&B…).
- `scopeMask.js` (529) — masque circulaire signature.
- `celestialRing.js` (714) — anneau céleste NVG/FLIR + fondu de détection.
- `bloom.js` (82) — normalisation de l'intensité bloom (migration v1→v2).
- `compassTape.js` (166) — boussole ruban de cap façon FPS.
- `splitFlap.js` (521) — animation « panneau d'aéroport » des statuts.
- `firstRunExperience.js` (647) — lanceur de mission au premier lancement.
- `flightMode.js` (273) — mode pilotage libre (POV drone, HUD fenêtré).

**Données territoriales / métiers**
- `chantier.js` (1 004) — **hub chantier v3** (prospection BOAMP, dossier,
  phasage 4D, gestion budget/inventaire, équipe, simulation, GPS, sous-sol OSM).
- `intelTwin.js` (1 016) — **mode intel « jumeau numérique » v2** (KPI cliquables,
  civilisation territoriale, profil « carte d'identité cognitive T0 »).
- `ficheLieu.js` (497) — fiche lieu « digital twin » au clic (OSM, Wikipédia,
  BAN, geo.gouv).
- `posteCommandement.js` (350) — vues de démarrage (explorer/individu/lieux/
  historique/favoris).
- `watchtowerExtras.js` (480) — panneau français (INFO VUE, MÉTÉO, DOMICILE,
  VUES ★, IMPORT KML/KMZ/GeoJSON/GPX).
- `nearbyPlaces.js` (265) — « MOI » (géoloc navigateur, adresse, domicile, POV rue).
- `locations.js` (1 150) — points d'intérêt par ville (5 POI chacune).
- `osmBuildings3D.js` (209) — bâtiments 3D gratuits par extrusion OSM (v14).
- `cctvCam.js` (241) — caméras gratuites (Windy Webcams, MapCam).
- `displayOptions.js` (203) — calques (pluie RainViewer, nuages IR, relief, labels).
- `chatConsole.js` (170) — console textuelle FR sans clé.

**Politiques / plomberie**
- `contactsDetectionPolicy.js` (173), `contextModePolicy.js` (384),
  `cctvFocusPolicy.js` (81), `cctvFocusRequest.js` (67),
  `rightRailPolicy.js` (48), `panelStackLayout.js` (149),
  `loadingFeedback.js` (301), `locationStatus.js` (65),
  `renderGovernor.js` (137) — gouvernance du rendu idle (perf),
  `sharelink.js` (617) — partage par hash d'URL,
  `mobiDock.js` (226) — dock bas d'écran « MobiGlas »,
  `draggable.js` (29) — fenêtres déplaçables,
  `weatherEffectsMath.js` (78), `ui.js` (10 310, upstream).

**Voix**
- `voice/freeVoice.js` (296) — commandes vocales gratuites Web Speech FR/EN,
  parsées en appels d'outils identiques à l'agent payant.

### `SOURCES-FR.md` — données France gratuites (catalogue)

IGN Géoplateforme (ortho 20 cm, Plan IGN), Esri, Sentinel-2 (Copernicus),
« Remonter le temps » IGN, Open-Meteo, RainViewer, Météo-France, Bison Futé,
transport.data.gouv.fr, TomTom, IGN LiDAR HD, BD TOPO bâtiments 3D, OSM
Buildings, BAN, annuaire Service-Public, data.gouv.fr, Géorisques, cadastre.
+ feuille de route « mode chantier 4D » (base → GPS Traccar → phasage → 4D →
IFC→glTF via IfcOpenShell).

### `vite.config.js` (7 821 l.)

Proxy serveur dev pour 15 sources (OpenSky, CelesTrak, Overpass, GBFS, CCTV,
adsb.lol, AIS, terrain Re:Earth, TomTom, FIRMS, installations militaires,
briefing régional, météo Open-Meteo, lancements, Radio Browser) + exposition
des clés Cesium/Google via `import.meta.env`.

## Réutilisable pour la vision

- **CLE** → pilier « Apprentissage » (Phase 2) ; à passer sur schéma JSON.
- **Watchtower** → pilier « Gods Eye View / World » (Phase 3) ; `intelTwin`
  préfigure le « World Graph + profil cognitif T0 » ; `chantier.js` préfigure
  « Projets + territoire + 4D ».
- **SOURCES-FR.md** → base de l'audit externe données France.

## Gaps / issues

- `learning/` : scénarios en dur, pas de moteur de règles, pas de persistance
  Skill Graph, non branché au graphe global (cf. ARCHITECTURE.md « prochaines étapes »).
- `watchtower-mods/` : delta incomplet sans l'upstream ; dépôt cible `watchtower`
  vide ; `ui.js` 10 k lignes (monolithe hérité).
- ~18 Mo d'images générées à la racine (nettoyage à prévoir).
