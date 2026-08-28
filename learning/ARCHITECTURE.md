# Cognitorium Learning Engine (CLE) v0.1

## Principe

Le CLE transforme un contenu ou une compétence en expérience d'apprentissage progressive :

**Situation → Problème → Action → Conséquence → Nouveau problème → Découverte → Formalisation → Transfert → Évaluation → mise à jour du Skill Graph**

Le moteur ne présente pas d'abord une liste de connaissances. Il fait émerger la connaissance parce qu'elle devient nécessaire pour résoudre un problème.

## Modules

### Scenario Engine
Génère et orchestre les situations pédagogiques à partir d'un objectif, d'un concept ou d'une compétence.

### Challenge Engine
Génère les contraintes, choix, erreurs et conséquences. Il contrôle la difficulté et le niveau d'aide.

### Cognitive Engine
Associe chaque étape aux opérations cognitives mobilisées : attention, compréhension, raisonnement, décision, mémoire, transfert, métacognition, etc. Cette couche est descriptive et ne doit pas être interprétée comme un diagnostic clinique.

### Skill Graph Engine
Met à jour le graphe avec les concepts rencontrés et leur état : découvert, compris, appliqué, transféré, maîtrisé ou fragile.

### Adaptive Learning Loop
Observe les réponses et adapte le prochain défi : difficulté, indice, répétition, changement de contexte et exercice de transfert.

## Modèle de progression

```text
OBJECTIF
  ↓
SITUATION
  ↓
PROBLÈME
  ↓
ACTION
  ↓
FEEDBACK / CONSÉQUENCE
  ↓
NOUVELLE CONTRAINTE
  ↓
CONCEPT NÉCESSAIRE
  ↓
FORMALISATION
  ↓
TRANSFERT
  ↓
ÉVALUATION
  ↓
SKILL GRAPH UPDATE
  ↓
PROCHAIN DÉFI
```

## UX

Le prototype `learning/index.html` démontre la boucle avec un scénario de reconstruction conceptuelle d'un turboréacteur. Le graphe latéral visualise en temps réel les concepts découverts.

## Prochaines étapes techniques

1. Remplacer le scénario statique par un schéma JSON versionné.
2. Ajouter un moteur de règles pour les branches et conséquences non linéaires.
3. Ajouter le transfert comme étape obligatoire avant le statut « maîtrisé ».
4. Persister le Skill Graph par utilisateur.
5. Ajouter des scénarios générés depuis les données ROME, des cours, PDF, vidéos et contenus importés.
6. Brancher le CLE au graphe Cognitorium global et au profil cognitif descriptif.
