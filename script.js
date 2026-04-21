// ── LOADER ──────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');
  const counter = document.getElementById('loader-counter');
  const name = document.getElementById('loader-name');

  // Animate name in
  gsap.to(name, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          onComplete: () => { loader.style.display = 'none'; initAnimations(); }
        });
      }, 300);
    }
    bar.style.width = progress + '%';
    counter.textContent = String(Math.floor(progress)).padStart(3, '0');
  }, 60);
});

// ── CUSTOM CURSOR ──────────────────────────────
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;

const isMobile = () => window.innerWidth <= 768;

document.addEventListener('mousemove', (e) => {
  if (isMobile()) return;
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

document.querySelectorAll('a, button, .project-item, .gallery-item, .skill-tag, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

document.addEventListener('mousedown', () => cursor.classList.add('click'));
document.addEventListener('mouseup', () => cursor.classList.remove('click'));

// ── INIT GSAP ANIMATIONS ──────────────────────
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero title lines
  gsap.from('.title-line', {
    yPercent: 110,
    stagger: 0.12,
    duration: 1,
    ease: 'power4.out',
  });

  // Reveal elements on scroll
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Stats counter animation
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.floor(this.targets()[0].val) + '+'; }
        });
      }
    });
  });

  // Gallery items stagger
  gsap.from('.gallery-item', {
    opacity: 0,
    y: 40,
    stagger: 0.08,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#galleryGrid',
      start: 'top 80%'
    }
  });

  // Navbar background
  ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => {
      const nav = document.getElementById('navbar');
      nav.style.boxShadow = self.progress > 0 ? '0 4px 40px rgba(0,0,0,0.06)' : 'none';
    }
  });
}

// ── GALLERY FILTER ────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      gsap.to(item, { opacity: show ? 1 : 0.2, scale: show ? 1 : 0.97, duration: 0.3 });
    });
  });
});

// ── PROJECT HOVER IMAGE ───────────────────────
const hoverImg = document.getElementById('proj-hover-img');
const hoverSrc = document.getElementById('proj-hover-src');

document.querySelectorAll('.project-item[data-img]').forEach(item => {
  item.addEventListener('mouseenter', () => {
    hoverSrc.src = item.dataset.img;
    hoverImg.classList.add('visible');
  });
  item.addEventListener('mouseleave', () => {
    hoverImg.classList.remove('visible');
  });
  item.addEventListener('mousemove', (e) => {
    const x = e.clientX + 24;
    const y = e.clientY - 90;
    hoverImg.style.left = x + 'px';
    hoverImg.style.top = y + 'px';
  });
});

// ── GITHUB API ────────────────────────────────
async function fetchGitHub() {
  try {
    const res = await fetch('https://api.github.com/users/Alibakhsn');
    if (res.ok) {
      const data = await res.json();
      if (data.public_repos) document.getElementById('ghRepos').textContent = data.public_repos;
      if (data.followers) document.getElementById('ghFollowers').textContent = data.followers;
    }
  } catch (e) {
    document.getElementById('ghRepos').textContent = '30+';
    document.getElementById('ghStars').textContent = '120+';
    document.getElementById('ghFollowers').textContent = '80+';
  }
}
fetchGitHub();

// ── CONTRIBUTION GRID GENERATOR ───────────────
function generateContribGrid() {
  const grid = document.getElementById('contribGrid');
  const weeks = 30;
  const days = 7;
  const levels = ['', 'l1', 'l2', 'l3', 'l4'];
  let html = '<div class="contrib-title">Contribution Activity — 2024</div>';
  for (let d = 0; d < days; d++) {
    html += '<div class="contrib-row">';
    for (let w = 0; w < weeks; w++) {
      const rand = Math.random();
      let level = '';
      if (rand > 0.6) level = 'l1';
      if (rand > 0.75) level = 'l2';
      if (rand > 0.88) level = 'l3';
      if (rand > 0.95) level = 'l4';
      html += `<div class="contrib-cell ${level}"></div>`;
    }
    html += '</div>';
  }
  grid.innerHTML = html;
}
generateContribGrid();

// ── FORM ──────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.innerHTML = '<span>Sending...</span>';
  setTimeout(() => {
    btn.innerHTML = '<span>Sent ✓</span>';
    document.getElementById('form-success').style.display = 'block';
    e.target.reset();
    setTimeout(() => { btn.innerHTML = '<span>Send Message →</span>'; }, 3000);
  }, 1200);
}

// ── MOBILE MENU ───────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ── SMOOTH SCROLL for nav links ───────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    }
  });
});