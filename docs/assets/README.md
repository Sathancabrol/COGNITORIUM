# Convention assets — motifs, fonds, illustrations

**Statut :** `REFERENCE` · 2026-09-05 · lié à ADR-010 (Book of Shapes)

## Principe

Tout asset importé dans le projet doit être **traçable** (même principe que les
preuves du profil) : source, auteur, licence, date, paramètres. Pas d'asset
orphelin.

## Arborescence cible

```
assets/
  patterns/            # motifs SVG (Book of Shapes)
    grid/ radial/ noise/ flow/ isometric/ organic/ distortion/ physics/
    SOURCES.md         # registre de provenance (ci-dessous)
  ui/                  # fonds, textures, états vides
  posters/             # affiches (mode poster)
```

## Convention de nommage

```
{source}-{categorie}/{slug}-{params}-{seed}.svg
ex : bos-flow/flow_lines-40-11-37086237.svg
```

## Registre `SOURCES.md` (modèle à remplir à chaque import)

```markdown
# Registre des assets

| Fichier | Source (URL) | Auteur | Licence | Date import | Seed | Paramètres | Usage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| bos-flow/flow_lines-*.svg | https://bookofshapes.com/patterns/flow_lines | Nikolaj Sokolowski | **à confirmer** | 2026-09-05 | 37086237 | grid=40… | fond graphe |
```

## Règles

1. **Licence d'abord** : Book of Shapes n'affiche pas de page Terms → obtenir
   confirmation écrite (nikolaj@creasurf.net) avant tout usage dans un livrable
   (ADR-010). Attribution à l'auteur.
2. **Épingler seed + paramètres + date** : le site évolue, la version compte.
3. **Télécharger** (ne pas référencer en hotlink) : les variations sauvegardées
   sont en localStorage, donc périssables.
4. SVG vectoriel privilégié (netteté, poids) ; éviter le raster généré.
