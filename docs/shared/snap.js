/**
 * shared/snap.js
 * ① スクロール停止後、セクション境界から vh×0.5 以内なら自動スナップ
 * ② 画面下中央: 次/前セクション or Back-to-top ナビボタン
 * ③ 画面右下: 常時表示のTOPボタン
 */
(function () {
  'use strict';

  var sections = Array.from(document.querySelectorAll('section[id]'));
  if (sections.length < 2) return;

  // ── ① スクロール50%閾値スナップ ─────────────────────────
  var snapTimer = null;
  var isSnapping = false;
  var DEBOUNCE = 120;

  function getNearestSection() {
    var scrollY = window.scrollY;
    var best = sections[0];
    var bestDist = Math.abs(sections[0].offsetTop - scrollY);
    sections.forEach(function (s) {
      var d = Math.abs(s.offsetTop - scrollY);
      if (d < bestDist) { bestDist = d; best = s; }
    });
    return { section: best, dist: bestDist };
  }

  function maybeSnap() {
    if (isSnapping) return;
    var vh = window.innerHeight;
    var result = getNearestSection();
    if (result.dist < vh * 0.5 && result.dist > 5) {
      isSnapping = true;
      window.scrollTo({ top: result.section.offsetTop, behavior: 'smooth' });
      setTimeout(function () { isSnapping = false; }, 700);
    }
  }

  window.addEventListener('scroll', function () {
    if (isSnapping) return;
    clearTimeout(snapTimer);
    snapTimer = setTimeout(maybeSnap, DEBOUNCE);
  }, { passive: true });

  // ── ② 中央ナビボタン（次/前 or Back-to-top）────────────
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

  // ── ③ 右下TOPボタン（常時表示）──────────────────────────
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
