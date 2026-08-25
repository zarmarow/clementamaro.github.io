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

function setGalleryImage(modalId, imageUrl, thumbBtn) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const mainImg = modal.querySelector('.modal-gallery-main');
    if (mainImg) mainImg.style.backgroundImage = `url('${imageUrl}')`;
    modal.querySelectorAll('.modal-gallery-thumbs button').forEach(b => b.classList.remove('active'));
    if (thumbBtn) thumbBtn.classList.add('active');
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

// ============================================
// ÉDITION ARTISTIQUE — curseur, lettres, magnétisme, parallax
// ============================================
(function() {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // --- Éclatement du nom en lettres interactives (hero) ---
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const splitIntoLetters = (node) => {
            const text = node.textContent;
            node.textContent = '';
            node.classList.add('word');
            text.split('').forEach(ch => {
                if (ch === ' ') {
                    node.appendChild(document.createTextNode(' '));
                    return;
                }
                const span = document.createElement('span');
                span.className = 'letter';
                span.textContent = ch;
                node.appendChild(span);
            });
        };
        // Le nœud texte "Clément " puis le span .hero-surname "Amaro"
        // L'espace final est extrait et laissé hors du mot pour garder un point de césure normal.
        Array.from(heroTitle.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                const raw = node.textContent;
                const trimmed = raw.replace(/\s+$/, '');
                const trailing = raw.slice(trimmed.length);
                const span = document.createElement('span');
                span.textContent = trimmed;
                heroTitle.replaceChild(span, node);
                splitIntoLetters(span);
                if (trailing) {
                    span.after(document.createTextNode(trailing));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('hero-surname')) {
                splitIntoLetters(node);
            }
        });
    }

    if (!isTouch) {
        // --- Curseur personnalisé ---
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        if (cursorDot && cursorRing) {
            let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
            let ringX = mouseX, ringY = mouseY;

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            });

            const animateRing = () => {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
                cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
                requestAnimationFrame(animateRing);
            };
            animateRing();

            const hoverTargets = 'a, button, .project-card, .subproject-item, .btn';
            document.addEventListener('mouseover', (e) => {
                if (e.target.closest(hoverTargets)) cursorRing.classList.add('is-hover');
            });
            document.addEventListener('mouseout', (e) => {
                if (e.target.closest(hoverTargets)) cursorRing.classList.remove('is-hover');
            });
        }

        // --- Effet magnétique sur les boutons ---
        document.querySelectorAll('.btn, .contact-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });

        // --- Parallax léger du halo derrière le hero ---
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
                const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
                hero.style.setProperty('--mx', relX.toFixed(2));
                hero.style.setProperty('--my', relY.toFixed(2));
            });
        }
    }
})();