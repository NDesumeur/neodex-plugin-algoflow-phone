# AlgoFlow

Regarde les algorithmes travailler, étape par étape : les barres s'allument quand elles sont comparées ou déplacées, le pseudo-code suit ligne par ligne, et les compteurs disent combien de travail chaque méthode a demandé.

*English version: [README.en.md](README.en.md)*

![AlgoFlow](screenshots/1.jpg)

## Version téléphone

- Même écran que sur PC, rangé en une colonne.
- Dans Graphes, le bouton **Le doigt pose : murs / boue** remplace Maj + clic : touche la grille pour poser des murs ou de la boue.
- Les mêmes réglages que sur PC (même identifiant `neodex.algoflow`).

## Tris

8 tris : à bulles, par insertion, par sélection, fusion, rapide, par tas, de Shell, par comptage. Choisis le nombre d'éléments (8 à 160) et le départ : **au hasard**, **presque trié**, **à l'envers** ou **peu de valeurs**. C'est là qu'on voit vraiment les différences : le tri par insertion fonce sur un tableau presque trié, le tri rapide peine sur un tableau à l'envers.

Couleurs : jaune = comparés, rose = écrits, bleu = pivot ou minimum, vert = à sa place, gris = hors de la zone en cours.

## Recherche

Recherche **linéaire** (case par case) et **dichotomique** (sur un tableau trié, on coupe en deux à chaque regard). La valeur cherchée est tirée au hasard ; **Nouveau tableau** en tire une autre.

## Graphes

Une grille de 40 × 24 cases que tu dessines : **clic** pour un mur, **Maj+clic** pour de la boue (coût 5), glisse le départ (vert) ou l'arrivée (rose). **Labyrinthe** en génère un. Puis compare les 4 parcours : **en largeur**, **en profondeur**, **Dijkstra** (tient compte de la boue) et **A\*** (comme Dijkstra, mais il vise l'arrivée et visite moins de cases).

## Le lecteur

**▶** lance, **◀ Étape / Étape ▶** avancent ou reculent d'une étape, **⟲** revient au début, **⏭** va à la fin. Le curseur règle la vitesse (1 à 200 étapes par seconde). À côté : le pseudo-code avec la ligne en cours, les compteurs (comparaisons, écritures, cases vues), l'explication et la complexité.

## Données

L'algorithme choisi, la vitesse et la grille dessinée sont gardés dans le dossier du plugin. Autorisation : `storage` seulement.

## Version 1.1.0

- Textes, pseudo-code et compteurs plus grands ; la grille des graphes a des cases plus grandes (32 × 18) ; l'appli prend toute la largeur.
- Nouveau mode **Course** : deux tris rangent le même tableau côte à côte (un en haut, un en bas), une étape chacun à la fois ; le premier qui a fini gagne.
