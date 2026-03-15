/* ============================================================
   ANIME THEME — script.js
   ============================================================ */

// ── Reveal on scroll ──────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const delay = siblings.indexOf(entry.target) * 90;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

revealEls.forEach(el => observer.observe(el));

// ── Skill bar animation (triggered on scroll) ────────────
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small delay for visual delight
        setTimeout(() => entry.target.classList.add('animated'), 200);
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

skillFills.forEach(el => skillObserver.observe(el));

// ── Cursor sparkle (desktop only) ────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const SPARKLE_CHARS = ['✦', '★', '✿', '♡', '•', '⭐'];
  const COLORS = ['#ff6eb4', '#a78bfa', '#ffd166', '#60d8ff', '#06d6a0'];

  document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
      const spark = document.createElement('div');
      const char  = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const angle = (Math.PI * 2 / 6) * i;
      const dist  = 40 + Math.random() * 30;

      spark.textContent = char;
      spark.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        color: ${color};
        font-size: ${10 + Math.random() * 12}px;
        pointer-events: none;
        z-index: 9999;
        animation: sparkFly 0.7s ease-out forwards;
        --dx: ${Math.cos(angle) * dist}px;
        --dy: ${Math.sin(angle) * dist}px;
      `;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 750);
    }
  });

  // Inject sparkle keyframes once
  if (!document.getElementById('spark-style')) {
    const style = document.createElement('style');
    style.id = 'spark-style';
    style.textContent = `
      @keyframes sparkFly {
        0%   { transform: translate(0,0) scale(1); opacity: 1; }
        100% { transform: translate(var(--dx), var(--dy)) scale(0.2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ── Eyes follow mouse (on hero character) ─────────────────
const pupils = document.querySelectorAll('.pupil');
const eyes   = document.querySelectorAll('.eye');

document.addEventListener('mousemove', (e) => {
  eyes.forEach((eye, idx) => {
    const rect = eye.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const dist  = 4;
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    pupils[idx].style.transform = `translate(${px}px, ${py}px)`;
  });
});

// ── Random emoji burst on logo click ──────────────────────
const logo = document.querySelector('.nav-logo');
if (logo) {
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    const emojis = ['🌸','⭐','💕','✨','🎉','🌟','💫','🦋'];
    for (let i = 0; i < 8; i++) {
      const el = document.createElement('span');
      el.textContent = emojis[i % emojis.length];
      const rect = logo.getBoundingClientRect();
      el.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width/2}px;
        top:  ${rect.top  + rect.height/2}px;
        font-size: 1.4rem;
        pointer-events: none;
        z-index: 9999;
        animation: sparkFly 0.9s ease-out forwards;
        --dx: ${(Math.random() - 0.5) * 120}px;
        --dy: ${-60 - Math.random() * 80}px;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
  });
}
