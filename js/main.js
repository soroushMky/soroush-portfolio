/* ============================================================
   SOROUSH PORTFOLIO — main.js
   Handles: grain animation, GSAP entrance, mode toggle
   Requires: gsap.min.js loaded before this file
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
      buf[i]     = v;
      buf[i + 1] = v;
      buf[i + 2] = v;
      buf[i + 3] = 18;
    }
    ctx.putImageData(imageData, 0, 0);
    frame++;
    requestAnimationFrame(drawGrain);
  }
  drawGrain();
})();


/* ── 2. PORTRAIT IMAGES ── */
const portraits = {
  creative: '../images/hero-creative.png',
  data:     '../images/hero-data.png'
};


/* ── 3. CONTENT DATA ── */
const content = {
  creative: {
    left: [
      {
        label: 'Expertise',
        html: `<span>UI/UX Design</span>
               <span>Motion Design</span>
               <span>Web Design</span>`
      },
      {
        label: 'Based In',
        html: `<span>Canada</span>`
      },
      {
        label: 'Skills',
        grid: true,
        cells: [
          { cat: 'Design',   val: 'Figma · Adobe Suite · Webflow' },
          { cat: 'Code',     val: 'HTML · CSS · JS · WordPress · Elementor' },
          { cat: 'Motion',   val: 'After Effects · Premiere' },
          { cat: 'Strategy', val: 'Brand Systems · UX Research' },
        ]
      }
    ],
    right: [
      {
        label: 'Speciality',
        html: `<span>Product Design</span>
               <span>Brand Systems</span>
               <span>Design Leadership</span>
               <span>Motion & Visual</span>`
      },
      {
        label: 'Experience',
        html: `<span>UI/UX — 6 Years</span>
               <span>Graphic Art — 2 Years</span>
               <span>Web Design — 4 Years</span>`
      },
      {
        label: 'Projects Done',
        html: `<span>10+ Completed</span>`
      }
    ]
  },

  data: {
    left: [
      {
        label: 'Expertise',
        html: `<span>Data Analytics</span>
               <span>Business Intelligence</span>
               <span>Machine Learning</span>`
      },
      {
        label: 'Based In',
        html: `<span>Canada</span>`
      },
      {
        label: 'Skills',
        grid: true,
        cells: [
          { cat: 'Languages',  val: 'Python · SQL · R' },
          { cat: 'Analytics',  val: 'Tableau · Power BI · Excel' },
          { cat: 'AI & ML',    val: 'Scikit-learn · Isolation Forest' },
          { cat: 'Tools',      val: 'Claude API · Flask · SQLite' },
        ]
      }
    ],
    right: [
      {
        label: 'Speciality',
        html: `<span>Data Storytelling</span>
               <span>Dashboard Design</span>
               <span>Predictive Models</span>
               <span>BI Reporting</span>`
      },
      {
        label: 'Experience',
        html: `<span>Data Analytics — 1 Year</span>
               <span>MEng — Concordia Univ.</span>
               <span>Electrical & CS Eng.</span>`
      },
      {
        label: 'Projects Done',
        html: `<span>3+ Completed</span>`
      }
    ]
  }
};


/* ── 4. RENDER CONTENT ── */
function renderSide(sideEl, cards) {
  const divs = sideEl.querySelectorAll(':scope > div');
  cards.forEach((card, i) => {
    if (!divs[i]) return;

    divs[i].querySelector('.info-label').textContent = card.label;

    // Wipe previous content
    const oldVal  = divs[i].querySelector('.info-value');
    const oldGrid = divs[i].querySelector('.skills-grid');
    if (oldVal)  oldVal.remove();
    if (oldGrid) oldGrid.remove();

    if (card.grid) {
      const gridEl = document.createElement('div');
      gridEl.className = 'skills-grid';
      gridEl.innerHTML = card.cells.map(c => `
        <div class="skill-cell">
          <span class="skill-cat">${c.cat}</span>
          <span class="skill-val">${c.val}</span>
        </div>`).join('');
      divs[i].appendChild(gridEl);
    } else {
      const valEl = document.createElement('div');
      valEl.className = 'info-value';
      valEl.innerHTML = card.html;
      divs[i].appendChild(valEl);
    }
  });
}


/* ── 5. MODE TOGGLE ── */
let mode = 'creative';

