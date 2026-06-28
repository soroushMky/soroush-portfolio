/* ============================================================
   SOROUSH PORTFOLIO — work.js (list page)
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

document.addEventListener('click', (e) => {
  const link = e.target.closest('a.work-row');
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

/* ── 4. FILTER WORK LIST ── */
function filterWork(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });
  const items = document.querySelectorAll('.work-item');
  items.forEach(item => {
    const matches = category === 'all' || item.dataset.category === category;
    if (matches) {
      item.classList.remove('hidden');
      gsap.fromTo(item, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3 });
    } else {
      item.classList.add('hidden');
    }
  });
}

/* ── 5. FLOATING PREVIEW IMAGE (desktop only) ── */
const previewImg = document.getElementById('previewImg');
const workRows = document.querySelectorAll('.work-row');

if (previewImg && window.innerWidth > 1024) {
  workRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const img = row.dataset.img;
      previewImg.style.backgroundImage = `url(${img})`;
      previewImg.classList.add('active');
    });
    row.addEventListener('mousemove', (e) => {
      gsap.to(previewImg, { x: e.clientX, y: e.clientY, duration: .4, ease: 'power2.out' });
    });
    row.addEventListener('mouseleave', () => {
      previewImg.classList.remove('active');
    });
  });
}

/* ── 6. ENTRANCE ANIMATIONS ── */
gsap.set('nav',          { opacity: 0, y: -20 });
gsap.set('.work-header', { opacity: 0, y: 16 });
gsap.set('.work-row',    { opacity: 0, x: -16 });

const tl = gsap.timeline({ delay: .1 });
tl.to('nav',          { opacity: 1, y: 0, duration: .5, ease: 'power3.out' })
  .to('.work-header', { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, '-=.2')
  .to('.work-row',    { opacity: 1, x: 0, duration: .5, stagger: .08, ease: 'power3.out' }, '-=.3');

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

gsap.from('#app', { opacity: 0, duration: .5, ease: 'power2.out' });