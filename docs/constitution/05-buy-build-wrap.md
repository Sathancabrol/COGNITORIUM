# 05 — Buy / Build / Wrap

**Statut :** `CONSTITUTION` · v1 · Septembre 2026
**Source :** Master Brief §14, §15, §19

---

## Cadre de décision

Pour chaque brique, remplir la fiche :

```text
PROJET · EXISTE ? · OPEN SOURCE ? · API ? · PRIX ? · LICENCE ? · MATURITÉ ?
QUALITÉ ? · INTÉGRABLE ? · LIMITATIONS ?
```

Puis décider :

- **BUY** — utiliser une solution existante ;
- **BUILD** — développer nous-mêmes ;
- **WRAP** — construire notre couche autour d'une technologie existante ;
- **REPLACE** — commencer avec une solution puis la remplacer.

## Audit externe obligatoire (open source)

Chercher notamment : GitHub · Hugging Face · OpenStreetMap · standards
industriels · bibliothèques scientifiques · moteurs 3D · moteurs CAD ·
simulateurs · frameworks IA.

## Audit externe obligatoire (commercial)

Comparer : Palantir · NVIDIA · Google · Autodesk · Dassault Systèmes · Siemens ·
Unity · Unreal · Blender · FreeCAD · Onshape · etc.

## Règle

> Ne jamais développer pendant six mois une technologie déjà disponible
> gratuitement ou à faible coût.

## Outils à évaluer (liste ouverte)

- **Développement** : GitHub, VS Code, agents de code, CI/CD, Docker.
- **Web** : Next.js / React, TypeScript.
- **Graph** : Neo4j, PostgreSQL + extensions, RDF/SPARQL, graphe embarqué.
- **Géospatial** : Cesium, MapLibre, Mapbox, OpenStreetMap, PostGIS.
- **3D** : Three.js, Babylon.js, Blender, OpenCascade, FreeCAD, formats STEP/STL/OBJ/GLTF.
- **IA** : OpenAI, Anthropic, Google, modèles open source, Hugging Face, embeddings, agents, vision, génération 3D.
- **Simulation** : NVIDIA Omniverse, Isaac Sim, moteurs physiques, simulateurs spécialisés, solutions scientifiques.

Chaque choix documenté dans `09-decision-log.md`.
