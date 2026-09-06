# État des lieux — Cognitorium

**Statut :** documentation vivante · Septembre 2026
**Méthode :** lecture intégrale des 8 dépôts `Sathancabrol/*` (clones complets,
tous fichiers hors binaires lus). Aucun code modifié.

Ce dossier documente **tout ce qui existe**, dépôt par dépôt, fichier par
fichier. C'est la base factuelle de la gouvernance (`docs/constitution/`) et de
l'audit global (`docs/audits/internal/001-audit-global.md`).

## Sommaire

| Fichier | Objet |
| --- | --- |
| `01-cognitorium.md` | le dépôt racine (vitrine + `learning/` + `watchtower-mods/`) |
| `02-proto-cognitorium.md` | l'app « audit du capital cognitif » (React + Gemini) |
| `03-hcsm.md` | le modèle scientifique de l'état cognitif |
| `04-reaserch-engine.md` | l'orchestrateur de recherche autonome (Python) |
| `05-etat-de-lart-psychologie.md` | la base de connaissances critique + app web |
| `06-watchtower.md` | le dépôt cible du fork (vide) + procédure de reconstruction |
| `07-animation-chronos.md` | l'animation de découverte (React) |
| `08-language-decoder.md` | le dépôt « décodeur de langage » (vide) |
| `09-synthese.md` | vue transversale : doublons, manques, convergence, matrice |

## Vue d'ensemble en une image

```
                    COGNITORIUM (écosystème)
        ┌───────────────┬───────────┬──────────────┬─────────────┐
        │               │           │              │             │
  proto-cognitorium    HCSM     reaserch-engine  ETAT-DE-LART  watchtower-mods
  (app + graphe 5      (modèle   (preuves /       (connaissances (monde 3D,
   niveaux + ROME      scien-     vérification)   critiques)      chantier,
   + decay)            tifique)                                    intelTwin)
        │                                                        (nécessite
   learning/ (CLE)                                              l'upstream)
```

## Constats transversaux (détail dans `09-synthese.md`)

1. **8 dépôts, 4 couches** (modèle / connaissances / application / monde), mais
   **aucun câblage** entre eux.
2. **3 doublons** : 3 bases de connaissances, 2 représentations de l'état
   cognitif, code Watchtower en 2 endroits.
3. **Aucun secret en clair** dans les instantanés actuels (le fichier
   `identifiants_cognitorium*.json` a été purgé).
4. **Tests** : présents uniquement dans `reaserch-engine` (12 fichiers) et le
   validateur HCSM.
5. **Persistance** : `localStorage` partout sauf reaserch-engine (JSON) et
   ETAT-DE-LART (SQLite).
