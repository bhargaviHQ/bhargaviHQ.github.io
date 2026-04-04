/* ============================================================
   Portfolio JS — Modern Vanilla JavaScript
   ============================================================ */
'use strict';

/* ============================================================
   1. Theme Toggle (Dark / Light Mode)
   ============================================================ */
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);

  const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  document.querySelectorAll('.theme-btn').forEach(btn => {
    const i = btn.querySelector('i');
    if (i) { i.className = `fas ${icon}`; }
    btn.setAttribute('aria-label', label);
  });
}

function initTheme() {
  const saved   = localStorage.getItem('portfolio-theme');
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || prefers);
}

document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
});

initTheme();

/* ============================================================
   2. Typing Effect
   ============================================================ */
const TYPE_SPEED          = 85;   // ms per character when typing
const DELETE_SPEED        = 55;   // ms per character when deleting
const PAUSE_AFTER_WORD    = 1800; // ms pause after a word is fully typed
const PAUSE_BEFORE_NEXT   = 320;  // ms pause before starting the next word
const TYPING_START_DELAY  = 900;  // ms before the effect begins on page load
const FADE_IN_STAGGER     = 70;   // ms stagger between sibling fade-in elements

const typedEl   = document.getElementById('typed-text');
const roles     = ['Data Engineer', 'Data Scientist', 'Software Engineer', 'Data Analyst'];
let wordIdx     = 0;
let charIdx     = 0;
let isDeleting  = false;

function tick() {
  const word   = roles[wordIdx];
  const slice  = word.slice(0, isDeleting ? charIdx - 1 : charIdx + 1);

  typedEl.textContent = slice;
  isDeleting ? charIdx-- : charIdx++;

  let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

  if (!isDeleting && charIdx === word.length) {
    delay      = PAUSE_AFTER_WORD;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx    = (wordIdx + 1) % roles.length;
    delay      = PAUSE_BEFORE_NEXT;
  }

  setTimeout(tick, delay);
}

if (typedEl) setTimeout(tick, TYPING_START_DELAY);

/* ============================================================
   3. Scroll-triggered Fade-in (IntersectionObserver)
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Honour inline transition-delay if set; otherwise stagger siblings
      const hasDelay = parseFloat(entry.target.style.transitionDelay || '0') > 0;
      setTimeout(() => entry.target.classList.add('visible'), hasDelay ? 0 : i * FADE_IN_STAGGER);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

/* ============================================================
   4. Navbar — Background on Scroll
   ============================================================ */
const mainNav = document.getElementById('mainNav');

function onScroll() {
  if (!mainNav) return;
  mainNav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ============================================================
   5. Active Nav Link Highlight on Scroll
   ============================================================ */
const navSections = document.querySelectorAll('section[id]');
const navLinks    = document.querySelectorAll('.navbar-nav .nav-link');

function updateActiveNav() {
  const scrollY    = window.scrollY;
  const navHeight  = mainNav ? mainNav.offsetHeight : 70;
  const threshold  = scrollY + navHeight + 20;

  let current = '';
  navSections.forEach(sec => {
    if (sec.offsetTop <= threshold) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ============================================================
   6. Smooth Scroll for Nav Links
   ============================================================ */
navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = (mainNav ? mainNav.offsetHeight : 70) + 8;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
      // Collapse Bootstrap mobile menu
      const bsNav    = document.getElementById('navbarNav');
      const instance = window.bootstrap && bootstrap.Collapse.getInstance(bsNav);
      if (instance) instance.hide();
    }
  });
});

/* ============================================================
   7. Scroll-indicator link
   ============================================================ */
const scrollCue = document.querySelector('.scroll-indicator');
if (scrollCue) {
  scrollCue.addEventListener('click', e => {
    e.preventDefault();
    const about = document.getElementById('about');
    if (about) {
      const offset = (mainNav ? mainNav.offsetHeight : 70) + 8;
      window.scrollTo({ top: about.offsetTop - offset, behavior: 'smooth' });
    }
  });
}
