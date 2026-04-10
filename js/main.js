/* ============================================
   Dark Mode
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
   Header Shadow on Scroll
   ============================================ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ============================================
   Active Navigation (Intersection Observer)
   ============================================ */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
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

sections.forEach(section => observer.observe(section));

/* ============================================
   BibTeX Toggle
   ============================================ */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.pub-bibtex-toggle');
  if (!btn) return;

  const entry = btn.closest('.pub-entry');
  const bibtex = entry.querySelector('.pub-bibtex');
  if (!bibtex) return;

  const isHidden = bibtex.hasAttribute('hidden');
  if (isHidden) {
    bibtex.removeAttribute('hidden');
    btn.textContent = 'Hide BibTeX';
  } else {
    bibtex.setAttribute('hidden', '');
    btn.textContent = 'BibTeX';
  }
});

/* ============================================
   Mobile Menu
   ============================================ */
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  nav.classList.toggle('open');
});

// Close menu when a nav link is clicked
nav.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    menuToggle.classList.remove('open');
    nav.classList.remove('open');
  }
});
