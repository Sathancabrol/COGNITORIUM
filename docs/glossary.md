# Glossaire unifié Cognitorium

**Statut :** `REFERENCE` · 2026-09-05 · but : un seul vocabulaire entre les 8 dépôts.

| Terme | Définition | Source / dépôt |
| --- | --- | --- |
| **Cognitorium** | architecture globale : connaissances · compétences · expériences · trajectoires | HCSM docs/00 |
| **HCSM** | Human Cognitive State Model — modèle scientifique de l'état cognitif à T0 | HCSM |
| **Cognition Hub** | système computationnel qui instancie HCSM (non implémenté) | HCSM |
| **CLE** | Cognitorium Learning Engine — apprentissage par résolution de problèmes | COGNITORIUM/learning |
| **Skill Graph** | graphe des capacités humaines (Personne→Capacité→Compétence→Mission→Métier) | brief §6 / proto |
| **Knowledge Graph** | graphe des concepts/sciences/procédures/formations | brief §4 |
| **World Graph** | graphe du monde (lieux, objets, infrastructures, temporalité) | brief §4 / watchtower |
| **Core** | noyau de données : User·Project·Knowledge·Skill·Object·Place·Task·Event | brief §21 |
| **Capital cognitif** | ensemble auditables : preuves, missions, compétences, trajectoires | proto metadata |
| **Échelle épistémique** | 5 niveaux : fait → inféré → candidat → hypothèse → conclusion psy (jamais auto) | proto `epistemics.ts` |
| **Vitalité** | disponibilité estimée d'une compétence (courbe d'oubli, plancher 35 %) | proto `decay.ts` |
| **ConstructEstimate** | estimation latente d'un construit (valeur + incertitude + fenêtre + preuves) | HCSM |
| **T0** | instant de référence de l'estimation d'état cognitif | HCSM |
| **Refusal** | refus d'estimer (preuves insuffisantes) — jamais une valeur inventée | HCSM |
| **Trust Factor** | score de confiance d'une publication : M+R+O+C+T−P (0-100) | ETAT-DE-LART |
| **ROME** | Référentiel des métiers (France Travail) — 1 911 fiches, 17 920 compétences | proto |
| **FORMACODE** | thésaurus des formations, lié aux codes ROME | proto |
| **Matching explicable** | rapprochement profil↔métier avec « pourquoi / il manque quoi » | proto `romeMatching.ts` |
| **Digital twin** | jumeau numérique (lieu/territoire) — ficheLieu, intelTwin | watchtower |
| **Start gate** | écran gratuit/payant de Watchtower | watchtower |
| **BUY / BUILD / WRAP / REPLACE** | modes de décision technologique | constitution 05 |
| **ADR** | Architecture Decision Record — registre de décisions | constitution 09 |
| **MCP** | Model Context Protocol — standard d'intégration d'outils d'agents | audits 005 |
| **B-rep** | Boundary Representation — noyau géométrique précis (OpenCascade) | audits 004 |
| **CSG** | Constructive Solid Geometry — combinaison de primitives | audits 004 |
| **Slicer** | logiciel qui transforme un modèle 3D en parcours d'impression | audits 004 |
| **4D** | 3D + temps (phasage chantier, timeline) | watchtower / graphDimensions |
| **Métacognition** | boucle planifier→surveiller→ajuster→évaluer (Zimmerman) | proto `MetacogLoopView` |

*Mise à jour : toute nouvelle notion partagée entre ≥2 dépôts doit être ajoutée ici.*
