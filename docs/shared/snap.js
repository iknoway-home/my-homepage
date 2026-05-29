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

  function updateNavBtn() {
    var mid = window.innerHeight / 2;
    var best = 0, bestDist = Infinity;
    sections.forEach(function (s, i) {
      var r = s.getBoundingClientRect();
      var d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    if (currentIndex !== best) {
      currentIndex = best;
      var isLast = currentIndex >= sections.length - 1;
      navBtn.classList.toggle('snap-next-btn--up', isLast);
      navBtn.setAttribute('aria-label', isLast ? 'Back to top' : 'Next section');
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { updateNavBtn(); ticking = false; });
    }
  }, { passive: true });
  updateNavBtn();

  navBtn.addEventListener('click', function () {
    var target = currentIndex >= sections.length - 1
      ? sections[0]
      : sections[currentIndex + 1];
    target.scrollIntoView({ behavior: 'smooth' });
  });

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
