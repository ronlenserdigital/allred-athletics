/* =========================================================
   ALLRED ATHLETICS — interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- PRELOADER ---- */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    setTimeout(function () { pre.classList.add("done"); }, 1100);
  });

  /* ---- YEAR ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- CUSTOM CURSOR ---- */
  var cursor = document.getElementById("cursor");
  var dot = document.getElementById("cursorDot");
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (fine && cursor && dot) {
    var cx = 0, cy = 0, rx = 0, ry = 0;
    document.addEventListener("mousemove", function (e) {
      cx = e.clientX; cy = e.clientY;
      dot.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
    });
    (function loop() {
      rx += (cx - rx) * 0.18; ry += (cy - ry) * 0.18;
      cursor.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    var hot = "a,button,.card,.rung,.qa__q,input,textarea";
    document.querySelectorAll(hot).forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("grow"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("grow"); });
    });
  }

  /* ---- STICKY NAV ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- MOBILE MENU ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function toggleMenu(open) {
    burger.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () {
    toggleMenu(!menu.classList.contains("open"));
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { toggleMenu(false); });
  });

  /* ---- SCROLL REVEAL ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- COUNT UP ---- */
  var counted = false;
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll("[data-count]").forEach(function (el) {
          var target = parseInt(el.getAttribute("data-count"), 10);
          var n = 0;
          var step = Math.max(1, Math.round(target / 24));
          var t = setInterval(function () {
            n += step;
            if (n >= target) { n = target; clearInterval(t); }
            el.textContent = n;
          }, 40);
        });
      }
    });
  }, { threshold: 0.5 });
  var heroStats = document.querySelector(".hero__stats");
  if (heroStats) countIO.observe(heroStats);

  /* ---- FAQ ACCORDION ---- */
  document.querySelectorAll(".qa__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var qa = btn.parentElement;
      var ans = qa.querySelector(".qa__a");
      var isOpen = qa.classList.contains("open");
      document.querySelectorAll(".qa").forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".qa__a").style.maxHeight = null;
        other.querySelector(".qa__q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        qa.classList.add("open");
        ans.style.maxHeight = ans.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---- HERO PARALLAX GLOW ---- */
  var glow = document.querySelector(".hero__glow");
  if (glow && fine) {
    document.querySelector(".hero").addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 40;
      var yv = (e.clientY / window.innerHeight - 0.5) * 40;
      glow.style.transform = "translate(" + x + "px," + yv + "px)";
    });
  }

  /* ---- CONTACT FORM (Web3Forms) ---- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var key = form.querySelector('[name="access_key"]').value;
      if (key.indexOf("YOUR_WEB3FORMS") === 0) {
        note.textContent = "Form not connected yet. Call 928.301.4330 to book.";
        return;
      }
      note.textContent = "Sending...";
      var data = new FormData(form);
      fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            note.textContent = "Got it. We'll be in touch soon.";
            form.reset();
          } else {
            note.textContent = "Something went wrong. Please call us instead.";
          }
        })
        .catch(function () {
          note.textContent = "Something went wrong. Please call us instead.";
        });
    });
  }
})();
