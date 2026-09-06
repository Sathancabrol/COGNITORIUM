# 07 — Registre des risques

**Statut :** `CONSTITUTION` · v1 · Septembre 2026
**Source :** Master Brief §20

Mis à jour en continu. Probabilité / Impact : faible · moyen · élevé · très élevé.

| Risque | Probabilité | Impact | Solution |
| --- | --- | --- | --- |
| coût IA | moyen | élevé | modèles hybrides, plafonds de session, cache |
| dépendance fournisseur | élevé | élevé | abstraction API (LLM / VectorDB / GraphDB / 3D / GIS) |
| complexité 3D | élevé | élevé | commencer simple (viewer → édition → validation) |
| simulation trop ambitieuse | élevé | élevé | scénarios ciblés, un problème à la fois |
| données insuffisantes | moyen | élevé | pipelines data, sources open data (IGN, OSM, data.gouv.fr) |
| dette technique | moyen | élevé | architecture modulaire, registre de décisions |
| hallucinations IA | élevé | élevé | vérification + sources + validation humaine |
| sécurité | moyen | très élevé | isolation + permissions + secrets hors du dépôt |
| dispersion multi-dépôts | élevé | moyen | constitution + roadmap unifiée + doublons traqués |
| secrets exposés (proto `raw/`) | faible | très élevé | déjà purgé (vérifié) ; rotation par prudence + `.gitignore` strict (voir audit §10) |

## Actions immédiates issues de l'audit v1

1. **Secrets** : vérifié 2026-09-04 — plus aucun identifiant en clair dans
   l'instantané proto (purge effectuée). Recommandé : **rotation** des
   identifiants ayant pu transiter par l'historique Git.
2. **Framing** : garder `ALLOW_FRAMING=1` réservé aux previews intégrées
   uniquement (déjà le cas dans Watchtower).
3. **Clés navigateur** : documenter la restriction des clés Google Maps /
   Cesium ion côté fournisseur (déjà documenté dans `watchtower-mods/README.md`).
