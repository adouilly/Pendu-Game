/**
 * Classe principale du jeu "Musk The Beast"
 * Gère la logique du jeu de pendu avec combat de sprites PNG animés
 */
class MuskTheBeastGame {
    /**
     * Constructeur de la classe de jeu
     * Initialise la configuration des sprites PNG avec animations par frames
     */
    constructor() {
        this.playerName = '';
        this.playerLives = 8;
        this.monsterLives = 0;
        this.currentWord = '';
        this.guessedLetters = [];
        this.wrongLetters = [];
        this.gameWords = []; // Chargé dynamiquement depuis listemots.md
        this.playerSprite = null;
        this.monsterSprite = null;
        this.spriteConfig = {
            level1: {
                player: {
                    frames: [
                        'assets/sprites/anim-fighter-png/fighter1.png',
                        'assets/sprites/anim-fighter-png/fighter2.png',
                        'assets/sprites/anim-fighter-png/fighter3.png',
                        'assets/sprites/anim-fighter-png/fighter4.png',
                        'assets/sprites/anim-fighter-png/fighter5.png'
                    ],
                    attack: 'assets/sprites/attack/monster-swords.png'
                },
                monster: {
                    frames: [
                        'assets/sprites/anim-monster1-png/monster1a.png',
                        'assets/sprites/anim-monster1-png/monster1b.png',
                        'assets/sprites/anim-monster1-png/monster1c.png',
                        'assets/sprites/anim-monster1-png/monster1d.png',
                        'assets/sprites/anim-monster1-png/monster1e.png'
                    ],
                    attack: 'assets/sprites/attack/monster-fireball.png'
                }
            },
            level2: {
                player: {
                    frames: [
                        'assets/sprites/anim-fighter-png/fighter1.png',
                        'assets/sprites/anim-fighter-png/fighter2.png',
                        'assets/sprites/anim-fighter-png/fighter3.png',
                        'assets/sprites/anim-fighter-png/fighter4.png',
                        'assets/sprites/anim-fighter-png/fighter5.png'
                    ],
                    attack: 'assets/sprites/attack/monster-swords.png'
                },
                monster: {
                    frames: [
                        'assets/sprites/anim-monster2-png/monster2a.png',
                        'assets/sprites/anim-monster2-png/monster2b.png',
                        'assets/sprites/anim-monster2-png/monster2c.png',
                        'assets/sprites/anim-monster2-png/monster2d.png',
                        'assets/sprites/anim-monster2-png/monster2e.png'
                    ],
                    attack: 'assets/sprites/attack/monster-orbs.png'
                }
            },
            level3: {
                player: {
                    frames: [
                        'assets/sprites/anim-fighter-png/fighter1.png',
                        'assets/sprites/anim-fighter-png/fighter2.png',
                        'assets/sprites/anim-fighter-png/fighter3.png',
                        'assets/sprites/anim-fighter-png/fighter4.png',
                        'assets/sprites/anim-fighter-png/fighter5.png'
                    ],
                    attack: 'assets/sprites/attack/monster-swords.png'
                },
                monster: {
                    frames: [
                        'assets/sprites/anim-monster3-png/monster3a.png',
                        'assets/sprites/anim-monster3-png/monster3b.png',
                        'assets/sprites/anim-monster3-png/monster3c.png',
                        'assets/sprites/anim-monster3-png/monster3d.png',
                        'assets/sprites/anim-monster3-png/monster3e.png'
                    ],
                    attack: ['assets/sprites/attack/monster-fireball.png', 'assets/sprites/attack/monster-orbs.png']
                }
            }
        };
        this.loadWordsFromFile();
        this.init();
    }

