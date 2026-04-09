/* ============================================================
   Y2K THEME — script.js
   2000s personal homepage vibes: sparkle cursor, hit counter,
   marquee, window-style panels
   ============================================================ */

// ── Render shared data ───────────────────────────────────
(function renderData() {
  var d = window.__data;
  if (!d) return;

  // Hero
  var heroName = document.getElementById('hero-name');
  var heroRole = document.getElementById('hero-role');
  var heroTagline = document.getElementById('hero-tagline');
  if (heroName) heroName.textContent = d.profile.name;
  if (heroRole) heroRole.textContent = d.profile.role;
  if (heroTagline) heroTagline.innerHTML = d.profile.tagline.replace(/\n/g, '<br>');

  // About paragraphs
  var aboutP = document.getElementById('about-paragraphs');
  if (aboutP) {
    aboutP.innerHTML = d.profile.about.map(function (t) {
      return '<p>' + t + '</p>';
    }).join('');
  }

  // About facts (table)
  var factsTable = document.getElementById('about-facts');
  if (factsTable) {
    factsTable.innerHTML = d.profile.facts.map(function (f) {
      return '<tr><td>' + f.label + '</td><td>' + f.value + '</td></tr>';
    }).join('');
  }

  // About traits
  var traitsDiv = document.getElementById('about-traits');
  if (traitsDiv && d.profile.traits) {
    traitsDiv.innerHTML = d.profile.traits.map(function (t) {
      return '<span class="trait-badge">' + t + '</span>';
    }).join('');
  }

  // Anime grid
  var animeGrid = document.getElementById('anime-grid');
  if (animeGrid) {
    animeGrid.innerHTML = d.anime.map(function (a, i) {
      return '<article class="work-card reveal">' +
        '<div class="work-number">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + a.title + '</h3>' +
        '<p>' + a.comment + '</p>' +
        '<div class="work-tags">' + a.tags.map(function (t) {
          return '<span>' + t + '</span>';
        }).join('') + '</div>' +
      '</article>';
    }).join('');
  }

  // Movies grid
  var moviesGrid = document.getElementById('movies-grid');
  if (moviesGrid) {
    moviesGrid.innerHTML = d.movies.map(function (m, i) {
      return '<article class="work-card reveal">' +
        '<div class="work-number">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + m.title + '</h3>' +
        '<p>' + m.comment + '</p>' +
        '<div class="work-tags">' + m.tags.map(function (t) {
          return '<span>' + t + '</span>';
        }).join('') + '</div>' +
      '</article>';
    }).join('');
  }

  // Contact
  var contactMsg = document.getElementById('contact-message');
  var contactSocial = document.getElementById('contact-social');
  if (contactMsg) contactMsg.textContent = d.contact.message;
  if (contactSocial) {
    contactSocial.innerHTML = d.social.map(function (s) {
      return '<a href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + s.name + '">' +
        (s.icon ? '<span class="social-icon">' + s.icon + '</span>' : '') +
        '<span>' + s.name + '</span></a>';
    }).join('');
  }
})();

// ── Fake hit counter ──────────────────────────────────────
(function initCounter() {
  var counterEl = document.getElementById('hit-counter');
  if (!counterEl) return;

  // Generate a "stable" visitor count from the date
  var today = new Date();
  var base = 4832;
  var daysSinceEpoch = Math.floor(today.getTime() / 86400000);
  var count = base + (daysSinceEpoch % 9973);
  var digits = String(count).padStart(6, '0');

  counterEl.innerHTML = digits.split('').map(function (ch) {
    return '<span class="counter-digit">' + ch + '</span>';
  }).join('');
})();

// ── Scroll-triggered header ───────────────────────────────
var header = document.getElementById('site-header');

window.addEventListener('scroll', function () {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Reveal on scroll (fallback) ──────────────────────────
if (!CSS.supports('animation-timeline', 'view()')) {
  var revealEls = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          var delay = siblings.indexOf(entry.target) * 80;
          setTimeout(function () { entry.target.classList.add('visible'); }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );
  revealEls.forEach(function (el) { observer.observe(el); });
}

// ── Sparkle cursor trail (desktop only) ──────────────────
if (window.matchMedia('(pointer: fine)').matches && !window.__utils.prefersReducedMotion()) {
  var sparkleColors = ['#ff69b4', '#00ffff', '#ffff00', '#ff1493', '#00ff00', '#cc66ff'];

  document.addEventListener('mousemove', function (e) {
    // Throttle: ~1 sparkle per 60ms
    if (e.timeStamp - (document._lastSparkle || 0) < 60) return;
    document._lastSparkle = e.timeStamp;

    var dot = document.createElement('div');
    dot.className = 'sparkle';
    var color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    var dx = (Math.random() - 0.5) * 30;
    var dy = (Math.random() - 0.5) * 30;
    dot.style.cssText =
      'left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
      'background:' + color + ';' +
      'box-shadow:0 0 4px ' + color + ';' +
      '--dx:' + dx + 'px;--dy:' + dy + 'px;';
    document.body.appendChild(dot);
    setTimeout(function () { dot.remove(); }, 600);
  });
}

// ── Active nav highlight ──────────────────────────────────
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a');

var navObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (a) {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id
            ? 'var(--yellow)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(function (s) { navObserver.observe(s); });
