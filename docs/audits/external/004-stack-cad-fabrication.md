# 004 — Stack CAD & fabrication (Phases 5-6)

**Type :** audit externe (technologie)
**Date :** 2026-09-05 · **Statut :** `RECOMMANDATION` (ADR à ouvrir au lancement de la Phase 5)

---

## Besoin (rappel vision §8)

Workflow cible : `Créer → Importer → Modifier → Mesurer → Valider → Vérifier la
géométrie → Préparer fabrication → Slicer → Impression 3D`. Premier objectif :
**un novice réalise une pièce utile** — pas recréer Fusion 360 / SolidWorks.

## Moteurs CAD (navigateur)

| Solution | Noyau | Verdict |
| --- | --- | --- |
| **Replicad** | **B-rep** (OpenCascade via WASM) | ✅ primaire : vrai noyau CAD, API type CadQuery, import STL/STEP |
| **OpenCascade.js** | B-rep (OpenCascade → WASM) | ✅ pour STEP import/export + opérations avancées |
| JSCAD | CSG / maillage (noyau OpenSCAD-like JS) | ⏸️ rapide pour protos CSG, mais congés/fillets difficiles, géométrie à résolution limitée |
| FreeCAD (desktop) + IfcOpenShell | B-rep (OCC) | ⏸️ outil « power user » + conversion IFC→glTF (feuille de route SOURCES-FR) |
| CascadeStudio / CadQuery | B-rep (OCC) | ⏸️ alternatives équivalentes à Replicad |

Analyse (sources) : les outils « Code-CAD » se divisent en **B-rep** (OpenCascade,
future-proof, optique/moulage/assemblages précis) vs **CSG/mesh** (JSCAD, rapide
mais limité pour les congés et les exports STEP). Replicad est un wrapper JS
d'OpenCascade.js taillé pour le navigateur, avec une API inspirée de CadQuery
(github sgenoud/replicad ; Irev-Dev/curated-code-cad ; ocjs.org).

## Slicers (fabrication)

| Solution | Licence | Verdict |
| --- | --- | --- |
| **OrcaSlicer** | **AGPL-3.0** | ✅ le plus populaire, 500+ imprimantes, CLI utilisable ; ⚠️ AGPL |
| PrusaSlicer | AGPL-3.0 | ✅ équivalent solide |
| CuraEngine / Bambu Studio | divers | ⏸️ alternatives |

> ⚠️ **Licence** : OrcaSlicer/PrusaSlicer sont **AGPL-3.0**. Exécution **locale /
> desktop** (le flux Phase 6 : l'utilisateur slice et imprime chez lui) = sans
> contrainte de réseau. Si un jour on héberge le slicer comme service en ligne,
> la clause réseau AGPL s'applique (obligation de fournir la source) → à
> réévaluer avant tout hébergement.

## Décision proposée (Phase 5-6)

1. **Replicad** (B-rep) comme moteur paramétrique navigateur ; **OpenCascade.js**
   pour importer/exporter STEP ; **JSCAD** pour des maquettes CSG jetables.
2. **OrcaSlicer** en étape locale/desktop (hors hébergement), via CLI.
3. Garder le pipeline « import → modifier → exporter STL » comme MVP, puis
   paramétrique, puis validation de géométrie, puis slicer (cf. brief §25).

## Sources

- https://github.com/sgenoud/replicad/discussions/106
- https://github.com/Irev-Dev/curated-code-cad
- https://ocjs.org/docs/about
- https://www.orcaslicer.com/ (AGPL-3.0, SoftFever)
