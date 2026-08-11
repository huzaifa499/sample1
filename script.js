/* =========================================================
   Huzaifa Usman — Coming Soon Portfolio
   Vanilla JS: countdown, reveals, particles, cursor glow, nav
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Text reveal: split "COMING SOON" into chars ---------- */
  function splitHeadline() {
    var el = document.querySelector("[data-split]");
    if (!el) return;
    var text = el.textContent.trim();
    el.textContent = "";
    text.split("").forEach(function (ch, i) {
      var span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.opacity = "0";
      span.style.transform = "translateY(40px)";
      span.style.transition =
        "opacity .6s cubic-bezier(.22,1,.36,1) " + i * 45 + "ms, transform .6s cubic-bezier(.22,1,.36,1) " + i * 45 + "ms";
      el.appendChild(span);
      requestAnimationFrame(function () {
        setTimeout(function () {
          span.style.opacity = "1";
          span.style.transform = "none";
        }, 120);
      });
    });
  }

  /* ---------- 2. Countdown timer (5 days from now) ---------- */
  var targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 5);
  targetDate.setHours(23, 59, 59, 999);
  var TARGET = targetDate.getTime();
  var fields = ["days", "hours", "minutes", "seconds"];
  var last = {};

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function renderCountdown() {
    var diff = Math.max(0, TARGET - Date.now());
    var s = Math.floor(diff / 1000);
    var values = {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60
    };
    fields.forEach(function (key) {
      var node = document.querySelector('[data-count="' + key + '"]');
      if (!node) return;
      var next = pad(values[key]);
      if (last[key] === next) return;
      last[key] = next;
      node.textContent = next;
      if (reduceMotion) return;
      node.classList.remove("tick");
      void node.offsetWidth; // restart animation
      node.classList.add("tick");
    });
  }

  renderCountdown();
  setInterval(renderCountdown, 1000);

  /* ---------- 3. Scroll reveal via IntersectionObserver ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = Number(entry.target.getAttribute("data-delay") || 0);
        setTimeout(function () { entry.target.classList.add("is-visible"); }, delay);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 4. Floating particles (lightweight, CSS-animated) ---------- */
  function initParticles() {
    var host = document.getElementById("particles");
    if (!host || reduceMotion) return;
    var count = window.innerWidth < 768 ? 14 : 28;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      var size = Math.random() * 3 + 1.5;
      p.className = "particle";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "vw";
      p.style.top = 100 + Math.random() * 20 + "vh";
      p.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      p.style.animationDuration = 18 + Math.random() * 22 + "s";
      p.style.animationDelay = "-" + Math.random() * 25 + "s";
      frag.appendChild(p);
    }
    host.appendChild(frag);
  }

  /* ---------- 5. Mouse-following glow (desktop / fine pointer only) ---------- */
  function initCursorGlow() {
    var glow = document.querySelector(".cursor-glow");
    if (!glow || reduceMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y, raf;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add("is-active");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    function loop() {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      raf = requestAnimationFrame(loop);
    }
  }

  /* ---------- 6. Mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    splitHeadline();
    initReveal();
    initParticles();
    initCursorGlow();
    initNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
