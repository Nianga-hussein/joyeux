document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const christmasScreen = document.getElementById('christmas-screen');
    const nameInput = document.getElementById('name-input');
    const enterBtn = document.getElementById('enter-btn');
    const userNameDisplay = document.getElementById('user-name-display');
    const backBtn = document.getElementById('back-btn');
    
    // Nouveaux éléments
    const sleighContainer = document.getElementById('sleigh-container');
    const santaInteraction = document.getElementById('santa-interaction');
    const giftBox = document.getElementById('gift-box');
    const predictionContainer = document.getElementById('prediction-container');
    const predictionText = document.getElementById('prediction-text');
    const instructionText = document.getElementById('instruction-text');
    const speechBubble = document.querySelector('.speech-bubble');

    // Audio
    const santaVoice = document.getElementById('santa-voice');
    const musicBox = document.getElementById('music-box');

    // Préchargement audio (optionnel, pour éviter les délais)
    santaVoice.load();
    musicBox.load();

    const predictions = [
        "Cette année, votre code compilera du premier coup, à chaque fois !",
        "Diagnostika prévoit une année remplie de succès et de café de qualité.",
        "Santé, bonheur et zéro bug en production pour 2026 !",
        "Votre créativité résoudra les problèmes les plus complexes.",
        "Une promotion ou une belle réussite est en chemin !",
        "L'équipe Diagnostika voit grand pour vous cette année.",
        "Vous serez la star de votre équipe en 2026 !",
        "Des projets passionnants et des défis stimulants vous attendent."
    ];

    // Fonction pour démarrer l'expérience
    const startExperience = () => {
        const name = nameInput.value.trim();
        
        if (name === '') {
            alert('S\'il vous plaît, entrez votre nom pour continuer ! 🎅');
            return;
        }

        // Mettre à jour le nom
        userNameDisplay.textContent = name;

        // Transition
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.classList.add('hidden');
            christmasScreen.classList.remove('hidden');
            // Petit délai pour l'animation d'entrée
            christmasScreen.style.opacity = '0';
            setTimeout(() => {
                christmasScreen.style.transition = 'opacity 1s ease';
                christmasScreen.style.opacity = '1';
                
                // Démarrer l'animation du traîneau
                startSleighAnimation();
                
            }, 50);
        }, 500);
    };

    const startSleighAnimation = () => {
        // Afficher le conteneur du traîneau
        sleighContainer.classList.remove('hidden');
        sleighContainer.classList.add('flying');

        // Jouer la voix du Père Noël après un petit délai
        setTimeout(() => {
            santaVoice.volume = 0.8;
            santaVoice.play().catch(e => console.log("Erreur lecture audio:", e));
        }, 1000);

        // Afficher la bulle de texte quand il passe au milieu (approx 4s)
        setTimeout(() => {
            speechBubble.classList.add('visible');
        }, 3500);

        // Cacher la bulle
        setTimeout(() => {
            speechBubble.classList.remove('visible');
        }, 8000);

        // Faire apparaître le cadeau et l'interaction une fois que le traîneau est passé
        setTimeout(() => {
            santaInteraction.classList.remove('hidden');
            giftBox.classList.remove('hidden');
            setTimeout(() => giftBox.classList.add('visible'), 100);
            
            // On cache l'instruction textuelle en bas car on a le label "Ouvre-moi" sur le cadeau maintenant
            // instructionText.innerHTML = "Le Père Noël a déposé un cadeau... <br>Clique dessus !";
            // instructionText.classList.remove('hidden');
        }, 9000); // Ajusté pour correspondre à la fin du passage
    };

    // Gestion du clic sur le cadeau
    giftBox.addEventListener('click', () => {
        if (giftBox.classList.contains('opened')) return;
        
        giftBox.classList.add('opened');
        
        // Jouer la musique
        musicBox.volume = 0.6;
        musicBox.currentTime = 0;
        musicBox.play().catch(e => console.log("Erreur lecture audio:", e));
        
        // Effets d'ouverture (confettis)
        createConfetti(giftBox);
        
        // Cacher le cadeau doucement
        giftBox.style.transform = 'translate(-50%, -50%) scale(0)';
        
        // Afficher la prédiction
        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        predictionText.textContent = randomPrediction;
        
        setTimeout(() => {
            instructionText.classList.add('hidden');
            predictionContainer.classList.remove('hidden');
        }, 500);
    });

    // Écouteurs d'événements
    enterBtn.addEventListener('click', startExperience);
    
    // Permettre la touche "Entrée"
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startExperience();
        }
    });

    backBtn.addEventListener('click', () => {
        christmasScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        loginScreen.style.opacity = '1';
        nameInput.value = '';
        
        // Reset animations
        sleighContainer.classList.remove('flying', 'hidden'); // Stop animation
        // Force reflow pour reset animation CSS
        void sleighContainer.offsetWidth; 
        
        santaInteraction.classList.add('hidden');
        giftBox.classList.remove('visible', 'opened');
        giftBox.classList.add('hidden');
        predictionContainer.classList.add('hidden');
        instructionText.classList.add('hidden'); // Caché au début
        
        // Stop audio
        santaVoice.pause();
        santaVoice.currentTime = 0;
        musicBox.pause();
        musicBox.currentTime = 0;
    });

    // Génération de la neige
    createSnow();
});

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Couleur aléatoire
        const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Position de départ
        confetti.style.left = centerX + 'px';
        confetti.style.top = centerY + 'px';
        
        // Direction aléatoire
        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 5;
        const tx = Math.cos(angle) * 100;
        const ty = Math.sin(angle) * 100 - 100; // Tendance vers le haut
        
        confetti.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        });
        
        document.body.appendChild(confetti);
        
        // Nettoyage
        setTimeout(() => confetti.remove(), 1500);
    }
}

function createSnow() {
    const container = document.querySelector('.snow-container');
    const snowflakeCount = 50;

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄';
        
        // Position aléatoire
        snowflake.style.left = Math.random() * 100 + 'vw';
        
        // Taille aléatoire
        const size = Math.random() * 1.5 + 0.5;
        snowflake.style.fontSize = size + 'rem';
        
        // Durée de chute aléatoire
        const duration = Math.random() * 5 + 5; // Entre 5 et 10 secondes
        snowflake.style.animationDuration = duration + 's';
        
        // Délai aléatoire
        snowflake.style.animationDelay = Math.random() * 5 + 's';

        container.appendChild(snowflake);
    }
}
