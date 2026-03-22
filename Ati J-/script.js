/* ===================================
   FLORES AMARILLAS — script.js
   Animaciones, interacciones y magia
   =================================== */

// ─── ESTADO GLOBAL ───────────────────
let currentScreen = 1;
const totalScreens = 4;

// ─── CURSOR PERSONALIZADO ─────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  setTimeout(() => {
    cursorTrail.style.left = e.clientX + 'px';
    cursorTrail.style.top  = e.clientY + 'px';
  }, 80);
});

document.querySelectorAll('button, .envelope, .reason-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
    cursor.style.opacity = '0.7';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
    cursor.style.opacity = '1';
  });
});

// ─── FONDO DE ESTRELLAS (Canvas) ─────
const canvasBg = document.getElementById('canvas-bg');
const ctxBg    = canvasBg.getContext('2d');
let stars      = [];

function resizeCanvas() {
  canvasBg.width  = window.innerWidth;
  canvasBg.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const count = Math.floor((canvasBg.width * canvasBg.height) / 6000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x:    Math.random() * canvasBg.width,
      y:    Math.random() * canvasBg.height,
      r:    Math.random() * 1.4 + 0.2,
      base: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      gold: Math.random() > 0.7,
    });
  }
}

function drawBg(time) {
  const w = canvasBg.width, h = canvasBg.height;
  // Gradiente fondo
  const grad = ctxBg.createRadialGradient(w/2, h*0.4, 0, w/2, h*0.4, w * 0.8);
  grad.addColorStop(0,   'rgba(30, 20, 0, 1)');
  grad.addColorStop(0.5, 'rgba(10, 7, 0, 1)');
  grad.addColorStop(1,   'rgba(4, 2, 6, 1)');
  ctxBg.fillStyle = grad;
  ctxBg.fillRect(0, 0, w, h);

  // Estrellas parpadeantes
  stars.forEach(s => {
    const blink = 0.3 + 0.7 * Math.abs(Math.sin(time * s.speed + s.base * Math.PI * 2));
    ctxBg.beginPath();
    ctxBg.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    if (s.gold) {
      ctxBg.fillStyle = `rgba(255, 220, 80, ${blink * 0.9})`;
    } else {
      ctxBg.fillStyle = `rgba(255, 245, 220, ${blink * 0.5})`;
    }
    ctxBg.fill();
  });
}

let lastTime = 0;
function animateBg(time) {
  drawBg(time * 0.001);
  requestAnimationFrame(animateBg);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(animateBg);

// ─── FLORES CAYENDO ─────────────────
const fallingDiv  = document.getElementById('fallingFlowers');
const petalEmojis = ['🌻', '🌼', '💛', '✨', '🌸', '⭐'];

function createPetal() {
  const el        = document.createElement('span');
  el.className    = 'petal';
  el.textContent  = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  const size      = 0.8 + Math.random() * 1.1;
  const duration  = 7 + Math.random() * 11;
  const delay     = Math.random() * 5;
  el.style.left            = Math.random() * 100 + 'vw';
  el.style.fontSize        = size + 'rem';
  el.style.animationDuration = duration + 's';
  el.style.animationDelay    = delay + 's';
  fallingDiv.appendChild(el);
  setTimeout(() => el.remove(), (duration + delay + 1) * 1000);
}

// Crear pétalos continuamente
for (let i = 0; i < 12; i++) setTimeout(createPetal, Math.random() * 4000);
setInterval(createPetal, 1500);

// ─── NAVEGACIÓN ENTRE PANTALLAS ─────
function goToScreen(num) {
  if (num === currentScreen) return;

  const old = document.getElementById('screen' + currentScreen);
  const next = document.getElementById('screen' + num);

  old.classList.remove('active');
  old.classList.add('exit');
  setTimeout(() => old.classList.remove('exit'), 700);

  setTimeout(() => {
    next.classList.add('active');
  }, 300);

  // Actualizar puntos nav
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i + 1 === num);
  });

  currentScreen = num;

  // Acciones al entrar a cada pantalla
  if (num === 2) initScreen2();
  if (num === 3) initScreen3();
  if (num === 4) initScreen4();
}

