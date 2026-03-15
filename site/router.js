/**
 * router.js — Theme selection logic
 *
 * Themes are weighted so you can adjust probability easily.
 * sessionStorage ensures the same theme is shown for the
 * entire browser session (refresh-stable), while each new
 * session gets a fresh random pick.
 */

const THEMES = [
  { id: 'classy', path: 'themes/classy/index.html', weight: 1 },
  { id: 'anime',  path: 'themes/anime/index.html',  weight: 1 },
  // Add future themes here:
  // { id: 'future-theme', path: 'themes/future-theme/index.html', weight: 1 },
];

/**
 * Weighted random selection.
 * @param {{ id: string, path: string, weight: number }[]} themes
 * @returns {{ id: string, path: string }}
 */
function pickTheme(themes) {
  const totalWeight = themes.reduce((sum, t) => sum + t.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const theme of themes) {
    rand -= theme.weight;
    if (rand <= 0) return theme;
  }
  return themes[themes.length - 1];
}

/**
 * Returns the active theme, persisting the choice in sessionStorage
 * so the page stays consistent within one session.
 */
function resolveTheme() {
  const stored = sessionStorage.getItem('selectedTheme');
  if (stored) {
    const found = THEMES.find(t => t.id === stored);
    if (found) return found;
  }

  // Allow ?theme=classy (or ?theme=anime) override for development
  const params = new URLSearchParams(window.location.search);
  const override = params.get('theme');
  if (override) {
    const found = THEMES.find(t => t.id === override);
    if (found) {
      sessionStorage.setItem('selectedTheme', found.id);
      return found;
    }
  }

  const chosen = pickTheme(THEMES);
  sessionStorage.setItem('selectedTheme', chosen.id);
  return chosen;
}

// ── Entry point ──────────────────────────────────────────
(function () {
  const theme = resolveTheme();
  const loader = document.getElementById('loader');

  // Brief fade-out for smooth UX, then navigate
  setTimeout(() => {
    if (loader) loader.classList.add('fade-out');
    setTimeout(() => {
      window.location.replace(theme.path);
    }, 400);
  }, 300);
})();
