/* ============================================================
   CLASSY THEME — script.js
   ============================================================ */

// ── Scroll-triggered header ────────────────────────────────
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Reveal on scroll (IntersectionObserver) ────────────────
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside the same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => observer.observe(el));

// ── Smooth active nav link highlight ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--gold)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => navObserver.observe(s));

// ── Cursor trail (subtle, desktop only) ───────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const trail = [];
  const TRAIL_LEN = 6;

  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: ${4 + i}px; height: ${4 + i}px;
      border-radius: 50%;
      background: rgba(200,169,110,${0.18 - i * 0.025});
      transform: translate(-50%,-50%);
      transition: left ${0.05 + i * 0.03}s ease, top ${0.05 + i * 0.03}s ease;
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }

  document.addEventListener('mousemove', e => {
    trail.forEach(dot => {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    });
  });
}
