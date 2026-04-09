/* ============================================================
   TERMINAL THEME — script.js
   ============================================================ */

(function renderData() {
  var d = window.__data;
  if (!d) return;

  var heroName = document.getElementById('hero-name');
  var heroRole = document.getElementById('hero-role');
  var heroTagline = document.getElementById('hero-tagline');
  if (heroName) heroName.textContent = d.profile.name;
  if (heroRole) heroRole.textContent = d.profile.role;
  if (heroTagline) heroTagline.innerHTML = '# ' + d.profile.tagline.replace(/\n/g, '<br># ');

  var aboutP = document.getElementById('about-paragraphs');
  if (aboutP) {
    aboutP.innerHTML = d.profile.about.map(function (t) {
      return '<p>&gt; ' + t + '</p>';
    }).join('');
  }

  var factsUl = document.getElementById('about-facts');
  if (factsUl) {
    factsUl.innerHTML = d.profile.facts.map(function (f) {
      return '<li><span class="fact-key">' + f.label + '</span><span class="fact-val">' + f.value + '</span></li>';
    }).join('');
  }

  var animeGrid = document.getElementById('anime-grid');
  if (animeGrid) {
    animeGrid.innerHTML = d.anime.map(function (a, i) {
      return '<article class="work-card reveal">' +
        '<div class="work-number">-rw-r--r-- 1 iknoway anime ' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + a.title + '</h3>' +
        '<p>' + a.comment + '</p>' +
        '<div class="work-tags">' + a.tags.map(function (t) { return '<span>#' + t + '</span>'; }).join('') + '</div>' +
      '</article>';
    }).join('');
  }

  var moviesGrid = document.getElementById('movies-grid');
  if (moviesGrid) {
    moviesGrid.innerHTML = d.movies.map(function (m, i) {
      return '<article class="work-card reveal">' +
        '<div class="work-number">-rw-r--r-- 1 iknoway movies ' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + m.title + '</h3>' +
        '<p>' + m.comment + '</p>' +
        '<div class="work-tags">' + m.tags.map(function (t) { return '<span>#' + t + '</span>'; }).join('') + '</div>' +
      '</article>';
    }).join('');
  }

  var contactMsg = document.getElementById('contact-message');
  var contactSocial = document.getElementById('contact-social');
  if (contactMsg) contactMsg.textContent = '> ' + d.contact.message;
  if (contactSocial) {
    contactSocial.innerHTML = d.social.map(function (s) {
      return '<a href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + s.name + '">' +
        (s.icon ? '<span class="social-icon">' + s.icon + '</span>' : '') +
        '<span>' + s.name + '</span></a>';
    }).join('');
  }
})();

var header = document.getElementById('site-header');
window.addEventListener('scroll', function () {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

if (!CSS.supports('animation-timeline', 'view()')) {
  var revealEls = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(function (el) { observer.observe(el); });
}

var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a');
var navObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function (a) {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id ? 'var(--green)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(function (s) { navObs.observe(s); });
