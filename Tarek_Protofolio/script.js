const themeToggle = document.getElementById("themeToggle");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function setTheme(mode){
  const isLight = mode === "light";
  document.body.classList.toggle("light", isLight);
  localStorage.setItem("theme", mode);

  if (themeToggle) {
    themeToggle.innerHTML = isLight
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  }
}

const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const now = document.body.classList.contains("light") ? "dark" : "light";
    setTheme(now);
  });
}

/* Mobile Menu */
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    if (navLinks.style.display === "flex") {
      navLinks.style.display = "none";
    } else {
      navLinks.style.display = "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "74px";
      navLinks.style.right = "18px";
      navLinks.style.background = "rgba(8,15,30,.92)";
      navLinks.style.backdropFilter = "blur(18px)";
      navLinks.style.border = "1px solid rgba(255,255,255,.10)";
      navLinks.style.borderRadius = "18px";
      navLinks.style.padding = "12px";
      navLinks.style.width = "220px";
      navLinks.style.zIndex = "99";
    }
  });
}

/* Active Nav Link on Scroll */
const sections = ["home","about","skills","projects","experience","education","certificates","contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navA = [...document.querySelectorAll(".nav-link")];

function updateActiveNav(){
  const y = window.scrollY + 140;
  let current = "home";

  for (const s of sections){
    if (y >= s.offsetTop) current = s.id;
  }

  navA.forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

/* Back To Top */
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (backToTop) {
    backToTop.classList.toggle("show", window.scrollY > 500);
  }
});

if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
}

/* Carousel Helper */
function createCarousel(trackId, prevId, nextId, dotsId){
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const dots = document.getElementById(dotsId);

  if (!track || !prev || !next || !dots) return;

  const slides = [...track.children];
  if (!slides.length) return;

  let index = 0;

  dots.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.setAttribute("aria-label", `Go to ${i+1}`);
    d.addEventListener("click", () => go(i));
    dots.appendChild(d);
  });

  function update(){
    track.style.transform = `translateX(${-index * 100}%)`;
    [...dots.children].forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function go(i){
    index = (i + slides.length) % slides.length;
    update();
  }

  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));

  let startX = 0;
  track.addEventListener("touchstart", (e) => startX = e.touches[0].clientX, {passive:true});
  track.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  });

  update();
}

createCarousel("projTrack", "projPrev", "projNext", "projDots");
createCarousel("certTrack", "certPrev", "certNext", "certDots");

/* Particles Background */
const canvas = document.getElementById("particles");
const ctx = canvas ? canvas.getContext("2d") : null;

let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
let particles = [];

function resize(){
  if (!canvas || !ctx) return;

  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(DPR,0,0,DPR,0,0);

  const count = Math.floor((W * H) / 26000);
  particles = Array.from({length: count}, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: 1 + Math.random() * 1.4
  }));
}

function draw(){
  if (!canvas || !ctx) return;

  ctx.clearRect(0,0,W,H);

  const isLight = document.body.classList.contains("light");
  const dotColor = isLight ? "rgba(71,85,105,.20)" : "rgba(210,225,255,.22)";
  const lineBase = isLight ? [124,58,237] : [96,165,250];

  for (const p of particles){
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    if (p.y < -20) p.y = H + 20;
    if (p.y > H + 20) p.y = -20;
  }

  for (let i = 0; i < particles.length; i++){
    for (let j = i + 1; j < particles.length; j++){
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d2 = dx*dx + dy*dy;

      if (d2 < 110 * 110){
        const alpha = (1 - Math.sqrt(d2)/110) * 0.22;
        ctx.strokeStyle = `rgba(${lineBase[0]}, ${lineBase[1]}, ${lineBase[2]}, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  ctx.fillStyle = dotColor;
  for (const p of particles){
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

if (canvas && ctx) {
  window.addEventListener("resize", resize);
  resize();
  draw();
}