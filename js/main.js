/* ============================================
   "The Space Between" — Main Script
   ============================================ */

/* ============================================
   1. Dark Mode
   ============================================ */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

/* ============================================
   2. Header — Scroll State
   ============================================ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ============================================
   3. Navigation — Active Section
   ============================================ */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, {
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));

/* ============================================
   4. Scroll Reveal
   ============================================ */
const revealElements = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));

/* ============================================
   5. Mobile Menu
   ============================================ */
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  nav.classList.toggle('open');
});

nav.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    menuToggle.classList.remove('open');
    nav.classList.remove('open');
  }
});

/* ============================================
   6. Generative Canvas — Flowing Field
   Organic curves (humanity) dissolving into
   geometric grids (technology)
   ============================================ */
const canvas = document.getElementById('gen-canvas');
const ctx = canvas.getContext('2d');

let canvasWidth, canvasHeight;
let particles = [];
let animationId;
let mouseX = -1000, mouseY = -1000;

const PARTICLE_COUNT = 80;
const CONNECTION_DIST = 150;

function isDark() {
  return html.getAttribute('data-theme') === 'dark';
}

function resize() {
  canvasWidth = canvas.width = window.innerWidth;
  canvasHeight = canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 0.5;
    // Organic movement: sinusoidal drift
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.005;
    this.drift = Math.random() * 20 + 10;
    this.originX = this.x;
    this.originY = this.y;
    this.phase = Math.random() * Math.PI * 2;
    // Color: warm on left, cool on right
    this.t = this.x / canvasWidth;
  }

  update(time) {
    this.angle += this.angleSpeed;
    this.phase += 0.003;

    // Gentle organic drift
    this.originX += this.speedX;
    this.originY += this.speedY;

    this.x = this.originX + Math.sin(this.angle + this.phase) * this.drift;
    this.y = this.originY + Math.cos(this.angle * 0.7 + this.phase) * this.drift;

    // Wrap around edges
    if (this.originX < -50) this.originX = canvasWidth + 50;
    if (this.originX > canvasWidth + 50) this.originX = -50;
    if (this.originY < -50) this.originY = canvasHeight + 50;
    if (this.originY > canvasHeight + 50) this.originY = -50;

    // Update color blend based on position
    this.t = this.x / canvasWidth;
  }

  draw() {
    const dark = isDark();
    const warmR = dark ? 212 : 200;
    const warmG = dark ? 184 : 168;
    const warmB = dark ? 138 : 124;
    const coolR = dark ? 125 : 74;
    const coolG = dark ? 161 : 111;
    const coolB = dark ? 212 : 165;

    const r = Math.round(warmR + (coolR - warmR) * this.t);
    const g = Math.round(warmG + (coolG - warmG) * this.t);
    const b = Math.round(warmB + (coolB - warmB) * this.t);
    const alpha = dark ? 0.3 : 0.25;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
  }
}

function drawConnections() {
  const dark = isDark();
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECTION_DIST) {
        const alpha = (1 - dist / CONNECTION_DIST) * (dark ? 0.08 : 0.06);
        const t = (particles[i].x + particles[j].x) / (2 * canvasWidth);

        const warmR = dark ? 212 : 200;
        const warmG = dark ? 184 : 168;
        const warmB = dark ? 138 : 124;
        const coolR = dark ? 125 : 74;
        const coolG = dark ? 161 : 111;
        const coolB = dark ? 212 : 165;

        const r = Math.round(warmR + (coolR - warmR) * t);
        const g = Math.round(warmG + (coolG - warmG) * t);
        const b = Math.round(warmB + (coolB - warmB) * t);

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate(time) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach(p => {
    p.update(time);
    p.draw();
  });

  drawConnections();
  animationId = requestAnimationFrame(animate);
}

function initCanvas() {
  resize();
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
  if (animationId) cancelAnimationFrame(animationId);
  animate(0);
}

// Reduce motion for accessibility
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!prefersReducedMotion.matches) {
  initCanvas();
  window.addEventListener('resize', () => {
    resize();
    // Reposition particles that are out of bounds
    particles.forEach(p => {
      if (p.originX > canvasWidth) p.originX = Math.random() * canvasWidth;
      if (p.originY > canvasHeight) p.originY = Math.random() * canvasHeight;
    });
  });
} else {
  canvas.style.display = 'none';
}

/* ============================================
   7. Smooth Parallax for Hero (subtle)
   ============================================ */
const heroContent = document.querySelector('.hero-content');
if (heroContent && !prefersReducedMotion.matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      heroContent.style.opacity = 1 - progress * 1.2;
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    }
  }, { passive: true });
}
