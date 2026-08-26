// ============================================
// I18N — Système de traduction FR/EN
// ============================================
var currentLang = 'fr';

function t(key) {
    var dict = (window.translations && translations[currentLang]) || {};
    return dict[key] !== undefined ? dict[key] : key;
}

function applyLanguage(lang) {
    if (!window.translations || !translations[lang]) return;
    currentLang = lang;
    var dict = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.documentElement.lang = lang;
    localStorage.setItem('portfolio-lang', lang);

    document.querySelectorAll('.lang-switch button').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Le mur de travaux et la vue stage sont générés dynamiquement : on les
    // reconstruit dans la nouvelle langue plutôt que de les marquer en data-i18n.
    if (window.renderWork) renderWork();
}

function initLanguageSwitch() {
    var buttons = document.querySelectorAll('.lang-switch button');
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            applyLanguage(btn.getAttribute('data-lang'));
        });
    });

    var saved = localStorage.getItem('portfolio-lang');
    var initial = (saved === 'en' || saved === 'fr') ? saved : 'fr';
    applyLanguage(initial);
}

// ============================================
// LE MUR DES TRAVAUX — données & rendu
// ============================================
var ICONS = {
    cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>',
    chair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 3v13M19 3v13M5 12h14M6 16l-2 5M18 16l2 5"/></svg>',
    room: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10l9-6 9 6v10H3z"/><path d="M9 20v-6h6v6"/></svg>',
    person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/></svg>',
    pillar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h16M6 4v16M18 4v16M4 20h16M9 8v9M15 8v9"/></svg>',
    mushroom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 11c0-4 3.5-7 8-7s8 3 8 7z"/><path d="M9 11v6a3 3 0 006 0v-6"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>',
    paint: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c4 4 7 7.5 7 11a7 7 0 01-14 0c0-3.5 3-7 7-11z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
    megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10v4h3l6 4V6l-6 4H3z"/><path d="M16 9a4 4 0 010 6"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>'
};

var skills = [
    { icon: "gear", key: "skills.1" },
    { icon: "cube", key: "skills.2" },
    { icon: "paint", key: "skills.3" },
    { icon: "chair", key: "skills.4" },
    { icon: "layers", key: "skills.5" },
    { icon: "person", key: "skills.6" }
];

var assets = [
    { id: "safran", size: "small", color: "c1", icon: "lock", confidential: true,
        categoryKey: "safran.category", titleKey: "safran.title", shortTitleKey: "safran.short",
        contextKey: "safran.modal.context", roleKey: "safran.modal.role",
        stepsKeys: ["safran.modal.li1", "safran.modal.li2", "safran.modal.li3"],
        resultKey: "safran.modal.result",
        tools: ["Rhinoceros 3D", "Blender", "Procreate", "Photoshop"] },
    { id: "ebenisterie", size: "small", color: "c4", icon: "chair",
        categoryKey: "ebenisterie.category", titleKey: "ebenisterie.title",
        contextKey: "ebenisterie.modal.context", roleKey: "ebenisterie.modal.role",
        stepsKeys: ["ebenisterie.modal.li1", "ebenisterie.modal.li2", "ebenisterie.modal.li3", "ebenisterie.modal.li4"],
        resultKey: "ebenisterie.modal.result",
        tools: ["Fusion 360", "Blender"] },
    { id: "espace", size: "small", color: "c5", icon: "room",
        categoryKey: "espace.category", titleKey: "espace.title",
        contextKey: "espace.modal.context", roleKey: "espace.modal.role",
        stepsKeys: ["espace.modal.li1", "espace.modal.li2", "espace.modal.li3", "espace.modal.li4"],
        resultKey: "espace.modal.result",
        tools: ["Blender"] },
    { id: "crypte", size: "small", color: "c1", icon: "pillar",
        categoryKey: "crypte.category", titleKey: "crypte.title",
        contextKey: "crypte.modal.context", roleKey: "crypte.modal.role",
        stepsKeys: ["crypte.modal.li1", "crypte.modal.li2", "crypte.modal.li3", "crypte.modal.li4"],
        resultKey: "crypte.modal.result",
        tools: ["3DZephyr", "3DS MAX", "Unity"] },
    { id: "mushroom", size: "small", color: "c4", icon: "mushroom",
        categoryKey: "mushroom.category", titleKey: "mushroom.title",
        contextKey: "mushroom.modal.context", roleKey: "mushroom.modal.role",
        stepsKeys: ["mushroom.modal.li1", "mushroom.modal.li2", "mushroom.modal.li3"],
        resultKey: "mushroom.modal.result",
        tools: ["ZBrush"] }
];

