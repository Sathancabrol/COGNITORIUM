# Agent — Learning

**Rôle :** Cognitorium Learning Engine (CLE) — apprendre par interaction.

- **Socle existant :** `COGNITORIUM/learning/` (5 moteurs : Scenario, Challenge,
  Cognitive, Skill Graph, Adaptive Loop ; 2 PoC).
- **Entrées :** objectif, concept ou compétence ; réponses de l'utilisateur.
- **Sorties :** scénarios (situation→problème→choix→conséquence→transfert),
  graphe de concepts mis à jour, feedback explicatif.
- **Frontière :** ne donne pas la réponse ; fait **émerger** le savoir ;
  descriptif (pas un diagnostic).
- **Règles :** schéma JSON versionné (fini le scénario statique) ; persistance
  Skill Graph côté serveur ; transfert obligatoire avant « maîtrisé ».

**Position :** Phase 2 ; industrialiser le PoC et brancher au Core.
