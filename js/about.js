// js/about.js
import { techStack } from './aboutData.js';

// Create particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.insertBefore(particlesContainer, document.body.firstChild);

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 5 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;

        particlesContainer.appendChild(particle);
    }
}

// Initialize tech globe
function initTechGlobe() {
    const globe = document.getElementById('globe');
    const container = document.getElementById('globeContainer');

    if (!globe || !container) {
        console.error('Globe elements not found!');
        return;
    }

    const cards = [];
    techStack.forEach((tech, index) => {
        const card = document.createElement('div');
        card.className = 'logo-card';
        card.setAttribute('data-name', tech.name);

        const img = document.createElement('img');
        img.src = tech.icon;
        img.alt = tech.name;
        img.onerror = () => {
            img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230aa" opacity="0.2"/><text x="50" y="50" font-size="10" text-anchor="middle" dominant-baseline="middle" fill="white">${tech.name}</text></svg>`;
        };

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'logo-tooltip';
        tooltip.innerText = tech.description || 'No description';

        card.appendChild(img);
        card.appendChild(tooltip);
        globe.appendChild(card);
        cards.push(card);
    });

    // Efek orbit animasi
    let angleOffset = 0;
    function animateOrbit() {
        cards.forEach((card, index) => {
            positionOnSphere(card, index, cards.length, container);
        });
        angleOffset += 0.002; // Lebih lambat (sebelumnya 0.008)
        requestAnimationFrame(animateOrbit);
    }
    animateOrbit();

    // Efek globe center glow
    const globeCenter = document.querySelector('.globe-center');
    if (globeCenter) {
        globeCenter.style.boxShadow = '0 0 60px 20px #00d9ff, 0 0 120px 40px #0066ff33';
    }

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 15, y: 0 };
    const rotationSpeed = 0.5;

    // Ubah durasi autoRotate agar lebih lambat
    const autoRotate = gsap.to(rotation, {
        y: 360,
        duration: 180, // Lebih lambat, sebelumnya 60
        repeat: -1,
        ease: "none",
        onUpdate: updateGlobeRotation
    });

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        autoRotate.pause();
        container.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        rotation.y += deltaMove.x * rotationSpeed;
        rotation.x -= deltaMove.y * rotationSpeed;
        rotation.x = Math.max(-90, Math.min(90, rotation.x));

        updateGlobeRotation();
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        autoRotate.play();
        container.style.cursor = 'grab';
    });

    // Touch events
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        autoRotate.pause();
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y
        };

        rotation.y += deltaMove.x * rotationSpeed;
        rotation.x -= deltaMove.y * rotationSpeed;
        rotation.x = Math.max(-90, Math.min(90, rotation.x));

        updateGlobeRotation();
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        e.preventDefault();
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
        autoRotate.play();
    });

    function updateGlobeRotation() {
        globe.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    }

    function createConnections(elements) {
        document.querySelectorAll('.connection').forEach(el => el.remove());

        for (let i = 0; i < elements.length; i++) {
            for (let j = i + 1; j < elements.length; j++) {
                if (Math.random() > 0.7) continue;

                const connection = document.createElement('div');
                connection.className = 'connection';
                globe.appendChild(connection);
                updateConnection(connection, elements[i], elements[j]);
            }
        }

        function updateConnections() {
            const connections = document.querySelectorAll('.connection');
            connections.forEach(conn => {
                const from = conn.getAttribute('data-from');
                const to = conn.getAttribute('data-to');
                if (from && to) {
                    updateConnection(conn, elements[from], elements[to]);
                }
            });
            requestAnimationFrame(updateConnections);
        }

        requestAnimationFrame(updateConnections);
    }

    function updateConnection(connection, el1, el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;

        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        connection.style.width = `${length}px`;
        connection.style.left = `${x1}px`;
        connection.style.top = `${y1}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        connection.style.opacity = Math.min(1, 300 / length);
    }

    function positionOnSphere(card, index, total, container) {
        // UBAH radius dari 0.38 ke 0.55 agar lebih renggang
        const radius = Math.min(container.offsetWidth, container.offsetHeight) * 0.50;
        const phi = Math.acos(1 - 2 * (index + 0.5) / total);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5) + angleOffset;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        card.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        card.style.boxShadow = `0 0 ${15 + z / 10}px rgba(0,247,255,${0.2 + z / (2 * radius)})`;
    }

    function handleResize() {
        cards.forEach((card, index) => {
            positionOnSphere(card, index, cards.length, container);
        });
        createConnections(cards);
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    updateGlobeRotation();
}

// Initialize about section
function initAbout() {
    createParticles();

    // Wait for elements to be available
    const checkGlobe = setInterval(() => {
        if (document.getElementById('globeContainer')) {
            clearInterval(checkGlobe);
            initTechGlobe();
        }
    }, 100);
}

// Start initialization when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAbout);
} else {
    initAbout();
}