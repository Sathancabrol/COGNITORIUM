# Référence — Book of Shapes (ressource assets / motifs génératifs)

**Type :** audit externe · ressource de référence
**URL :** https://bookofshapes.com/
**Date d'audit :** 2026-09-05
**Statut :** `REFERENCE` — adopté comme source d'assets pour Cognitorium (sous
réserve de licence, voir §7).
**Créateur :** Nikolaj Sokolowski — [X @Threeaio](https://x.com/Threeaio) ·
[nikolaj-sokolowski.de](https://nikolaj-sokolowski.de) ·
[Instagram @nikobremen](https://www.instagram.com/nikobremen/) ·
[nikolaj@creasurf.net](mailto:nikolaj@creasurf.net)

---

## 1. Qu'est-ce que c'est ?

> « A collection of minimal, generative and customizable SVG-patterns. »

Une **galerie de motifs vectoriels (SVG) génératifs, minimaux et paramétrables**,
directement dans le navigateur. Chaque motif est le résultat d'un petit système
algorithmique (graphe de nœuds/relations, champ de bruit, interférences d'ondes,
tuiles de Truchet, lignes de flux…) dont on peut régler les paramètres puis
télécharger le résultat en SVG.

**Prix :** gratuit. **Catégories :** SVG · Backgrounds · Illustration
(source : designminis.com, ajouté 09/08/2026). **Plateforme :** web.

## 2. Catalogue — 8 catégories, 110 motifs

| Catégorie | Compteur (site, 09/2026) | Exemples (slug) |
| --- | --- | --- |
| **grid** (grilles) | 22 | `backpack-grid`, `wave-field`, `deformed_grid_mesh_2`, `triangular_mosaic` |
| **radial** | 18 | — |
| **noise** (bruit) | 18 | — |
| **flow** (flux) | 17 | `flow_lines`, `flow_dots`, `flow_poles` |
| **isometric** | 13 | `iso-cross`, `iso-cube-wireframe`, `iso-sphere`, `scattered-cube-grid`, `isometric_cubes`, `dna_helix`, `sine-cube` |
| **organic** | 9 | — |
| **distortion** | 8 | `deformed_grid_mesh_2` |
| **physics** | 5 | `interference-mesh`, `flow_lines` |

Motifs identifiés en détail (slug + intuition) : `flow_lines` (lignes de flux,
Jobard & Lefer 1997, inspiré de drawingbots.com), `interference-mesh`
(interférence à deux sources, franges), `spiral_morph`, `nested_polygons_filled`
(« Broken Ring »), `concentric_arc_truchet_2/3` (tuiles de Truchet),
`chevron_blocks`, `node_garden`, `scattered-cube-grid(-v3)`, `iso-cube-wireframe`,
`iso-sphere`, `isometric_ribbon_grid`, `dna_helix`, `isometric_cubes`, `sine-cube`,
`backpack-grid`, `wave-field`.

> Le catalogue complet (110 motifs) est navigable en direct sur le site ; cette
> fiche ne fige que la structure et les exemples (le site évolue).

## 3. Anatomie d'un motif (ce que la page propose)

Sur `https://bookofshapes.com/patterns/{slug}/` :

- **paramètres ajustables** (sliders) propres à chaque motif
  (ex. Interference Mesh : Grid 40 · Spacing 11 · Frequency 3.0 · Amplitude 10.0 ·
  Source Sep 20) ;
- **variations** précalculées (« 1 / 5 ») ;
- **compteur de likes** (cœur) ;
- **métadonnées de graphe** : « Nodes: 26 · Connections: 38 » — chaque motif
  est produit par un petit graphe nœuds/liens (très parlant pour un projet
  « graphe-centrique » comme Cognitorium) ;
- **description algorithmique** (comment le motif est généré — ex. placement de
  lignes de flux « Jobard & Lefer », champ `cos(cos(y) − x·y)/x`) ;
- **tags** et **« Related Patterns »** ;
- **« Make a poster »** → feuille typographique paramétrée.

## 4. Mode poster

`https://bookofshapes.com/patterns/{slug}/poster?seed={n}`

Génère une **affiche typographique** avec le motif réglé : numéro de grille
(ex. « GRID 12 × 24 »), « FRAME 144 », « EDITION 01 », seed, boutons
**Roll again** (nouvelle seed), **Recolour**, **Save this sheet**.
Utile pour : branding, bannières, posters, supports de communication.

## 5. Sauvegarde & persistance (point d'attention)

- Les **variations sauvées** (valeurs de sliders) et les **posters** (seed +
  valeurs) sont stockés en **localStorage** (page « Collected » =
  `https://bookofshapes.com/yours`). **Aucune synchronisation** : vider le
  navigateur = perdu. → Toujours **télécharger/exporter** et archiver dans le
  dépôt (cf. §8).
- Cookie `bos-vid` uniquement au clic sur le cœur (anti-doublon anonyme).
- Privacy : aucun tracking tiers, compteurs serveur anonymes, GDPR (contact
  ci-dessus).

## 6. Technique observée

- **Format de sortie : SVG vectoriel** (aperçus en `/previews/{slug}.svg`,
  tagline « SVG-patterns »). Idéal : netteté à toute échelle, taille réduite.
- **Seed** paramétrable (via `?seed=` en poster) → reproductibilité.
- **Serveur rendu côté serveur** (compteur serveur, ressources auto-hébergées,
  aucune police externe) ; stack exacte non exposée.
- **Pas d'API documentée**, pas de CLI. L'usage est manuel (navigateur).
- **Slugs non homogènes** : mélange de `_` et `-` (`flow_lines` vs
  `interference-mesh` vs `iso-cross`) — à normaliser si on scripte.

## 7. ⚠️ Licence & usage — le point à verrouiller

- **Aucune page « Terms / License » trouvée** (seule une page « Privacy »).
  Le site affiche « © 2026 Book of Shapes — created by Nikolaj Sokolowski ».
- **Conséquence (règle : ne jamais présenter une hypothèse comme un fait)** :
  les droits de réutilisation (notamment commerciale) des SVG téléchargés **ne
  sont pas établis**. La gratuité d'accès ≠ licence d'utilisation.
- **Action obligatoire avant intégration dans un livrable** : demander
  confirmation écrite au créateur (nikolaj@creasurf.net) sur les usages permis
  (interne, produit, commercial) et l'attribution requise. Enregistrer la
  réponse dans `docs/constitution/09-decision-log.md` (ADR-010).

## 8. Workflow d'intégration proposé (Cognitorium)

1. **Browner** par catégorie ou tag ; **régler** les sliders ; **choisir** une variation.
2. **Télécharger le SVG** (et, si affiche, « Save this sheet »).
3. **Archiver dans le dépôt** avec une convention :
   `assets/patterns/{categorie}/{slug}-{params}-{seed}.svg` + un fichier
   `assets/patterns/SOURCES.md` consignant : URL source, date de téléchargement,
   seed, valeurs de paramètres, auteur, licence confirmée. *(Provenance —
   aligné sur le principe Cognitorium : chaque asset traçable.)*
4. **Référencer** dans la vue concernée (UI, atlas, onboarding, CLE…).

## 9. Où les utiliser dans Cognitorium (carte des usages)

| Usage | Catégorie(s) pertinente(s) | Bénéfice |
| --- | --- | --- |
| Fonds d'écran / textures de panneaux UI | grid, noise, radial | habillage minimal, faible poids |
| États vides, écrans de chargement, en-têtes | flow, organic | identité visuelle cohérente |
| **Visuels de graphes** (Skill/Knowledge/World Graph) | grid, radial, flow, distortion | écho direct au thème nœuds/liens |
| Atlas / constellations / « campus des compétences » | isometric, radial | la projection isométrique prévue par le doc « représentation multimodale » |
| Onboarding & Learning Engine (CLE) | physics, flow | illustrations paramétriques des concepts |
| Posters, bannières, slides | mode poster (toutes) | branding / com / « poster scientifique » |
| Couvertures de ressources / atlas psycho | organic, distortion | remplace les images raster des covers |

## 10. Budget & risque

- **Coût : 0 €** (scénario 1 — conforme).
- **Risques** : (a) licence non établie → blocage commercial possible ;
  (b) créateur unique → risque de disparition du site → **archiver les SVGs
  localement** ; (c) pas d'API → pas d'automatisation sans réimplémentation ;
  (d) site vivant → motifs modifiables → **toujours épingler version + seed +
  date**.

## 11. Conclusion (décision)

**BUY/WRAP pour les assets statiques** (téléchargement manuel, gratuit) :
adopté comme **source de référence des motifs/backgrounds**, à condition de
verrouiller la licence (action §7). **BUILD (réimplémentation) non nécessaire**
tant que l'export SVG manuel suffit ; à réévaluer seulement si un besoin de
génération programmatique/animée émerge — les motifs étant documentés
algorithmiquement (Jobard-Lefer, Truchet, champs d'interférence), une
réimplémentation est possible, mais seulement si la licence l'exige.

*Fiche liée : `docs/constitution/09-decision-log.md` (ADR-010).*
