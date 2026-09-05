# 005 — Stack LLM & multi-agents (tranche ADR-008)

**Type :** audit externe (technologie)
**Date :** 2026-09-05 · **Statut :** `DECISION` (ADR-008 fermée)

---

## Besoin

Fournisseurs IA **abstraits** (règle P4) et un orchestre multi-agents (Phase 7)
sans verrouillage, dans le budget scénario 1.

## LLM — abstraction

Interface unique `LLMProvider` : `complete() · stream() · embed()`. Implémentations :

| Provider | Usage | Coût |
| --- | --- | --- |
| **Google Gemini** | défaut (déjà branché dans proto) | pay-per-use, à plafonner |
| OpenAI / Anthropic | optionnels | pay-per-use |
| **Local (Ollama / llama.cpp / vLLM)** | souveraineté, données sensibles, hors-ligne | 0 € (matériel) |

- **Embeddings** : privilégier des modèles **open source** (sentence-transformers
  ou équivalents locaux) pour rester souverain sur la mémoire.
- Chaque appel est **loggé + budgété** (cf. `audits/costs/001-costs.md`), plafond
  de session, cache, modèles hybrides (le pattern existe déjà : reaserch-engine
  injecte les modèles comme callables ; Watchtower dégrade proprement sans clé).

## Multi-agents — frameworks

| Framework | Positionnement 2026 | Licence | Verdict |
| --- | --- | --- | --- |
| **Orchestrateur maison** (reaserch-engine) | machine à états + agents callables, provider-agnostique | nôtre | ✅ **défaut** : on l'a, il est testé, sans dépendance |
| LangGraph | workflows stateful, durabilité, human-in-the-loop | MIT | ⏸️ si orchestration durable multi-étapes nécessaire |
| CrewAI | équipes par rôles, onboarding rapide | MIT | ⏸️ pilote rapide |
| AutoGen | exécution de code, patterns conversationnels | MIT | ⏸️ |
| OpenAI Agents SDK | rapide mais **verrouille** OpenAI | Apache-2.0 | ❌ verrouillage |

Sources : LangGraph = plus de contrôle et meilleure maturité prod ; CrewAI = DX
la plus douce ; AutoGen = flexibilité/exécution de code ; les SDK vendeurs =
setup rapide mais lock-in. Tous convergent vers **MCP** pour l'intégration
d'outils (fungies.io ; openagents.org ; arsum.com).

## Décision (ADR-008)

1. **LLM** : interface `LLMProvider` unique ; défaut Gemini ; optionnels
   OpenAI/Anthropic ; **cible locale** pour la souveraineté (Ollama).
2. **Agents** : conserver l'**orchestrateur maison** (reaserch-engine) comme
   noyau (états, provenance, budget, arrêt) ; exposer les outils via **MCP** ;
   n'adopter **LangGraph** que si les workflows durables multi-étapes avec
   human-in-the-loop le justifient (décision réévaluée en Phase 7).

## Sources

- https://fungies.io/ai-agent-frameworks-comparison-2026-langchain-crewai-autogen/
- https://openagents.org/blog/posts/2026-02-23-open-source-ai-agent-frameworks-compared
- https://arsum.com/blog/posts/ai-agent-frameworks/
