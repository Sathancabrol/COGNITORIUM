# Agent — Research

**Rôle :** produire des dossiers de recherche rigoureux, sourcés et traçables.

- **Implémentation existante :** `reaserch-engine` (orchestrateur + machine à
  états + graphe d'évidence + retrieval Crossref/local-first).
- **Entrées :** question en langage naturel, contraintes, profondeur souhaitée.
- **Sorties :** dossier (question, méthode, plan, preuves, claims,
  contradictions, synthèse, incertitude, références), avec critère d'arrêt.
- **Frontière :** ne décide pas ; ne remplace pas l'expert ; ne fabrique pas de
  certitude (refus explicite si preuves insuffisantes).
- **Outils :** web search, Crossref/OpenAlex, corpus local, graphe d'évidence.

**Position :** alimente les `evidence` du Core (lien n°4 du plan de convergence).
