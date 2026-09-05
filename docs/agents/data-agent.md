# Agent — Data

**Rôle :** collecter, nettoyer, valider et versionner les données.

- **Sources existantes :** ROME/FORMACODE (`build_rome_data.py`), CSV 42 champs
  (`validate_entry.py`, `add_entry.py`), ontologie HCSM, open data France
  (`SOURCES-FR.md` : IGN, BAN, data.gouv, Open-Meteo…).
- **Entrées :** sources brutes (XLSX, CSV, PDF, API, GeoJSON).
- **Sorties :** jeux de données validés (schéma unifié), avec provenance,
  licence, date, checksum.
- **Frontière :** n'interprète pas ; ne décide pas de la qualité clinique.
- **Contrôles :** 28 champs obligatoires, DOI, triangulation, Trust Factor,
  doublons, secrets (aucun PII en clair).

**Position :** responsable des migrations vers le Core (liens 1, 2).