var groups = {
    bluestinger: { size: "big", color: "c3", icon: "box",
        categoryKey: "bluestinger.category", titleKey: "bluestinger.title", descKey: "bluestinger.desc",
        items: [
            { id: "dispenser", icon: "box",
                categoryKey: "dispenser.category", titleKey: "dispenser.title",
                contextKey: "dispenser.modal.context", roleKey: "dispenser.modal.role",
                stepsKeys: ["dispenser.modal.li1", "dispenser.modal.li2", "dispenser.modal.li3", "dispenser.modal.li4"],
                resultKey: "dispenser.modal.result",
                tools: ["Blender", "Substance Painter"] },
            { id: "character", icon: "person",
                categoryKey: "character.category", titleKey: "character.title",
                contextKey: "character.modal.context", roleKey: "character.modal.role",
                stepsKeys: ["character.modal.li1", "character.modal.li2", "character.modal.li3"],
                resultKey: "character.modal.result",
                tools: ["Character Creator", "Marvelous Designer", "Blender", "ZBrush", "Substance Painter"] }
        ] },
    foxtrot: { size: "wide", color: "c2", icon: "layers",
        categoryKey: "foxtrot.category", titleKey: "foxtrot.title", descKey: "foxtrot.desc",
        items: [
            { id: "fox_mk18", icon: "gear",
                categoryKey: null, titleKey: "foxtrot.mk18.title",
                contextKey: "foxtrot.mk18.modal.context", roleKey: "foxtrot.mk18.modal.role",
                stepsKeys: ["foxtrot.mk18.modal.li1", "foxtrot.mk18.modal.li2", "foxtrot.mk18.modal.li3"],
                resultKey: "foxtrot.mk18.modal.result",
                tools: ["Blender", "Substance Painter"] },
            { id: "fox_smartmat", icon: "paint",
                categoryKey: null, titleKey: "foxtrot.smartmat.title",
                contextKey: "foxtrot.smartmat.modal.context", roleKey: "foxtrot.smartmat.modal.role",
                stepsKeys: ["foxtrot.smartmat.modal.li1", "foxtrot.smartmat.modal.li2", "foxtrot.smartmat.modal.li3"],
                resultKey: "foxtrot.smartmat.modal.result",
                tools: ["Substance Painter"] },
            { id: "fox_avatar", icon: "person",
                categoryKey: null, titleKey: "foxtrot.avatar.title",
                contextKey: "foxtrot.avatar.modal.context", roleKey: "foxtrot.avatar.modal.role",
                stepsKeys: ["foxtrot.avatar.modal.li1", "foxtrot.avatar.modal.li2", "foxtrot.avatar.modal.li3", "foxtrot.avatar.modal.li4"],
                resultKey: "foxtrot.avatar.modal.result",
                tools: ["Blender", "Photoshop"] },
            { id: "fox_uxui", icon: "phone",
                categoryKey: null, titleKey: "foxtrot.uxui.title",
                contextKey: "foxtrot.uxui.modal.context", roleKey: "foxtrot.uxui.modal.role",
                stepsKeys: ["foxtrot.uxui.modal.li1", "foxtrot.uxui.modal.li2", "foxtrot.uxui.modal.li3", "foxtrot.uxui.modal.li4"],
                resultKey: "foxtrot.uxui.modal.result",
                tools: ["Figma", "Photoshop"] },
            { id: "fox_marketing", icon: "megaphone",
                categoryKey: null, titleKey: "foxtrot.marketing.title",
                contextKey: "foxtrot.marketing.modal.context", roleKey: "foxtrot.marketing.modal.role",
                stepsKeys: ["foxtrot.marketing.modal.li1", "foxtrot.marketing.modal.li2", "foxtrot.marketing.modal.li3", "foxtrot.marketing.modal.li4"],
                resultKey: "foxtrot.marketing.modal.result",
                tools: ["Figma", "Kickstarter", "Instagram"] }
        ] }
};

