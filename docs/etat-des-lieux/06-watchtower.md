# 06 — watchtower (dépôt cible du fork, vide)

**Rôle :** recevoir le fork « Watchtower » de gods-eye-view.
**État :** dépôt **vide** (`Sathancabrol/watchtower` — aucun fichier).
**Maturité :** néant.

## Situation

Le code réel de Watchtower vit dans `COGNITORIUM/watchtower-mods/`
(voir `01-cognitorium.md`). Ce dépôt est la cible de publication, mais la
reconstruction n'a pas encore été effectuée.

## Procédure de reconstruction (issue de `watchtower-mods/APPLIQUER.md`)

```bash
git clone --depth 1 https://github.com/bilawalsidhu/gods-eye-view watchtower
cd watchtower && rm -rf .git docs/media
cp -r ../watchtower-mods/src ../watchtower-mods/vite.config.js \
      ../watchtower-mods/README.md ../watchtower-mods/index.html .
cp ../watchtower-mods/SOURCES-FR.md docs/
git init && git add -A && git commit -m "Watchtower"
git remote add origin https://github.com/Sathancabrol/watchtower
git push origin main
```

## Risque documenté

Double emplacement du code (delta dans COGNITORIUM vs dépôt cible vide) :
risque de **désynchronisation**. À résoudre en Phase 3 (Gods Eye View), quand
le fork sera publié proprement. Voir `09-synthese.md`.
