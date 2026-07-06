/* ============================================================
   WINDOWS XP THEME — script.js
   ============================================================ */

// ── Render shared data ──────────────────────────────────────
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

  // About facts
  var factsTable = document.getElementById('about-facts');
  if (factsTable) {
    factsTable.innerHTML = d.profile.facts.map(function (f) {
      return '<tr><td>' + f.label + '</td><td>' + f.value + '</td></tr>';
    }).join('');
  }

  // Traits
  var traitsDiv = document.getElementById('about-traits');
  if (traitsDiv && d.profile.traits) {
    traitsDiv.innerHTML = d.profile.traits.map(function (t) {
      return '<span class="xp-trait">' + t + '</span>';
    }).join('');
  }

  // Anime grid
  var animeGrid = document.getElementById('anime-grid');
  if (animeGrid) {
    animeGrid.innerHTML = d.anime.map(function (a, i) {
      return '<article class="xp-card reveal">' +
        '<div class="xp-card-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + a.title + '</h3>' +
        '<p>' + a.comment + '</p>' +
        '<div class="xp-card-tags">' + a.tags.map(function (t) {
          return '<span>' + t + '</span>';
        }).join('') + '</div>' +
      '</article>';
    }).join('');
  }

  // Movies grid
  var moviesGrid = document.getElementById('movies-grid');
  if (moviesGrid) {
    moviesGrid.innerHTML = d.movies.map(function (m, i) {
      return '<article class="xp-card reveal">' +
        '<div class="xp-card-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + m.title + '</h3>' +
        '<p>' + m.comment + '</p>' +
        '<div class="xp-card-tags">' + m.tags.map(function (t) {
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
        (s.icon ? '<span>' + s.icon + '</span>' : '') +
        '<span>' + s.name + '</span></a>';
    }).join('');
  }
})();

// ── Fake windows taskbar clock ──────────────────────────────
(function initClock() {
  var clock = document.createElement('span');
  clock.className = 'xp-clock';
  clock.setAttribute('aria-live', 'polite');
  var nav = document.querySelector('.nav-inner');
  if (nav) nav.appendChild(clock);

  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    clock.textContent = h + ':' + pad(m) + ' ' + ampm;
  }
  tick();
  setInterval(tick, 10000);
})();

// ── Inject clock styles ─────────────────────────────────────
(function () {
  var style = document.createElement('style');
  style.textContent = [
    '.xp-clock {',
    '  padding: 0 9px;',
    '  height: 22px;',
    '  display: inline-flex;',
    '  align-items: center;',
    '  font-size: 11px;',
    '  font-family: Tahoma, sans-serif;',
    '  color: #fff;',
    '  background: linear-gradient(to bottom, rgba(255,255,255,0.28), transparent 42%), linear-gradient(to bottom, #1397de, #09549e);',
    '  border: 1px solid #06408a;',
    '  border-left-color: #4ab8f3;',
    '  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.25);',
    '  text-shadow: 1px 1px 1px rgba(0,0,0,0.55);',
    '  white-space: nowrap;',
    '  flex-shrink: 0;',
    '}'
  ].join('');
  document.head.appendChild(style);
})();

