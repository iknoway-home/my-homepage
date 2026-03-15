/**
 * shared/analytics.js
 * Lightweight, privacy-friendly analytics stub.
 *
 * Replace the `send()` implementation with your actual analytics
 * provider (e.g. Plausible, Fathom, or your own endpoint).
 *
 * No personal data or fingerprinting — only anonymous events.
 */

(function () {
  'use strict';

  // ── Config ─────────────────────────────────────────────
  const CONFIG = {
    /** Set to false to disable all tracking (e.g. dev / localhost). */
    enabled: !['localhost', '127.0.0.1'].includes(location.hostname),

    /** Endpoint for custom analytics. Leave empty to use console.log stub. */
    endpoint: '', // e.g. 'https://analytics.example.com/collect'

    /** Debounce scroll-depth events (ms). */
    scrollDebounceMs: 500,
  };

  // ── Internal state ─────────────────────────────────────
  const state = {
    theme: sessionStorage.getItem('selectedTheme') ?? 'unknown',
    pageLoadTime: Date.now(),
    maxScrollDepth: 0,
    sentScrollMilestones: new Set(),
  };

  // ── Core send ──────────────────────────────────────────
  /**
   * Send an analytics event.
   * @param {string} name  Event name
   * @param {object} [props] Extra key-value pairs
   */
  function send(name, props = {}) {
    if (!CONFIG.enabled) return;

    const payload = {
      name,
      theme: state.theme,
      path: location.pathname,
      referrer: document.referrer || null,
      ts: Date.now(),
      ...props,
    };

    if (CONFIG.endpoint) {
      // Fire-and-forget beacon (doesn't block navigation)
      navigator.sendBeacon(CONFIG.endpoint, JSON.stringify(payload));
    } else {
      // Dev stub — log to console
      console.debug('[analytics]', name, payload);
    }
  }

  // ── Automatic page-view ────────────────────────────────
  function trackPageView() {
    send('pageview', {
      title: document.title,
      url: location.href,
    });
  }

  // ── Time on page (on unload) ───────────────────────────
  function trackTimeOnPage() {
    const elapsed = Math.round((Date.now() - state.pageLoadTime) / 1000);
    send('time_on_page', { seconds: elapsed });
  }

  // ── Scroll depth ───────────────────────────────────────
  function trackScroll() {
    const scrolled = window.scrollY + window.innerHeight;
    const total    = document.documentElement.scrollHeight;
    const pct      = Math.round((scrolled / total) * 100);

    if (pct > state.maxScrollDepth) state.maxScrollDepth = pct;

    [25, 50, 75, 90, 100].forEach(milestone => {
      if (pct >= milestone && !state.sentScrollMilestones.has(milestone)) {
        state.sentScrollMilestones.add(milestone);
        send('scroll_depth', { percent: milestone });
      }
    });
  }

  // ── Outbound link clicks ───────────────────────────────
  function trackOutboundLinks() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const url = anchor.href;
      if (url && !url.startsWith(location.origin)) {
        send('outbound_click', { url });
      }
    });
  }

  // ── Theme switch tracking ──────────────────────────────
  function trackThemeSwitch() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('a');
      if (!el) return;
      if (el.href && el.href.includes('index.html')) {
        send('theme_switch', { from: state.theme });
      }
    });
  }

  // ── Init ───────────────────────────────────────────────
  function init() {
    trackPageView();
    trackOutboundLinks();
    trackThemeSwitch();

    // Scroll depth (debounced)
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(trackScroll, CONFIG.scrollDebounceMs);
    }, { passive: true });

    // Time on page
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') trackTimeOnPage();
    });
    window.addEventListener('pagehide', trackTimeOnPage);
  }

  // ── Public API ─────────────────────────────────────────
  window.__analytics = { send };

  // Run on DOMContentLoaded (or immediately if already loaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
