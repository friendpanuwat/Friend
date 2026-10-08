import * as THREE from 'three';
import { canvasTex, grime, speckle, rng, lerp } from './util.js';

export function asphaltTex() {
  const r = rng(101);
  return canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#26282a'; g.fillRect(0, 0, w, h);
    speckle(g, w, h, r, 40000, 'rgba(255,255,255,0.05)', 1.6);
    speckle(g, w, h, r, 30000, 'rgba(0,0,0,0.25)', 1.8);
    grime(g, w, h, r, 40, 'rgba(0,0,0,A)', 0.35, [30, 140]);
    grime(g, w, h, r, 20, 'rgba(70,80,60,A)', 0.2, [40, 160]);
    g.strokeStyle = 'rgba(10,10,10,0.8)'; g.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      let x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 10; k++) { x += (r() - .5) * 60; y += (r() - .5) * 60; g.lineTo(x, y); }
      g.stroke();
    }
  }, { repeat: [12, 2] });
}

export function concreteTex() {
  const r = rng(202);
  return canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#5b5d58'; g.fillRect(0, 0, w, h);
    speckle(g, w, h, r, 30000, 'rgba(255,255,255,0.06)', 1.5);
    grime(g, w, h, r, 60, 'rgba(0,0,0,A)', 0.25, [20, 120]);
    grime(g, w, h, r, 12, 'rgba(0,0,0,A)', 0.45, [10, 40]); // gum / stains
    g.strokeStyle = 'rgba(20,20,20,0.85)'; g.lineWidth = 5;
    for (let x = 0; x <= w; x += w / 4) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  }, { repeat: [30, 1] });
}

const TAGS = ['NR', 'MILO', 'KAT', 'OWL', 'ZEK', '2AM', 'B4', 'NITE', 'SK8', 'RUN'];
const SPRAY = ['#e33b3b', '#ffffff', '#3ad16b', '#f2d43a', '#2e8fe6', '#ff5fd2', '#111111'];
export function graffiti(g, w, h, r, n, y0 = 0.5, y1 = 1.0) {
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = lerp(y0, y1, r()) * h, s = 30 + r() * 70;
    g.save(); g.translate(x, y); g.rotate((r() - .5) * 0.5);
    g.font = `${s}px "Permanent Marker"`;
    const t = TAGS[Math.floor(r() * TAGS.length)];
    g.lineWidth = s * 0.12; g.strokeStyle = SPRAY[Math.floor(r() * SPRAY.length)];
    g.fillStyle = SPRAY[Math.floor(r() * SPRAY.length)];
    g.globalAlpha = 0.65 + r() * 0.3;
    if (r() < 0.5) g.strokeText(t, 0, 0);
    g.fillText(t, 0, 0);
    // drips
    g.fillRect(s * 0.2, 0, 2, s * r() * 0.6);
    g.restore();
  }
  g.globalAlpha = 1;
}

export function facadeTex() {
  const r = rng(303);
  return canvasTex(2048, 1024, (g, w, h) => {
    g.fillStyle = '#7f9788'; g.fillRect(0, 0, w, h);
    grime(g, w, h, r, 200, 'rgba(0,0,0,A)', 0.25, [20, 160]);
    // grime streaks from top
    g.globalAlpha = 0.25;
    for (let i = 0; i < 60; i++) { const x = r() * w; g.fillStyle = '#1a1a14'; g.fillRect(x, 0, 2 + r() * 8, h * (0.1 + r() * 0.4)); }
    g.globalAlpha = 1;
    // bottom dirt band
    const gr = g.createLinearGradient(0, h * 0.75, 0, h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(10,10,6,0.7)');
    g.fillStyle = gr; g.fillRect(0, h * 0.75, w, h * 0.25);
    graffiti(g, w, h, r, 24, 0.72, 0.98);
    speckle(g, w, h, r, 20000, 'rgba(0,0,0,0.12)', 2);
  });
}

export function brickTex(base = '#5a2e26', seed = 7) {
  const r = rng(seed);
  return canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#2a2420'; g.fillRect(0, 0, w, h);
    const bw = 64, bh = 26;
    for (let y = 0, row = 0; y < h; y += bh, row++) for (let x = (row % 2) * -bw / 2; x < w; x += bw) {
      const c = new THREE.Color(base).offsetHSL(0, (r() - .5) * 0.1, (r() - .5) * 0.08);
      g.fillStyle = '#' + c.getHexString(); g.fillRect(x + 2, y + 2, bw - 4, bh - 4);
    }
    grime(g, w, h, r, 100, 'rgba(0,0,0,A)', 0.35, [30, 180]);
    graffiti(g, w, h, r, 10, 0.8, 1.0);
  }, { repeat: [4, 2] });
}