var byId = {};
assets.forEach(function(a) { byId[a.id] = a; });
var groupByChild = {};
Object.keys(groups).forEach(function(gid) {
    groups[gid].items.forEach(function(it) {
        it.groupId = gid;
        groupByChild[it.id] = gid;
        byId[it.id] = it;
    });
});

function esc(s) { return String(s == null ? "" : s); }
function icon(name) { return ICONS[name] || ICONS.cube; }

function catFor(item) {
    if (item.categoryKey) return t(item.categoryKey);
    var gid = groupByChild[item.id];
    if (gid) return t(groups[gid].categoryKey);
    return "";
}

function chipsHTML() {
    return skills.map(function(s) {
        return '<span class="chip">' + icon(s.icon) + '<span>' + esc(t(s.key)) + '</span></span>';
    }).join("");
}

function tileHTML(kind, id, data) {
    var sizeClass = data.size ? " " + data.size : "";
    var badge = data.confidential ? '<span class="tile-lock">' + esc(t("safran.badge")) + '</span>'
        : (kind === "group" ? '<span class="tile-count">' + groups[id].items.length + '</span>' : "");
    var title = t(data.shortTitleKey || data.titleKey);
    return '' +
        '<button type="button" class="tile' + sizeClass + '" style="background:var(--' + data.color + ')" data-open="' + kind + ':' + id + '">' +
        badge +
        '<div class="tile-icon">' + icon(data.icon) + '</div>' +
        '<div class="tile-foot"><div class="tile-cat">' + esc(catFor(data)) + '</div><h3>' + esc(title) + '</h3></div>' +
        '</button>';
}

function buildBento() {
    var html = "";
    assets.forEach(function(a) { html += tileHTML("asset", a.id, a); });
    Object.keys(groups).forEach(function(gid) { html += tileHTML("group", gid, groups[gid]); });
    var bento = document.getElementById("bento");
    if (bento) bento.innerHTML = html;
}

function fieldsHTML(a, colorVar) {
    var stepsHtml = (a.stepsKeys || []).map(function(k) { return "<li>" + esc(t(k)) + "</li>"; }).join("");
    var toolsHtml = (a.tools || []).map(function(tool) { return "<span>" + esc(tool) + "</span>"; }).join("");
    return '' +
        '<div class="stage-field full"><span class="field-label" style="background:var(' + colorVar + ')">' + esc(t("common.context")) + '</span><p>' + esc(t(a.contextKey)) + '</p></div>' +
        '<div class="stage-field"><span class="field-label" style="background:var(' + colorVar + ')">' + esc(t("common.role")) + '</span><p>' + esc(t(a.roleKey)) + '</p></div>' +
        '<div class="stage-field"><span class="field-label" style="background:var(' + colorVar + ')">' + esc(t("common.steps")) + '</span><ol>' + stepsHtml + '</ol></div>' +
        '<div class="stage-field full"><span class="field-label" style="background:var(' + colorVar + ')">' + esc(t("common.result")) + '</span><p>' + esc(t(a.resultKey)) + '</p></div>' +
        '<div class="stage-field full"><span class="field-label" style="background:var(' + colorVar + ')">' + esc(t("common.tools")) + '</span><div class="tools-row">' + toolsHtml + '</div></div>';
}

function renderAssetStage(a, backLabel, backTarget) {
    var colorVar = "--" + a.color;
    var media = a.confidential
        ? '<div class="confidential-panel">' + esc(t("safran.badge")) + ' — ' + esc(t("common.soon")) + '</div>'
        : '';
    return '' +
        '<div class="stage-head" style="background:var(' + colorVar + ')">' +
        '<div class="stage-inner">' +
        '<button type="button" class="back-btn" data-back="' + backTarget + '">&larr; ' + esc(backLabel) + '</button>' +
        '<div class="stage-icon">' + icon(a.icon) + '</div>' +
        '<div class="stage-cat">' + esc(catFor(a)) + '</div>' +
        '<h1 class="stage-title">' + esc(t(a.titleKey)) + '</h1>' +
        '</div></div>' +
        '<div class="stage-body"><div class="stage-inner">' +
        media +
        '<div class="stage-grid">' + fieldsHTML(a, colorVar) + '</div>' +
        '</div></div>';
}

