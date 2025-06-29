document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', e => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseover', e => {
        const target = e.target.closest('a, button, .floating-icon, .floating-icon-tech');
        if (target) {
            cursor.classList.add('hover-effect');
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.opacity = '0.6';
        } else {
            cursor.classList.remove('hover-effect');
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.opacity = '0.3';
        }
    });

    // --- Particle System Logic ---
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.querySelector('.hero').appendChild(particle);

        const size = Math.random() * 4 + 1; // Smaller particles for subtlety
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        particle.style.setProperty('--dx1', `${(Math.random() - 0.5) * 150}px`);
        particle.style.setProperty('--dy1', `${(Math.random() - 0.5) * 150}px`);
        particle.style.setProperty('--dx2', `${(Math.random() - 0.5) * 150}px`);
        particle.style.setProperty('--dy2', `${(Math.random() - 0.5) * 150}px`);
        particle.style.setProperty('--dx3', `${(Math.random() - 0.5) * 150}px`);
        particle.style.setProperty('--dy3', `${(Math.random() - 0.5) * 150}px`);

        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 8 + 4}s`;

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    };

    // Create initial particles and then continuously add new ones
    for (let i = 0; i < 20; i++) {
        createParticle();
    }
    setInterval(createParticle, 500);

    // --- Floating Text Pop-up Logic ---
    const floatingTexts = ['AI', 'ML', 'Data', 'Coding', 'DevOps', 'Cloud', 'Analytics']; // Added more relevant texts
    const createFloatingText = () => {
        const textElement = document.createElement('div');
        textElement.classList.add('floating-text-popup');
        textElement.textContent = floatingTexts[Math.floor(Math.random() * floatingTexts.length)];
        document.querySelector('.hero').appendChild(textElement);

        // Get hero and hero-content dimensions for positioning
        const heroRect = document.querySelector('.hero').getBoundingClientRect();
        const heroContentRect = document.querySelector('.hero-content').getBoundingClientRect();

        let xPos, yPos;
        const buffer = 50; // Buffer to ensure it's clearly outside the main content

        // Decide to place top/bottom or left/right
        if (Math.random() < 0.5) { // Top or Bottom
            yPos = Math.random() < 0.5 ?
                heroRect.top + Math.random() * (heroContentRect.top - heroRect.top - buffer) : // Top area
                heroContentRect.bottom + buffer + Math.random() * (heroRect.bottom - heroContentRect.bottom - buffer); // Bottom area
            xPos = heroRect.left + Math.random() * heroRect.width;
        } else { // Left or Right
            xPos = Math.random() < 0.5 ?
                heroRect.left + Math.random() * (heroContentRect.left - heroRect.left - buffer) : // Left area
                heroContentRect.right + buffer + Math.random() * (heroRect.right - heroContentRect.right - buffer); // Right area
            yPos = heroRect.top + Math.random() * heroRect.height;
        }

        // Adjust position to be relative to the hero container
        textElement.style.left = `${xPos - heroRect.left}px`;
        textElement.style.top = `${yPos - heroRect.top}px`;

        // Set animation properties for movement
        const startX = (Math.random() - 0.5) * 100;
        const startY = (Math.random() - 0.5) * 100;
        const moveX = (Math.random() - 0.5) * 50;
        const moveY = (Math.random() - 0.5) * 50;
        const endX = (Math.random() - 0.5) * 150;
        const endY = (Math.random() - 0.5) * 150;

        textElement.style.setProperty('--x-start', `${startX}px`);
        textElement.style.setProperty('--y-start', `${startY}px`);
        textElement.style.setProperty('--x-move', `${moveX}px`);
        textElement.style.setProperty('--y-move', `${moveY}px`);
        textElement.style.setProperty('--x-end', `${endX}px`);
        textElement.style.setProperty('--y-end', `${endY}px`);

        textElement.addEventListener('animationend', () => {
            textElement.remove();
        });
    };

    // Create initial floating texts and then continuously add new ones
    for (let i = 0; i < 5; i++) { // Initial number of floating texts
        createFloatingText();
    }
    setInterval(createFloatingText, 2000); // Create a new floating text every 2 seconds

    // Set the data-text attribute for the glitch effect
    const heroTitleElement = document.querySelector('.hero-title');
    heroTitleElement.setAttribute('data-text', heroTitleElement.textContent);

    // Typing effect for the greeting (added this back)
    const greetingElement = document.querySelector('.greeting');
    const greetings = ["Hello World!", "Welcome to my digital realm.", "Innovating for the future.", "Explore my creations."];
    let currentGreetingIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeGreeting = () => {
        const currentText = greetings[currentGreetingIndex];
        if (isDeleting) {
            greetingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            greetingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        greetingElement.classList.add('active'); // Ensure greeting is visible when typing

        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 1500); // Pause at end of typing
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentGreetingIndex = (currentGreetingIndex + 1) % greetings.length;
            setTimeout(() => greetingElement.classList.remove('active'), 500); // Briefly hide before next typing
        }

        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeGreeting, typingSpeed);
    };

    // Start the typing effect after a short delay
    setTimeout(typeGreeting, 1000);

    // Back to Top button logic
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.style.display = (window.scrollY > 300) ? 'flex' : 'none';
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});