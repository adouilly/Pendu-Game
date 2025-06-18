Contexte : Jeu similaire au jeu du pendu.
Concept : 
- Trouver les lettres d'un mot au hasard avec un nombre de tentatives définies (8)
- Le mot es masqué juste un caractere pour signaler qu'il y a une lettre a trouver
- Taper une Lettre sur le clavier donne :  Faire apparaitre la/les lettre(s) 
- ou Taper la lettre et avoir une erreure et une tentative en moins : Déclenche une animation

Game design / concept : (mots à trouver univers médiéval)
Au lieu de faire des battons pour faire apparaitre un pendu comme dans le jeu classique,
j'aimerai avoir un combat d'animation de sprites (esprit pixel art) Theme medieval.
On a un monstre qui a chaque mauvaise réponse déclenche une attaque sur le sprite d'un "combatant" les deux ont 8 vies.
Inversement pour le combattant lorsqu'une lettre est trouvée. Le monstre a autant de point de vie qu'il y a de lettres à trouver
et le combattant a toujours 8 vies.
Il y a aurai des monstres et combattants différents en fonction du nombre de lettre dans le mot à trouver.

Niveau 1 : Mot de 6 à 8 lettres.
Niveau 2 : Mot de 9 à 10 lettres.
Niveau 3 : Mot de 11 à 15 lettres max.

Nom du jeu : Musck the beat

Logique du jeu : Ecran de démarrage : index.html 
-> Clic sur bouton :"Commencer le jeu"
-> A partir du clic il y a un prompt js qui permet à l'utilisateur de rentrer son pseudo de joueur avant d'acceder à l'écran de la partie.
-> Une fois le pseudo rentré accés à la partie.
-> fichier listemots.md qui contient les mots a utiliser pour le jeu.
-> au lancement de la partie :
un mot est déterminé depuis la liste et les lettres doivent etre trouvée pour compléter le mot.
-> il y a un container au dessus de celui qui reveal les lettres qui affiche des animations de sprites 2D
en cas de réussite lettre revélé dans le container ou les lettres apparaissent et animations dédié pour la réussite, aussi animation de défaite en cas de mauvaise lettre proposé.
-> le joueur a un espace d'input ou il peut rentré la lettre a jouer avec un bouton de validation.
-> fin de jeu le joueur n'a plus de vie et n'a pas trouvé toute les lettres pour compléter le mot en entier ou le joueur a compléter le mot en trouvant toutes les lettres et victoire, une boite de dialogue propose de relancer une partie.