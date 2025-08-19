document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('glass-hamburger');
    const navLinks = document.getElementById('glass-nav-links');

    // Toggle mobile menu
    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link (only for mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Highlight active link on scroll
    const sections = ['about', 'experience', 'projects', 'certificates', 'contact'];
    window.addEventListener('scroll', () => {
        let scrollPos = window.scrollY + 120;
        sections.forEach(id => {
            const section = document.getElementById(id);
            const link = document.querySelector(`.glass-nav-links a[href="#${id}"]`);
            if (section && link) {
                if (
                    scrollPos >= section.offsetTop &&
                    scrollPos < section.offsetTop + section.offsetHeight
                ) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    });
});