export function shutterTex() {
  const r = rng(404);
  return canvasTex(1024, 1024, (g, w, h) => {
    for (let y = 0; y < h; y += 16) {
      const gr = g.createLinearGradient(0, y, 0, y + 16);
      gr.addColorStop(0, '#8d9292'); gr.addColorStop(0.5, '#5c6060'); gr.addColorStop(1, '#3a3d3d');
      g.fillStyle = gr; g.fillRect(0, y, w, 16);
    }
    grime(g, w, h, r, 80, 'rgba(0,0,0,A)', 0.3, [20, 120]);
    graffiti(g, w, h, r, 26, 0.15, 0.95);
  });
}

// Bright store interior as seen through the window
export function windowViewTex() {
  const r = rng(505);
  return canvasTex(1024, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#eaf7e0'); gr.addColorStop(1, '#b9d6b0');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    // ceiling lights
    g.fillStyle = '#ffffff'; for (let x = 40; x < w; x += 180) g.fillRect(x, 10, 120, 10);
    // shelves of colourful product
    const cols = ['#e33b3b', '#f2d43a', '#2e8fe6', '#3ad16b', '#ff8a2a', '#b54ae0', '#ffffff'];
    for (let s = 0; s < 3; s++) {
      const x0 = 40 + s * 340, y0 = 120;
      g.fillStyle = '#5f6d63'; g.fillRect(x0, y0, 280, 330);
      for (let row = 0; row < 5; row++) {
        g.fillStyle = '#3c463f'; g.fillRect(x0, y0 + row * 66 + 58, 280, 8);
        for (let x = x0 + 4; x < x0 + 276; x += 16 + r() * 8) {
          g.fillStyle = cols[Math.floor(r() * cols.length)];
          const hh = 30 + r() * 24; g.fillRect(x, y0 + row * 66 + 58 - hh, 12 + r() * 6, hh);
        }
      }
    }
    // posters stuck on glass (seen from inside, reversed text not needed)
    g.fillStyle = '#f2d43a'; g.fillRect(60, 300, 150, 180);
    g.fillStyle = '#e33b3b'; g.font = '64px "Bangers"'; g.fillText('2 FOR', 75, 370); g.fillText('$3', 100, 440);
    g.fillStyle = '#ffffff'; g.fillRect(760, 280, 200, 120);
    g.fillStyle = '#2e8fe6'; g.font = '54px "Bangers"'; g.fillText('ICE COLD', 772, 340); g.fillStyle = '#111'; g.font = '36px "Bangers"'; g.fillText('DRINKS INSIDE', 776, 384);
    speckle(g, w, h, r, 6000, 'rgba(0,0,0,0.06)', 2);
  });
}

