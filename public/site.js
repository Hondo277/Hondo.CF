const root = document.documentElement;
const toggle = document.querySelector('.motion-toggle');
const label = toggle.querySelector('.motion-label');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPreference = null;
try {
  const stored = localStorage.getItem('hondo-motion-preference');
  if (stored === 'paused' || stored === 'enabled') motionPreference = stored;
} catch {}

function applyMotion() {
  const paused = motionPreference === 'paused' || (motionPreference === null && reducedMotion.matches);
  root.classList.toggle('motion-paused', paused);
  root.classList.toggle('motion-enabled', !paused);
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.setAttribute('aria-label', paused ? 'Activer les animations' : 'Mettre les animations en pause');
  label.textContent = paused ? 'Animations en pause' : 'Animations actives';
  toggle.title = paused && reducedMotion.matches ? 'Mouvement réduit respecté. Vous pouvez activer les animations pour ce site.' : label.textContent;
}

toggle.addEventListener('click', () => {
  motionPreference = root.classList.contains('motion-paused') ? 'enabled' : 'paused';
  try { localStorage.setItem('hondo-motion-preference', motionPreference); } catch {}
  applyMotion();
});
reducedMotion.addEventListener('change', applyMotion);
applyMotion();
document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px 35px 0px' });

  document.querySelectorAll('.section-kicker, .intro-content, .interests, .section-heading, .project-card, .schedule-grid, .social-card, .closing-copy, .format-card, .page-lead > *, .about-story, .passion-card, .story-band-inner, .page-invitation, .contact-primary, .contact-row, .collab-layout, .faq-list, .studio-showcase, .story-columns, .feature-grid > article, .credit-card, .directory-project, .week-grid > article, .fox-playground, .rules-grid > article, .setup-inner').forEach((element) => {
    element.dataset.reveal = '';
    revealObserver.observe(element);
  });

  const links = [...document.querySelectorAll('.site-nav a')].filter((link) => link.pathname === '/' && link.hash);
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  if (document.body.dataset.page === 'home') {
    document.querySelectorAll('main > section[id]').forEach((section) => sectionObserver.observe(section));
  }
}

root.classList.add('motion-ready');
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
let scheduled = false;
function updateScroll() {
  const distance = root.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
  header.classList.toggle('is-scrolled', window.scrollY > 30);
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateScroll);
}, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();

const menuButton = document.querySelector('.mobile-menu-toggle');
const navigation = document.querySelector('.site-nav');
function closeMenu(restoreFocus = false) {
  if (menuButton.getAttribute('aria-expanded') !== 'true') return;
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});

const nextSlots = document.querySelectorAll('[data-next-slot]');
if (nextSlots.length) {
  import('./planning.js').then(({ nextSlot }) => {
    const updateSlot = () => {
      const slot = nextSlot();
      if (slot) nextSlots.forEach((element) => { element.textContent = slot.label; });
    };
    updateSlot();
    window.setInterval(() => { if (!document.hidden) updateSlot(); }, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) updateSlot(); });
  }).catch(() => { /* Le planning hebdomadaire reste visible sans le module. */ });
}

const foxDemo = document.querySelector('.fox-demo');
if (foxDemo) {
  const reactions = {
    wake: { command: '!reveille', message: 'Le terrier se réveille !' },
    coffee: { command: '!cafe', message: 'Une petite pause café dans le terrier.' },
    pet: { command: '!caresse', message: 'Une caresse pour le renard. Merci la meute !' },
  };
  const buttons = [...document.querySelectorAll('[data-fox-reaction]')];
  const code = document.querySelector('#fox-command');
  const feedback = document.querySelector('[data-copy-feedback]');
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const key = button.dataset.foxReaction;
      const reaction = reactions[key];
      foxDemo.dataset.reaction = key;
      foxDemo.querySelector('.fox-speech').textContent = reaction.message;
      code.textContent = reaction.command;
      feedback.textContent = '';
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    });
  }
  document.querySelector('[data-copy-command]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      feedback.textContent = `${code.textContent} copiée. Tu peux la coller dans le chat Twitch.`;
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      feedback.textContent = 'La commande est sélectionnée : copie-la avec le menu de ton appareil.';
    }
  });
}
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 821px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

const sceneTabs = [...document.querySelectorAll('.scene-selector [role="tab"]')];
function selectScene(selected, focus = false) {
  for (const tab of sceneTabs) {
    const active = selected === tab;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  }
  if (focus) selected.focus();
}
sceneTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectScene(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % sceneTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + sceneTabs.length) % sceneTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = sceneTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectScene(sceneTabs[next], true);
  });
});

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.project-card, .social-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (root.classList.contains('motion-paused')) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    });
  });
}
