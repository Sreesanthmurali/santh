// ===== Birthday Website - Interactive Script (Anime Edition) =====

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollReveal();
    initGiftBox();
    initCakeCutting();
    initAnimalParade();
});

// ===== PARTICLE SYSTEM =====
function initParticles() {
    const container = document.getElementById('particles');
    const emojis = ['💖', '✨', '🌸', '💫', '🦋', '⭐', '💕', '🎀', '🌷', '🎂'];

    // Burst on load
    for (let i = 0; i < 25; i++) {
        setTimeout(() => createParticle(container, emojis), i * 120);
    }

    // Ongoing gentle particles
    setInterval(() => {
        if (Math.random() > 0.4) {
            createParticle(container, emojis);
        }
    }, 800);
}

function createParticle(container, emojis) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const x = Math.random() * window.innerWidth;
    const duration = 4 + Math.random() * 4;
    const size = 0.6 + Math.random() * 1;

    particle.style.left = x + 'px';
    particle.style.top = '-20px';
    particle.style.fontSize = size + 'rem';
    particle.style.animationDuration = duration + 's';

    container.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => observer.observe(section));

    // Hero visible immediately
    setTimeout(() => {
        document.getElementById('hero').classList.add('visible');
    }, 300);
}

// ===== GIFT BOX =====
function initGiftBox() {
    const giftBox = document.getElementById('giftBox');

    giftBox.addEventListener('click', () => {
        if (giftBox.classList.contains('opened')) return;
        giftBox.classList.add('opened');

        // Celebration burst
        const container = document.getElementById('particles');
        const celebrationEmojis = ['🎉', '🎊', '💖', '✨', '🌟', '💝', '🎁', '🥳'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createParticle(container, celebrationEmojis), i * 80);
        }
    });
}

// ===== CAKE CUTTING WITH SLICE SEPARATION =====
function initCakeCutting() {
    const cakeWrapper = document.getElementById('cakeWrapper');
    const knifeCursor = document.getElementById('knifeCursor');
    const cakeInstruction = document.getElementById('cakeInstruction');
    const cakeCelebration = document.getElementById('cakeCelebration');
    const cutLine = document.getElementById('cutLine');
    const cakeSlice = document.getElementById('cakeSlice');

    let isCutting = false;
    let hasCut = false;
    let startY = null;

    // Enable cutting mode when section is visible
    const cakeSection = document.getElementById('cake');
    const cakeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCut) {
                setTimeout(() => {
                    cakeWrapper.classList.add('cutting');
                }, 1200);
            }
        });
    }, { threshold: 0.3 });
    cakeObserver.observe(cakeSection);

    // Click counter for cut-on-double-click fallback
    let clickCount = 0;

    function handleMoveStart(e) {
        if (hasCut) return;
        isCutting = true;
        const pos = getEventPos(e);
        startY = pos.y;

        // Double-click fallback for cutting
        clickCount++;
        if (clickCount >= 2) {
            performCut();
        }
        setTimeout(() => { clickCount = 0; }, 800);
    }

    function handleMove(e) {
        if (hasCut) return;
        const pos = getEventPos(e);

        // Update knife cursor
        const rect = cakeWrapper.getBoundingClientRect();
        knifeCursor.style.left = (pos.x - rect.left - 15) + 'px';
        knifeCursor.style.top = (pos.y - rect.top - 15) + 'px';

        if (!isCutting) return;

        const distance = pos.y - startY;
        // Lower threshold for easier cutting
        if (distance > 40) {
            performCut();
        }
    }

    function handleMoveEnd() {
        isCutting = false;
        startY = null;
    }

    function getEventPos(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    function performCut() {
        if (hasCut) return;
        hasCut = true;
        isCutting = false;

        // Show cut line
        cakeWrapper.classList.add('cut');

        // Candles go out
        const flames = document.querySelectorAll('.flame');
        flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.style.opacity = '0';
                flame.style.transform = 'translateX(-50%) scale(0)';
            }, index * 100);
        });

        // Separate the cake slice
        setTimeout(() => {
            cakeSlice.classList.add('separated');
        }, 400);

        // Hide instruction, show celebration
        setTimeout(() => {
            cakeInstruction.classList.add('hidden');
            cakeCelebration.classList.add('show');

            // Celebration particles
            const container = document.getElementById('particles');
            const cakeEmojis = ['🎂', '🍰', '🎉', '🥳', '🎊', '✨', '💖', '🎈'];
            for (let i = 0; i < 30; i++) {
                setTimeout(() => createParticle(container, cakeEmojis), i * 60);
            }
        }, 800);

        // Disable knife cursor
        setTimeout(() => {
            cakeWrapper.classList.remove('cutting');
        }, 1000);
    }

    // Event listeners
    cakeWrapper.addEventListener('mousedown', handleMoveStart);
    cakeWrapper.addEventListener('mousemove', handleMove);
    cakeWrapper.addEventListener('mouseup', handleMoveEnd);
    cakeWrapper.addEventListener('mouseleave', handleMoveEnd);
    cakeWrapper.addEventListener('touchstart', handleMoveStart, { passive: true });
    cakeWrapper.addEventListener('touchmove', handleMove, { passive: true });
    cakeWrapper.addEventListener('touchend', handleMoveEnd);
}

// ===== ANIMAL PARADE =====
function initAnimalParade() {
    const animals = document.querySelectorAll('.parade-animal');

    animals.forEach(animal => {
        animal.addEventListener('click', () => {
            const wasActive = animal.classList.contains('active');
            animals.forEach(a => a.classList.remove('active'));

            if (!wasActive) {
                animal.classList.add('active');
                const container = document.getElementById('particles');
                const heartEmojis = ['💖', '✨', '💕'];
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => createParticle(container, heartEmojis), i * 100);
                }
            }
        });
    });
}