// neon sign: returns {map, emissive}
export function neonSignTex() {
  const W = 2048, H = 512;
  const drawTubes = (g, glow) => {
    g.save();
    g.lineJoin = 'round'; g.lineCap = 'round';
    g.font = '300px "Bangers"'; g.textBaseline = 'middle';
    const word = (txt, x, y, col) => {
      if (glow) { g.shadowColor = col; g.shadowBlur = 40; }
      g.lineWidth = 16; g.strokeStyle = glow ? col : '#3a3a3a'; g.strokeText(txt, x, y);
      if (glow) { g.lineWidth = 6; g.strokeStyle = '#ffffff'; g.shadowBlur = 0; g.strokeText(txt, x, y); }
    };
    word('NITE', 120, 270, '#ff3a5c');
    word('OWL', 830, 270, '#39ff88');
    // owl head icon
    const ox = 1560, oy = 260;
    if (glow) { g.shadowColor = '#ffd23a'; g.shadowBlur = 40; }
    g.lineWidth = 14; g.strokeStyle = glow ? '#ffd23a' : '#3a3a3a';
    g.beginPath(); g.moveTo(ox - 150, oy - 150); g.lineTo(ox - 110, oy - 60); g.lineTo(ox + 110, oy - 60); g.lineTo(ox + 150, oy - 150); g.stroke();
    g.beginPath(); g.ellipse(ox, oy + 30, 150, 150, 0, Math.PI * 1.1, Math.PI * 1.9 + Math.PI * 1.0); g.stroke();
    for (const s of [-1, 1]) { g.beginPath(); g.arc(ox + s * 62, oy + 10, 48, 0, Math.PI * 2); g.stroke(); }
    g.beginPath(); g.moveTo(ox - 18, oy + 70); g.lineTo(ox, oy + 105); g.lineTo(ox + 18, oy + 70); g.stroke();
    if (glow) { g.lineWidth = 5; g.strokeStyle = '#fff'; g.shadowBlur = 0; for (const s of [-1, 1]) { g.beginPath(); g.arc(ox + s * 62, oy + 10, 48, 0, Math.PI * 2); g.stroke(); } }
    g.restore();
  };
  const map = canvasTex(W, H, (g) => {
    g.fillStyle = '#141a18'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#2d3532'; g.lineWidth = 10; g.strokeRect(10, 10, W - 20, H - 20);
    drawTubes(g, false);
  });
  const parts = {};
  for (const [name, col] of [['nite', '#ff3a5c'], ['owl', '#39ff88'], ['icon', '#ffd23a']]) {
    parts[name] = canvasTex(W, H, (g) => {
      g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      g.save();
      g.beginPath();
      if (name === 'nite') g.rect(0, 0, 800, H); else if (name === 'owl') g.rect(800, 0, 560, H); else g.rect(1360, 0, 700, H);
      g.clip(); drawTubes(g, true); g.restore();
    });
  }
  return { map, parts };
}

