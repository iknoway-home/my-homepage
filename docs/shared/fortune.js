/**
 * shared/fortune.js
 * Injects a small anime/character fortune teller across themes.
 */
(function () {
  'use strict';

  var data = window.__data;
  if (!data || !data.fortune || !Array.isArray(data.fortune.characterTypes)) return;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function animePool() {
    return Array.isArray(data.anime) ? data.anime : [];
  }

  function pickAnime(character) {
    var anime = animePool();
    if (!anime.length) return null;

    var lucky = character.luckyTag;
    var matched = anime.filter(function (item) {
      return Array.isArray(item.tags) && item.tags.indexOf(lucky) >= 0;
    });

    return randomItem(matched.length ? matched : anime);
  }

  function drawFortune() {
    var character = randomItem(data.fortune.characterTypes);
    return {
      character: character,
      anime: pickAnime(character),
      power: 72 + Math.floor(Math.random() * 28),
    };
  }

  function themeMode() {
    var firstNav = document.querySelector('.nav-links a');
    var text = firstNav ? firstNav.textContent.trim() : '';
    if (text.indexOf('./') === 0) return 'terminal';
    if (/連絡|作品|映画|ゲーム/.test(document.body.textContent)) return 'jp';
    if (text === text.toUpperCase() && /[A-Z]/.test(text)) return 'caps';
    return 'default';
  }

  function copy() {
    var mode = themeMode();
    if (mode === 'terminal') {
      return {
        nav: './fortune',
        kicker: '// ── anime_fortune ──',
        title: '$ ./uranai --anime',
        subtitle: 'character type + recommended anime',
        button: 'run fortune',
        retry: 'reroll',
      };
    }
    if (mode === 'jp') {
      return {
        nav: '占い',
        kicker: '今日のおすすめ',
        title: data.fortune.title,
        subtitle: data.fortune.subtitle,
        button: data.fortune.buttonLabel,
        retry: data.fortune.retryLabel,
      };
    }
    if (mode === 'caps') {
      return {
        nav: 'FORTUNE',
        kicker: 'TODAY\'S PICK',
        title: 'ANIME FORTUNE',
        subtitle: 'Draw a character type and a matching anime.',
        button: 'DRAW',
        retry: 'DRAW AGAIN',
      };
    }
    return {
      nav: 'Fortune',
      kicker: 'Today\'s pick',
      title: 'Anime Fortune',
      subtitle: 'Draw a character type and a matching anime.',
      button: 'Draw',
      retry: 'Draw Again',
    };
  }

  function tagsHtml(tags, className) {
    return '<div class="' + className + '">' + (tags || []).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('') + '</div>';
  }

  function resultHtml(result) {
    var character = result.character;
    var anime = result.anime;
    var animeTags = anime && Array.isArray(anime.tags) ? anime.tags : [];

    return '<div class="fortune-result" aria-live="polite">' +
      '<div class="fortune-character">' +
        '<p class="fortune-label">今日のキャラタイプ</p>' +
        '<h3>' + escapeHtml(character.name) + '</h3>' +
        '<p class="fortune-mood">' + escapeHtml(character.mood) + '</p>' +
        '<p class="fortune-advice">' + escapeHtml(character.advice) + '</p>' +
        tagsHtml(character.tags, 'fortune-tags') +
      '</div>' +
      '<div class="fortune-pick">' +
        '<p class="fortune-label">おすすめアニメ</p>' +
        '<h3>' + escapeHtml(anime ? anime.title : '今日は自由枠') + '</h3>' +
        '<p>' + escapeHtml(anime ? anime.comment : '気分で選んでよし。') + '</p>' +
        tagsHtml(animeTags, 'fortune-tags') +
      '</div>' +
      '<div class="fortune-meter">' +
        '<span>相性</span>' +
        '<strong>' + result.power + '%</strong>' +
        '<i style="--fortune-power:' + result.power + '%"></i>' +
      '</div>' +
    '</div>';
  }

  function bindDraw(root, labels) {
    var output = root.querySelector('[data-fortune-result]');
    var button = root.querySelector('[data-fortune-draw]');
    if (!output || !button) return;

    function render() {
      output.innerHTML = resultHtml(drawFortune());
      button.textContent = labels.retry;
    }

    output.innerHTML = resultHtml(drawFortune());
    button.textContent = labels.retry;
    button.addEventListener('click', render);
  }

  function honorFortuneHash(section) {
    if (window.location.hash !== '#fortune') return;

    function scroll() {
      section.scrollIntoView({ block: 'start' });
    }

    window.setTimeout(scroll, 80);
    window.addEventListener('load', function () {
      window.setTimeout(scroll, 120);
    }, { once: true });
  }

  function renderSection() {
    var contact = document.getElementById('contact');
    if (!contact || contact.closest('.book') || document.getElementById('fortune')) return;

    var labels = copy();
    var navLinks = document.querySelector('.nav-links');
    if (navLinks && !navLinks.querySelector('a[href="#fortune"]')) {
      var item = document.createElement('li');
      item.innerHTML = '<a href="#fortune">' + escapeHtml(labels.nav) + '</a>';
      var contactLink = navLinks.querySelector('a[href="#contact"]');
      if (contactLink && contactLink.parentElement) {
        navLinks.insertBefore(item, contactLink.parentElement);
      } else {
        navLinks.appendChild(item);
      }
    }

    var section = document.createElement('section');
    section.className = 'section fortune-section';
    section.id = 'fortune';
    section.innerHTML =
      '<div class="container fortune-container">' +
        '<p class="fortune-kicker reveal">' + escapeHtml(labels.kicker) + '</p>' +
        '<div class="fortune-heading reveal">' +
          '<h2 class="fortune-title">' + escapeHtml(labels.title) + '</h2>' +
          '<p>' + escapeHtml(labels.subtitle) + '</p>' +
        '</div>' +
        '<div class="fortune-oracle reveal">' +
          '<div data-fortune-result></div>' +
          '<button class="fortune-draw" type="button" data-fortune-draw>' +
            escapeHtml(labels.button) +
          '</button>' +
        '</div>' +
      '</div>';

    contact.parentNode.insertBefore(section, contact);
    bindDraw(section, labels);
    honorFortuneHash(section);
  }

  function renderBookSpread() {
    var book = document.getElementById('book');
    if (!book || document.getElementById('fortune')) return;

    var labels = {
      retry: 'Draw Again',
    };
    var spread = document.createElement('section');
    spread.className = 'spread fortune-spread';
    spread.id = 'fortune';
    spread.dataset.chapter = 'Fortune';
    spread.innerHTML =
      '<article class="page page-left">' +
        '<p class="chapter-kicker">Bonus Chapter</p>' +
        '<h2>Anime Fortune</h2>' +
        '<p class="body-copy">Draw a character type and a matching anime from the grimoire.</p>' +
        '<button class="turn-cta fortune-draw" type="button" data-fortune-draw>Draw</button>' +
      '</article>' +
      '<article class="page page-right">' +
        '<div data-fortune-result></div>' +
      '</article>';

    book.appendChild(spread);
    bindDraw(spread, labels);

    var all = Array.from(document.querySelectorAll('.spread'));
    var active = document.querySelector('.spread.is-active');
    var activeIndex = all.indexOf(active);

    if (window.location.hash === '#fortune') {
      activeIndex = all.indexOf(spread);
      all.forEach(function (node, index) {
        node.classList.toggle('is-active', node === spread);
        node.classList.toggle('is-before', index < activeIndex);
        node.classList.toggle('is-after', index > activeIndex);
      });

      var indicator = document.getElementById('page-indicator');
      if (indicator) {
        indicator.textContent = 'Page ' + (activeIndex + 1) + ' / ' + all.length + ' - Fortune';
      }
    }

    if (activeIndex >= 0 && activeIndex < all.length - 1) {
      document.querySelectorAll('[data-action="next"]').forEach(function (button) {
        button.disabled = false;
      });
    }

    if (activeIndex === all.length - 1) {
      document.querySelectorAll('[data-action="next"]').forEach(function (button) {
        button.disabled = true;
      });
      document.querySelectorAll('[data-action="prev"]').forEach(function (button) {
        button.disabled = false;
      });
    }
  }

  if (document.getElementById('book')) {
    renderBookSpread();
  } else {
    renderSection();
  }
})();
