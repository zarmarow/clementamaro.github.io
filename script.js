// ============================================================
// AMARO VIEWPORT — data, i18n, rendering, interactions
// ============================================================
(function () {
    "use strict";

    /* ---------- i18n ---------- */
    var currentLang = "fr";

    function t(key) {
        var dict = window.translations && window.translations[currentLang];
        return (dict && dict[key] !== undefined) ? dict[key] : key;
    }

    function applyStaticI18n() {
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var key = el.getAttribute("data-i18n");
            var val = t(key);
            if (val !== undefined) el.textContent = val;
        });
        document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
            var key = el.getAttribute("data-i18n-html");
            var val = t(key);
            if (val !== undefined) el.innerHTML = val;
        });
        document.documentElement.lang = currentLang;
        document.querySelectorAll(".lang-switch button").forEach(function (btn) {
            btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
        });
    }

    function applyLanguage(lang) {
        if (!window.translations || !window.translations[lang]) return;
        currentLang = lang;
        localStorage.setItem("portfolio-lang", lang);
        applyStaticI18n();
        render();
        if (currentId) selectAsset(currentId, { silent: true });
    }

    function initLanguageSwitch() {
        document.querySelectorAll(".lang-switch button").forEach(function (btn) {
            btn.addEventListener("click", function () {
                applyLanguage(btn.getAttribute("data-lang"));
            });
        });
        var saved = localStorage.getItem("portfolio-lang");
        applyLanguage(saved === "en" ? "en" : "fr");
    }

    /* ---------- project data ---------- */
    // Steps are pulled from translations via "<prefix>.modal.liN" (N = 1..).
    var assets = [
        { id: "safran", section: "produit", order: 1, confidential: true, prefix: "safran",
            tools: ["Rhinoceros 3D", "Blender", "Procreate", "Photoshop"] },
        { id: "ebenisterie", section: "produit", order: 2, prefix: "ebenisterie", image: "images/Ebenisterie.jpg",
            tools: ["Fusion 360", "Blender"] },
        { id: "espace", section: "3d", order: 3, prefix: "espace", image: "images/RenduPhotorealiste.png",
            tools: ["Blender"] },
        { id: "dispenser", section: "3d", order: 4, group: "bluestinger", prefix: "dispenser", image: "images/FoodDispenser.png",
            tools: ["Blender", "Substance Painter"] },
        { id: "crypte", section: "3d", order: 5, prefix: "crypte", image: "images/Crypte-Render.jpg",
            tools: ["3DZephyr", "3DS MAX", "Unity"] },
        { id: "mushroom", section: "3d", order: 6, prefix: "mushroom", image: "images/Mushroom-04.jpg",
            tools: ["ZBrush"] },
        { id: "character", section: "3d", order: 7, group: "bluestinger", prefix: "character", image: "images/DogsBower-MarvelousDesigner.png",
            tools: ["Character Creator", "Marvelous Designer", "Blender", "ZBrush", "Substance Painter"] },
        { id: "fox_mk18", section: "3d", order: 8, group: "foxtrot", prefix: "foxtrot.mk18", image: "images/Foxtrot-MK18-Render.png",
            tools: ["Blender", "Substance Painter"] },
        { id: "fox_smartmat", section: "3d", order: 9, group: "foxtrot", prefix: "foxtrot.smartmat", image: "images/Foxtrot-Pouches.png",
            tools: ["Substance Painter"] },
        { id: "fox_avatar", section: "3d", order: 10, group: "foxtrot", prefix: "foxtrot.avatar", image: "images/Foxtrot-Avatars-Render.png",
            tools: ["Blender", "Photoshop"] },
        { id: "fox_uxui", section: "3d", order: 11, group: "foxtrot", prefix: "foxtrot.uxui", image: "images/Foxtrot-Socials.png",
            tools: ["Figma", "Photoshop"] },
        { id: "fox_marketing", section: "3d", order: 12, group: "foxtrot", prefix: "foxtrot.marketing", image: "images/Foxtrot-Rooms.png",
            tools: ["Figma", "Kickstarter", "Instagram"] }
    ];

    var groups = {
        bluestinger: { prefix: "bluestinger", image: "images/DogsBower-ZbrushOutfit-Front.png" },
        foxtrot: { prefix: "foxtrot", image: "images/Foxtrot-01.png" }
    };

    var byId = {}; assets.forEach(function (a) { byId[a.id] = a; });
    var leafOrder = assets.map(function (a) { return a.id; });

    function steps(prefix) {
        var out = [], i = 1;
        while (true) {
            var key = prefix + ".modal.li" + i;
            var val = t(key);
            if (val === key) break; // key not found -> t() returned the key itself
            out.push(val);
            i++;
        }
        return out;
    }

    function esc(s) { return String(s == null ? "" : s); }

    function catFor(a) {
        var key = a.prefix + ".category";
        var val = t(key);
        if (val === key && a.group) return t(groups[a.group].prefix + ".category");
        return val;
    }

    function plateHTML(a) {
        var idx = String(a.order).padStart(2, "0");
        var cat = catFor(a);
        var title = t(a.prefix + ".title");
        if (a.confidential) {
            return "" +
                '<button class="plate" type="button" data-id="' + a.id + '" aria-label="' + esc(title) + '">' +
                '<div class="plate-frame"><div class="plate-lock">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="10" width="16" height="10" rx="1"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>' +
                esc(t("safran.badge")) + "</div>" +
                '<span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>' +
                "</div>" +
                '<div class="plate-caption"><span class="cap-idx mono">' + idx + '</span><div class="cap-cat">' + esc(cat) + "</div><h3>" + esc(title) + "</h3></div>" +
                "</button>";
        }
        return "" +
            '<button class="plate" type="button" data-id="' + a.id + '" aria-label="' + esc(title) + '">' +
            '<div class="plate-frame">' +
            '<div class="plate-img" style="background-image:url(\'' + a.image + '\')"></div>' +
            '<div class="plate-wire-overlay"></div><div class="plate-solid-overlay"></div>' +
            '<span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>' +
            "</div>" +
            '<div class="plate-caption"><span class="cap-idx mono">' + idx + '</span><div class="cap-cat">' + esc(cat) + "</div><h3>" + esc(title) + "</h3></div>" +
            "</button>";
    }

    function groupChildrenHTML(gid) {
        return assets.filter(function (a) { return a.group === gid; }).map(plateHTML).join("");
    }

    function groupCardHTML(gid) {
        var g = groups[gid];
        var cat = t(g.prefix + ".category");
        var title = t(g.prefix + ".title");
        var desc = t(g.prefix + ".desc");
        return "" +
            '<div class="group-card">' +
            '<div class="group-thumb"><div class="group-thumb-img" style="background-image:url(\'' + g.image + '\')"></div>' +
            '<div class="plate-wire-overlay"></div><div class="plate-solid-overlay"></div></div>' +
            '<div class="g-meta"><span class="eyebrow">' + esc(cat) + "</span><h3>" + esc(title) + "</h3><p>" + esc(desc) + "</p></div>" +
            '<div class="group-children">' + groupChildrenHTML(gid) + "</div>" +
            "</div>";
    }

    function render() {
        var produitEl = document.getElementById("grid-produit");
        var troisEl = document.getElementById("grid-3d");
        if (!produitEl || !troisEl) return;
        var htmlProduit = "", html3d = "";
        var seenGroups = {};

        assets.filter(function (a) { return a.section === "produit"; }).forEach(function (a) {
            if (a.group) { if (!seenGroups[a.group]) { htmlProduit += groupCardHTML(a.group); seenGroups[a.group] = true; } }
            else { htmlProduit += plateHTML(a); }
        });
        assets.filter(function (a) { return a.section === "3d"; }).forEach(function (a) {
            if (a.group) { if (!seenGroups[a.group]) { html3d += groupCardHTML(a.group); seenGroups[a.group] = true; } }
            else { html3d += plateHTML(a); }
        });

        produitEl.innerHTML = htmlProduit;
        troisEl.innerHTML = html3d;

        var sceneCount = document.getElementById("sceneCount");
        if (sceneCount) sceneCount.innerHTML = "— " + assets.length + " <span data-i18n=\"outliner.objects\">" + esc(t("outliner.objects")) + "</span>";
        var hudCount = document.getElementById("hudCount");
        if (hudCount) hudCount.textContent = String(assets.length).padStart(2, "0");
        var renderCount = document.getElementById("renderCount");
        if (renderCount) renderCount.textContent = assets.length + " " + t("render.assets");

        document.getElementById("tree").innerHTML = treeHTML();

        if (currentId) {
            document.querySelectorAll(".plate, .tree button").forEach(function (el) {
                el.classList.toggle("is-selected", el.getAttribute("data-id") === currentId);
            });
        }
    }

    function treeHTML() {
        function leaf(a) {
            var ic = a.confidential ? "🔒" : "▪";
            return '<li><button type="button" data-id="' + a.id + '"><span class="ic">' + ic + "</span>" + esc(t(a.prefix + ".title")) + "</button></li>";
        }
        var produitItems = assets.filter(function (a) { return a.section === "produit" && !a.group; }).map(leaf).join("");
        var d3Items = "";
        var seen = {};
        assets.filter(function (a) { return a.section === "3d"; }).forEach(function (a) {
            if (a.group) {
                if (!seen[a.group]) {
                    seen[a.group] = true;
                    var g = groups[a.group];
                    d3Items += '<li class="tree-group"><div class="group-label">▸ ' + esc(t(g.prefix + ".title")) + "</div><ul>" +
                        assets.filter(function (x) { return x.group === a.group; }).map(leaf).join("") + "</ul></li>";
                }
            } else {
                d3Items += leaf(a);
            }
        });
        return "" +
            '<li class="collection"><div class="col-label">' + esc(t("nav.produit")) + "</div><ul>" + produitItems + "</ul></li>" +
            '<li class="collection"><div class="col-label">' + esc(t("nav.3d")) + "</div><ul>" + d3Items + "</ul></li>";
    }

    /* ---------- selection / inspector ---------- */
    var inspector, inspectorBody, currentId = null;

    function selectAsset(id, opts) {
        opts = opts || {};
        currentId = id;
        document.querySelectorAll(".plate, .tree button").forEach(function (el) {
            el.classList.toggle("is-selected", el.getAttribute("data-id") === id);
        });
        var a = byId[id];
        if (!a) return;
        var idx = String(a.order).padStart(2, "0");
        var cat = catFor(a);
        var title = t(a.prefix + ".title");
        var stepsHtml = steps(a.prefix).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
        var toolsHtml = a.tools.map(function (tool) { return "<span>" + esc(tool) + "</span>"; }).join("");
        var mediaHtml = a.confidential
            ? '<div class="insp-frame" style="display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(135deg,var(--hatch),var(--hatch) 10px,color-mix(in srgb, var(--orange) 14%, var(--hatch)) 10px,color-mix(in srgb, var(--orange) 14%, var(--hatch)) 20px);"><span class="mono" style="font-size:11px;letter-spacing:.1em;color:var(--muted);">🔒 ' + esc(t("safran.badge")).toUpperCase() + "</span></div>"
            : '<div class="insp-frame" style="background-image:url(\'' + a.image + '\')"></div>';

        inspectorBody.innerHTML = "" +
            '<div class="insp-top"><div><div class="insp-cat mono">' + idx + " · " + esc(cat) + '</div><h3 class="insp-title">' + esc(title) + "</h3></div>" +
            '<button class="insp-close" id="inspClose" aria-label="Close">✕</button></div>' +
            mediaHtml +
            '<div class="insp-block"><h4>' + esc(t("common.context")) + "</h4><p>" + esc(t(a.prefix + ".modal.context")) + "</p></div>" +
            '<div class="insp-block"><h4>' + esc(t("common.role")) + "</h4><p>" + esc(t(a.prefix + ".modal.role")) + "</p></div>" +
            '<div class="insp-block"><h4>' + esc(t("common.steps")) + "</h4><ol>" + stepsHtml + "</ol></div>" +
            '<div class="insp-block"><h4>' + esc(t("common.result")) + "</h4><p>" + esc(t(a.prefix + ".modal.result")) + "</p></div>" +
            '<div class="insp-block"><h4>' + esc(t("common.tools")) + '</h4><div class="insp-tools">' + toolsHtml + "</div></div>" +
            '<div class="insp-nav"><button id="prevAsset">◂ ' + esc(t("insp.prev")) + '</button><button id="nextAsset">' + esc(t("insp.next")) + " ▸</button></div>";

        inspector.classList.add("is-open");
        inspector.setAttribute("aria-hidden", "false");
        document.getElementById("inspClose").addEventListener("click", closeInspector);
        document.getElementById("prevAsset").addEventListener("click", function () { step(-1); });
        document.getElementById("nextAsset").addEventListener("click", function () { step(1); });

        if (!opts.silent && window.matchMedia("(max-width:980px)").matches) {
            inspector.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function step(dir) {
        var i = leafOrder.indexOf(currentId);
        var next = leafOrder[(i + dir + leafOrder.length) % leafOrder.length];
        selectAsset(next);
    }

    function closeInspector() {
        inspector.classList.remove("is-open");
        inspector.setAttribute("aria-hidden", "true");
        document.querySelectorAll(".plate, .tree button").forEach(function (el) { el.classList.remove("is-selected"); });
        currentId = null;
    }

    /* ---------- boot ---------- */
    document.addEventListener("DOMContentLoaded", function () {
        inspector = document.getElementById("inspector");
        inspectorBody = document.getElementById("inspectorBody");

        initLanguageSwitch(); // also triggers first render()

        document.getElementById("viewport").addEventListener("click", function (e) {
            var el = e.target.closest("[data-id]");
            if (el) selectAsset(el.getAttribute("data-id"));
        });
        document.getElementById("tree").addEventListener("click", function (e) {
            var el = e.target.closest("[data-id]");
            if (el) {
                var id = el.getAttribute("data-id");
                selectAsset(id);
                var target = byId[id];
                var anchor = document.getElementById(target.section === "produit" ? "scene-produit" : "scene-3d");
                if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
                if (window.matchMedia("(max-width:980px)").matches) outliner.classList.remove("is-open");
            }
        });

        /* shading toggle */
        document.querySelectorAll(".shade-toggle button").forEach(function (btn) {
            btn.addEventListener("click", function () {
                document.querySelectorAll(".shade-toggle button").forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
                document.body.setAttribute("data-shade", btn.getAttribute("data-shade"));
            });
        });
        document.body.setAttribute("data-shade", "rendered");

        /* mobile outliner */
        var outliner = document.getElementById("outliner");
        document.getElementById("menuToggle").addEventListener("click", function () {
            outliner.classList.toggle("is-open");
        });

        /* hero HUD: gizmo + coordinate readout (skip on touch / reduced motion) */
        var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var isTouch = window.matchMedia("(hover:none)").matches;
        var gizmo = document.getElementById("gizmoLive");
        var cx = document.getElementById("cx"), cy = document.getElementById("cy");
        var coordReadout = document.getElementById("coordReadout");

        if (!reduceMotion && !isTouch) {
            document.getElementById("scene-hero").addEventListener("mousemove", function (e) {
                var r = this.getBoundingClientRect();
                var relX = (e.clientX - r.left) / r.width, relY = (e.clientY - r.top) / r.height;
                gizmo.style.transform = "rotate(" + ((relX - 0.5) * 24) + "deg)";
                cx.textContent = (relX * 1000).toFixed(1);
                cy.textContent = (relY * 1000).toFixed(1);
            });
        } else if (coordReadout) {
            coordReadout.style.display = "none";
        }

        /* render bar fill on scroll into view */
        var fill = document.getElementById("renderFill");
        var panel = document.getElementById("renderPanel");
        if (fill && panel) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) { if (en.isIntersecting) { fill.style.width = "100%"; io.disconnect(); } });
            }, { threshold: .4 });
            io.observe(panel);
        }

        /* status bar clock */
        function tick() {
            var d = new Date();
            var pad = function (n) { return String(n).padStart(2, "0"); };
            var clock = document.getElementById("clock");
            if (clock) clock.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
        }
        tick(); setInterval(tick, 1000);
    });
})();
