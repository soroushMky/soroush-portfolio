/* ============================================================
   SOROUSH PORTFOLIO — hobbies.js
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
      buf[i+3] = 15;
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

/* ── 4. LIGHTBOX ── */
const photoItems = Array.from(document.querySelectorAll('.photo-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = photoItems[index].dataset.img;
  lightbox.classList.add('open');
  gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: .3 });
  gsap.fromTo(lightboxImg, { scale: .92, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: 'power2.out' });
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  gsap.to(lightbox, {
    opacity: 0, duration: .25,
    onComplete: () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

function navigateLightbox(dir) {
  currentIndex = (currentIndex + dir + photoItems.length) % photoItems.length;
  gsap.to(lightboxImg, {
    opacity: 0, duration: .15,
    onComplete: () => {
      lightboxImg.src = photoItems[currentIndex].dataset.img;
      gsap.to(lightboxImg, { opacity: 1, duration: .3 });
    }
  });
}

photoItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ── 4.5 SCROLL-TRIGGERED REVEAL FOR HOBBY SECTIONS ── */
function initHobbySectionReveals() {
  const sections = document.querySelectorAll('.hobby-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('.hobby-img-wrap');
        const text = entry.target.querySelectorAll('.hobby-num, .hobby-tag, .hobby-title, .hobby-desc');
        gsap.to(img, { opacity: 1, scale: 1, duration: .8, ease: 'power3.out' });
        gsap.to(text, { opacity: 1, y: 0, duration: .6, stagger: .08, ease: 'power3.out', delay: .1 });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    const img = section.querySelector('.hobby-img-wrap');
    const text = section.querySelectorAll('.hobby-num, .hobby-tag, .hobby-title, .hobby-desc');
    gsap.set(img, { opacity: 0, scale: .96 });
    gsap.set(text, { opacity: 0, y: 16 });
    observer.observe(section);
  });
}
initHobbySectionReveals();

/* ── 5. ENTRANCE ANIMATIONS ── */
gsap.set('nav',             { opacity: 0, y: -20 });
gsap.set('.editorial-tag',  { opacity: 0, y: 14 });
gsap.set('.editorial-title',{ opacity: 0, y: 26 });
gsap.set('.editorial-text', { opacity: 0, y: 14 });
gsap.set('.editorial-tags', { opacity: 0, y: 12 });
gsap.set('.collage-img',    { opacity: 0, scale: .9 });
gsap.set('.hobbies-eyebrow',{ opacity: 0, y: 14 });
gsap.set('.hobbies-title',  { opacity: 0, y: 22 });
gsap.set('.hobbies-subtitle',{ opacity: 0, y: 14 });
gsap.set('.photo-item',     { opacity: 0, y: 24 });

const tl = gsap.timeline({ delay: .1 });
tl.to('nav',               { opacity: 1, y: 0, duration: .5, ease: 'power3.out' })
  .to('.editorial-tag',    { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.2')
  .to('.editorial-title',  { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=.3')
  .to('.editorial-text',   { opacity: 1, y: 0, duration: .55, ease: 'power3.out' }, '-=.45')
  .to('.editorial-tags',   { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.35')
  .to('.collage-img',      { opacity: 1, scale: 1, duration: .6, stagger: .1, ease: 'power3.out' }, '-=.6')
  .to('.hobbies-eyebrow',  { opacity: 1, y: 0, duration: .55, ease: 'power3.out' }, '-=.2')
  .to('.hobbies-title',    { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.35')
  .to('.hobbies-subtitle', { opacity: 1, y: 0, duration: .55, ease: 'power3.out' }, '-=.4')
  .to('.photo-item',       { opacity: 1, y: 0, duration: .6, stagger: .07, ease: 'power3.out' }, '-=.3');

/* ── PARALLAX BACKGROUND (mouse + scroll) ── */
function initParallax() {
  if (window.innerWidth <= 1024) return;
  const grid = document.querySelector('.grid');
  const grain = document.getElementById('grain');
  const scrollEl = document.querySelector('.page-scroll');
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

    const scrollY = scrollEl ? scrollEl.scrollTop : 0;
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
initParallax();

gsap.to('.editorial-glow', {
  x: 40, y: 30,
  duration: 8, ease: 'sine.inOut',
  yoyo: true, repeat: -1
});

gsap.from('#app', { opacity: 0, duration: .5, ease: 'power2.out' });