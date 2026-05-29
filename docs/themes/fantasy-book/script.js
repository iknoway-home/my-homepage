/* ============================================================
   FANTASY BOOK THEME - script.js
   ============================================================ */

(function () {
  'use strict';

  var data = window.__data;
  var book = document.getElementById('book');
  var indicator = document.getElementById('page-indicator');
  var nextSheet = document.getElementById('turn-next');
  var prevSheet = document.getElementById('turn-prev');
  var navButtons = Array.from(document.querySelectorAll('[data-page]'));
  var current = 0;
  var isTurning = false;
  var wheelDebt = 0;
  var wheelTimer = null;

  if (!data || !book) return;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function tagList(tags) {
    return '<div class="rune-tags">' + tags.map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('') + '</div>';
  }

  function workEntry(item, index) {
    return '<article class="entry">' +
      '<p class="entry-index">No. ' + String(index + 1).padStart(2, '0') + '</p>' +
      '<h3>' + escapeHtml(item.title) + '</h3>' +
      '<p>' + escapeHtml(item.comment) + '</p>' +
      tagList(item.tags) +
    '</article>';
  }

  function gameEntry(item, index) {
    return '<article class="entry">' +
      '<p class="entry-index">' + escapeHtml(item.status || 'Playing') + ' ' + String(index + 1).padStart(2, '0') + '</p>' +
      '<h3>' + escapeHtml(item.title) + '</h3>' +
      '<p>' + escapeHtml(item.comment) + '</p>' +
      tagList(item.tags || []) +
    '</article>';
  }

  function projectEntry(item, index) {
    return '<article class="entry">' +
      '<p class="entry-index">Artifact ' + String(index + 1).padStart(2, '0') + '</p>' +
      '<h3><a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener">' +
      escapeHtml(item.name) + '</a></h3>' +
      '<p>' + escapeHtml(item.description || item.url) + '</p>' +
      tagList(item.tags || []) +
    '</article>';
  }

  function statEntry(item) {
    return '<div><strong>' + escapeHtml(item.count) + escapeHtml(item.unit) + '</strong><span>' +
      escapeHtml(item.label) + '</span></div>';
  }

  function profileFacts() {
    return data.profile.facts.map(function (fact) {
      return '<div class="fact-stone"><span>' + escapeHtml(fact.label) + '</span><strong>' +
        escapeHtml(fact.value) + '</strong></div>';
    }).join('');
  }

  function traitRunes() {
    return '<div class="trait-runes">' + data.profile.traits.map(function (trait) {
      return '<span>' + escapeHtml(trait) + '</span>';
    }).join('') + '</div>';
  }

  function socialLinks() {
    return data.social.map(function (social) {
      return '<a href="' + escapeHtml(social.url) + '" target="_blank" rel="noopener" aria-label="' +
        escapeHtml(social.name) + '">' +
        (social.icon ? '<span class="social-icon">' + social.icon + '</span>' : '') +
        '<span>' + escapeHtml(social.name) + '</span></a>';
    }).join('');
  }

  function spread(id, chapter, left, right) {
    return '<section class="spread" id="' + id + '" data-chapter="' + escapeHtml(chapter) + '">' +
      '<article class="page page-left">' + left + '</article>' +
      '<article class="page page-right">' + right + '</article>' +
    '</section>';
  }

  function render() {
    document.getElementById('hero-name').textContent = data.profile.name;
    document.getElementById('hero-role').textContent = data.profile.role;
    document.getElementById('hero-tagline').innerHTML = escapeHtml(data.profile.tagline).replace(/\n/g, '<br>');
    document.getElementById('hero-stats').innerHTML = data.heroStats.map(statEntry).join('');

    var animeOne = data.anime.slice(0, 4);
    var animeTwo = data.anime.slice(4);
    var moviesOne = data.movies.slice(0, 3);
    var moviesTwo = data.movies.slice(3);

    var pages = [
      spread(
        'profile',
        'Profile',
        '<p class="chapter-kicker">Chapter I</p><h2>Wanderer Profile</h2>' +
          data.profile.about.map(function (text) {
            return '<p class="body-copy">' + escapeHtml(text) + '</p>';
          }).join('') +
          '<blockquote>' + escapeHtml(data.profile.tagline.split('\n')[0]) + '</blockquote>',
        '<p class="chapter-kicker">Known Traits</p><h2>Marginalia</h2>' +
          '<div class="facts-grid">' + profileFacts() + '</div>' + traitRunes()
      ),
      spread(
        'games',
        'Games',
        '<p class="chapter-kicker">Chapter II</p><h2>Current Quests</h2>' +
          (data.games || []).slice(0, 1).map(gameEntry).join(''),
        '<p class="chapter-kicker">Party Log</p><h2>Rift Notes</h2>' +
          (data.games || []).slice(1).map(function (item, index) { return gameEntry(item, index + 1); }).join('')
      ),
      spread(
        'anime-a',
        'Anime I',
        '<p class="chapter-kicker">Chapter III</p><h2>Anime Codex</h2>' +
          animeOne.slice(0, 2).map(workEntry).join(''),
        '<p class="chapter-kicker">Continued</p><h2>Favorite Tomes</h2>' +
          animeOne.slice(2).map(function (item, index) { return workEntry(item, index + 2); }).join('')
      ),
      spread(
        'anime-b',
        'Anime II',
        '<p class="chapter-kicker">Chapter IV</p><h2>Further Entries</h2>' +
          animeTwo.slice(0, 2).map(function (item, index) { return workEntry(item, index + 4); }).join(''),
        '<p class="chapter-kicker">Appendix</p><h2>Battle Notes</h2>' +
          animeTwo.slice(2, 3).map(function (item, index) { return workEntry(item, index + 6); }).join('') +
          '<div class="page-ornament" aria-hidden="true"></div>'
      ),
      spread(
        'anime-c',
        'Anime III',
        '<p class="chapter-kicker">Chapter V</p><h2>Late Entries</h2>' +
          animeTwo.slice(3, 4).map(function (item, index) { return workEntry(item, index + 7); }).join('') +
          '<div class="page-ornament page-ornament-small" aria-hidden="true"></div>',
        '<p class="chapter-kicker">Codex Close</p><h2>Dark Fantasy</h2>' +
          animeTwo.slice(4).map(function (item, index) { return workEntry(item, index + 8); }).join('') +
          '<div class="page-ornament page-ornament-small" aria-hidden="true"></div>'
      ),
      spread(
        'movies-a',
        'Movies I',
        '<p class="chapter-kicker">Chapter VI</p><h2>Moving Pictures</h2>' +
          moviesOne.slice(0, 2).map(workEntry).join(''),
        '<p class="chapter-kicker">Silver Screen</p><h2>Relics</h2>' +
          moviesOne.slice(2).map(function (item, index) { return workEntry(item, index + 2); }).join('')
      ),
      spread(
        'movies-b',
        'Movies II',
        '<p class="chapter-kicker">Chapter VII</p><h2>Other Visions</h2>' +
          moviesTwo.slice(0, 2).map(function (item, index) { return workEntry(item, index + 3); }).join(''),
        '<p class="chapter-kicker">Final Reel</p><h2>Last Leaves</h2>' +
          moviesTwo.slice(2).map(function (item, index) { return workEntry(item, index + 5); }).join('')
      ),
      spread(
        'projects',
        'Projects',
        '<p class="chapter-kicker">Chapter VIII</p><h2>Made Artifacts</h2>' +
          (data.projects || []).map(projectEntry).join(''),
        '<p class="chapter-kicker">Portal Notes</p><h2>Open the Gate</h2>' +
          '<p class="body-copy body-copy-large">これまで作ったサイトを、連絡先とは別の章にまとめています。</p>' +
          '<div class="page-ornament" aria-hidden="true"></div>'
      ),
      spread(
        'contact',
        'Contact',
        '<p class="chapter-kicker">Chapter IX</p><h2>Send a Raven</h2>' +
          '<p class="body-copy body-copy-large">' + escapeHtml(data.contact.message) + '</p>' +
          '<a class="email-link" href="mailto:' + escapeHtml(data.contact.email) + '">' +
          escapeHtml(data.contact.email) + '</a>',
        '<p class="chapter-kicker">Gateways</p><h2>Social Sigils</h2>' +
          '<div class="social-links">' + socialLinks() + '</div>' +
          '<a href="../../index.html?switch=1" class="closing-switch">Draw Another Theme</a>'
      )
    ];

    book.insertAdjacentHTML('beforeend', pages.join(''));
  }

  function spreads() {
    return Array.from(document.querySelectorAll('.spread'));
  }

  function setActive(index) {
    var all = spreads();
    var max = all.length - 1;
    current = Math.max(0, Math.min(index, max));

    all.forEach(function (node, i) {
      node.classList.toggle('is-active', i === current);
      node.classList.toggle('is-before', i < current);
      node.classList.toggle('is-after', i > current);
    });

    navButtons.forEach(function (button) {
      button.classList.toggle('is-current', Number(button.dataset.page) === current);
    });

    document.querySelectorAll('[data-action="prev"]').forEach(function (button) {
      button.disabled = current === 0;
    });
    document.querySelectorAll('[data-action="next"]').forEach(function (button) {
      button.disabled = current === max;
    });
    indicator.textContent = 'Page ' + (current + 1) + ' / ' + (max + 1) + ' - ' + all[current].dataset.chapter;
    history.replaceState(null, '', '#' + all[current].id);
  }

  function turnTo(index, direction) {
    var all = spreads();
    var max = all.length - 1;
    var target = Math.max(0, Math.min(index, max));
    if (target === current || isTurning) return;

    isTurning = true;
    var sheet = direction === 'prev' ? prevSheet : nextSheet;
    if (sheet) {
      sheet.classList.remove('is-turning');
      sheet.offsetWidth;
      sheet.classList.add('is-turning');
    }

    document.body.classList.toggle('turning-prev', direction === 'prev');
    document.body.classList.toggle('turning-next', direction !== 'prev');

    window.setTimeout(function () {
      setActive(target);
    }, 260);

    window.setTimeout(function () {
      if (sheet) sheet.classList.remove('is-turning');
      document.body.classList.remove('turning-prev', 'turning-next');
      isTurning = false;
    }, 760);
  }

  function next() {
    turnTo(current + 1, 'next');
  }

  function prev() {
    turnTo(current - 1, 'prev');
  }

  function handleWheel(event) {
    event.preventDefault();
    if (isTurning) return;
    wheelDebt += event.deltaY || event.deltaX;
    clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(function () { wheelDebt = 0; }, 120);

    if (Math.abs(wheelDebt) < 70) return;
    if (wheelDebt > 0) next();
    if (wheelDebt < 0) prev();
    wheelDebt = 0;
  }

  function bind() {
    document.addEventListener('click', function (event) {
      var actionTarget = event.target.closest('[data-action]');
      if (actionTarget && !actionTarget.disabled) {
        event.preventDefault();
        if (actionTarget.dataset.action === 'next') next();
        if (actionTarget.dataset.action === 'prev') prev();
        return;
      }

      var pageTarget = event.target.closest('.page-left, .page-right');
      if (!pageTarget || !pageTarget.closest('.spread.is-active')) return;
      if (event.target.closest('a, button')) return;
      if (pageTarget.classList.contains('page-left')) prev();
      if (pageTarget.classList.contains('page-right')) next();
    });

    navButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var target = Number(button.dataset.page);
        turnTo(target, target < current ? 'prev' : 'next');
      });
    });

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (['PageDown', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
        next();
      }
      if (['PageUp', 'ArrowLeft', 'Backspace'].includes(event.key)) {
        event.preventDefault();
        prev();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        turnTo(0, 'prev');
      }
      if (event.key === 'End') {
        event.preventDefault();
        turnTo(spreads().length - 1, 'next');
      }
    });
  }

  render();
  bind();

  var hashIndex = spreads().findIndex(function (node) {
    return '#' + node.id === window.location.hash;
  });
  setActive(hashIndex >= 0 ? hashIndex : 0);
})();
