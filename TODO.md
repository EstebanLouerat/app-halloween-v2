# ToDo

- [x] Page d'accueil
- [ ] Page selection générateur
  - [ ] Ajouter, editer et supprimer des générateurs
  - [ ] _Optionnel: Savoir quels générateurs sont actifs_
- [x] Page générateur
  - [x] Bouton player, bouton tueurs
  - [x] Barre de progression et temps restant
  - [x] Ecran de fin de réparation
  - [ ] _Optionnel: Ecran fin de jeu_
- [ ] Page paramettre
  - [ ] Editer les paramettres
  - [ ] _Optionnel: Modifier les paramettres global ou unique au générateur_

  ## MàJ

  - [x] Texte non selectionnable
  - [x] Mise à jour du nbre de gen en arrière plan
  - [x] Interface maitre du jeu
  - [x] auto refresh

## Idées

- [ ] une page de création de générateur ou l'on peut choisir la couleur, le nom (par défaut 'Générateur n') et les settings
- [x] Ratio:
  - Pour 1 : x1 => 90s
  - Pour 2 : x1.7 => 53s
  - Pour 3 : x2.1 => 43s
  - Pour 4 : x2.2 => 41s
  - Pour le killer : hold 5s pour casser pour -20% du temps partiel
- [x] Progress bar
- [x] Temps generateur 90s
- [ ] Sons pendant sabotage et réparation

### Refonte de l'architecture

> Soit je fais en monolithic avec Nextjs prisma etc soit je garde le premier repo et j'en fais un deuxième avec une API REST express nodejs

- [x] Mettre une page d'accueil avec un bouton "ajouter un generateur"
- [ ] Dans les paramètre mettre un bouton supprimer ou désinscrire le générateur
- [x] Faire API/Backend (NextJS, Php, Nuxtjs ?) + config base de donnée postgres vercel
- [ ] Mettre le nombre de générateur et update dynamiquement
- [x] Améliorer l'UI
