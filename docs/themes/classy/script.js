/* ============================================================
   CLASSY THEME — script.js
   ============================================================ */

// ── Scroll-triggered header ───────────────────────────────
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Reveal on scroll ──────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const delay = siblings.indexOf(entry.target) * 90;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
);

revealEls.forEach(el => observer.observe(el));

// ── Active nav highlight ───────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--chalk)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => navObserver.observe(s));

// ── Subtle cursor trail (desktop only) ────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const TRAIL_LEN = 6;
  const trail = [];

  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      width: ${3 + i}px;
      height: ${3 + i}px;
      border-radius: 50%;
      background: rgba(212, 168, 48, ${0.16 - i * 0.02});
      transform: translate(-50%, -50%);
      transition: left ${0.04 + i * 0.03}s ease,
                  top  ${0.04 + i * 0.03}s ease;
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }

  document.addEventListener('mousemove', e => {
    trail.forEach(d => {
      d.style.left = e.clientX + 'px';
      d.style.top  = e.clientY + 'px';
    });
  });
}

// ── Parallax on hero light shaft ─────────────────────────
const lightShaft = document.querySelector('.hero-light-shaft');
if (lightShaft) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    lightShaft.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
}
