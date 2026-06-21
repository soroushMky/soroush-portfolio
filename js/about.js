/* ============================================================
   SOROUSH PORTFOLIO — about.js
   Handles: grain, entrance animations, navigation, photo slider
   ============================================================ */

/* ── 1. SHIFTING GRAIN ── */
(function initGrain() {
  const canvas = document.getElementById('grain');
  const ctx    = canvas.getContext('2d');
  let   frame  = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawGrain() {
    const w = canvas.width;
    const h = canvas.height;
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


/* ── 3. ENTRANCE ANIMATIONS ── */
gsap.set('nav',       { opacity: 0, y: -20 });
gsap.set('#aLeft',    { opacity: 0, x: -30 });
gsap.set('#aCenter',  { opacity: 0, y: 20 });
gsap.set('#aRight',   { opacity: 0, x: 30 });
gsap.set('.tl-item',  { opacity: 0, x: 16 });

const tl = gsap.timeline({ delay: .1 });
tl.to('nav',      { opacity: 1, y: 0,  duration: .5, ease: 'power3.out' })
  .to('#aLeft',   { opacity: 1, x: 0,  duration: .7, ease: 'power3.out' }, '-=.2')
  .to('#aCenter', { opacity: 1, y: 0,  duration: .7, ease: 'power3.out' }, '-=.5')
  .to('#aRight',  { opacity: 1, x: 0,  duration: .7, ease: 'power3.out' }, '-=.5')
  .to('.tl-item', { opacity: 1, x: 0,  duration: .4, stagger: .1, ease: 'power2.out' }, '-=.3');

/* Fade in on load */
gsap.from('#app', { opacity: 0, duration: .5, ease: 'power2.out' });


/* ── 4. AUTO PHOTO SLIDER ── */
const photos = [
  { src: '../images/hero-creative.png', label: 'Creative' },
  { src: '../images/hero-data.png',     label: 'Data'     }
];
let photoIndex = 0;

function cyclePhoto() {
  const img = document.getElementById('about-img');
  const tag = document.getElementById('about-photo-tag');

  photoIndex = (photoIndex + 1) % photos.length;

  gsap.to(img, {
    opacity: 0, scale: .97, duration: .4, ease: 'power2.in',
    onComplete: () => {
      img.src = photos[photoIndex].src;
      tag.textContent = photos[photoIndex].label;
      gsap.to(img, { opacity: 1, scale: 1, duration: .5, ease: 'power2.out' });
    }
  });
}

// Start cycling after entrance animation finishes
setTimeout(() => {
  setInterval(cyclePhoto, 3500);
}, 2000);