function setMode(m) {
  if (mode === m) return;
  mode = m;

  const infoL = document.getElementById('infoL');
  const infoR = document.getElementById('infoR');
  const textRingText = document.querySelector('#textRing textPath');
  const img = document.getElementById('portrait-img');

  document.body.classList.toggle('data', m === 'data');
  document.getElementById('btnC').className = 'm-btn' + (m === 'creative' ? ' on-creative' : '');
  document.getElementById('btnD').className = 'm-btn' + (m === 'data'     ? ' on-data'     : '');

  // Update text ring wording (static, no longer rotates)
  if (textRingText) {
    textRingText.textContent = m === 'creative'
      ? 'SOROUSH · PRODUCT DESIGNER · WEB DEVELOPER · DATA ANALYST · SOROUSH · PRODUCT DESIGNER · WEB DEVELOPER · DATA ANALYST ·'
      : 'SOROUSH · DATA ANALYST · PYTHON · SQL · TABLEAU · ML · SOROUSH · DATA ANALYST · PYTHON · SQL · TABLEAU · ML ·';
  }

  // Swap portrait with crossfade
  gsap.to(img, {
    opacity: 0, duration: .2,
    onComplete: () => {
      img.src = portraits[m];
      gsap.to(img, { opacity: 1, duration: .35, ease: 'power2.out' });
    }
  });

  // Fade only info cards — bottom title stays fixed
  gsap.to([infoL, infoR], {
    opacity: 0, y: 8, duration: .2,
    onComplete: () => {
      renderSide(infoL, content[m].left);
      renderSide(infoR, content[m].right);
      gsap.to([infoL, infoR], {
        opacity: 1, y: 0, duration: .4, ease: 'power2.out'
      });
    }
  });

  // Update mobile info strip
  updateMobileStrip(m);
}


/* ── 6. GSAP ENTRANCE ANIMATION ── */
gsap.set('nav',                    { opacity: 0, y: -20 });
gsap.set('.oval-ring-outer',       { opacity: 0, scale: .88, transformOrigin: '50% 50%' });
gsap.set('.oval-ring',             { opacity: 0, scale: .92, transformOrigin: '50% 50%' });
gsap.set('#textRing',              { opacity: 0 });
gsap.set('#portrait',              { opacity: 0, scale: .9,  transformOrigin: '50% 50%' });
gsap.set('#infoL > div',           { opacity: 0, x: -28 });
gsap.set('#infoR > div',           { opacity: 0, x:  28 });
gsap.set('.hero-bottom',           { opacity: 0, y: 18 });
gsap.set('.resume-buttons',        { opacity: 0, y: 10 });
gsap.set(['.scroll-cue', '.mode-toggle', '.accent-dot'], { opacity: 0 });

const tl = gsap.timeline({ delay: .2 });
tl.to('nav',              { opacity: 1, y: 0,    duration: .6,  ease: 'power3.out' })
  .to('.oval-ring-outer', { opacity: 1, scale: 1, duration: .9,  ease: 'power3.out' }, '-=.7')
  .to('.oval-ring',       { opacity: 1, scale: 1, duration: .8,  ease: 'power3.out' }, '-=.7')
  .to('#textRing',        { opacity: 1,            duration: .8,  ease: 'power2.out' }, '-=.6')
  .to('#portrait',        { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }, '-=.65')
  .to('#infoL > div',     { opacity: 1, x: 0,    duration: .55, stagger: .12, ease: 'power3.out' }, '-=.6')
  .to('#infoR > div',     { opacity: 1, x: 0,    duration: .55, stagger: .12, ease: 'power3.out' }, '-=.65')
  .to('.hero-bottom',     { opacity: 1, y: 0,    duration: .55, ease: 'power3.out' }, '-=.4')
  .to('.resume-buttons',  { opacity: 1, y: 0,    duration: .45, ease: 'power3.out' }, '-=.2')
  .to(['.scroll-cue', '.mode-toggle', '.accent-dot'], { opacity: 1, duration: .4 }, '-=.3');


/* ── 7. PAGE NAVIGATION WITH FADE ── */
function goTo(page) {
  gsap.to('#app', {
    opacity: 0, duration: .4, ease: 'power2.in',
    onComplete: () => { window.location.href = page; }
  });
}

/* ── 8. MOBILE INFO STRIP ── */
const mobileData = {
  creative: {
    expertise:  'UI/UX · Motion · Web',
    experience: '6 Yrs UI/UX',
    speciality: 'Product · Brand · Motion',
    projects:   '10+ Done'
  },
  data: {
    expertise:  'Analytics · ML · BI',
    experience: 'MEng Concordia',
    speciality: 'Dashboards · Models',
    projects:   '3+ Done'
  }
};

function updateMobileStrip(m) {
  const strip = document.getElementById('mobileStrip');
  if (!strip) return;
  const d = mobileData[m];
  document.getElementById('m-expertise').textContent  = d.expertise;
  document.getElementById('m-experience').textContent = d.experience;
  document.getElementById('m-speciality').textContent = d.speciality;
  document.getElementById('m-projects').textContent   = d.projects;
}

// Show strip on mobile only
function checkMobile() {
  const strip = document.getElementById('mobileStrip');
  if (!strip) return;
  if (window.innerWidth <= 768) {
    strip.style.display = 'flex';
  } else {
    strip.style.display = 'none';
  }
}
checkMobile();
window.addEventListener('resize', checkMobile);