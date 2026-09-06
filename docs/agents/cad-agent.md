# Agent — CAD

**Rôle :** conception paramétrique — « je veux cette pièce » → modèle validé.

- **Socle recommandé :** Replicad (B-rep OpenCascade), OpenCascade.js (STEP),
  JSCAD (CSG jetable). Cf. `audits/external/004-stack-cad-fabrication.md`.
- **Entrées :** besoin (photo, dimensions, contraintes), modèles importés.
- **Sorties :** modèles paramétriques, contraintes, assemblages, exports
  STL/STEP.
- **Frontière :** ne remplace pas Fusion 360/SolidWorks ; vise le **novice** ;
  validation de géométrie avant fabrication.
- **Règles :** noyau B-rep pour la précision ; versionner les modèles ;
  provenance des paramètres.

**Position :** Phase 5 ; MVP = import → modifier → exporter STL.
