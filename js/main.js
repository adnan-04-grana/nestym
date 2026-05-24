(function () {
    'use strict';

    function createParticles() {
        const bg = document.getElementById('animatedBg');
        if (!bg || bg.dataset.particlesReady === 'true') return;
        bg.dataset.particlesReady = 'true';
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 20) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            bg.appendChild(particle);
        }
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.length <= 1) return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function initMobileNav() {
        const toggle = document.getElementById('menuToggle');
        const navLinks = document.querySelector('.nav-links');
        if (!toggle || !navLinks) return;

        toggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function initActiveNav() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const inPages = window.location.pathname.includes('/pages/');

        document.querySelectorAll('.nav-links a').forEach(function (link) {
            const href = link.getAttribute('href');
            let linkPath = href.split('/').pop().split('#')[0] || 'index.html';

            if (href === '#home' && (path === 'index.html' || path === '')) {
                link.classList.add('active');
                return;
            }

            if (inPages && href.startsWith('../index.html#')) return;

            if (linkPath === path || (path === '' && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    function buildWhatsAppMessage(form) {
        const fields = [
            { label: 'Name', selector: '[name="name"]' },
            { label: 'Email', selector: '[name="email"]' },
            { label: 'Phone', selector: '[name="phone"]' },
            { label: 'Company', selector: '[name="company"]' },
            { label: 'Subject', selector: '[name="subject"]' },
            { label: 'Service', selector: '[name="service"]' },
            { label: 'Message', selector: '[name="message"]' }
        ];

        const lines = fields.reduce(function (result, field) {
            const element = form.querySelector(field.selector);
            if (!element) return result;
            const value = element.value.trim();
            if (!value) return result;
            result.push(field.label + ': ' + value);
            return result;
        }, []);

        if (lines.length === 0) {
            return '';
        }

        lines.push('');
        lines.push('Sent from NESTYM website contact form.');
        return encodeURIComponent(lines.join('\n'));
    }

    function openWhatsAppChat(phone, message) {
        const url = 'https://wa.me/' + phone + '?text=' + message;
        window.open(url, '_blank');
    }

    function initForms() {
        const whatsappPhone = '254769159245';

        document.querySelectorAll('.contact-form').forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const message = buildWhatsAppMessage(form);
                if (!message) {
                    alert('Please fill in the contact form before sending.');
                    return;
                }
                openWhatsAppChat(whatsappPhone, message);
            });
        });

        document.querySelectorAll('.newsletter-form').forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                alert('Thank you for subscribing! Check your email for confirmation.');
                form.reset();
            });
        });
    }

    function initScrollReveal() {
        const targets = document.querySelectorAll(
            '.service-card, .project-card, .blog-card, .feature-box, .testimonial-card, .stat-box, .tech-item, .section-header'
        );

        targets.forEach(function (el) {
            el.classList.add('reveal');
        });

        if (!('IntersectionObserver' in window)) {
            targets.forEach(function (el) {
                el.classList.add('revealed');
            });
            return;
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        targets.forEach(function (el) {
            observer.observe(el);
        });
    }

    function initNavScroll() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        function updateNav() {
            nav.classList.toggle('nav-scrolled', window.scrollY > 24);
        }

        updateNav();
        window.addEventListener('scroll', updateNav, { passive: true });
    }

    function initImageFallbacks() {
        document.querySelectorAll('img').forEach(function (img) {
            img.decoding = 'async';

            img.addEventListener('error', function onError() {
                img.removeEventListener('error', onError);
                if (img.dataset.fallbackApplied === 'true') return;
                img.dataset.fallbackApplied = 'true';

                const parent = img.closest('.project-image, .blog-image, .about-image');
                if (parent) {
                    parent.classList.add('image-fallback');
                }
                img.style.display = 'none';
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        createParticles();
        initSmoothScroll();
        initMobileNav();
        initActiveNav();
        initForms();
        initScrollReveal();
        initNavScroll();
        initImageFallbacks();
    });
})();
