document.addEventListener('DOMContentLoaded', () => {
    console.log('experience.js loaded with advanced futuristic animations.');

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animasi Intro untuk Bagian Pengalaman
    gsap.from(".experience", {
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
    });

    // Animasi untuk Judul dan Subtitle Bagian
    gsap.from(".section-header .section-title", {
        y: -60,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.2
    });

    gsap.from(".section-header .section-divider", {
        width: 0,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.7
    });

    gsap.from(".section-header .section-subtitle", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 1.1
    });

    // Animasi untuk Garis Timeline Utama
    gsap.from(".timeline::before", {
        height: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".timeline",
            start: "top 80%",
            toggleActions: "play none none none",
        }
    });

    // Animasi Timeline Items (muncul secara bergantian)
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: index % 2 === 0 ? -180 : 180,
            scale: 0.85,
            rotation: index % 2 === 0 ? -8 : 8,
            duration: 1.1,
            ease: "expo.out",
            delay: index * 0.12,
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
            }
        });

        // Animasi dot timeline
        gsap.from(item.querySelector('.timeline-dot'), {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(2)",
            delay: index * 0.1 + 0.8, // Muncul setelah itemnya
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
            }
        });

        // Animasi company-logo (muncul dari zoom kecil)
        gsap.from(item.querySelector('.company-logo'), {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            delay: index * 0.1 + 1, // Muncul setelah dot
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
            }
        });

        // Animasi skill-tag (muncul satu per satu)
        gsap.from(item.querySelectorAll('.skill-tag'), {
            opacity: 0,
            y: 20,
            stagger: 0.05,
            duration: 0.4,
            ease: "power2.out",
            delay: index * 0.1 + 1.2,
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
            }
        });

        // Efek hover JavaScript untuk timeline-content (lebih kompleks)
        item.querySelector('.timeline-content').addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('.timeline-content'), {
                y: -12, // Lebih jauh naik
                boxShadow: "0 20px 70px rgba(0, 229, 255, 0.6), 0 0 40px rgba(138, 43, 226, 0.4)", // Glow ganda
                duration: 0.3,
                ease: "power2.out"
            });
            gsap.to(item.querySelector('.timeline-dot'), {
                scale: 1.2, // Dot juga membesar
                boxShadow: "0 0 0 10px rgba(0, 229, 255, 0.4), 0 0 50px rgba(0, 229, 255, 1)",
                duration: 0.2
            });
        });

        item.querySelector('.timeline-content').addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('.timeline-content'), {
                y: 0,
                boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.45)",
                duration: 0.3,
                ease: "power2.out"
            });
            gsap.to(item.querySelector('.timeline-dot'), {
                scale: 1,
                boxShadow: "0 0 0 6px rgba(0, 229, 255, 0.5), 0 0 25px rgba(0, 229, 255, 0.9)",
                duration: 0.2
            });
        });

        // Add scanline
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        item.querySelector('.timeline-content').appendChild(scanline);
    });

    // Particle background using tsParticles
    tsParticles.load("experience-particles", {
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
            color: { value: ["#00e5ff", "#8a2be2", "#fff"] },
            links: { enable: true, color: "#00e5ff", distance: 120, opacity: 0.3 },
            move: { enable: true, speed: 1.2, outModes: "bounce" },
            number: { value: 40 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } }
        },
        detectRetina: true
    });

    // Timeline progress bar (smooth)
    const timeline = document.querySelector('.timeline');
    const progressBar = document.querySelector('.timeline-progress');
    let lastProgress = 0;
    window.addEventListener('scroll', () => {
        const rect = timeline.getBoundingClientRect();
        const winH = window.innerHeight;
        const total = rect.height;
        let visible = Math.min(Math.max(winH - rect.top, 0), total);
        let progress = (visible / total * 100);
        // Smooth animation
        gsap.to(progressBar, { height: progress + '%', duration: 0.3, overwrite: true });
    });

    // Parallax effect for timeline background
    const timelineBg = document.querySelector('.timeline');
    if (timelineBg) {
        const offset = window.scrollY * 0.08;
        timelineBg.style.backgroundPosition = `center ${offset}px`;
    }

    // Expand/collapse timeline card
    document.querySelectorAll('.timeline-content').forEach(card => {
        card.addEventListener('click', function (e) {
            if (window.innerWidth < 600) return; // skip on mobile
            this.classList.toggle('expanded');
            if (this.classList.contains('expanded')) {
                gsap.to(this, { scale: 1.07, background: "rgba(0,229,255,0.13)", duration: 0.4 });
            } else {
                gsap.to(this, { scale: 1, background: "rgba(255,255,255,0.08)", duration: 0.4 });
            }
        });
    });

    // Ripple effect on timeline-content click
    document.querySelectorAll('.timeline-content').forEach(card => {
        card.addEventListener('click', function (e) {
            if (window.innerWidth < 600) return;
            let ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = (e.clientX - card.getBoundingClientRect().left) + 'px';
            ripple.style.top = (e.clientY - card.getBoundingClientRect().top) + 'px';
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    // Parallax logo on mouse move (smooth)
    document.querySelectorAll('.company-logo').forEach(logo => {
        logo.addEventListener('mousemove', e => {
            const rect = logo.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            logo.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.08)`;
        });
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = '';
        });
    });

    // --- Animated Wave Divider (SVG Path morphing) ---
    (function animateWave() {
        const wave = document.getElementById('expWavePath');
        if (!wave) return;
        let t = 0;
        function morph() {
            t += 0.018;
            // Morphing wave path
            const amp = 30 + 10 * Math.sin(t * 0.7);
            const mid = 60 + 10 * Math.cos(t * 0.5);
            const d = `M0,${mid} Q360,${mid + amp} 720,${mid} T1440,${mid} V120 H0Z`;
            wave.setAttribute('d', d);
            requestAnimationFrame(morph);
        }
        morph();
    })();

    // --- Wave Divider Particles (simple floating dots) ---
    (function waveParticles() {
        const container = document.querySelector('.wave-particles');
        if (!container) return;
        const colors = ['#0ea5e9', '#38bdf8', '#8a2be2', '#fff'];
        for (let i = 0; i < 18; i++) {
            const dot = document.createElement('div');
            dot.className = 'wave-dot';
            dot.style.background = colors[Math.floor(Math.random() * colors.length)];
            dot.style.left = `${Math.random() * 98}%`;
            dot.style.top = `${40 + Math.random() * 40}%`;
            dot.style.width = dot.style.height = `${6 + Math.random() * 10}px`;
            dot.style.opacity = 0.18 + Math.random() * 0.18;
            dot.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(dot);
        }
    })();

    // --- Project Divider Particles (tiny shimmer dots) ---
    (function projectDividerParticles() {
        const container = document.querySelector('.project-divider-particles');
        if (!container) return;
        const colors = ['#0ea5e9', '#38bdf8', '#8a2be2', '#fff'];
        for (let i = 0; i < 12; i++) {
            const dot = document.createElement('div');
            dot.className = 'divider-dot';
            dot.style.background = colors[Math.floor(Math.random() * colors.length)];
            dot.style.left = `${5 + Math.random() * 90}%`;
            dot.style.top = `${30 + Math.random() * 40}%`;
            dot.style.width = dot.style.height = `${3 + Math.random() * 5}px`;
            dot.style.opacity = 0.22 + Math.random() * 0.18;
            dot.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(dot);
        }
    })();

    // --- Advanced Animated Wave Divider (SVG Path morphing & shimmer) ---
    (function animateWave() {
        const wave = document.getElementById('expWavePath');
        if (!wave) return;
        let t = 0;
        function morph() {
            t += 0.018;
            // Multi-frequency morphing for more "liquid" effect
            const amp = 32 + 14 * Math.sin(t * 0.7) + 7 * Math.cos(t * 1.2);
            const mid = 60 + 10 * Math.cos(t * 0.5) + 4 * Math.sin(t * 1.1);
            const d = `M0,${mid} Q360,${mid + amp} 720,${mid} T1440,${mid} V120 H0Z`;
            wave.setAttribute('d', d);
            requestAnimationFrame(morph);
        }
        morph();
    })();

    // --- Advanced Wave Divider Particles (neon, floating, random speed) ---
    (function waveParticles() {
        const container = document.querySelector('.wave-particles');
        if (!container) return;
        const colors = [
            'rgba(14,165,233,0.85)', 'rgba(56,189,248,0.85)', 'rgba(138,43,226,0.85)', '#fff'
        ];
        for (let i = 0; i < 24; i++) {
            const dot = document.createElement('div');
            dot.className = 'wave-dot';
            dot.style.background = colors[Math.floor(Math.random() * colors.length)];
            dot.style.left = `${Math.random() * 98}%`;
            dot.style.top = `${40 + Math.random() * 40}%`;
            dot.style.width = dot.style.height = `${7 + Math.random() * 13}px`;
            dot.style.opacity = 0.18 + Math.random() * 0.22;
            dot.style.animationDelay = `${Math.random() * 2.5}s`;
            dot.style.animationDuration = `${3.2 + Math.random() * 2.2}s`;
            container.appendChild(dot);
        }
    })();

    // --- Advanced Project Divider Particles (neon, shimmer, horizontal flow) ---
    (function projectDividerParticles() {
        const container = document.querySelector('.project-divider-particles');
        if (!container) return;
        const colors = [
            'rgba(14,165,233,0.85)', 'rgba(56,189,248,0.85)', 'rgba(138,43,226,0.85)', '#fff'
        ];
        for (let i = 0; i < 16; i++) {
            const dot = document.createElement('div');
            dot.className = 'divider-dot';
            dot.style.background = colors[Math.floor(Math.random() * colors.length)];
            dot.style.left = `${5 + Math.random() * 90}%`;
            dot.style.top = `${30 + Math.random() * 40}%`;
            dot.style.width = dot.style.height = `${3 + Math.random() * 7}px`;
            dot.style.opacity = 0.22 + Math.random() * 0.18;
            dot.style.animationDelay = `${Math.random() * 2.5}s`;
            dot.style.animationDuration = `${2.2 + Math.random() * 2.2}s`;
            container.appendChild(dot);
        }
    })();

    // Neon Canvas Particle Background
    (function neonParticles() {
        const canvas = document.getElementById('neon-particles-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = document.querySelector('.experience').offsetHeight;
        window.addEventListener('resize', () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = document.querySelector('.experience').offsetHeight;
        });
        const colors = ['#00e5ff', '#8a2be2', '#fff', '#38bdf8'];
        const particles = Array.from({ length: 36 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 2 + Math.random() * 5,
            dx: -0.5 + Math.random(),
            dy: -0.5 + Math.random(),
            c: colors[Math.floor(Math.random() * colors.length)],
            o: 0.18 + Math.random() * 0.22
        }));
        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
                ctx.shadowColor = p.c;
                ctx.shadowBlur = 16;
                ctx.globalAlpha = p.o;
                ctx.fillStyle = p.c;
                ctx.fill();
                ctx.globalAlpha = 1;
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > w) p.dx *= -1;
                if (p.y < 0 || p.y > h) p.dy *= -1;
            }
            requestAnimationFrame(draw);
        }
        draw();
    })();

    window.addEventListener('scroll', () => {
        const title = document.querySelector('.section-title');
        if (title) {
            title.style.transform = `translateY(${window.scrollY * 0.08}px)`;
        }
    });
});

document.querySelectorAll('.timeline-content').forEach(card => {
    card.addEventListener('mousemove', e => {
        const trail = document.createElement('span');
        trail.className = 'neon-trail';
        trail.style.left = (e.clientX - card.getBoundingClientRect().left) + 'px';
        trail.style.top = (e.clientY - card.getBoundingClientRect().top) + 'px';
        card.appendChild(trail);
        setTimeout(() => trail.remove(), 400);
    });
});