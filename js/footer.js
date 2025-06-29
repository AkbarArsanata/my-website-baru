document.addEventListener('DOMContentLoaded', function () {
    // Current year for copyright
    document.querySelector('.footer-bottom p').textContent =
        `© ${new Date().getFullYear()} MyPortfolio. All rights reserved.`;

    // Smooth scroll for footer links
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});