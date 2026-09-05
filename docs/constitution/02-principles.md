# 02 — Principes

**Statut :** `CONSTITUTION` · v1 · Septembre 2026
**Source :** Master Brief §16, §19, §23, §24, §29

---

## P1 — Honnêteté épistémique

- Ne jamais présenter une hypothèse comme un fait.
- Séparer explicitement : fait documenté / inférence / capacité candidate /
  hypothèse cognitive / conclusion psychologique (jamais déduite automatiquement).
- Une valeur estimée doit porter son incertitude, sa provenance, son contexte
  et ses explications alternatives.
- Ne jamais masquer l'incertitude derrière une valeur unique quand elle est
  décisionnelle.

## P2 — Ne pas coder trop vite

Avant toute fonctionnalité, répondre dans l'ordre :

1. Cette capacité existe-t-elle déjà dans le projet ?
2. Existe-t-il une solution externe ?
3. Peut-on l'intégrer ?
4. Quel est le coût ?
5. Est-ce nécessaire maintenant ?
6. **Seulement ensuite : construire.**

## P3 — Décider BUY / BUILD / WRAP / REPLACE

- **BUY** : utiliser une solution existante.
- **BUILD** : développer nous-mêmes (avantage stratégique central).
- **WRAP** : construire notre couche autour d'une technologie existante.
- **REPLACE** : commencer avec une solution puis la remplacer progressivement.

> Ne jamais développer pendant six mois une technologie déjà disponible
> gratuitement ou à faible coût.

## P4 — Architecture modulaire, fournisseurs abstraits

Cognitorium ne doit pas devenir un monolithe impossible à maintenir. Chaque
capacité doit pouvoir être remplacée :

```
Cognitorium
     ├── LLM Provider (OpenAI / Anthropic / Google / local)
     ├── Vector DB
     ├── Graph DB
     ├── 3D Engine
     ├── GIS
     └── Simulation Engine
```

Les fournisseurs externes sont abstraits derrière des interfaces. Une
technologie prometteuse mais immature est isolée derrière une interface
remplaçable.

## P5 — Règle de recherche avant décision

Avant chaque décision technologique importante :

1. rechercher les solutions existantes ;
2. rechercher les alternatives open source ;
3. vérifier la licence ;
4. vérifier l'activité du projet ;
5. vérifier les performances ;
6. vérifier la communauté ;
7. vérifier l'intégration ;
8. vérifier le coût ;
9. vérifier le risque de verrouillage fournisseur ;
10. décider BUILD / BUY / WRAP.

## P6 — Critères de validation

Une fonctionnalité n'est pas terminée parce que le code compile. Elle doit
passer :

- **Fonctionnel** : cas normal, cas erreur, cas limite.
- **UX** : compréhensible, utilisable par un novice, assez rapide.
- **Technique** : architecture propre, tests, logs, gestion d'erreurs.
- **Sécurité** : secrets protégés, permissions, validation d'entrées, isolation.
- **Coût** : coût par utilisateur, par opération, coût maximum.
- **Maintenance** : documentation, dépendances, procédure de remplacement.

## P7 — Chaque brique a une place claire

- Si une fonctionnalité n'a pas de place claire dans l'architecture →
  questionner sa pertinence.
- Si une technologie externe fait déjà parfaitement le travail → l'intégrer.
- Si une capacité constitue un avantage stratégique central → envisager de la
  construire nous-mêmes.
