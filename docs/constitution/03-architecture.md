# 03 — Architecture conceptuelle

**Statut :** `CONSTITUTION` · v1 · Septembre 2026
**Source :** Master Brief §4, §5, §6, §7, §8, §9, §27

---

## Les quatre couches

### Couche 1 — HUMAN

personne · objectifs · besoins · connaissances · compétences · capacités ·
préférences · expérience · projets · progression.

### Couche 2 — KNOWLEDGE

concepts · sciences · techniques · procédures · relations · compétences ·
métiers · formations · documentation · connaissances générées par les agents.

### Couche 3 — WORLD

géographie · bâtiments · infrastructures · objets · machines · véhicules ·
réseaux · ressources · événements · population · contraintes · temporalité.

### Couche 4 — WORLD GRAPH

Relie les éléments précédents :

```text
Commune
 ├── Quartier
 │    ├── Bâtiment
 │    │    ├── Pièce
 │    │    └── Objet
 │    └── Infrastructure
 ├── Population
 │    ├── Compétences
 │    └── Besoins
 └── Projets
      ├── Contraintes
      ├── Ressources
      ├── Scénarios
      └── Résultats
```

## Skill Graph

```text
Personne → Capacité → Compétence → Mission → Métier → Formation → Projet
Compétence → Prérequis → Compétence supérieure
```

Questions auxquelles il doit répondre :

> Que sait faire cette personne ? Que pourrait-elle apprendre ? Quels métiers
> correspondent à son profil ? Quelles compétences manquent ? Quel projet
> permettrait de développer ces compétences ?

## Gods Eye View — les échelles et dimensions

Échelles : objet → pièce → maison → bâtiment → quartier → ville → territoire →
pays → planète.

Dimensions : spatiale · temporelle · relationnelle · économique · humaine ·
technique · environnementale.

## Cognitorium Learning Engine (CLE)

```text
Situation → Problème → Décision → Conséquence → Feedback → Concept découvert
→ Compétence → Formalisation → Transfert
```

Apprendre par interaction, pas par simple réponse.

## Module 3D / CAD / Fabrication

Objectif : « Je veux cette pièce » → « Ma pièce est prête à être fabriquée ».

```text
Créer → Importer → Choisir un modèle → Modifier → Mesurer → Valider →
Vérifier la géométrie → Préparer fabrication → Slicer → Impression 3D
```

Premier objectif : permettre à un **novice** de réaliser rapidement une pièce
utile — pas recréer Fusion 360 ou SolidWorks.

## Mémoire / Knowledge Graph

Sources : conversations · documents · fichiers · recherches · projets ·
décisions · bases de données · résultats d'expériences · données externes ·
autres IA.

Objectif : ne pas dépendre de la mémoire isolée d'une conversation ou d'une IA.

## Positionnement final

```text
                  COGNITORIUM
                       │
        ┌──────────────┼──────────────┐
        │              │              │
      HUMAN         KNOWLEDGE       WORLD
        │              │              │
     Skills          Concepts       Places
     Cognition       Sciences       Objects
     Learning        Procedures     Buildings
        │              │              │
        └──────────────┼──────────────┘
                       │
                  DESIGN ENGINE
                       │
              ┌────────┼────────┐
              │        │        │
           Generate  Simulate  Optimize
              │        │        │
              └────────┼────────┘
                       │
                     MAKE
                       │
                 CAD / 3D / CNC
                 3D printing
                 Construction
                       │
                       ↓
                 REAL WORLD
                       │
                       ↓
                 DATA / FEEDBACK
                       │
                       └────→ COGNITORIUM
```

## Application : noyau de données (Core)

Entités fondatrices de la Phase 1 :

```text
User · Project · Knowledge · Skill · Object · Place · Task · Event
```

+ leurs relations. Chaque entité doit, dès le départ, pouvoir porter
provenance, incertitude et contexte (principe HCSM).