function renderGroupStage(gid) {
    var g = groups[gid];
    var colorVar = "--" + g.color;
    var tiles = g.items.map(function(it) {
        return tileHTML("asset-in-group", it.id, { color: g.color, icon: it.icon, categoryKey: it.categoryKey, titleKey: it.titleKey });
    }).join("");
    return '' +
        '<div class="stage-head" style="background:var(' + colorVar + ')">' +
        '<div class="stage-inner">' +
        '<button type="button" class="back-btn" data-back="grid">&larr; ' + esc(t("wall.back")) + '</button>' +
        '<div class="stage-icon">' + icon(g.icon) + '</div>' +
        '<div class="stage-cat">' + esc(t(g.categoryKey)) + '</div>' +
        '<h1 class="stage-title">' + esc(t(g.titleKey)) + '</h1>' +
        '</div></div>' +
        '<div class="stage-body"><div class="stage-inner">' +
        '<p class="group-desc">' + esc(t(g.descKey)) + '</p>' +
        '<div class="group-grid" data-group-grid="' + gid + '">' + tiles + '</div>' +
        '</div></div>';
}

// État de la vue courante, pour pouvoir la reconstruire au changement de langue.
var currentView = { type: "grid" };

var gridWrap, stageWrap;

function showGrid(skipScroll) {
    currentView = { type: "grid" };
    if (gridWrap) gridWrap.classList.remove("is-hidden");
    if (stageWrap) { stageWrap.classList.remove("is-active"); stageWrap.innerHTML = ""; }
    if (!skipScroll) window.scrollTo({ top: 0, behavior: "auto" });
}

function showAssetStage(id, backLabel, backTarget, skipScroll) {
    currentView = { type: "asset", id: id, backLabel: backLabel, backTarget: backTarget };
    var a = byId[id];
    if (!a || !stageWrap) return;
    stageWrap.innerHTML = renderAssetStage(a, backLabel, backTarget);
    if (gridWrap) gridWrap.classList.add("is-hidden");
    stageWrap.classList.add("is-active");
    if (!skipScroll) window.scrollTo({ top: 0, behavior: "auto" });
}

function showGroupStage(gid, skipScroll) {
    currentView = { type: "group", id: gid };
    if (!stageWrap) return;
    stageWrap.innerHTML = renderGroupStage(gid);
    if (gridWrap) gridWrap.classList.add("is-hidden");
    stageWrap.classList.add("is-active");
    if (!skipScroll) window.scrollTo({ top: 0, behavior: "auto" });
}

function renderWork() {
    var chips = document.getElementById("skillChips");
    if (chips) chips.innerHTML = chipsHTML();
    buildBento();

    // Reconstruit la vue active dans la nouvelle langue, sans changer le scroll.
    if (currentView.type === "asset") showAssetStage(currentView.id, currentView.backLabel, currentView.backTarget, true);
    else if (currentView.type === "group") showGroupStage(currentView.id, true);
}

document.addEventListener("click", function(e) {
    var open = e.target.closest("[data-open]");
    if (open) {
        var parts = open.getAttribute("data-open").split(":");
        var kind = parts[0], id = parts[1];
        if (kind === "asset") showAssetStage(id, t("wall.back"), "grid");
        else if (kind === "group") showGroupStage(id);
        else if (kind === "asset-in-group") {
            var gid = groupByChild[id];
            showAssetStage(id, t(groups[gid].titleKey), "group:" + gid);
        }
        return;
    }
    var back = e.target.closest("[data-back]");
    if (back) {
        var target = back.getAttribute("data-back");
        if (target === "grid") showGrid();
        else if (target.indexOf("group:") === 0) showGroupStage(target.split(":")[1]);
    }
});

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    gridWrap = document.getElementById("gridWrap");
    stageWrap = document.getElementById("stageWrap");

    initLanguageSwitch(); // appelle applyLanguage(), qui appelle renderWork()

    // Menu mobile
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            var spans = menuBtn.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        document.querySelectorAll('.nav-links a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                var spans = menuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Reveal au scroll (sections statiques : profil, en-tête du mur, contact)
    var revealElements = document.querySelectorAll('.reveal');
    var revealOnScroll = function() {
        var windowHeight = window.innerHeight;
        var elementVisible = 100;
        revealElements.forEach(function(element) {
            var elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) element.classList.add('active');
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Retour au mur avec la touche Échap depuis une vue stage
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentView.type !== 'grid') showGrid();
    });

    // Défilement fluide pour les liens d'ancre
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                showGrid(true);
                var headerOffset = 80;
                var elementPosition = targetElement.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });
});
