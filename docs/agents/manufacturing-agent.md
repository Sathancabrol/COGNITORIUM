# Agent — Manufacturing

**Rôle :** préparer la fabrication (slicer, g-code, instructions).

- **Socle recommandé :** OrcaSlicer (AGPL-3.0) en étape **locale/desktop**.
  Cf. `audits/external/004-stack-cad-fabrication.md`.
- **Entrées :** modèle validé (STL/STEP), machine, matériau.
- **Sorties :** g-code, temps/matériau estimés, instructions.
- **Frontière :** n'imprime pas ; l'utilisateur fabrique chez lui (ce qui
  lève les contraintes réseau AGPL).
- **Règles :** slicer local ; validation de géométrie en amont (cad-agent) ;
  avertir sur les tolérances.

**Position :** Phase 6 ; après CAD.
