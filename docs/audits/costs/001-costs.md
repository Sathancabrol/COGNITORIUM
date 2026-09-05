# 001 — Suivi des coûts (baseline 2026-09-05)

**Type :** audit coûts · **Statut :** `REFERENCE` (à actualiser chaque mois)

---

## Baseline actuelle (scénario 1 — prototype, cible 0-500 €/mois)

| Poste | État actuel | Coût/mois |
| --- | --- | --- |
| Hébergement | GitHub public + exécution locale | 0 € |
| Visualisation 3D (Watchtower) | mode gratuit sans clé | 0 € |
| Géodonnées | IGN/OSM/data.gouv/Open-Meteo/EONET (gratuits) | 0 € |
| IA — Gemini (proto) | pay-per-use, **non plafonné, non mesuré** | **à mesurer** |
| IA — embeddings / local | non branché | 0 € |
| Base de données | locale (SQLite/latest) | 0 € |
| Monitoring / domaine / CI | absent | 0 € |

**Seule dépense variable réelle : l'API Gemini.** Priorité : poser un plafond
(budget/limite par utilisateur + session, comme le fait déjà Watchtower pour
OpenAI) et logger les coûts par appel.

## Projeté — scénario 2 (MVP, 500-3 000 €/mois)

| Poste | Estimation | Notes |
| --- | --- | --- |
| VPS / hébergement | 10-50 € | serveur + PostgreSQL |
| Base PostgreSQL + pgvector + AGE + PostGIS | 0-20 € | self-host ou managed |
| IA (LLM + embeddings) | 20-300 € | selon usage ; plafonds + cache |
| Domaine + email | 5-15 € | |
| Monitoring / logs / backups | 5-30 € | |
| CI/CD (GitHub Actions) | 0-10 € | |

## Projeté — scénario 3 (plateforme avancée)

3 000-20 000+ €/mois : multi-utilisateurs, GPU (inférence locale ou cloud),
simulation, données massives, SRE. **Non engagé** tant que le MVP n'est pas validé.

## Règles

1. Ne jamais engager une dépense récurrente sans justification (constitution §18).
2. Toute API payante = **plafond + alerte + mesure** avant mise en service.
3. Réévaluer le scénario à chaque fin de phase (roadmap).
4. Privilégier free tiers / open source / local tant que le prototype le permet.
