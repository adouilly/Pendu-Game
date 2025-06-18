# Hang The Beast 🐉⚔️

Un jeu de pendu médiéval avec combats de sprites animés en PNG.

## 📋 Description

**Hang The Beast** est une version modernisée du jeu du pendu classique. Au lieu de dessiner un pendu, le joueur incarne un combattant qui affronte des monstres dans des duels épiques avec des animations de sprites PNG. Chaque lettre correcte permet d'attaquer le monstre, tandis que chaque erreur fait subir des dégâts au joueur.

## 🎮 Fonctionnalités

#### Interface et Navigation
- **Écran d'accueil** avec animation néon
- **Écran de jeu** avec interface complète
- **Navigation fluide** entre les écrans
- **Système de pseudonyme** avec sauvegarde localStorage

#### Logique de Jeu
- **Chargement dynamique** des mots depuis `listemots.md` via fetch API
- **Large base de mots** : tous les mots du fichier markdown sont utilisés
- **Système de vies** : Joueur (8 vies) vs Monstre (nombre de lettres)
- **Validation des entrées** : lettres uniques, pas de répétition
- **Détection automatique** des conditions de victoire/défaite
- **Système de rejeu** avec confirmation

#### Système de Sprites et Animations PNG
- **3 niveaux de difficulté** avec sprites adaptés :
  - Niveau 1 (6-8 lettres) : Fighter vs Gobelin
  - Niveau 2 (9-10 lettres) : Warrior vs Orc  
  - Niveau 3 (11-15 lettres) : Paladin vs Dragon
- **Animations par frames PNG** : 5 images par sprite pour animation fluide
- **Animation en boucle** continue pendant toute la partie
- **Sprites de fallback** : émojis et CSS si images manquantes
- **Positionnement optimisé** : 250px des bords latéraux
- **Orientation automatique** : sprites monstres retournés pour faire face au joueur
- **Effets d'attaque** avec images PNG dédiées

#### Interface Utilisateur
- **Design responsive** sans scroll
- **Thème sombre** avec effets néon verts
- **Feedback visuel** pour les actions du joueur
- **Affichage en temps réel** des vies et du mot
- **Espacement optimal** des éléments de combat

### 🔧 Architecture Technique

#### Système d'Animation PNG
- **Animation par frames** : setInterval pour changer les background-image
- **Gestion d'erreurs** : fallback automatique si images manquantes
- **Performance optimisée** : préchargement et nettoyage des intervals
- **Fallback visuels** : émojis et CSS pour compatibilité maximale

#### Chargement Dynamique des Mots
- **Fetch API** pour charger `listemots.md`
- **Parser markdown** : extraction automatique des mots
- **Fallback de sécurité** : mots de base si fichier inaccessible
- **Validation** : mots d'au moins 4 lettres

#### Fichiers Principaux
- `index.html` - Page d'accueil
- `gameboard.html` - Interface de jeu
- `styles.css` - Styles et animations CSS optimisés
- `scripts.js` - Logique JavaScript avec animations PNG
- `listemots.md` - Base de données complète des mots

### 🎯 Mécaniques de Jeu

#### Système de Combat Visuel
1. **Joueur à gauche** (250px du bord gauche, animation continue)
2. **Monstre à droite** (250px du bord droit, orientation retournée, animation continue)
3. **Combat face-à-face** avec animations synchronisées
4. **Effets d'attaque** : images PNG spécialisées par niveau

#### Système de Combat
1. **Lettre correcte** → Joueur attaque → Monstre perd des vies
2. **Lettre incorrecte** → Monstre attaque → Joueur perd 1 vie
3. **Victoire** : Toutes les lettres trouvées OU monstre à 0 vie
4. **Défaite** : Joueur à 0 vie

### 🚀 Installation et Utilisation

1. **Cloner** ou télécharger le projet
2. **Organiser les assets** selon la structure PNG :
```
assets/sprites/
├── anim-fighter-png/
│   ├── fighter1.png à fighter5.png
├── anim-monster1-png/
│   ├── monster1a.png à monster1e.png
├── anim-monster2-png/
│   ├── monster2a.png à monster2e.png
├── anim-monster3-png/
│   ├── monster3a.png à monster3e.png
└── attack/
    ├── monster-swords.png
    ├── monster-fireball.png
    └── monster-orbs.png
```
3. **Servir via HTTP** (requis pour fetch API)
4. **Ouvrir** `index.html` dans un navigateur
5. **Entrer** un pseudonyme et commencer à jouer !

### 📁 Structure du Projet

```
pendu/
├── index.html              # Page d'accueil
├── gameboard.html          # Interface de jeu
├── styles.css              # Styles optimisés pour PNG
├── scripts.js              # Logique avec animations PNG
├── readme.md              # Documentation
├── projet.md              # Cahier des charges
├── listemots.md           # Base complète de mots
└── assets/                # Assets PNG organisés
    ├── sprites/           # Animations par frames
    │   ├── anim-fighter-png/
    │   ├── anim-monster1-png/
    │   ├── anim-monster2-png/
    │   ├── anim-monster3-png/
    │   └── attack/
    └── backgrounds/       # Images de fond
```

### 👨‍💻 Notes Techniques

#### Animation PNG
- 5 frames par sprite pour fluidité optimale
- Interval de 200ms pour animation naturelle
- Nettoyage automatique des intervals pour éviter les fuites mémoire
- Fallback CSS/émojis pour compatibilité universelle

#### Performance
- Chargement asynchrone des mots via fetch
- Gestion d'erreurs robuste avec fallbacks
- Optimisation mémoire avec nettoyage des animations

#### Compatibilité
- Fonctionne sur tous navigateurs modernes
- Dégradation gracieuse si assets manquants
- Responsive design maintenu

---

*Jeu développé pour l'apprentissage du développement web*
