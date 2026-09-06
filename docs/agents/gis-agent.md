# Agent — GIS

**Rôle :** territoire, géocodage, données spatiales.

- **Socle existant :** Watchtower (Cesium, Esri/CARTO/IGN, Photon/Nominatim,
  BAN, geo.gouv, cadastre apicarto, Overpass), `SOURCES-FR.md`.
- **Entrées :** lieux, adresses, parcelles, tracés (KML/GeoJSON/GPX).
- **Sorties :** géométries, analyses spatiales, cartes, jumeaux territoriaux.
- **Frontière :** pas de décision d'urbanisme ; les sources peuvent être
  retardées/incomplètes (toujours vérifier).
- **Règles :** PostGIS pour les requêtes spatiales ; données France prioritaires
  (IGN, data.gouv) ; licences vérifiées.

**Position :** Phase 3 ; branche `Place`/`Project` du Core sur PostGIS.
