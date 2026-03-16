/**
 * router.js — Theme selection logic
 *
 * Normal visit:   picks a random theme, stores it in sessionStorage
 *                 so the same theme is shown for the whole session.
 * ?switch=1:      clears the stored theme, forces a DIFFERENT theme,
 *                 used by every "Switch / Gacha" button on the site.
 * ?theme=classy:  dev override – forces a specific theme.
 */

const THEMES = [
  { id: 'classy', path: 'themes/classy/index.html', weight: 1 },
  { id: 'anime',  path: 'themes/anime/index.html',  weight: 1 },
  // Add future themes here:
  // { id: 'future-theme', path: 'themes/future-theme/index.html', weight: 1 },
];

/** Weighted random selection from a list of themes. */
function pickTheme(themes) {
  const total = themes.reduce((s, t) => s + t.weight, 0);
  let rand = Math.random() * total;
  for (const t of themes) {
    rand -= t.weight;
    if (rand <= 0) return t;
  }
  return themes[themes.length - 1];
}

/**
 * Resolve which theme to show.
 *
 * Priority order:
 *  1. ?switch=1   → force-pick a DIFFERENT theme, persist it
 *  2. sessionStorage hit → return same theme (session-stable)
 *  3. ?theme=xxx  → dev override
 *  4. random pick
 */
function resolveTheme() {
  const params = new URLSearchParams(window.location.search);

  // ── Switch (Gacha) button was clicked ──────────────────
  if (params.get('switch') === '1') {
    // Strip param from URL so back/refresh doesn't keep re-rolling
    params.delete('switch');
    const clean = location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState(null, '', clean);

    const current = sessionStorage.getItem('selectedTheme');
    sessionStorage.removeItem('selectedTheme');

    // Pick a theme that is DIFFERENT from the current one
    const pool = current ? THEMES.filter(t => t.id !== current) : THEMES;
    const chosen = pickTheme(pool.length ? pool : THEMES);
    sessionStorage.setItem('selectedTheme', chosen.id);
    return chosen;
  }

  // ── Session-stable: return the already-chosen theme ────
  const stored = sessionStorage.getItem('selectedTheme');
  if (stored) {
    const found = THEMES.find(t => t.id === stored);
    if (found) return found;
  }

  // ── Dev override (?theme=classy etc.) ──────────────────
  const override = params.get('theme');
  if (override) {
    const found = THEMES.find(t => t.id === override);
    if (found) {
      sessionStorage.setItem('selectedTheme', found.id);
      return found;
    }
  }

  // ── Fresh random pick ──────────────────────────────────
  const chosen = pickTheme(THEMES);
  sessionStorage.setItem('selectedTheme', chosen.id);
  return chosen;
}

// ── Entry point ──────────────────────────────────────────
(function () {
  const theme  = resolveTheme();
  const loader = document.getElementById('loader');

  setTimeout(() => {
    if (loader) loader.classList.add('fade-out');
    setTimeout(() => window.location.replace(theme.path), 400);
  }, 280);
})();
