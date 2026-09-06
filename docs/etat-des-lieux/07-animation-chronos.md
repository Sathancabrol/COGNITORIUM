# 07 — animation-chronos (animation de découverte)

**Rôle :** animation cosmique / « cerveau ferrofluidique » — une scène
interactive de **découverte progressive** (5 phases + points d'inspection).
**Maturité :** prototype visuel React, autonome.
**Dépôt :** `Sathancabrol/animation-chronos`.

## Stack

React + Vite + TypeScript (mêmes conventions que proto-cognitorium), Canvas
(FluidCanvas), `audio.ts`.

## Structure

```
animation-chronos/
├── index.html · package.json (35) · vite.config.ts (22) · tsconfig.json
├── metadata.json · .env.example · .gitignore
├── public/assets/aistudio/ (1 .gitignore)
└── src/
    ├── App.tsx (364)                  # orchestration des phases
    ├── main.tsx · index.css · types.ts (22) · vite-env.d.ts
    ├── data/stages.ts (117)           # 5 phases + hotspots
    ├── utils/audio.ts (203)
    └── components/
        ├── VesselStage.tsx (240)      # scène du vaisseau
        ├── FullScreenFluidCanvas.tsx (572)  # simulation fluide plein écran
        ├── CosmicBackground.tsx (174) # fond cosmique
        ├── ChronosBubble.tsx (441)    # bulle « Chronos »
        ├── InspectionLens.tsx (92)    # loupe d'inspection (hotspots)
        ├── MonographDrawer.tsx (157)  # fiche « monographie »
        ├── ObservationControls.tsx (228) # contrôles d'observation
        ├── ProgressiveDiscoveryBar.tsx (141)  # barre de progression de découverte
        └── TransitionSequenceBar.tsx (109)    # barre de séquence de transition
```

## Contenu narratif (stages.ts)

5 phases : I vaisseau ovoïde de verre · II masse ferrofluidique · III réseau
magnétique · IV hémisphères bilatéraux · V pont lumineux central — avec
`focusPoint` (zoom progressif) et `visualHighlight`. 6 hotspots inspectables
(cœur lumineux, lobes cérébraux, filaments magnétiques, bulle de réfraction,
bord géoïde).

## Réutilisable pour la vision

Ce dépôt n'est **pas** un outil de la vision au sens strict, mais un **pattern
UX réutilisable** : la « révélation progressive » (découverte par zoom/étapes,
hotspots inspectables, barre de progression). C'est exactement la thèse du CLE
(le concept émerge parce qu'il devient nécessaire).

Usages possibles : onboarding Cognitorium, narration d'un concept dans le
Learning Engine, « atlas » animé. Sinon : archiver ou fusionner.

## Gaps

- Aucun lien explicite avec Cognitorium (pas de README de rattachement).
- App autonome, sans persistance ni API.
