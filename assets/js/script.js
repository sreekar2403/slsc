(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const yearEl = document.getElementById('year');
  const faviconEl = document.getElementById('site-favicon');

  // Year in footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme persistence
  // Prefer system theme unless user has a preference saved
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem('slsc-theme');
  const initialLight = savedTheme ? savedTheme === 'light' : systemPrefersLight;
  if (initialLight) root.setAttribute('data-theme', 'light');
  themeToggle && (themeToggle.textContent = initialLight ? 'Dark' : 'Light');
  // Set favicon based on initial theme
  const setFavicon = (isLight) => {
    if (!faviconEl) return;
    faviconEl.href = isLight ? 'assets/media/light_theme_logo.png' : 'assets/media/dark_theme_logo.png';
  };
  setFavicon(initialLight);
  themeToggle?.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('slsc-theme', 'dark');
      themeToggle.textContent = 'Light';
      setFavicon(false);
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('slsc-theme', 'light');
      themeToggle.textContent = 'Dark';
      setFavicon(true);
    }
  });

  // React to system theme changes if user hasn't set a preference
  if (!savedTheme && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener?.('change', (e) => {
      if (e.matches) {
        root.setAttribute('data-theme', 'light');
        themeToggle && (themeToggle.textContent = 'Dark');
        setFavicon(true);
      } else {
        root.removeAttribute('data-theme');
        themeToggle && (themeToggle.textContent = 'Light');
        setFavicon(false);
      }
    });
  }

  // Mobile nav toggle
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList?.classList.toggle('open');
  });
  navList?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navList.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Count-up stats on hero when visible
  const counters = document.querySelectorAll('.stat .num');
  const animateCount = (el) => {
    const target = Number(el.getAttribute('data-count') || 0);
    const duration = 1000;
    const startTime = performance.now();
    const startVal = 0;
    const step = (now) => {
      const p = Math.min(1, (now - startTime) / duration);
      el.textContent = String(Math.floor(startVal + (target - startVal) * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        counters.forEach(animateCount);
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  counters[0] && obs.observe(counters[0]);

  // Lightbox for gallery
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('#lightbox .lightbox-content');
  const lightboxClose = document.querySelector('#lightbox .lightbox-close');

  const openLightbox = (node) => {
    if (!lightbox || !lightboxContent) return;
    lightboxContent.innerHTML = '';
    const type = node.getAttribute('data-type');
    const href = node.getAttribute('href');
    if (type === 'video') {
      const video = document.createElement('video');
      video.src = href;
      video.controls = true;
      video.autoplay = true;
      video.style.maxHeight = '82vh';
      lightboxContent.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = href;
      img.alt = 'Project media';
      lightboxContent.appendChild(img);
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxContent) lightboxContent.innerHTML = '';
  };
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(item);
    });
  });
})();

