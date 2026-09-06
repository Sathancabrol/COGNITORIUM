# Agent — IA

**Rôle :** faire fonctionner les modèles derrière l'interface `LLMProvider`,
gérer la mémoire, les embeddings et l'évaluation.

- **Socle existant :** `@google/genai` (proto), pattern provider-agnostique
  (reaserch-engine `providers.py`), voix Web Speech (watchtower).
- **Entrées :** requêtes applicatives (distiller CV, résumé, matching, agents).
- **Sorties :** réponses **avec provenance**, embeddings versionnés, métriques
  (latence, coût, qualité).
- **Frontière :** le LLM est un composant, pas la source de vérité ; aucun
  diagnostic ; aucune conclusion psy automatique.
- **Règles :** plafonds de session, cache, modèles hybrides (cloud/local),
  garde-fous épistémiques, journalisation des coûts.

**Position :** ADR-008 ; cible = inférence locale (Ollama) pour la souveraineté.
