document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('glass-hamburger');
    const navLinks = document.querySelector('.glass-nav-links');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.glass-nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
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