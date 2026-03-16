/* ============================================================
   ANIME THEME — script.js
   Canvas particles · Glitch · Counters · Neon effects
   ============================================================ */

'use strict';

// ── Canvas particle field ─────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const NEONS = ['#00d4ff', '#ff0080', '#9b30ff', '#00ff88', '#ffe600'];
  const COUNT = window.innerWidth < 600 ? 60 : 130;

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
      this.vy = -(0.3 + Math.random() * 0.8);
      this.vx = (Math.random() - 0.5) * 0.3;
      this.r  = 0.5 + Math.random() * 1.5;
      this.col = NEONS[Math.floor(Math.random() * NEONS.length)];
      this.alpha = 0.2 + Math.random() * 0.5;
      this.life  = 1;
      this.decay = 0.0008 + Math.random() * 0.001;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha * this.life;
      ctx.fillStyle   = this.col;
      ctx.shadowBlur  = 10;
      ctx.shadowColor = this.col;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: COUNT }, () => new Particle());

  // Connection lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 6400) { // 80px
          const alpha = (1 - d2 / 6400) * 0.12;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = particles[i].col;
          ctx.lineWidth   = 0.5;
          ctx.shadowBlur  = 4;
          ctx.shadowColor = particles[i].col;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  // Mouse interaction
  let mouse = { x: -9999, y: -9999 };
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function applyMouseRepel() {
    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 80 && d > 0) {
        const force = (80 - d) / 80 * 0.8;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
        // Dampen
        p.vx *= 0.95;
        p.vy *= 0.95;
      }
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyMouseRepel();
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── Scroll reveal ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

// ── Power level bar ───────────────────────────────────────
const plFill = document.querySelector('.pl-fill');
if (plFill) {
  const plObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => plFill.classList.add('animated'), 300);
      plObserver.disconnect();
    }
  }, { threshold: 0.5 });
  plObserver.observe(plFill);
}

// ── Skill bar animation ────────────────────────────────────
const skillFills = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('animated'), 200);
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(el => skillObserver.observe(el));

// ── Counter animation (hero stats) ────────────────────────
function animateCount(el, target, duration = 1400) {
  const start = performance.now();
  function step(now) {
    const t   = Math.min((now - start) / duration, 1);
    const val = Math.round(t * t * (3 - 2 * t) * target); // smoothstep
    el.textContent = val;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('.stat-num[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target, parseInt(e.target.dataset.count, 10));
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// ── Click burst effect ────────────────────────────────────
const BURST_CHARS = ['⚡', '✦', '★', '▲', '◆', '×'];
const BURST_COLS  = ['#00d4ff', '#ff0080', '#9b30ff', '#00ff88', '#ffe600'];

document.addEventListener('click', e => {
  for (let i = 0; i < 8; i++) {
    const el    = document.createElement('span');
    const char  = BURST_CHARS[Math.floor(Math.random() * BURST_CHARS.length)];
    const col   = BURST_COLS [Math.floor(Math.random() * BURST_COLS.length)];
    const angle = (Math.PI * 2 / 8) * i;
    const dist  = 50 + Math.random() * 40;

    el.textContent = char;
    el.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top:  ${e.clientY}px;
      color: ${col};
      font-size: ${12 + Math.random() * 10}px;
      pointer-events: none;
      z-index: 9999;
      text-shadow: 0 0 8px ${col};
      animation: burstFly 0.6s ease-out forwards;
      --dx: ${Math.cos(angle) * dist}px;
      --dy: ${Math.sin(angle) * dist}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 650);
  }
});

// inject burst keyframes once
if (!document.getElementById('burst-kf')) {
  const s = document.createElement('style');
  s.id = 'burst-kf';
  s.textContent = `
    @keyframes burstFly {
      0%   { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
      100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.2); opacity: 0; }
    }
  `;
  document.head.appendChild(s);
}

// ── Neon flicker on title (random, subtle) ─────────────────
const heroTitle = document.querySelector('.glitch');
if (heroTitle) {
  setInterval(() => {
    if (Math.random() < 0.15) {
      heroTitle.style.opacity = '0.85';
      setTimeout(() => { heroTitle.style.opacity = ''; }, 60);
    }
  }, 800);
}

// ── Power-up effect on card hover ─────────────────────────
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color 0.1s, box-shadow 0.1s, transform 0.2s';
    card.style.transform = 'translateY(-4px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── CRT flicker (very subtle, rare) ──────────────────────
setInterval(() => {
  if (Math.random() < 0.04) {
    document.body.style.filter = 'brightness(0.94)';
    setTimeout(() => { document.body.style.filter = ''; }, 50);
    setTimeout(() => {
      document.body.style.filter = 'brightness(1.04)';
      setTimeout(() => { document.body.style.filter = ''; }, 30);
    }, 80);
  }
}, 3000);

// ── Typing effect re-trigger on visible ──────────────────
const typeEl = document.querySelector('.typing-effect');
if (typeEl) {
  const text = typeEl.textContent.replace('█', '');
  typeEl.textContent = '';
  const termObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let i = 0;
      const tick = setInterval(() => {
        typeEl.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(tick);
      }, 55);
      termObserver.disconnect();
    }
  }, { threshold: 0.5 });
  termObserver.observe(typeEl);
}
