import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// ---------- deterministic randomness ----------
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash1 = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
// smooth 1D value noise in [-1,1]
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return (hash1(i + seed * 57.3) * (1 - u) + hash1(i + 1 + seed * 57.3) * u) * 2 - 1;
}

// ---------- easing / timing ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t) => Math.pow(clamp(t), 3);
export const easeInOut = (t) => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const range = (t, a, b) => clamp((t - a) / (b - a));
export const backOut = (t, s = 1.7) => { t = clamp(t) - 1; return t * t * ((s + 1) * t + s) + 1; };
// piecewise keyframes: [[t, value], ...] with smooth interpolation (numbers or arrays)
export function keys(t, ks, ease = smooth) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    const [t0, v0] = ks[i], [t1, v1] = ks[i + 1];
    if (t <= t1) {
      const u = ease((t - t0) / (t1 - t0));
      return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], u)) : lerp(v0, v1, u);
    }
  }
  return ks[ks.length - 1][1];
}
export const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- ink outline (inverted hull) ----------
const outlineMats = new Map();
export function outlineMat(thick = 1.0, color = 0x0b0b0c) {
  const key = thick + ':' + color;
  if (outlineMats.has(key)) return outlineMats.get(key);
  const m = new THREE.ShaderMaterial({
    uniforms: { uThick: { value: thick }, uColor: { value: new THREE.Color(color) } },
    vertexShader: `
      uniform float uThick;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vec3 n = normalize(normalMatrix * normal);
        float d = clamp(-mv.z, 0.25, 30.0);
        mv.xyz += n * uThick * 0.0016 * d;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform vec3 uColor; void main(){ gl_FragColor = vec4(uColor,1.0); }`,
    side: THREE.BackSide,
  });
  outlineMats.set(key, m);
  return m;
}
// Adds an outline hull to every mesh under obj (skip ones flagged noOutline)
export function inkify(obj, thick = 1.0) {
  const list = [];
  obj.traverse((o) => { if (o.isMesh && !o.userData.noOutline && !o.userData.isOutline) list.push(o); });
  for (const m of list) {
    const h = new THREE.Mesh(m.geometry, outlineMat(m.userData.ink ?? thick));
    h.userData.isOutline = true;
    h.castShadow = false; h.receiveShadow = false;
    h.renderOrder = -1;
    m.add(h);
  }
  return obj;
}

// ---------- geometry helpers ----------
export function mesh(geo, mat, opts = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = opts.cast ?? true;
  m.receiveShadow = opts.recv ?? true;
  if (opts.pos) m.position.set(...opts.pos);
  if (opts.rot) m.rotation.set(...opts.rot);
  if (opts.scale) (typeof opts.scale === 'number') ? m.scale.setScalar(opts.scale) : m.scale.set(...opts.scale);
  if (opts.noOutline) m.userData.noOutline = true;
  if (opts.ink != null) m.userData.ink = opts.ink;
  return m;
}
export const rbox = (w, h, d, r = 0.02, seg = 3) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2, h / 2, d / 2) * 0.999);
// lathe from [[radius, y], ...]
export function lathe(profile, seg = 28) {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg);
}
export function group(parent, pos = [0, 0, 0]) {
  const g = new THREE.Group(); g.position.set(...pos); if (parent) parent.add(g); return g;
}

// ---------- canvas textures ----------
export function canvasTex(w, h, draw, opts = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = opts.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...opts.repeat); }
  t.userData.canvas = c; t.userData.ctx = g;
  return t;
}
// scatter blotches of grime
export function grime(g, w, h, r, n, color, alpha, size = [4, 40]) {
  g.save();
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, s = lerp(size[0], size[1], Math.pow(r(), 2));
    const gr = g.createRadialGradient(x, y, 0, x, y, s);
    gr.addColorStop(0, color.replace('A', (alpha * (0.4 + r() * 0.6)).toFixed(3)));
    gr.addColorStop(1, color.replace('A', '0'));
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}
export function speckle(g, w, h, r, n, color, sz = 1.5) {
  g.fillStyle = color;
  for (let i = 0; i < n; i++) g.fillRect(r() * w, r() * h, sz * (0.5 + r()), sz * (0.5 + r()));
}
// fabric texture: base colour + folds + dirt
export function fabricTex(base, opts = {}) {
  const r = rng(opts.seed ?? 7);
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    grime(g, w, h, r, 70, 'rgba(255,255,255,A)', opts.light ?? 0.06, [20, 90]);
    grime(g, w, h, r, 120, 'rgba(0,0,0,A)', opts.dark ?? 0.22, [10, 80]);
    // vertical fold streaks
    g.globalAlpha = 0.18;
    for (let i = 0; i < (opts.folds ?? 26); i++) {
      const x = r() * w; g.strokeStyle = r() < .5 ? '#000' : '#fff'; g.lineWidth = 2 + r() * 10;
      g.beginPath(); g.moveTo(x, 0);
      g.bezierCurveTo(x + (r() - .5) * 80, h * .3, x + (r() - .5) * 80, h * .7, x + (r() - .5) * 60, h); g.stroke();
    }
    g.globalAlpha = 1;
    speckle(g, w, h, r, 2500, 'rgba(0,0,0,0.12)', 1.6);
    if (opts.extra) opts.extra(g, w, h, r);
  }, opts);
}
