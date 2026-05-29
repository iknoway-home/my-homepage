/**
 * shared/snap.js
 * ① 画面下中央: 次/前セクション or Back-to-top ナビボタン
 * ② 画面右下: 常時表示のTOPボタン
 */
(function () {
  'use strict';

  var sections = Array.from(document.querySelectorAll('section[id]'));
  if (sections.length < 2) return;

  // ── ① 中央ナビボタン（次/前 or Back-to-top）────────────
  var currentIndex = 0;
  var navBtn = document.createElement('button');
  navBtn.className = 'snap-next-btn';
  navBtn.type = 'button';
  navBtn.setAttribute('aria-label', 'Next section');
  navBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="6 9 12 15 18 9"/></svg>';
  document.body.appendChild(navBtn);

  function setCurrentIndex(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    var isLast = currentIndex >= sections.length - 1;
    navBtn.classList.toggle('snap-next-btn--up', isLast);
    navBtn.setAttribute('aria-label', isLast ? 'Back to top' : 'Next section');
  }

  function getNearestSectionIndex() {
    var mid = window.innerHeight / 2;
    var best = 0;
    var bestDist = Infinity;
    sections.forEach(function (section, index) {
      var rect = section.getBoundingClientRect();
      var dist = Math.abs(rect.top + rect.height / 2 - mid);
      if (dist < bestDist) {
        best = index;
        bestDist = dist;
      }
    });
    return best;
  }

  if ('IntersectionObserver' in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = sections.indexOf(entry.target);
          if (index !== -1) setCurrentIndex(index);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (section) {
      activeObserver.observe(section);
    });
  }

  window.addEventListener('resize', function () {
    setCurrentIndex(getNearestSectionIndex());
  }, { passive: true });

  setCurrentIndex(getNearestSectionIndex());

  navBtn.addEventListener('click', function () {
    currentIndex = getNearestSectionIndex();
    var target = currentIndex >= sections.length - 1
      ? sections[0]
      : sections[currentIndex + 1];
    target.scrollIntoView({ behavior: 'smooth' });
  });

  // Fallback for older browsers without IntersectionObserver.
  if (!('IntersectionObserver' in window)) {
    window.addEventListener('scroll', function () {
      setCurrentIndex(getNearestSectionIndex());
    }, { passive: true });
  }

  function updateInitialButtonState() {
    var isLast = currentIndex >= sections.length - 1;
    navBtn.classList.toggle('snap-next-btn--up', isLast);
    navBtn.setAttribute('aria-label', isLast ? 'Back to top' : 'Next section');
  }

  updateInitialButtonState();

  // ── ② 右下TOPボタン（常時表示）──────────────────────────
  var topBtn = document.createElement('button');
  topBtn.className = 'top-btn';
  topBtn.type = 'button';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(topBtn);

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
