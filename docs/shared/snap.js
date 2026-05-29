/**
 * shared/snap.js
 * ① 画面左下: 次/前セクション ナビボタン
 * ② 画面右下: 上端では最下部へ、それ以外では最上部へ移動するボタン
 */
(function () {
  'use strict';

  var sections = Array.from(document.querySelectorAll('section[id]'));
  if (sections.length < 2) return;

  // ── ① 左下ナビボタン（次/前セクション）───────────────
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

  function setIcon(button, direction) {
    if (button.dataset.direction === direction) return;
    var points = direction === 'up' ? '18 15 12 9 6 15' : '6 9 12 15 18 9';
    button.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="' + points + '"/></svg>';
    button.dataset.direction = direction;
  }

  function setCurrentIndex(index) {
    currentIndex = index;
    var isLast = currentIndex >= sections.length - 1;
    navBtn.classList.toggle('snap-next-btn--up', isLast);
    navBtn.setAttribute('aria-label', isLast ? 'Previous section' : 'Next section');
    setIcon(navBtn, isLast ? 'up' : 'down');
    updateTopButtonState();
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
      ? sections[currentIndex - 1]
      : sections[currentIndex + 1];
    target.scrollIntoView({ behavior: 'smooth' });
  });

  // ── ② 右下TOP/BOTTOMボタン（常時表示）────────────────
  var topBtn = document.createElement('button');
  topBtn.className = 'top-btn';
  topBtn.type = 'button';
  topBtn.setAttribute('aria-label', 'Back to top');
  setIcon(topBtn, 'up');
  document.body.appendChild(topBtn);

  function isAtTop() {
    return window.scrollY <= 8;
  }

  function updateTopButtonState() {
    if (!topBtn) return;
    var atTop = isAtTop();
    topBtn.classList.toggle('top-btn--down', atTop);
    topBtn.setAttribute('aria-label', atTop ? 'Go to bottom' : 'Back to top');
    setIcon(topBtn, atTop ? 'down' : 'up');
  }

  window.addEventListener('scroll', function () {
    setCurrentIndex(getNearestSectionIndex());
  }, { passive: true });

  topBtn.addEventListener('click', function () {
    if (isAtTop()) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  setCurrentIndex(getNearestSectionIndex());
})();
