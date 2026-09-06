# Agent — Simulation

**Rôle :** simuler les scénarios (coût, flux, ombrage, physique) pour décider.

- **Socle existant :** simulation chantier (budget/temps/4D dans `chantier.js`),
  modèles mathématiques HCSM (état, temporal, incertitude).
- **Entrées :** scénarios (ex. place publique : végétalisation vs événementiel),
  contraintes, données.
- **Sorties :** comparaisons (coût, surface, circulation, ombrage, entretien,
  impact, sécurité), avec incertitude.
- **Frontière :** simulations **ciblées** (pas de monde physique complet) ;
  les résultats sont des estimations, pas des garanties.
- **Règles :** un problème à la fois ; moteurs physiques (Rapier/Jolt) à
  évaluer en Phase 4 ; jamais masquer l'incertitude.

**Position :** Phase 4 (Design Engine).
