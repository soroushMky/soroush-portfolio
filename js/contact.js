/* ============================================================
   SOROUSH PORTFOLIO — contact.js
   ============================================================ */

/* ── 0. CIRCLE PARTICLES AROUND FORM ── */
(function initParticleCircles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = [];

    // Center the particle field on the form (right side on desktop, full width on mobile)
    const isMobile = window.innerWidth <= 900;
    const cx = isMobile ? canvas.width * 0.5 : canvas.width * 0.74;
    const cy = canvas.height * 0.5;

    const fieldW = isMobile ? canvas.width * 0.9 : canvas.width * 0.42;
    const fieldH = canvas.height * 0.78;

    const count = isMobile ? 70 : 130;

    for (let i = 0; i < count; i++) {
      // Scatter within an ellipse around the form
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random();
      const x = cx + Math.cos(angle) * (fieldW / 2) * Math.sqrt(radius);
      const y = cy + Math.sin(angle) * (fieldH / 2) * Math.sqrt(radius);

      particles.push({
        baseX: x, baseY: y,
        x: x, y: y,
        vx: 0, vy: 0,
        size: Math.random() * 2.2 + 1,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.4 + 0.2
      });
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  const REPEL_RADIUS = 110;
  const REPEL_STRENGTH = 7;
  const RETURN_SPEED = 0.05;
  const FRICTION = 0.9;

  let t = 0;

  function animate() {
    t += 0.01;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(249, 115, 22, 0.45)';

    for (let p of particles) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * REPEL_STRENGTH;
        p.vy += Math.sin(angle) * force * REPEL_STRENGTH;
      }

      // Gentle ambient drift around base position
      const driftX = Math.sin(t * p.driftSpeed + p.driftPhase) * 4;
      const driftY = Math.cos(t * p.driftSpeed + p.driftPhase) * 4;

      p.vx += (p.baseX + driftX - p.x) * RETURN_SPEED;
      p.vy += (p.baseY + driftY - p.y) * RETURN_SPEED;

      p.vx *= FRICTION;
      p.vy *= FRICTION;

      p.x += p.vx;
      p.y += p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();
})();


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
      buf[i+3] = 16;
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

/* ── 4. FORM SUBMISSION ── */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitBtn = form.querySelector('.submit-btn');
  const submitText = submitBtn.querySelector('.submit-text');
  const originalText = submitText.textContent;

  submitBtn.disabled = true;
  submitText.textContent = 'Sending...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      submitText.textContent = 'Sent ✓';
      successMsg.classList.add('show');
      gsap.fromTo(successMsg, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .4 });
      form.reset();

      setTimeout(() => {
        submitText.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    submitText.textContent = 'Error — try again';
    submitBtn.disabled = false;
    setTimeout(() => { submitText.textContent = originalText; }, 3000);
  }
});

/* ── 5. ENTRANCE ANIMATIONS ── */
gsap.set('nav',              { opacity: 0, y: -20 });
gsap.set('.contact-eyebrow', { opacity: 0, y: 14 });
gsap.set('.contact-headline',{ opacity: 0, y: 24 });
gsap.set('.contact-text',    { opacity: 0, y: 14 });
gsap.set('.contact-direct',  { opacity: 0, y: 14 });
gsap.set('.social-link',     { opacity: 0, x: -12 });
gsap.set('.availability',    { opacity: 0 });
gsap.set('.form-group',      { opacity: 0, y: 16 });
gsap.set('.submit-btn',      { opacity: 0, y: 16 });

const tl = gsap.timeline({ delay: .1 });
tl.to('nav',               { opacity: 1, y: 0, duration: .5, ease: 'power3.out' })
  .to('.contact-eyebrow',  { opacity: 1, y: 0, duration: .55, ease: 'power3.out' }, '-=.2')
  .to('.contact-headline', { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.35')
  .to('.contact-text',     { opacity: 1, y: 0, duration: .55, ease: 'power3.out' }, '-=.4')
  .to('.contact-direct',   { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.3')
  .to('.social-link',      { opacity: 1, x: 0, duration: .45, stagger: .07, ease: 'power3.out' }, '-=.3')
  .to('.availability',     { opacity: 1, duration: .4 }, '-=.1')
  .to('.form-group',       { opacity: 1, y: 0, duration: .5, stagger: .08, ease: 'power3.out' }, '-=.6')
  .to('.submit-btn',       { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.2');

gsap.from('#app', { opacity: 0, duration: .5, ease: 'power2.out' });