// ============================================
// I18N — Système de traduction FR/EN
// ============================================
function applyLanguage(lang) {
    if (!window.translations || !translations[lang]) return;
    const dict = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            el.textContent = dict[key];
        }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) {
            el.innerHTML = dict[key];
        }
    });

    document.documentElement.lang = lang;
    localStorage.setItem('portfolio-lang', lang);

    document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

function initLanguageSwitch() {
    const buttons = document.querySelectorAll('.lang-switch button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            applyLanguage(btn.getAttribute('data-lang'));
        });
    });

    const saved = localStorage.getItem('portfolio-lang');
    const initial = (saved === 'en' || saved === 'fr') ? saved : 'fr';
    applyLanguage(initial);
}

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitch();

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animation simple du bouton hamburger
            const spans = menuBtn.querySelectorAll('span');
            if(navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // Modal System
    // Note: Les fonctions openModal et closeModal sont appelées directement dans le HTML via onclick
    // On ajoute juste la fermeture au clic sur l'overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Fermeture avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement){
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

// Fonctions globales pour les modales (appelées par le HTML)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Attacher les événements click aux cartes projets et aux sous-projets (mega-projet Foxtrot)
document.querySelectorAll('.project-card[data-modal], .subproject-item[data-modal]').forEach(card => {
    card.addEventListener('click', function(e) {
        e.stopPropagation(); // évite qu'un clic sur un sous-item déclenche aussi la carte parente
        const modalId = this.getAttribute('data-modal');
        if (modalId) {
            openModal(modalId);
        }
    });
});