// Consolidated site JS. Single DOMContentLoaded listener to avoid nested handlers.
document.addEventListener('DOMContentLoaded', function () {
	/* Mobile panel (hamburger) */
	const btn = document.getElementById('hamburgerBtn');
	const panel = document.getElementById('mobilePanel');
	const closeBtn = panel ? panel.querySelector('.close') : null;

	function openPanel() {
		if (!panel) return;
		panel.classList.add('open');
		document.body.classList.add('no-scroll');
		panel.setAttribute('aria-hidden', 'false');
	}

	function closePanel() {
		if (!panel) return;
		panel.classList.remove('open');
		document.body.classList.remove('no-scroll');
		panel.setAttribute('aria-hidden', 'true');
	}

	if (btn && panel) {
		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			if (panel.classList.contains('open')) closePanel();
			else openPanel();
		});
	}

	if (closeBtn) closeBtn.addEventListener('click', closePanel);

	if (panel) {
		panel.addEventListener('click', function (e) {
			if (e.target === panel) closePanel();
		});
	}

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
			closePanel();
		}
	});

	/* Slider buttons for cards */
	const track = document.getElementById('cardsTrack');
	const prev = document.getElementById('sliderPrev');
	const next = document.getElementById('sliderNext');
	if (track) {
		const getScrollAmount = () => Math.round(track.clientWidth * 0.8);
		if (next) next.addEventListener('click', () => track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }));
		if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }));
	}

	/* Panels reveal animation */
	const panels = document.querySelectorAll('.panel');
	if (panels.length) {
		const revealObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				const panelEl = entry.target;
				const reveals = panelEl.querySelectorAll('.reveal');
				if (entry.isIntersecting) {
					panelEl.classList.add('in-view');
					reveals.forEach((el, i) => el.style.transitionDelay = `${i * 90}ms`);
				} else {
					panelEl.classList.remove('in-view');
					reveals.forEach((el) => el.style.transitionDelay = '');
				}
			});
		}, { threshold: 0.45 });
		panels.forEach(p => revealObserver.observe(p));
	}

	/* Header shrink on scroll */
	const header = document.getElementById('header');
	if (header) {
		const onScroll = () => {
			if (window.scrollY > 100) header.classList.add('header-scrolled');
			else header.classList.remove('header-scrolled');
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
	}

	/* Hero cover (uses rAF for smooth transform) */
	const hero = document.getElementById('immagineRete');
	const cover = document.getElementById('immagineReteCover');
	let heroHeight = window.innerHeight;
	function updateHeaderHeight() {
		const h = header ? header.offsetHeight : 0;
		document.documentElement.style.setProperty('--header-height', h + 'px');
		if (hero) hero.style.removeProperty('height');
		heroHeight = hero ? hero.offsetHeight || window.innerHeight : window.innerHeight;
	}
	let ticking = false;
	function updateCover() {
		if (!hero || !cover) return;
		const rect = hero.getBoundingClientRect();
		const h = heroHeight || rect.height || window.innerHeight;
		const progress = Math.min(Math.max((-rect.top) / h, 0), 1);
		const translatePct = (1 - progress) * 100;
		cover.style.transform = `translateY(${translatePct}%)`;
	}
	window.addEventListener('resize', function () { updateHeaderHeight(); updateCover(); }, { passive: true });
	window.addEventListener('scroll', function () { if (!ticking) { window.requestAnimationFrame(function () { updateCover(); ticking = false; }); ticking = true; } }, { passive: true });
	updateHeaderHeight(); updateCover();

	/* FAQ: enhance native <details> behaviour if present */
	const faqItems = document.querySelectorAll('.faq-item');
	if (faqItems.length) {
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
			if (summary) summary.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') requestAnimationFrame(update); });
		});
	}

	/* Animated counters for `violenze` page */
	const counters = document.querySelectorAll('.stat-number');
	if (counters.length) {
		console.log('Animated counters: found', counters.length);
		const formatNumber = (n) => n.toLocaleString();

		const targets = Array.from(counters).map(c => parseInt(c.dataset.target, 10) || 0);
		let started = false;

		// Animate only numeric counters (chart removed)
		const animateItem = (el, target) => {
			const duration = 2500;
			const start = performance.now();
			const from = 0;
			const step = (now) => {
				const progress = Math.min((now - start) / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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
			// start all when any entry becomes visible
			const anyVisible = entries.some(en => en.isIntersecting);
			if (anyVisible) {
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


	// Chart animations removed per user request.

});

/* header expansion feature removed */


document.addEventListener('DOMContentLoaded', function () {
	const track = document.getElementById('cardsTrack');
	const prev = document.getElementById('sliderPrev');
	const next = document.getElementById('sliderNext');
	if (!track) return;

	const getScrollAmount = () => Math.round(track.clientWidth * 0.8);

	if (next) next.addEventListener('click', () => {
		track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
	});

	if (prev) prev.addEventListener('click', () => {
		track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
	});

	
});







document.addEventListener('DOMContentLoaded', () => {
  const panels = document.querySelectorAll('.panel');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const panel = entry.target;
      const reveals = panel.querySelectorAll('.reveal');

      if (entry.isIntersecting) {
        panel.classList.add('in-view');
        reveals.forEach((el, i) => {
          el.style.transitionDelay = `${i * 90}ms`;
        });
      } else {
        panel.classList.remove('in-view');
        reveals.forEach((el) => {
          el.style.transitionDelay = '';
        });
      }
    });
  }, { threshold: 0.45 });

  panels.forEach(p => observer.observe(p));
});