export function textSignTex(lines, opts = {}) {
  const w = opts.w ?? 512, h = opts.h ?? 256;
  return canvasTex(w, h, (g) => {
    g.fillStyle = opts.bg ?? '#f2d43a'; g.fillRect(0, 0, w, h);
    if (opts.border) { g.strokeStyle = opts.border; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    lines.forEach(([txt, size, col, font, y], i) => {
      g.font = `${size}px "${font ?? 'Bangers'}"`; g.fillStyle = col;
      g.fillText(txt, w / 2, y ?? h * (i + 1) / (lines.length + 1));
    });
    const r = rng(opts.seed ?? 3); grime(g, w, h, r, 20, 'rgba(0,0,0,A)', 0.18, [10, 60]);
  });
}

// snack bag labels
export const SNACKS = [
  ['KRUNCH', '#e33b3b', '#f2d43a'], ['TAKO', '#7a2ae0', '#ff8a2a'], ['ZAPZ', '#2e8fe6', '#ffffff'],
  ['PUFFS', '#f2a83a', '#c22a2a'], ['HOT RINGS', '#c22a2a', '#111111'], ['MEGA', '#3ad16b', '#ffffff'],
];
export function snackTex([name, bg, fg], seed) {
  const r = rng(seed);
  return canvasTex(256, 320, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, bg); gr.addColorStop(1, new THREE.Color(bg).multiplyScalar(0.6).getStyle());
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.arc(w * 0.7, h * 0.65, 80, 0, Math.PI * 2); g.fill();
    g.save(); g.translate(w / 2, h * 0.4); g.rotate(-0.12);
    g.font = `${name.length > 6 ? 46 : 64}px "Bangers"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 10; g.strokeStyle = '#111'; g.strokeText(name, 0, 0); g.fillStyle = fg; g.fillText(name, 0, 0);
    g.restore();
    g.fillStyle = '#f2d43a'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(w * (0.3 + r() * 0.5), h * (0.6 + r() * 0.3), 10 + r() * 14, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 14, w, 14);
  });
}
export const DRINKS = [['GLOW', '#39d17a'], ['FIZZ', '#e33b3b'], ['MANGO', '#ff9a2a'], ['OK!', '#2e8fe6'], ['VOLT', '#b54ae0'], ['LIME', '#c4e83a']];
export function drinkTex([name, col]) {
  return canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, h * 0.7, w, h * 0.3);
    g.font = '48px "Bangers"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const x of [w * 0.25, w * 0.75]) { g.lineWidth = 6; g.strokeStyle = '#111'; g.strokeText(name, x, h * 0.45); g.fillStyle = '#fff'; g.fillText(name, x, h * 0.45); }
  });
}

export function checkerTex() {
  const r = rng(606);
  return canvasTex(1024, 1024, (g, w, h) => {
    const n = 8, s = w / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const c = (x + y) % 2 ? new THREE.Color('#e9e4cf') : new THREE.Color('#3f7d6a');
      c.offsetHSL(0, 0, (r() - .5) * 0.06);
      g.fillStyle = c.getStyle(); g.fillRect(x * s, y * s, s, s);
    }
    g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3;
    for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, h); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); }
    grime(g, w, h, r, 90, 'rgba(40,30,10,A)', 0.25, [20, 120]);
    speckle(g, w, h, r, 9000, 'rgba(0,0,0,0.15)', 2);
  }, { repeat: [6, 5] });
}
export function wallTex(base = '#a9c4ae', seed = 707) {
  const r = rng(seed);
  return canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    grime(g, w, h, r, 120, 'rgba(0,0,0,A)', 0.14, [30, 160]);
    const gr = g.createLinearGradient(0, h * 0.7, 0, h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(20,20,10,0.35)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    speckle(g, w, h, r, 6000, 'rgba(0,0,0,0.08)', 2);
  }, { repeat: [3, 1] });
}
export function ceilTex() {
  const r = rng(808);
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#c9cbbf'; g.fillRect(0, 0, w, h);
    speckle(g, w, h, r, 8000, 'rgba(0,0,0,0.12)', 1.5);
    grime(g, w, h, r, 10, 'rgba(120,90,40,A)', 0.3, [20, 70]); // water stains
    g.strokeStyle = '#8e8f86'; g.lineWidth = 8; g.strokeRect(0, 0, w, h);
  }, { repeat: [10, 8] });
}
export function posterTex(kind, seed = 1) {
  const r = rng(seed);
  return canvasTex(512, 720, (g, w, h) => {
    if (kind === 'skate') {
      g.fillStyle = '#f2d43a'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#111'; g.font = '130px "Bangers"'; g.textAlign = 'center'; g.fillText('SKATE', w / 2, 170); g.fillText('JAM', w / 2, 300);
      g.fillStyle = '#e33b3b'; g.beginPath(); g.arc(w / 2, 470, 120, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#111'; g.font = '50px "Permanent Marker"'; g.fillText('SAT · 4PM', w / 2, 660);
    } else if (kind === 'band') {
      g.fillStyle = '#151515'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#e33b3b'; g.font = '110px "Permanent Marker"'; g.textAlign = 'center'; g.fillText('LOUD', w / 2, 160);
      g.fillStyle = '#eee'; g.font = '84px "Permanent Marker"'; g.fillText('BUGS', w / 2, 270);
      g.strokeStyle = '#eee'; g.lineWidth = 8; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(w / 2, 480, 40 + i * 25, 0, Math.PI * 2); g.stroke(); }
      g.font = '40px "Bangers"'; g.fillText('LIVE · FRIDAY', w / 2, 680);
    } else if (kind === 'hotdog') {
      g.fillStyle = '#e33b3b'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#fff'; g.font = '120px "Bangers"'; g.textAlign = 'center'; g.fillText('HOT', w / 2, 160); g.fillText('DOGS', w / 2, 280);
      g.fillStyle = '#f2d43a'; g.font = '170px "Bangers"'; g.fillText('99¢', w / 2, 520);
      g.fillStyle = '#fff'; g.font = '44px "Permanent Marker"'; g.fillText('all nite long', w / 2, 650);
    } else {
      g.fillStyle = '#2e8fe6'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#fff'; g.font = '110px "Bangers"'; g.textAlign = 'center'; g.fillText('ICE', w / 2, 170); g.fillText('COLD', w / 2, 290);
      g.fillStyle = '#39ff88'; g.font = '90px "Bangers"'; g.fillText('GLOW', w / 2, 470);
      g.fillStyle = '#fff'; g.font = '46px "Permanent Marker"'; g.fillText('the night drink', w / 2, 620);
    }
    grime(g, w, h, r, 40, 'rgba(0,0,0,A)', 0.22, [20, 100]);
    g.strokeStyle = 'rgba(255,255,255,0.3)'; g.lineWidth = 3; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(r() * w, 0); g.lineTo(r() * w, h); g.stroke(); }
  });
}