// ─── PANTALLA 2: SOBRE & CARTA ──────
const letterMessage = `Dicen que hoy es el día de las flores amarillas…
pero yo creo que cualquier día es bueno
cuando se trata de alguien especial.

No sé si esto cuenta como una flor,
pero al menos viene con una intención bonita:
sacarte una sonrisa.

Porque tienes algo que me gusta,
algo sencillo pero difícil de encontrar…
y es esa forma tuya de alegrar sin darte cuenta.

Así que hoy paso por aquí
a dejarte este pequeño detalle,
sin presión, sin etiquetas…
solo porque sí, porque me nace.

Y quién sabe…
tal vez algún día te lleve flores de verdad
🌻💛`;

let letterInterval = null;
let letterInitialized = false;

function initScreen2() {
  if (letterInitialized) return;
  letterInitialized = true;

  const envelope = document.getElementById('envelope');
  envelope.addEventListener('click', openEnvelope);
}

function openEnvelope() {
  const envelope        = document.getElementById('envelope');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const letter          = document.getElementById('letter');

  envelope.classList.add('open');
  envelope.style.transform = 'scale(1.1)';

  // Lanzar mini flores desde el sobre
  burstFlowers(
    envelope.getBoundingClientRect().left + 100,
    envelope.getBoundingClientRect().top  + 70
  );

  setTimeout(() => {
    envelopeWrapper.style.opacity   = '0';
    envelopeWrapper.style.transform = 'scale(0.8)';
    envelopeWrapper.style.transition = '0.4s ease';
    setTimeout(() => {
      envelopeWrapper.style.display = 'none';
      letter.classList.remove('hidden');
      typewriteText('letterText', letterMessage, 30);
    }, 400);
  }, 600);
}

function typewriteText(elementId, text, speed) {
  clearInterval(letterInterval);
  const el = document.getElementById(elementId);
  el.textContent = '';
  let i = 0;
  letterInterval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(letterInterval);
    }
  }, speed);
}

function replayLetter() {
  typewriteText('letterText', letterMessage, 30);
}

