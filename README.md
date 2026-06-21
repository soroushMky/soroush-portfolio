# Soroush Portfolio

## Folder Structure
```
soroush-portfolio/
├── index.html          ← Root redirect → html/index.html (open THIS file, or html/index.html directly)
├── html/                ← All page files
│   ├── index.html       ← Hero / Home page
│   ├── about.html       ← About Me page
│   ├── work.html        ← Work list page
│   ├── work-01.html     ← RUDSAK (Creative case study — full)
│   ├── work-02.html     ← Boutique TAG (placeholder)
│   ├── work-03.html     ← FinanceIQ (Data case study — full)
│   ├── work-04.html     ← Reno Viva (placeholder)
│   ├── work-05.html     ← CCubed (Data case study — full)
│   ├── work-06.html     ← Parto Ads (placeholder)
│   ├── hobbies.html     ← Photography / Hobbies page
│   └── contact.html     ← Contact page
├── css/                  ← All stylesheets
│   ├── style.css        ← Hero page styles
│   ├── about.css        ← About page styles
│   ├── work.css          ← Work list page styles
│   ├── project.css       ← Shared styles for all work-0X.html project pages
│   ├── hobbies.css        ← Hobbies page styles
│   └── contact.css       ← Contact page styles
├── js/                   ← All scripts
│   ├── main.js            ← Hero page logic (grain, GSAP, mode toggle, photo swap)
│   ├── about.js           ← About page logic
│   ├── work.js            ← Work list page logic (filter, preview, parallax)
│   ├── project.js         ← Shared logic for all work-0X.html pages (parallax, scroll reveals)
│   ├── hobbies.js         ← Hobbies page logic (lightbox)
│   ├── contact.js         ← Contact page logic (particle circles, form)
│   └── gsap.min.js        ← (optional local copy — currently loaded via CDN in all pages)
├── images/                ← Your photos go here
│   ├── hero-creative.png  ← Portrait shown in Creative mode
│   └── hero-data.png      ← Portrait shown in Data mode
├── resumes/                ← Resume PDFs
│   ├── resume-design.pdf
│   └── resume-data.pdf
└── README.md               ← This file
```

## How Paths Work
All HTML files live in `html/`, so every reference to CSS, JS, and images uses
`../` to step back up to the project root first:
- CSS: `../css/style.css`
- JS: `../js/main.js`
- Images: `../images/hero-creative.png`
- Resumes: `../resumes/resume-design.pdf`

Page-to-page links (e.g. `goTo('about.html')`) stay relative with no `../`
since all HTML pages live in the same `html/` folder together.

## To Open the Site
Double-click `index.html` at the project root — it automatically redirects to
`html/index.html`. Or open `html/index.html` directly.

## To Add Your Photos
1. Place `hero-creative.png` and `hero-data.png` inside `images/`
2. For hobbies/photography, create `images/hobbies/` and update the
   `data-img` / `src` paths in `html/hobbies.html`

## To Add Your Resumes
Place `resume-design.pdf` and `resume-data.pdf` inside `resumes/`

## Deploy
1. Upload the entire `soroush-portfolio/` folder to GitHub
2. Connect to Netlify → set publish directory to the project root
3. Netlify will serve `index.html` which redirects into `html/`