    /**
     * Charge les mots depuis le fichier listemots.md via fetch API
     * Parse le format markdown pour extraire tous les mots disponibles
     */
    async loadWordsFromFile() {
        try {
            const response = await fetch('listemots.md');
            const text = await response.text();
            
            // Parser le fichier markdown pour extraire les mots
            const lines = text.split('\n');
            this.gameWords = [];
            
            lines.forEach(line => {
                // Chercher les lignes qui commencent par "- " (mots dans la liste)
                if (line.trim().startsWith('- ')) {
                    const word = line.trim().substring(2).toUpperCase();
                    if (word && word.length >= 4) { // Mots d'au moins 4 lettres
                        this.gameWords.push(word);
                    }
                }
            });
            
            console.log(`${this.gameWords.length} mots chargés depuis listemots.md`);
        } catch (error) {
            console.error('Erreur lors du chargement des mots:', error);
            // Fallback avec quelques mots de base si le fichier ne se charge pas
            this.gameWords = ['CHEVALIER', 'DRAGON', 'EPEE', 'BOUCLIER', 'CHATEAU', 'BATAILLE'];
        }
    }

    /**
     * Initialise les événements et les écouteurs
     */
    init() {
        // Gestion de l'écran d'accueil
        const startButton = document.getElementById('start-game');
        if (startButton) {
            startButton.addEventListener('click', () => this.startGame());
        }

        // Gestion du jeu si on est sur gameboard.html
        const submitButton = document.getElementById('submit-letter');
        if (submitButton) {
            submitButton.addEventListener('click', () => this.submitLetter());
            
            const letterInput = document.getElementById('letter-input');
            if (letterInput) {
                letterInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.submitLetter();
                    }
                });
            }
        }
    }

    /**
     * Démarre une nouvelle partie
     * Demande le nom du joueur et redirige vers le plateau de jeu
     */
    startGame() {
        // Demander le pseudo du joueur
        const playerName = prompt('Entrez votre nom de combattant :');
        if (playerName && playerName.trim()) {
            this.playerName = playerName.trim();
            // Sauvegarder dans localStorage avant de rediriger
            localStorage.setItem('playerName', this.playerName);
            // Rediriger vers gameboard.html
            window.location.href = 'gameboard.html';
        } else {
            alert('Veuillez entrer un nom valide !');
        }
    }

    /**
     * Initialise le plateau de jeu
     * Configure les sprites, le mot à deviner et l'interface
     */
    async initGameBoard() {
        // Récupérer le nom du joueur depuis le localStorage
        this.playerName = localStorage.getItem('playerName');
        
        // Si pas de nom sauvegardé, demander à nouveau
        if (!this.playerName) {
            this.playerName = prompt('Entrez votre nom :');
            if (this.playerName) {
                localStorage.setItem('playerName', this.playerName);
            }
        }

        // Attendre que les mots soient chargés si ce n'est pas encore fait
        if (this.gameWords.length === 0) {
            await this.loadWordsFromFile();
        }

        // Choisir un mot aléatoire
        this.selectRandomWord();
        this.setupSprites();
        
        // Initialiser l'interface
        this.updatePlayerInfo();
        this.updateWordDisplay();
    }

    /**
     * Configure et affiche les sprites selon le niveau
     */
    setupSprites() {
        const level = this.getCurrentLevel();
        const config = this.spriteConfig[level];
        
        const container = document.querySelector('.container-animation-sprites');
        if (!container) return;
        
        container.innerHTML = '';

        // Créer le sprite du joueur
        const playerContainer = document.createElement('div');
        playerContainer.className = 'sprite-container';
        playerContainer.innerHTML = `
            <div class="sprite player-sprite"></div>
            <div class="sprite-health">Joueur: ${this.playerLives}</div>
        `;
        
        // Créer le sprite du monstre
        const monsterContainer = document.createElement('div');
        monsterContainer.className = 'sprite-container';
        monsterContainer.innerHTML = `
            <div class="sprite monster-sprite"></div>
            <div class="sprite-health">Monstre: ${this.monsterLives}</div>
        `;

        container.appendChild(playerContainer);
        container.appendChild(monsterContainer);

        this.playerSprite = container.querySelector('.player-sprite');
        this.monsterSprite = container.querySelector('.monster-sprite');

        // Démarrer les animations
        this.startSpriteAnimation(this.playerSprite, config.player.frames, 'player');
        this.startSpriteAnimation(this.monsterSprite, config.monster.frames, 'monster');
    }

    /**
     * Démarre l'animation d'un sprite avec une séquence de frames PNG
     * Utilise setInterval pour créer l'effet d'animation
     * @param {Element} spriteElement - L'élément DOM du sprite
     * @param {Array} frames - Tableau des chemins vers les images PNG
     * @param {string} spriteType - Type de sprite ('player' ou 'monster')
     */
    startSpriteAnimation(spriteElement, frames, spriteType) {
        if (!spriteElement || !frames || frames.length === 0) return;
        
        // Arrêter toute animation existante
        if (spriteElement.animationInterval) {
            clearInterval(spriteElement.animationInterval);
        }

        let currentFrame = 0;
        let errorCount = 0;
        const maxErrors = frames.length; // Si toutes les frames échouent, arrêter
        
        const animateSprite = () => {
            if (errorCount >= maxErrors) {
                console.error(`Toutes les frames ont échoué pour ${spriteType}`);
                this.createFallbackSprite(spriteElement, spriteType);
                return;
            }

            const framePath = frames[currentFrame];
            
            // Tester si l'image existe
            const testImg = new Image();
            testImg.onload = () => {
                spriteElement.style.backgroundImage = `url('${framePath}')`;
                errorCount = 0; // Reset du compteur d'erreurs si succès
            };
            
            testImg.onerror = () => {
                console.warn(`Frame non trouvée: ${framePath}`);
                errorCount++;
            };
            
            testImg.src = framePath;
            
            currentFrame = (currentFrame + 1) % frames.length;
        };
        
        // Charger la première frame immédiatement
        animateSprite();
        
        // Démarrer l'animation
        spriteElement.animationInterval = setInterval(animateSprite, 200);
    }

    /**
     * Crée un sprite de fallback avec CSS si les images PNG ne se chargent pas
     * Utilise des émojis et gradients comme alternative visuelle
     * @param {Element} spriteElement - L'élément sprite
     * @param {string} spriteType - 'player' ou 'monster'
     */
    createFallbackSprite(spriteElement, spriteType) {
        spriteElement.style.backgroundImage = 'none';
        
        if (spriteType === 'player') {
            spriteElement.style.background = 'linear-gradient(45deg, #4a90e2, #357abd)';
            spriteElement.innerHTML = '<div style="text-align:center;line-height:400px;font-size:4em;color:white;">🛡️</div>';
        } else {
            spriteElement.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
            spriteElement.innerHTML = '<div style="text-align:center;line-height:400px;font-size:4em;color:white;">👹</div>';
        }
        
        // Animation simple avec CSS
        spriteElement.style.animation = 'sprite-pulse 2s ease-in-out infinite';
    }

    /**
     * Arrête l'animation d'un sprite en nettoyant l'interval
     * @param {Element} spriteElement - L'élément sprite à arrêter
     */
    stopSpriteAnimation(spriteElement) {
        if (spriteElement && spriteElement.animationInterval) {
            clearInterval(spriteElement.animationInterval);
            spriteElement.animationInterval = null;
        }
    }

    /**
     * Détermine le niveau en fonction de la longueur du mot
     * @returns {string} Le niveau (level1, level2, ou level3)
     */
    getCurrentLevel() {
        if (this.currentWord.length <= 8) return 'level1';
        if (this.currentWord.length <= 10) return 'level2';
        return 'level3';
    }

    /**
     * Sélectionne un mot aléatoire et initialise les variables de jeu
     */
    selectRandomWord() {
        if (this.gameWords.length === 0) {
            console.error('Aucun mot disponible');
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * this.gameWords.length);
        this.currentWord = this.gameWords[randomIndex].toUpperCase();
        this.monsterLives = this.currentWord.length;
        this.guessedLetters = [];
        this.wrongLetters = [];
        
        // SUPPRIMÉ : Ne plus afficher le mot dans la console pour éviter la triche
        // console.log('Mot sélectionné:', this.currentWord);
    }

    /**
     * Met à jour l'affichage des informations du joueur et du monstre
     */
    updatePlayerInfo() {
        const playerNameElement = document.getElementById('player-name');
        const playerLivesElement = document.getElementById('player-lives');
        const monsterLivesElement = document.getElementById('monster-lives');
        const monsterNameElement = document.getElementById('monster-name');

        if (playerNameElement) playerNameElement.textContent = this.playerName;
        if (playerLivesElement) playerLivesElement.textContent = this.playerLives;
        if (monsterLivesElement) monsterLivesElement.textContent = this.monsterLives;
        
        // Nom du monstre selon la difficulté
        if (monsterNameElement) {
            if (this.currentWord.length <= 8) {
                monsterNameElement.textContent = 'Gobelin';
            } else if (this.currentWord.length <= 10) {
                monsterNameElement.textContent = 'Orc';
            } else {
                monsterNameElement.textContent = 'Dragon';
            }
        }
    }

    /**
     * Met à jour l'affichage du mot à deviner
     */
    updateWordDisplay() {
        const wordPlaceholder = document.getElementById('word-placeholder');
        if (wordPlaceholder) {
            let display = '';
            for (let i = 0; i < this.currentWord.length; i++) {
                const letter = this.currentWord[i];
                if (this.guessedLetters.includes(letter)) {
                    display += letter + ' ';
                } else {
                    display += '_ ';
                }
            }
            wordPlaceholder.textContent = display.trim();
        }
    }

    /**
     * Traite la soumission d'une lettre par le joueur
     * Valide l'entrée et met à jour l'état du jeu
     */
    submitLetter() {
        const letterInput = document.getElementById('letter-input');
        if (!letterInput) return;
        
        const letter = letterInput.value.toUpperCase().trim();

        // Validation
        if (!letter || letter.length !== 1 || !/[A-Z]/.test(letter)) {
            alert('Veuillez entrer une seule lettre valide !');
            letterInput.value = '';
            return;
        }

        // Vérifier si la lettre a déjà été proposée
        if (this.guessedLetters.includes(letter) || this.wrongLetters.includes(letter)) {
            alert('Cette lettre a déjà été proposée !');
            letterInput.value = '';
            return;
        }

        // Traitement de la lettre
        if (this.currentWord.includes(letter)) {
            this.guessedLetters.push(letter);
            this.monsterLives -= this.countLetterOccurrences(letter);
            this.playSuccessAnimation();
        } else {
            this.wrongLetters.push(letter);
            this.playerLives--;
            this.playFailureAnimation();
        }

        // Mise à jour de l'affichage
        this.updatePlayerInfo();
        this.updateWordDisplay();
        letterInput.value = '';

        // Vérifier les conditions de fin de jeu
        this.checkGameEnd();
    }

    /**
     * Compte le nombre d'occurrences d'une lettre dans le mot
     * @param {string} letter - La lettre à compter
     * @returns {number} Le nombre d'occurrences
     */
    countLetterOccurrences(letter) {
        return this.currentWord.split(letter).length - 1;
    }

    /**
     * Joue l'animation de succès (joueur attaque le monstre)
     */
    playSuccessAnimation() {
        const level = this.getCurrentLevel();
        const config = this.spriteConfig[level];
        
        if (this.playerSprite) {
            this.playerSprite.classList.add('attacking');
        }
        this.createAttackImage(config.player.attack, 'player');
        
        // Impact sur le monstre après 600ms (quand le projectile l'atteint)
        setTimeout(() => {
            this.createImpactEffect('monster');
            this.createScreenFlash('player-attack');
            if (this.monsterSprite) {
                this.monsterSprite.classList.add('hit');
            }
            this.updateSpriteHealth();
        }, 600);

        // Fin des animations
        setTimeout(() => {
            if (this.playerSprite) {
                this.playerSprite.classList.remove('attacking');
            }
            if (this.monsterSprite) {
                this.monsterSprite.classList.remove('hit');
            }
        }, 1200);
    }

    /**
     * Joue l'animation d'échec (monstre attaque le joueur)
     */
    playFailureAnimation() {
        const level = this.getCurrentLevel();
        const config = this.spriteConfig[level];
        
        if (this.monsterSprite) {
            this.monsterSprite.classList.add('attacking');
        }
        
        // Pour le niveau 3, alterner entre les deux attaques
        let attackImage = config.monster.attack;
        if (Array.isArray(attackImage)) {
            const randomIndex = Math.floor(Math.random() * attackImage.length);
            attackImage = attackImage[randomIndex];
        }
        
        this.createAttackImage(attackImage, 'monster');
        
        // Impact sur le joueur après 600ms (quand le projectile l'atteint)
        setTimeout(() => {
            this.createImpactEffect('player');
            this.createScreenFlash('monster-attack');
            if (this.playerSprite) {
                this.playerSprite.classList.add('hit');
            }
            this.updateSpriteHealth();
        }, 600);

        // Fin des animations
        setTimeout(() => {
            if (this.monsterSprite) {
                this.monsterSprite.classList.remove('attacking');
            }
            if (this.playerSprite) {
                this.playerSprite.classList.remove('hit');
            }
        }, 1200);
    }

    /**
     * Crée un effet d'impact visuel au moment où l'attaque touche le sprite
     * @param {string} target - 'player' ou 'monster'
     */
    createImpactEffect(target) {
        const targetSprite = target === 'player' ? this.playerSprite : this.monsterSprite;
        if (!targetSprite) return;

        const impactEffect = document.createElement('div');
        impactEffect.className = `impact-effect impact-${target}`;
        
        // Positionner l'effet sur le sprite touché
        const spriteRect = targetSprite.getBoundingClientRect();
        const containerRect = targetSprite.closest('.sprite-container').getBoundingClientRect();
        
        impactEffect.style.position = 'absolute';
        impactEffect.style.left = '50%';
        impactEffect.style.top = '50%';
        
        targetSprite.closest('.sprite-container').appendChild(impactEffect);
        
        // Supprimer l'effet après l'animation
        setTimeout(() => {
            if (impactEffect.parentNode) {
                impactEffect.parentNode.removeChild(impactEffect);
            }
        }, 400);
    }

    /**
     * Crée un flash d'écran pour renforcer l'effet d'impact
     * @param {string} attackType - 'player-attack' ou 'monster-attack'
     */
    createScreenFlash(attackType) {
        const flash = document.createElement('div');
        flash.className = `screen-flash flash-${attackType}`;
        
        document.body.appendChild(flash);
        
        // Supprimer le flash après l'animation
        setTimeout(() => {
            if (flash.parentNode) {
                flash.parentNode.removeChild(flash);
            }
        }, 300);
    }

    /**
     * Crée une image d'attaque temporaire avec animation de projectile améliorée
     * @param {string} imagePath - Chemin de l'image d'attaque
     * @param {string} attacker - 'player' ou 'monster'
     */
    createAttackImage(imagePath, attacker) {
        const container = document.querySelector('.container-animation-sprites');
        if (!container) return;
        
        const attackImg = document.createElement('img');
        attackImg.className = `attack-effect ${attacker}-attack`;
        
        // Styles de base pour l'effet d'attaque
        attackImg.style.position = 'absolute';
        attackImg.style.width = '80px';
        attackImg.style.height = '80px';
        attackImg.style.zIndex = '10';
        attackImg.style.top = '50%';
        attackImg.style.pointerEvents = 'none';
        attackImg.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))';
        
        // Tester si l'image d'attaque existe
        attackImg.onload = () => {
            console.log('Image d\'attaque chargée:', imagePath);
        };
        
        attackImg.onerror = () => {
            console.error('Image d\'attaque non trouvée:', imagePath);
            // Créer un effet visuel alternatif amélioré
            attackImg.remove();
            const fallbackEffect = document.createElement('div');
            fallbackEffect.className = `attack-effect ${attacker}-attack`;
            fallbackEffect.style.position = 'absolute';
            fallbackEffect.style.width = '60px';
            fallbackEffect.style.height = '60px';
            fallbackEffect.style.top = '50%';
            fallbackEffect.style.zIndex = '10';
            fallbackEffect.style.pointerEvents = 'none';
            fallbackEffect.style.borderRadius = '50%';
            fallbackEffect.style.display = 'flex';
            fallbackEffect.style.alignItems = 'center';
            fallbackEffect.style.justifyContent = 'center';
            fallbackEffect.style.fontSize = '2em';
            fallbackEffect.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
            fallbackEffect.style.filter = 'drop-shadow(0 0 15px currentColor)';
            
            if (attacker === 'player') {
                fallbackEffect.style.background = 'radial-gradient(circle, #ffff00, #ff8800)';
                fallbackEffect.innerHTML = '⚔️';
                fallbackEffect.style.left = '20%';
            } else {
                fallbackEffect.style.background = 'radial-gradient(circle, #ff4444, #aa0000)';
                fallbackEffect.innerHTML = '🔥';
                fallbackEffect.style.right = '20%';
            }
            
            container.appendChild(fallbackEffect);
            
            setTimeout(() => {
                if (fallbackEffect.parentNode) {
                    fallbackEffect.parentNode.removeChild(fallbackEffect);
                }
            }, 800);
            
            return;
        };
        
        attackImg.src = imagePath;
        container.appendChild(attackImg);
        
        // Supprimer l'effet après l'animation
        setTimeout(() => {
            if (attackImg.parentNode) {
                attackImg.parentNode.removeChild(attackImg);
            }
        }, 800);
    }

    /**
     * Met à jour l'affichage des points de vie sur les sprites
     */
    updateSpriteHealth() {
        const healthElements = document.querySelectorAll('.sprite-health');
        if (healthElements[0]) {
            healthElements[0].textContent = `Joueur: ${this.playerLives}`;
        }
        if (healthElements[1]) {
            healthElements[1].textContent = `Monstre: ${this.monsterLives}`;
        }
    }

    /**
     * Vérifie les conditions de fin de jeu
     * Détermine si le joueur a gagné ou perdu
     */
    checkGameEnd() {
        const wordCompleted = this.currentWord.split('').every(letter => 
            this.guessedLetters.includes(letter)
        );

        if (wordCompleted || this.monsterLives <= 0) {
            setTimeout(() => {
                alert(`Victoire ! Vous avez terrassé le monstre !\nLe mot était : ${this.currentWord}`);
                this.askPlayAgain();
            }, 100);
        } else if (this.playerLives <= 0) {
            setTimeout(() => {
                alert(`Défaite ! Le monstre vous a vaincu...\nLe mot était : ${this.currentWord}`);
                this.askPlayAgain();
            }, 100);
        }
    }

    /**
     * Demande au joueur s'il veut rejouer
     */
    askPlayAgain() {
        const playAgain = confirm('Voulez-vous jouer une nouvelle partie ?');
        if (playAgain) {
            this.resetGame();
        } else {
            window.location.href = 'index.html';
        }
    }

    /**
     * Remet à zéro le jeu pour une nouvelle partie
     */
    resetGame() {
        this.playerLives = 8;
        this.selectRandomWord();
        
        // Arrêter toutes les animations avant de recréer
        if (this.playerSprite) {
            this.stopSpriteAnimation(this.playerSprite);
        }
        if (this.monsterSprite) {
            this.stopSpriteAnimation(this.monsterSprite);
        }
        
        this.setupSprites();
        this.updatePlayerInfo();
        this.updateWordDisplay();
    }
}

/**
 * Initialisation du jeu au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    const game = new MuskTheBeastGame();
    
    // Si on est sur gameboard.html, initialiser le plateau de jeu
    if (document.getElementById('word-placeholder')) {
        game.initGameBoard();
    }
});
