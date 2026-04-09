/* ============================================================
   KAWAII THEME — script.js
   ============================================================ */

(function renderData() {
  var d = window.__data;
  if (!d) return;

  var heroName = document.getElementById('hero-name');
  var heroRole = document.getElementById('hero-role');
  var heroTagline = document.getElementById('hero-tagline');
  if (heroName) heroName.textContent = d.profile.name;
  if (heroRole) heroRole.textContent = d.profile.role;
  if (heroTagline) heroTagline.innerHTML = d.profile.tagline.replace(/\n/g, '<br>');

  var aboutP = document.getElementById('about-paragraphs');
  if (aboutP) {
    aboutP.innerHTML = d.profile.about.map(function (t) { return '<p>' + t + '</p>'; }).join('');
  }

  var facts = document.getElementById('about-facts');
  if (facts) {
    facts.innerHTML = d.profile.facts.map(function (f) {
      return '<div class="fact-pill"><strong>' + f.label + '</strong>' + f.value + '</div>';
    }).join('');
  }

  var traits = document.getElementById('about-traits');
  if (traits && d.profile.traits) {
    traits.innerHTML = d.profile.traits.map(function (t) {
      return '<span class="trait-chip">' + t + '</span>';
    }).join('');
  }

  function renderCards(gridId, items) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = items.map(function (item, i) {
      return '<article class="work-card reveal">' +
        '<div class="work-number">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3>' + item.title + '</h3>' +
        '<p>' + item.comment + '</p>' +
        '<div class="work-tags">' + item.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
      '</article>';
    }).join('');
  }

  renderCards('anime-grid', d.anime);
  renderCards('movies-grid', d.movies);

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

var header = document.getElementById('site-header');
window.addEventListener('scroll', function () {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

if (!CSS.supports('animation-timeline', 'view()')) {
  var revealEls = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        var delay = siblings.indexOf(entry.target) * 70;
        setTimeout(function () { entry.target.classList.add('visible'); }, delay);
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
        var match = a.getAttribute('href') === '#' + entry.target.id;
        a.style.color = match ? '#fff' : '';
        a.style.background = match ? 'var(--pink)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(function (s) { navObs.observe(s); });
