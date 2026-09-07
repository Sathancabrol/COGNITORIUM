# WATCHTOWER OSINT

Extension de WATCHTOWER en **poste d’enquête OSINT visuel**.

> Le globe reste la couche physique. L’OSINT Workbench ajoute la couche informationnelle : entités, sources, observations, relations, chronologie et validation humaine.

## Lire dans cet ordre

1. [`docs/OSINT-WORKBENCH.md`](docs/OSINT-WORKBENCH.md) — architecture et règles
2. [`docs/OSINT-ROADMAP.md`](docs/OSINT-ROADMAP.md) — feuille de route
3. [`src/osint/README.md`](src/osint/README.md) — organisation du code
4. [`docs/OSINT-CHANGELOG.md`](docs/OSINT-CHANGELOG.md) — historique
5. [`osint-demo.html`](osint-demo.html) — démonstration isolée

## V0.1

La première version pose le contrat :

`source → observation → évidence → relation → validation humaine`

Elle n’essaie volontairement pas de lancer une batterie de requêtes réseau automatiquement. Les connecteurs réels seront ajoutés source par source, avec leurs quotas, licences, restrictions et règles de sécurité.

## Objectif final

Sélectionner un bâtiment, une personne, une entreprise, un document ou un événement dans WATCHTOWER et obtenir une **fiche d’enquête traçable**, reliée au graphe de sources et au palais mental, sans transformer une hypothèse en fait.
