# COGNITORIUM

Outils de visualisation cognitive — cognitive tool visualization.

## Learning Engine — PoC v0.1

Le premier Proof of Concept teste une hypothèse pédagogique : faire comprendre un système complexe par résolution progressive de problèmes, avec feedback explicatif et construction dynamique d'un graphe conceptuel.

### PoC « Comprendre l'argent »

Parcours : **troc → double coïncidence des besoins → monnaie → prix → épargne → crédit → intérêt → inflation → investissement**.

Chaque niveau contient :
- une situation concrète ;
- un problème à résoudre ;
- plusieurs choix ;
- une conséquence explicative ;
- les concepts associés ;
- les liens avec les concepts précédents et suivants ;
- une mise à jour du Skill / Concept Graph.

Le parcours se termine par une question de transfert et conserve localement les événements de session.

### Lancer

Depuis la racine du dépôt :

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000/learning/` et choisir le PoC.

## Architecture

Voir `learning/ARCHITECTURE.md` pour le modèle CLE : Scenario Engine, Challenge Engine, Cognitive Engine, Skill Graph Engine et Adaptive Learning Loop.
