/**
 * shared/snap.js
 * ① 画面左下: 前/次セクション ナビボタン
 * ② 画面右下: 上端では最下部へ、それ以外では最上部へ移動するボタン
 */
(function () {
  'use strict';

  var sections = Array.from(document.querySelectorAll('section[id]'));
  if (sections.length < 2) return;

  // ── ① 左下ナビボタン（前/次セクション）───────────────
  var currentIndex = 0;
  var navBtn = document.createElement('button');
  navBtn.className = 'snap-next-btn';
  navBtn.type = 'button';
  navBtn.setAttribute('aria-label', 'Next section');
  document.body.appendChild(navBtn);

  var prevBtn = document.createElement('button');
  prevBtn.className = 'snap-next-btn snap-prev-btn';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous section');
  document.body.appendChild(prevBtn);

  function iconSvg(direction, double) {
    var points;
    if (double) {
      points = direction === 'up'
        ? ['7 12 12 7 17 12', '7 17 12 12 17 17']
        : ['7 7 12 12 17 7', '7 12 12 17 17 12'];
    } else {
      points = [direction === 'up' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'];
    }
    return (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      points.map(function (point) {
        return '<polyline points="' + point + '"/>';
      }).join('') +
    '</svg>'
    );
  }

  function setIcon(button, direction, double) {
    var iconKey = direction + (double ? '-double' : '-single');
    if (button.dataset.direction === iconKey) return;
    button.innerHTML = iconSvg(direction, double);
    button.dataset.direction = iconKey;
  }

  function setDisabled(button, disabled) {
    button.disabled = disabled;
    button.classList.toggle('snap-next-btn--disabled', disabled);
    button.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  }

  function setCurrentIndex(index) {
    currentIndex = index;
    setIcon(navBtn, 'down', false);
    setIcon(prevBtn, 'up', false);
    setDisabled(navBtn, currentIndex >= sections.length - 1);
    setDisabled(prevBtn, currentIndex <= 0);
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
    if (currentIndex >= sections.length - 1) return;
    var target = sections[currentIndex + 1];
    target.scrollIntoView({ behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', function () {
    currentIndex = getNearestSectionIndex();
    if (currentIndex <= 0) return;
    var target = sections[currentIndex - 1];
    target.scrollIntoView({ behavior: 'smooth' });
  });

  // ── ② 右下TOP/BOTTOMボタン（常時表示）────────────────
  var topBtn = document.createElement('button');
  topBtn.className = 'top-btn';
  topBtn.type = 'button';
  topBtn.setAttribute('aria-label', 'Back to top');
  setIcon(topBtn, 'up', true);
  document.body.appendChild(topBtn);

  function isAtTop() {
    return window.scrollY <= 8;
  }

  function updateTopButtonState() {
    if (!topBtn) return;
    var atTop = isAtTop();
    topBtn.classList.toggle('top-btn--down', atTop);
    topBtn.setAttribute('aria-label', atTop ? 'Go to bottom' : 'Back to top');
    setIcon(topBtn, atTop ? 'down' : 'up', true);
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