document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('header');
    if (!header) return;

    function onScroll() {
        if (window.scrollY > 100) header.classList.add('header-scrolled');
        else header.classList.remove('header-scrolled');
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
});

// Hero cover: make header height available to CSS and animate cover growth on scroll
document.addEventListener('DOMContentLoaded', function () {
	const header = document.getElementById('header');
	const hero = document.getElementById('immagineRete');
	const cover = document.getElementById('immagineReteCover');

	// Cache hero height to avoid measuring every frame. Recompute on resize.
	let heroHeight = window.innerHeight;

	function updateHeaderHeight() {
		const h = header ? header.offsetHeight : 0;
		document.documentElement.style.setProperty('--header-height', h + 'px');
		// Let CSS control the hero height; remove any inline height previously set by JS.
		if (hero) hero.style.removeProperty('height');
		// Update cached hero height
		heroHeight = hero ? hero.offsetHeight || window.innerHeight : window.innerHeight;
	}

	let ticking = false;
	function updateCover() {
		if (!hero || !cover) return;
		// read-only layout measurement
		const rect = hero.getBoundingClientRect();
		// Use cached heroHeight to avoid re-measuring height each frame when possible
		const h = heroHeight || rect.height || window.innerHeight;
		// progress 0..1 as hero scrolls out of view
		const progress = Math.min(Math.max((-rect.top) / h, 0), 1);
		// use transform (GPU) instead of changing height to avoid layout thrash
		const translatePct = (1 - progress) * 100; // 100% -> 0%
		cover.style.transform = `translateY(${translatePct}%)`;
	}

	window.addEventListener('resize', function () {
		updateHeaderHeight();
		// Also update once to keep cover in sync
		updateCover();
	}, { passive: true });

	window.addEventListener('scroll', function () {
		if (!ticking) {
			window.requestAnimationFrame(function () {
				updateCover();
				ticking = false;
			});
			ticking = true;
		}
	}, { passive: true });

	updateHeaderHeight();
	updateCover();
});

	// FAQ: sync +/− icon and aria-expanded with the <details> open state
	document.addEventListener('DOMContentLoaded', function () {
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

			// initialize
			update();

			// Listen for native toggle event on <details>
			details.addEventListener('toggle', update);

			// Improve keyboard interaction: open on Enter/Space when summary focused
			if (summary) {
				summary.addEventListener('keydown', (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						// default toggles, but ensure update after next tick
						requestAnimationFrame(update);
					}
				});
			}
		});
	});