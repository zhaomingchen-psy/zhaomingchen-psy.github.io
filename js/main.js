/* ============================================
   DUALITY — Main Script
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
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ============================================
   2. Header Scroll
   ============================================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ============================================
   3. Active Nav
   ============================================ */
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

sections.forEach(s => sectionObs.observe(s));

/* ============================================
   4. Scroll Reveal
   ============================================ */
const reveals = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

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
   6. Cursor Glow — follows mouse
   ============================================ */
const cursorGlow = document.getElementById('cursor-glow');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!prefersReducedMotion.matches && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    if (!cursorGlow.classList.contains('active')) {
      cursorGlow.classList.add('active');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });
}

/* ============================================
   7. 3D Tilt Cards
   ============================================ */
const tiltCards = document.querySelectorAll('[data-tilt]');

if (!prefersReducedMotion.matches && window.innerWidth > 768) {
  tiltCards.forEach(card => {
    const inner = card.querySelector('.card-inner');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    });
  });
}

/* ============================================
   8. Hero Parallax Fade
   ============================================ */
const heroContent = document.querySelector('.hero-content');
if (heroContent && !prefersReducedMotion.matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const h = window.innerHeight;
    if (scrollY < h) {
      const p = scrollY / h;
      heroContent.style.opacity = 1 - p * 1.5;
      heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
    }
  }, { passive: true });
}
