document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initSlider();
  initPanels();
  initHeaderScroll();
  initHeroCover();
  initFAQ();
  initCounters();
});


function initHamburger() {
  const btn = document.getElementById('hamburgerBtn');
  const panel = document.getElementById('mobilePanel');
  const closeBtn = panel ? panel.querySelector('.close') : null;

  if (!panel || !btn) return;

  function openPanel() {
    panel.classList.add('open');
    document.body.classList.add('no-scroll');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closePanel() {
    panel.classList.remove('open');
    document.body.classList.remove('no-scroll');
    panel.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.contains('open') ? closePanel() : openPanel();
  });

  if (closeBtn) closeBtn.addEventListener('click', closePanel);

  panel.addEventListener('click', (e) => {
    if (e.target === panel) closePanel();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });
}


function initSlider() {
  const sliders = document.querySelectorAll('.cards-slider');
  if (!sliders.length) return;

  sliders.forEach(slider => {
    const track = slider.querySelector('.cards-track');
    const prev = slider.querySelector('.slider-btn.prev');
    const next = slider.querySelector('.slider-btn.next');
    if (!track) return;

    const getScrollAmount = () => Math.round(track.clientWidth * 0.8);

    if (next) next.addEventListener('click', () => {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    if (prev) prev.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  });
}


function initPanels() {
  const panels = document.querySelectorAll('.panel');
  if (!panels.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const panel = entry.target;
      const reveals = panel.querySelectorAll('.reveal');

      if (entry.isIntersecting) {
        panel.classList.add('in-view');
        reveals.forEach((el, i) => el.style.transitionDelay = `${i * 90}ms`);
      } else {
        panel.classList.remove('in-view');
        reveals.forEach(el => el.style.transitionDelay = '');
      }
    });
  }, { threshold: 0.2 });

  panels.forEach(p => observer.observe(p));
}


function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 100) header.classList.add('header-scrolled');
    else header.classList.remove('header-scrolled');
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}


function initHeroCover() {
  const header = document.getElementById('header');
  const hero = document.getElementById('immagineRete');
  const cover = document.getElementById('immagineReteCover');
  if (!hero || !cover) return;

  let heroHeight = window.innerHeight;

  function updateHeaderHeight() {
    const h = header ? header.offsetHeight : 0;
    document.documentElement.style.setProperty('--header-height', h + 'px');
    hero.style.removeProperty('height');
    heroHeight = hero.offsetHeight || window.innerHeight;
  }

  let ticking = false;
  function updateCover() {
    const rect = hero.getBoundingClientRect();
    const h = heroHeight || rect.height || window.innerHeight;
    const progress = Math.min(Math.max((-rect.top) / h, 0), 1);
    const translatePct = (1 - progress) * 100;
    cover.style.transform = `translateY(${translatePct}%)`;
  }

  window.addEventListener('resize', () => {
    updateHeaderHeight();
    updateCover();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateCover();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateHeaderHeight();
  updateCover();
}


function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(details => {
    const summary = details.querySelector('summary');
    const icon = summary ? summary.querySelector('.faq-icon') : null;

    const update = () => {
      const isOpen = details.hasAttribute('open');
      if (summary) summary.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (icon) icon.textContent = isOpen ? '−' : '+';
    };

    update();
    details.addEventListener('toggle', update);

    if (summary) {
      summary.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') requestAnimationFrame(update);
      });
    }
  });
}


function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const formatNumber = (n) => n.toLocaleString();
  const targets = Array.from(counters).map(c => parseInt(c.dataset.target, 10) || 0);
  let started = false;

  const animateItem = (el, target) => {
    const duration = 2500;
    const start = performance.now();
    const from = 0;

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(from + (target - from) * eased);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target);
    };
    requestAnimationFrame(step);
  };

  const startAll = () => {
    if (started) return;
    started = true;
    counters.forEach((c, i) => {
      const target = targets[i] || 0;
      c.textContent = '0';
      animateItem(c, target);
    });
  };

  const io = new IntersectionObserver((entries, obs) => {
    if (entries.some(en => en.isIntersecting)) {
      startAll();
      entries.forEach(en => obs.unobserve(en.target));
    }
  }, { threshold: 0.35 });

  const anyInViewport = Array.from(counters).some(c => {
    const rect = c.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  });

  if (anyInViewport) startAll();
  else counters.forEach(c => io.observe(c));
}


function downloadFile() {
  const link = document.createElement("a");
  link.href = "assets/materiali.txt";
  link.download = "materiali.txt";
  link.click();
}