// Efecto de flores mini al abrir sobre
function burstFlowers(x, y) {
  const emojis = ['🌻', '💛', '🌼', '✨', '🌸'];
  for (let i = 0; i < 10; i++) {
    const el     = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${0.8 + Math.random() * 0.8}rem;
      pointer-events: none;
      z-index: 999;
      transition: all ${0.6 + Math.random() * 0.4}s ease;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      const angle  = (Math.random() * 360) * (Math.PI / 180);
      const dist   = 60 + Math.random() * 100;
      el.style.transform   = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0)`;
      el.style.opacity     = '0';
    });
    setTimeout(() => el.remove(), 1100);
  }
}

// ─── PANTALLA 3: RAZONES ─────────────
const reasons = [
  { emoji: '🌻', text: 'Tu sonrisa ilumina cualquier día gris' },
  { emoji: '💛', text: 'Eres tierna sin ni siquiera intentarlo' },
  { emoji: '🌼', text: 'Me haces reír como nadie más lo hace' },
  { emoji: '✨', text: 'Tienes magia en cada cosa que haces' },
  { emoji: '🌸', text: 'Tu presencia es mi lugar favorito' },
  { emoji: '⭐', text: 'Me inspiras a ser mejor cada día' },
  { emoji: '💫', text: 'Eres especial de formas que no caben en palabras' },
  { emoji: '🍀', text: 'Tenerte es mi mayor suerte' },
  { emoji: '🌷', text: 'Cada momento contigo vale todo' },
];

let screen3Initialized = false;

function initScreen3() {
  if (screen3Initialized) return;
  screen3Initialized = true;

  const grid = document.getElementById('reasonsGrid');
  reasons.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.innerHTML = `
      <div class="reason-shimmer"></div>
      <span class="reason-flower">${r.emoji}</span>
      <p class="reason-text">${r.text}</p>
    `;
    card.style.animationDelay = (i * 0.08) + 's';
    card.style.animation = 'fadeInUp 0.5s ease both';
    card.style.animationDelay = (i * 0.07) + 's';
    card.addEventListener('click', () => {
      card.classList.toggle('revealed');
      if (card.classList.contains('revealed')) {
        burstFlowers(
          card.getBoundingClientRect().left + 60,
          card.getBoundingClientRect().top  + 60
        );
      }
    });
    grid.appendChild(card);
  });
}

// ─── PANTALLA 4: FINAL & FUEGOS ──────
let screen4Initialized = false;

function initScreen4() {
  if (screen4Initialized) return;
  screen4Initialized = true;
  setTimeout(() => launchFireworks(), 500);
}

// Sistema de fuegos artificiales
const fwCanvas = document.getElementById('fireworks-canvas');
const fwCtx    = fwCanvas.getContext('2d');
let particles  = [];
let fwRunning  = false;

function resizeFw() {
  fwCanvas.width  = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
resizeFw();
window.addEventListener('resize', resizeFw);

class Particle {
  constructor(x, y, color) {
    this.x    = x;
    this.y    = y;
    this.vx   = (Math.random() - 0.5) * 8;
    this.vy   = (Math.random() - 0.5) * 8 - 2;
    this.alpha = 1;
    this.color = color;
    this.size  = Math.random() * 3 + 1;
    this.decay = Math.random() * 0.015 + 0.012;
    this.gravity = 0.12;
  }
  update() {
    this.x   += this.vx;
    this.y   += this.vy;
    this.vy  += this.gravity;
    this.vx  *= 0.98;
    this.alpha -= this.decay;
  }
  draw() {
    fwCtx.save();
    fwCtx.globalAlpha = Math.max(0, this.alpha);
    fwCtx.fillStyle   = this.color;
    fwCtx.beginPath();
    fwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  }
}

const fwColors = [
  '#f0d060', '#c9a227', '#fff176', '#ffca28',
  '#ffe082', '#ffd700', '#ff8f00', '#ffffff',
  '#e8c94a', '#ffb300',
];

function explode(x, y) {
  const color = fwColors[Math.floor(Math.random() * fwColors.length)];
  const count = 70 + Math.floor(Math.random() * 50);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
}

function animateFireworks() {
  if (!fwRunning) return;
  fwCtx.fillStyle = 'rgba(6, 4, 10, 0.18)';
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

  particles = particles.filter(p => p.alpha > 0);
  particles.forEach(p => { p.update(); p.draw(); });

  requestAnimationFrame(animateFireworks);
}

function launchFireworks() {
  if (!fwRunning) {
    fwRunning = true;
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    animateFireworks();
  }

  const bursts   = 5 + Math.floor(Math.random() * 4);
  const w        = fwCanvas.width;
  const h        = fwCanvas.height;

  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      const x = w * (0.15 + Math.random() * 0.7);
      const y = h * (0.1  + Math.random() * 0.55);
      explode(x, y);
    }, i * 220);
  }

  // Auto-relanzar una vez más después
  setTimeout(() => {
    if (fwRunning) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          explode(w * (0.2 + Math.random() * 0.6), h * (0.15 + Math.random() * 0.45));
        }, i * 300);
      }
    }
  }, 2200);
}

// Click en el corazón grande = explosión
document.getElementById('bigHeart').addEventListener('click', function() {
  const rect = this.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  explode(cx, cy);
  explode(cx - 40, cy - 30);
  explode(cx + 40, cy - 30);

  // Partículas emoji
  for (let i = 0; i < 8; i++) {
    burstFlowers(cx + (Math.random()-0.5)*60, cy + (Math.random()-0.5)*60);
  }
});

// ─── TECLAS DE FLECHA para navegar ───
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (currentScreen < totalScreens) goToScreen(currentScreen + 1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (currentScreen > 1) goToScreen(currentScreen - 1);
  }
});

// ─── SWIPE en móvil ──────────────────
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dy = touchStartY - e.changedTouches[0].clientY;
  const dx = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 50) {
    if (dy > 0 && currentScreen < totalScreens) goToScreen(currentScreen + 1);
    if (dy < 0 && currentScreen > 1)            goToScreen(currentScreen - 1);
  }
});

// ─── RIPPLE en botones ───────────────
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = this.querySelector('.btn-ripple');
    if (!ripple) return;
    const rect = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    ripple.style.width  = '0';
    ripple.style.height = '0';
    ripple.style.opacity = '0.4';
    requestAnimationFrame(() => {
      ripple.style.width  = '300px';
      ripple.style.height = '300px';
      ripple.style.opacity = '0';
    });
  });
});

// ─── MENSAJE EN CONSOLA (easter egg) ─
console.log('%c💛 Hecho con amor para Tí😊💛', 
  'color: #c9a227; font-size: 18px; font-family: serif; font-style: italic;');
console.log('%cEste código fue escrito pensando en ti.', 
  'color: #8a7340; font-size: 13px;');
