/* ============================================================
   SOROUSH PORTFOLIO — project.js
   Shared logic for all individual project pages
   ============================================================ */

/* ── 1. SHIFTING GRAIN ── */
(function initGrain() {
  const canvas = document.getElementById('grain');
  const ctx    = canvas.getContext('2d');
  let   frame  = 0;
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  function drawGrain() {
    const w = canvas.width, h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const buf = imageData.data;
    const seed = frame * 13337;
    for (let i = 0; i < buf.length; i += 4) {
      const r = (Math.sin(i + seed) * 43758.5453) % 1;
      const v = Math.abs(r) * 255;
      buf[i] = buf[i+1] = buf[i+2] = v;
      buf[i+3] = 13;
    }
    ctx.putImageData(imageData, 0, 0);
    frame++;
    requestAnimationFrame(drawGrain);
  }
  drawGrain();
})();

/* ── 2. PAGE NAVIGATION WITH FADE ── */
function goTo(page) {
  gsap.to('#app', {
    opacity: 0, duration: .4, ease: 'power2.in',
    onComplete: () => { window.location.href = page; }
  });
}
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-transition]');
  if (link && link.href) {
    e.preventDefault();
    gsap.to('#app', {
      opacity: 0, duration: .4, ease: 'power2.in',
      onComplete: () => { window.location.href = link.href; }
    });
  }
});

/* ── 3. MOBILE MENU ── */
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileNav');
  h.classList.toggle('open');
  m.classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileNav');
  if (!h || !m) return;
  if (!h.contains(e.target) && !m.contains(e.target)) {
    h.classList.remove('open'); m.classList.remove('open');
  }
});

/* ── 4. SCROLL-TRIGGERED REVEAL ANIMATIONS ── */
function initScrollReveals() {
  const targets = document.querySelectorAll(
    '.project-section, .project-image-block, .gallery-grid, .results-grid, ' +
    '.code-block, .chart-placeholder, .tech-stack-row, .learnings-list, .project-nav'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1, y: 0, duration: .6, ease: 'power2.out'
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

  targets.forEach(el => {
    gsap.set(el, { opacity: 0, y: 14 });
    observer.observe(el);
  });
}

/* ── 5. HERO ENTRANCE ── */
function initHeroEntrance() {
  gsap.set('nav',               { opacity: 0, y: -20 });
  gsap.set('.back-link',        { opacity: 0, x: -10 });
  gsap.set('.project-eyebrow',  { opacity: 0, y: 10 });
  gsap.set('.project-title',    { opacity: 0, y: 10 });
  gsap.set('.project-subtitle', { opacity: 0, y: 10 });
  gsap.set('.project-meta-bar', { opacity: 0, y: 10 });
  gsap.set('.project-hero-img', { opacity: 0, y: 16, scale: .98 });

  const tl = gsap.timeline({ delay: .1 });
  tl.to('nav',               { opacity: 1, y: 0, duration: .5, ease: 'power3.out' })
    .to('.back-link',        { opacity: 1, x: 0, duration: .5, ease: 'power3.out' }, '-=.2')
    .to('.project-eyebrow',  { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.2')
    .to('.project-title',   { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, '-=.3')
    .to('.project-subtitle',{ opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.25')
    .to('.project-meta-bar',{ opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.2')
    .to('.project-hero-img',{ opacity: 1, y: 0, scale: 1, duration: .7, ease: 'power3.out' }, '-=.2');
}

/* ── 6. PARALLAX BACKGROUND (mouse + scroll) ── */
function initParallax() {
  if (window.innerWidth <= 1024) return;
  const grid = document.querySelector('.grid');
  const grain = document.getElementById('grain');
  if (!grid) return;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateParallax() {
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    const scrollY = window.scrollY || 0;
    const scrollOffset = scrollY * 0.04;

    gsap.set(grid, {
      x: targetX * 14,
      y: targetY * 14 - scrollOffset * 0.3,
    });

    if (grain) {
      gsap.set(grain, {
        x: targetX * 6,
        y: targetY * 6,
      });
    }

    requestAnimationFrame(animateParallax);
  }
  animateParallax();
}

initHeroEntrance();
initScrollReveals();
initParallax();
gsap.from('#app', { opacity: 0, duration: .5, ease: 'power2.out' });