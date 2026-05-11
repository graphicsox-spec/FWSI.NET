/**
 * components.js — Loads shared header/footer into every page
 * Works with both file:// and http:// protocols
 */
(function () {
    'use strict';

    // ============================
    // Header HTML Template
    // ============================
    const headerHTML = `
    <header class="site-header" id="siteHeader">
        <div class="header-inner">
            <a href="index.html" class="header-logo" aria-label="Framework Solutions Home">
                <img src="./assets/logo-main.svg" onerror="this.onerror=null; this.outerHTML='<span class=\\'logo-fallback\\'><i class=\\'fa-brands fa-stripe-s\\'></i> FRAMEWORK<br>SOLUTIONS</span>';" alt="Framework Solutions" />
            </a>
            <nav class="header-nav" id="headerNav">
                <a href="index.html" data-page="index">Home</a>
                <a href="about.html" data-page="about">About</a>
                <a href="#" data-page="services">Services</a>
                <a href="#" data-page="solutions">Solutions</a>
                <a href="#" data-page="blog">Blog</a>
                <a href="#" data-page="contact">Contact</a>
            </nav>
            <div class="header-actions">
                <a href="tel:8445672696" class="header-phone">
                    <i class="fa-solid fa-phone"></i>
                    <span>844-567-2696</span>
                </a>
                <a href="#" class="header-cta">Get Started</a>
            </div>
            <button class="hamburger" id="hamburgerBtn" aria-label="Toggle Menu">
                <span></span><span></span><span></span>
            </button>
        </div>
        <div class="mobile-menu" id="mobileMenu">
            <nav class="mobile-nav">
                <a href="index.html" data-page="index">Home</a>
                <a href="about.html" data-page="about">About</a>
                <a href="#" data-page="services">Services</a>
                <a href="#" data-page="solutions">Solutions</a>
                <a href="#" data-page="blog">Blog</a>
                <a href="#" data-page="contact">Contact</a>
            </nav>
            <div class="mobile-menu-footer">
                <a href="tel:8445672696" class="mobile-phone">
                    <i class="fa-solid fa-phone"></i> 844-567-2696
                </a>
                <a href="#" class="header-cta" style="width:100%; text-align:center;">Get Started</a>
            </div>
        </div>
    </header>`;

    // ============================
    // Footer HTML Template
    // ============================
    const footerHTML = `
    <footer class="site-footer" id="siteFooter">
        <div class="footer-accent-line"></div>
        <div class="footer-body">
            <div class="container">
                <div class="footer-grid-modern">
                    <div class="footer-brand">
                        <a href="index.html" class="footer-logo-link">
                            <img src="./assets/logo-main.svg" onerror="this.onerror=null; this.outerHTML='<span class=\\'logo-fallback-footer\\'><i class=\\'fa-brands fa-stripe-s\\'></i> FRAMEWORK SOLUTIONS</span>';" alt="Framework Solutions" />
                        </a>
                        <p class="footer-tagline">Custom software development, systems integration, and enterprise application architecture assessment since 1999.</p>
                        <div class="footer-socials">
                            <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                            <a href="#" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
                            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                            <a href="#" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                        </div>
                    </div>
                    <div class="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="about.html">About Us</a></li>
                            <li><a href="#">Services</a></li>
                            <li><a href="#">Solutions</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">Software Development</a></li>
                            <li><a href="#">Systems Integration</a></li>
                            <li><a href="#">CRM Consulting</a></li>
                            <li><a href="#">Dynamics 365</a></li>
                            <li><a href="#">Web &amp; SEO</a></li>
                        </ul>
                    </div>
                    <div class="footer-col footer-contact-col">
                        <h4>Get In Touch</h4>
                        <div class="footer-contact-items">
                            <div class="footer-contact-row">
                                <i class="fa-solid fa-location-dot"></i>
                                <span>Los Angeles, Southern California</span>
                            </div>
                            <div class="footer-contact-row">
                                <i class="fa-solid fa-phone"></i>
                                <a href="tel:8445672696">844-567-2696</a>
                            </div>
                            <div class="footer-contact-row">
                                <i class="fa-solid fa-envelope"></i>
                                <a href="mailto:info@frameworksolutions.com">info@frameworksolutions.com</a>
                            </div>
                        </div>
                        <div class="footer-newsletter-box">
                            <span class="newsletter-label">Subscribe to Newsletter</span>
                            <div class="newsletter-form">
                                <input type="email" placeholder="Your email address" />
                                <button type="button" aria-label="Subscribe"><i class="fa-solid fa-paper-plane"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-inner">
                    <p>&copy; FWSI.NET 2026 — All rights reserved.</p>
                    <p class="footer-credit">Design &amp; Development by <a href="https://www.behance.net/advarto" target="_blank" rel="noopener">Advarto</a></p>
                </div>
            </div>
        </div>
        <button class="back-to-top" id="backToTop" aria-label="Back to top">
            <i class="fa-solid fa-arrow-up"></i>
        </button>
    </footer>`;

    // ============================
    // Inject Components
    // ============================
    function init() {
        const headerRoot = document.getElementById('header-root');
        const footerRoot = document.getElementById('footer-root');
        if (headerRoot) headerRoot.innerHTML = headerHTML;
        if (footerRoot) footerRoot.innerHTML = footerHTML;

        setActivePage();
        initStickyHeader();
        initHamburger();
        initBackToTop();
    }

    // ============================
    // Highlight Active Nav Link
    // ============================
    function setActivePage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';

        document.querySelectorAll('[data-page]').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
    }

    // ============================
    // Sticky Header on Scroll
    // ============================
    function initStickyHeader() {
        const header = document.getElementById('siteHeader');
        if (!header) return;

        let lastY = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;
                    if (y > 80) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ============================
    // Mobile Hamburger Menu
    // ============================
    function initHamburger() {
        const btn = document.getElementById('hamburgerBtn');
        const menu = document.getElementById('mobileMenu');
        const header = document.getElementById('siteHeader');
        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
            btn.classList.toggle('open');
            menu.classList.toggle('open');
            header.classList.toggle('menu-open');
            document.body.classList.toggle('menu-lock');
        });

        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                btn.classList.remove('open');
                menu.classList.remove('open');
                header.classList.remove('menu-open');
                document.body.classList.remove('menu-lock');
            });
        });
    }

    // ============================
    // Back to Top Button
    // ============================
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================
    // Kick off
    // ============================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