// ── Error popup (random appearance) ────────────────────────
(function initErrorPopup() {
  var popup = document.getElementById('error-popup');
  var closeBtn = document.getElementById('error-close');
  var okBtn = document.getElementById('error-ok');
  if (!popup) return;

  var messages = [
    'An unexpected error has occurred. Please save your work and restart.',
    'iexplore.exe has caused an illegal operation.',
    'Low virtual memory. Please close some programs.',
    'Your computer is at risk! Install antivirus software immediately.',
    'You have 47 unread messages in your Inbox.',
    'A new update is available. Restart to apply changes.',
    'Critical error in module AWESOME.DLL'
  ];

  function showError() {
    if (window.__utils && window.__utils.prefersReducedMotion()) return;
    var msg = messages[Math.floor(Math.random() * messages.length)];
    var el = document.getElementById('error-msg');
    if (el) el.textContent = msg;
    popup.classList.add('visible');
    popup.removeAttribute('aria-hidden');
  }

  function hideError() {
    popup.classList.remove('visible');
    popup.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', hideError);
  if (okBtn) okBtn.addEventListener('click', hideError);

  // Show after 5 seconds on first visit
  if (!sessionStorage.getItem('xp-error-shown')) {
    setTimeout(function () {
      showError();
      sessionStorage.setItem('xp-error-shown', '1');
    }, 5000);
  }

  // Re-show on theme-switch button click
  var switchBtn = document.querySelector('.nav-switch');
  if (switchBtn) {
    switchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showError();
      document.getElementById('error-msg').textContent = 'Are you sure you want to switch themes? Unsaved changes will be lost.';
      if (okBtn) {
        okBtn.textContent = 'Switch';
        var once = function () {
          okBtn.removeEventListener('click', once);
          hideError();
          window.location.href = switchBtn.href;
        };
        okBtn.addEventListener('click', once);
        closeBtn && closeBtn.addEventListener('click', function () {
          okBtn.textContent = 'OK';
        }, { once: true });
      }
    });
  }
})();

// ── Dialog Easter egg buttons ───────────────────────────────
(function () {
  var okBtn = document.getElementById('dialog-ok');
  var cancelBtn = document.getElementById('dialog-cancel');
  var detailsBtn = document.getElementById('dialog-details');

  var detailMsg = [
    'Error code: 0xDEADBEEF',
    'Stack trace:',
    '  AWESOME.DLL + 0x1337',
    '  USER32.DLL + 0x4242',
    'Memory address: 0xC0FFEE',
  ].join('\n');

  if (okBtn) okBtn.addEventListener('click', function () {
    var dialog = okBtn.closest('.xp-dialog');
    if (dialog) dialog.style.display = 'none';
  });

  if (cancelBtn) cancelBtn.addEventListener('click', function () {
    var dialog = cancelBtn.closest('.xp-dialog');
    if (dialog) {
      dialog.querySelector('.xp-dialog-body p').textContent = 'Operation cancelled. Have a nice day!';
    }
  });

  if (detailsBtn) detailsBtn.addEventListener('click', function () {
    var dialog = detailsBtn.closest('.xp-dialog');
    if (!dialog) return;
    var body = dialog.querySelector('.xp-dialog-body');
    var existing = body.querySelector('.xp-details');
    if (existing) {
      existing.remove();
      detailsBtn.textContent = 'Details >>';
    } else {
      var pre = document.createElement('pre');
      pre.className = 'xp-details';
      pre.style.cssText = 'font-size:10px;background:#fff;border:1px inset #888;padding:6px;margin-top:4px;overflow:auto;max-height:80px;font-family:Courier New,monospace;white-space:pre;';
      pre.textContent = detailMsg;
      body.appendChild(pre);
      detailsBtn.textContent = 'Details <<';
    }
  });
})();

// ── Scroll-triggered header ─────────────────────────────────
var header = document.getElementById('site-header');
window.addEventListener('scroll', function () {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Reveal on scroll (fallback) ─────────────────────────────
if (!CSS.supports('animation-timeline', 'view()')) {
  var revealEls = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        var delay = siblings.indexOf(entry.target) * 60;
        setTimeout(function () { entry.target.classList.add('visible'); }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(function (el) { observer.observe(el); });
}

// ── Active nav highlight ────────────────────────────────────
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a');

var navObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function (a) {
        var isActive = a.getAttribute('href') === '#' + entry.target.id;
        a.style.background = isActive
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(255,255,255,0.12)), linear-gradient(to bottom, #11439c 0%, #276bd1 100%)'
          : '';
        a.style.borderColor = isActive ? '#082a71 #75a9f0 #75a9f0 #082a71' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(function (s) { navObserver.observe(s); });
