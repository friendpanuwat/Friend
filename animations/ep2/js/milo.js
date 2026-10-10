import * as THREE from 'three';
import { mesh, rbox, group, inkify, canvasTex, fabricTex, grime, speckle, rng, lerp } from './util.js';

const latheP = (profile, seg = 32, phiStart = Math.PI) => {
  const p = profile[0][1] > profile[profile.length - 1][1] ? [...profile].reverse() : profile;
  return new THREE.LatheGeometry(p.map(([r, y]) => new THREE.Vector2(r, y)), seg, phiStart);
};

function shirtTex() {
  return fabricTex('#b3262b', {
    seed: 11, dark: 0.25, folds: 10,
    extra: (g, w, h, r) => {
      // front graphic centred at u=0.5 (front of lathe), upper chest
      const cx = w * 0.5, cy = h * 0.42;
      g.save(); g.translate(cx, cy); g.scale(0.85, 1);
      // cartoon coin-face mascot
      g.fillStyle = '#f2c230'; g.strokeStyle = '#111'; g.lineWidth = 6;
      g.beginPath(); g.arc(0, 0, 48, 0, Math.PI * 2); g.fill(); g.stroke();
      g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 38, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#111';
      g.beginPath(); g.ellipse(-14, -8, 6, 9, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(14, -8, 6, 9, 0, 0, Math.PI * 2); g.fill();
      g.lineWidth = 5; g.beginPath(); g.arc(0, 6, 20, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
      g.fillStyle = '#fff'; g.fillRect(-6, 26, 12, 7);
      // little legs + skateboard
      g.strokeStyle = '#111'; g.lineWidth = 6;
      g.beginPath(); g.moveTo(-16, 44); g.lineTo(-22, 66); g.moveTo(16, 44); g.lineTo(22, 66); g.stroke();
      g.fillStyle = '#e8e8e8'; g.fillRect(-40, 66, 80, 8); g.strokeRect(-40, 66, 80, 8);
      g.restore();
      g.font = '38px "Bangers"'; g.textAlign = 'center';
      g.lineWidth = 7; g.strokeStyle = '#111'; g.fillStyle = '#f4efe0';
      g.strokeText('LOOSE CHANGE', cx, cy - 66); g.fillText('LOOSE CHANGE', cx, cy - 66);
      g.font = '22px "Permanent Marker"'; g.lineWidth = 5;
      g.strokeText('skate crew', cx, cy + 112); g.fillText('skate crew', cx, cy + 112);
      // crack the print a bit
      g.globalAlpha = 0.35; speckle(g, w, h, r, 900, '#b3262b', 2.5); g.globalAlpha = 1;
    },
  });
}

function denimTex() {
  return fabricTex('#3d5a80', {
    seed: 5, dark: 0.32, light: 0.12, folds: 40,
    extra: (g, w, h, r) => {
      grime(g, w, h, r, 30, 'rgba(110,90,60,A)', 0.25, [20, 70]); // dirt
      g.strokeStyle = 'rgba(220,170,90,0.55)'; g.lineWidth = 3; g.setLineDash([8, 6]);
      for (const x of [w * 0.5, 0.02 * w]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      g.setLineDash([]);
      // denim twill
      g.globalAlpha = 0.08; g.strokeStyle = '#fff'; g.lineWidth = 1;
      for (let i = -h; i < w; i += 5) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); }
      g.globalAlpha = 1;
    },
  });
}

function beanieTex() {
  const r = rng(3);
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#7fa64a'; g.fillRect(0, 0, w, h);
    g.globalAlpha = 0.25; g.strokeStyle = '#2d4a1c'; g.lineWidth = 3;
    for (let x = 0; x < w; x += 7) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    g.globalAlpha = 1;
    grime(g, w, h, r, 40, 'rgba(0,0,0,A)', 0.2, [8, 40]);
    speckle(g, w, h, r, 800, 'rgba(255,255,255,0.08)', 1.5);
  });
}

function patchTex() {
  return canvasTex(128, 96, (g, w, h) => {
    g.fillStyle = '#efe9d6'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#111'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
    g.fillStyle = '#c7322e'; g.font = '50px "Bangers"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('NR', w / 2, h / 2 + 3);
  });
}

function gripTex() {
  const r = rng(9);
  return canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#151515'; g.fillRect(0, 0, w, h);
    speckle(g, w, h, r, 5000, 'rgba(255,255,255,0.10)', 1.2);
    g.fillStyle = 'rgba(255,255,255,0.12)'; g.font = '60px "Permanent Marker"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.save(); g.translate(w / 2, h / 2); g.rotate(-0.05); g.fillText('nite run', 0, 0); g.restore();
  });
}

export function buildMilo() {
  const M = {};
  const skin = new THREE.MeshStandardMaterial({ color: 0xbf8660, roughness: 0.62, emissive: 0x2a0e04, emissiveIntensity: 0.25 });
  const skinDark = new THREE.MeshStandardMaterial({ color: 0x8e5a3c, roughness: 0.7 });
  const white = new THREE.MeshStandardMaterial({ color: 0xe9e6dd, roughness: 0.8 });
  const sleeveTex = fabricTex('#e6e2d8', { seed: 21, dark: 0.18, folds: 18 });
  const sleeve = new THREE.MeshStandardMaterial({ map: sleeveTex, roughness: 0.85 });
  const shirt = new THREE.MeshStandardMaterial({ map: shirtTex(), roughness: 0.85 });
  const denim = new THREE.MeshStandardMaterial({ map: denimTex(), roughness: 0.9 });
  const black = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.55 });
  const sole = new THREE.MeshStandardMaterial({ color: 0xdcd8cc, roughness: 0.7 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a0d08, roughness: 0.9 });
  const hairM = new THREE.MeshStandardMaterial({ color: 0x24170f, roughness: 0.85 });
  const beanie = new THREE.MeshStandardMaterial({ map: beanieTex(), roughness: 0.95 });
  const mouthM = new THREE.MeshStandardMaterial({ color: 0x3b1210, roughness: 0.6 });
  const eyeW = new THREE.MeshStandardMaterial({ color: 0xf1ece4, roughness: 0.25 });
  const iris = new THREE.MeshStandardMaterial({ color: 0x2b1a10, roughness: 0.2 });
  const bandaid = new THREE.MeshStandardMaterial({ color: 0xeedcbc, roughness: 0.7 });
  const lip = new THREE.MeshStandardMaterial({ color: 0x9c5a46, roughness: 0.55 });

  const root = new THREE.Group(); M.root = root;
  const hips = group(root, [0, 0.92, 0]); M.hips = hips;

  // ----- torso -----
  const torso = group(hips, [0, 0, 0]); M.torso = torso;
  const shirtGeo = latheP([[0.0, -0.08], [0.2, -0.08], [0.235, -0.02], [0.24, 0.12], [0.235, 0.3], [0.245, 0.44], [0.225, 0.52], [0.15, 0.585], [0.065, 0.6], [0.0, 0.6]], 40);
  const shirtM = mesh(shirtGeo, shirt, { scale: [1, 1, 0.72] }); torso.add(shirtM);
  // hem flare
  torso.add(mesh(latheP([[0.215, -0.13], [0.245, -0.12], [0.25, -0.05], [0.235, -0.02]], 40), shirt, { scale: [1, 1, 0.74] }));
  const neck = group(torso, [0, 0.565, 0.0]); M.neck = neck;
  neck.add(mesh(new THREE.CylinderGeometry(0.048, 0.055, 0.12, 16), skin, { pos: [0, 0.04, 0] }));
  // collar rib
  torso.add(mesh(new THREE.TorusGeometry(0.068, 0.016, 8, 24), shirt, { pos: [0, 0.59, 0.0], rot: [Math.PI / 2, 0, 0], scale: [1, 0.8, 1] }));

  // ----- head -----
  const head = group(neck, [0, 0.065, 0]); M.head = head;
  const H = group(head, [0, 0, 0.0]);
  H.add(mesh(new THREE.SphereGeometry(0.122, 32, 24), skin, { pos: [0, 0.14, 0], scale: [0.9, 1.12, 1.0] }));
  H.add(mesh(new THREE.SphereGeometry(0.1, 28, 18), skin, { pos: [0, 0.065, 0.024], scale: [0.84, 0.78, 0.9] }));
  // cheekbones
  for (const s of [-1, 1]) H.add(mesh(new THREE.SphereGeometry(0.03, 14, 10), skin, { pos: [s * 0.058, 0.112, 0.06], scale: [1, 0.65, 0.8], noOutline: true }));
  // chin + goatee
  H.add(mesh(new THREE.SphereGeometry(0.04, 16, 12), skin, { pos: [0, 0.03, 0.085], scale: [1, 0.8, 0.8] }));
  // nose
  H.add(mesh(new THREE.SphereGeometry(0.017, 16, 12), skin, { pos: [0, 0.12, 0.117], scale: [0.8, 1.6, 1.0] }));
  H.add(mesh(new THREE.SphereGeometry(0.016, 16, 12), skin, { pos: [0, 0.098, 0.128], scale: [1.1, 0.9, 1] }));
  for (const s of [-1, 1]) H.add(mesh(new THREE.SphereGeometry(0.009, 10, 8), skin, { pos: [s * 0.014, 0.094, 0.122], noOutline: true }));
  H.add(mesh(rbox(0.05, 0.016, 0.006, 0.003), bandaid, { pos: [0, 0.122, 0.133], rot: [-0.2, 0, 0.2], ink: 0.5 }));
  // ears
  for (const s of [-1, 1]) H.add(mesh(new THREE.SphereGeometry(0.03, 14, 10), skin, { pos: [s * 0.113, 0.12, -0.005], scale: [0.45, 1, 0.8] }));
  // eyes
  M.eyes = []; M.lids = []; M.brows = [];
  for (const s of [-1, 1]) {
    const eg = group(H, [s * 0.042, 0.148, 0.099]); eg.scale.set(1.05, 0.72, 1); eg.rotation.z = s * 0.08;
    eg.add(mesh(new THREE.SphereGeometry(0.021, 20, 14), eyeW, { scale: [1, 1, 0.75], noOutline: true }));
    const ball = group(eg, [0, 0, 0]);
    ball.add(mesh(new THREE.CircleGeometry(0.0105, 20), iris, { pos: [0, 0, 0.0162], noOutline: true, cast: false }));
    ball.add(mesh(new THREE.CircleGeometry(0.0035, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }), { pos: [0.004 * -s, 0.004, 0.0165], noOutline: true, cast: false }));
    M.eyes.push(ball);
    // upper lid: hemisphere rotating down
    const lid = group(eg, [0, 0, 0]);
    lid.add(mesh(new THREE.SphereGeometry(0.0235, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), skin, { scale: [1, 0.9, 0.8], noOutline: true }));
    lid.add(mesh(new THREE.TorusGeometry(0.0225, 0.0026, 6, 20, Math.PI), dark, { rot: [Math.PI / 2, 0, 0], scale: [1.02, 1, 0.8], noOutline: true }));
    M.lids.push(lid);
    // lower lid line
    eg.add(mesh(new THREE.TorusGeometry(0.02, 0.0018, 6, 16, Math.PI * 0.8), skinDark, { rot: [0.2, 0, Math.PI + 0.3], scale: [1, 0.7, 0.8], noOutline: true }));
    const brow = mesh(rbox(0.05, 0.011, 0.012, 0.005), hairM, { pos: [s * 0.045, 0.172, 0.112], rot: [-0.25, s * 0.15, s * -0.1], ink: 0.4 });
    H.add(brow); M.brows.push(brow);
  }
  // mouth
  const mouth = group(H, [0, 0.062, 0.106]); M.mouth = mouth;
  M.mouthIn = mesh(new THREE.SphereGeometry(0.024, 20, 12), mouthM, { scale: [1.1, 0.25, 0.35], noOutline: true });
  mouth.add(M.mouthIn);
  M.teeth = mesh(rbox(0.036, 0.009, 0.01, 0.003), white, { pos: [0, 0.004, 0.005], noOutline: true });
  mouth.add(M.teeth);
  M.upperLip = mesh(new THREE.CapsuleGeometry(0.0035, 0.034, 4, 8), lip, { pos: [0, 0.008, 0.006], rot: [0, 0, Math.PI / 2], noOutline: true });
  M.lowerLip = mesh(new THREE.CapsuleGeometry(0.0048, 0.028, 4, 8), lip, { pos: [0, -0.008, 0.005], rot: [0, 0, Math.PI / 2], noOutline: true });
  mouth.add(M.upperLip, M.lowerLip);
  // hair under beanie
  H.add(mesh(new THREE.SphereGeometry(0.127, 24, 12, Math.PI * 0.95, Math.PI * 1.1, Math.PI * 0.3, Math.PI * 0.32), hairM, { pos: [0, 0.14, -0.006], scale: [0.93, 1.1, 1.0] }));
  for (const s of [-1, 1]) {
    H.add(mesh(new THREE.ConeGeometry(0.016, 0.06, 6), hairM, { pos: [s * 0.104, 0.15, -0.02], rot: [0.2, 0, s * -0.1] }));
    H.add(mesh(new THREE.ConeGeometry(0.02, 0.06, 6), hairM, { pos: [s * 0.07, 0.07, -0.09], rot: [0.6, 0, s * 0.3] }));
  }
  // beanie (pushed back)
  const bn = group(H, [0, 0.16, -0.012]); bn.rotation.x = -0.3; M.beanie = bn;
  bn.add(mesh(new THREE.SphereGeometry(0.134, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), beanie, { pos: [0, 0.03, 0], scale: [0.98, 1.12, 1.03] }));
  bn.add(mesh(latheP([[0.134, 0.0], [0.139, 0.005], [0.141, 0.035], [0.138, 0.06], [0.131, 0.065]], 40), beanie, { scale: [0.98, 1, 1.03] }));
  bn.add(mesh(new THREE.PlaneGeometry(0.06, 0.045), new THREE.MeshStandardMaterial({ map: patchTex(), roughness: 0.8 }), { pos: [-0.04, 0.033, 0.139], rot: [0, -0.28, 0], noOutline: true }));

  // ----- arms -----
  M.arm = {};
  for (const [side, s] of [['L', 1], ['R', -1]]) {
    const sh = group(torso, [s * 0.215, 0.5, 0]);
    // short tee sleeve (wide)
    sh.add(mesh(latheP([[0.085, 0.02], [0.105, -0.02], [0.11, -0.16], [0.1, -0.2], [0.0, -0.2]], 20, 0), shirt, { rot: [0, 0, 0] }));
    sh.add(mesh(new THREE.CapsuleGeometry(0.048, 0.2, 4, 12), sleeve, { pos: [0, -0.15, 0] }));
    const el = group(sh, [0, -0.28, 0]);
    el.add(mesh(new THREE.CapsuleGeometry(0.044, 0.18, 4, 12), sleeve, { pos: [0, -0.11, 0] }));
    // cuff
    el.add(mesh(new THREE.CylinderGeometry(0.046, 0.044, 0.04, 14), sleeve, { pos: [0, -0.21, 0] }));
    const hand = group(el, [0, -0.25, 0]);
    hand.add(mesh(rbox(0.07, 0.08, 0.034, 0.015), skin, { pos: [0, -0.04, 0] }));
    const fing = group(hand, [0, -0.075, 0]);
    fing.add(mesh(rbox(0.066, 0.055, 0.03, 0.013), skin, { pos: [0, -0.025, 0] }));
    const th = group(hand, [s * -0.035, -0.02, 0.012]);
    th.add(mesh(new THREE.CapsuleGeometry(0.012, 0.035, 4, 8), skin, { pos: [0, -0.02, 0.006], rot: [0.3, 0, s * 0.5] }));
    M.arm[side] = { sh, el, hand, fing, th };
  }

  // ----- legs (baggy denim) -----
  M.leg = {};
  const thighGeo = latheP([[0.14, 0.02], [0.155, -0.08], [0.16, -0.3], [0.165, -0.46]], 28);
  const shinGeo = latheP([[0.165, 0.04], [0.17, -0.15], [0.18, -0.28], [0.195, -0.33], [0.185, -0.36], [0.205, -0.39], [0.2, -0.42], [0.18, -0.44], [0.0, -0.44]], 28);
  hips.add(mesh(latheP([[0.0, 0.0], [0.24, 0.0], [0.255, -0.06], [0.25, -0.14], [0.0, -0.16]], 32), denim, { scale: [1, 1, 0.78] }));
  for (const [side, s] of [['L', 1], ['R', -1]]) {
    const hip = group(hips, [s * 0.115, -0.04, 0]);
    hip.add(mesh(thighGeo, denim, { scale: [1, 1, 0.92] }));
    const knee = group(hip, [0, -0.42, 0]);
    knee.add(mesh(shinGeo, denim, { scale: [1, 1, 0.95] }));
    const ankle = group(knee, [0, -0.42, 0]);
    // shoe: chunky skate shoe
    const shoe = group(ankle, [0, -0.02, 0.06]);
    shoe.add(mesh(rbox(0.175, 0.065, 0.37, 0.03), sole, { pos: [0, -0.025, 0] }));
    shoe.add(mesh(rbox(0.165, 0.11, 0.3, 0.05), black, { pos: [0, 0.045, -0.02] }));
    shoe.add(mesh(new THREE.SphereGeometry(0.085, 18, 12), black, { pos: [0, 0.03, 0.11], scale: [1, 0.68, 1.05] }));
    for (let i = 0; i < 3; i++) shoe.add(mesh(rbox(0.07, 0.008, 0.016, 0.003), white, { pos: [0, 0.103 - i * 0.012, 0.05 - i * 0.03], rot: [0.5, 0, 0], noOutline: true }));
    // side stripe
    shoe.add(mesh(rbox(0.004, 0.03, 0.18, 0.002), white, { pos: [s * 0.083, 0.04, -0.01], noOutline: true }));
    M.leg[side] = { hip, knee, ankle, shoe };
  }
  inkify(root, 1.0);

  // ---------- pose helpers ----------
  M.reset = () => {
    hips.position.set(0, 0.92, 0); hips.rotation.set(0, 0, 0);
    torso.rotation.set(0, 0, 0); neck.rotation.set(0, 0, 0); head.rotation.set(0, 0, 0);
    for (const s of ['L', 'R']) {
      const a = M.arm[s], sg = s === 'L' ? 1 : -1;
      a.sh.rotation.set(0.05, 0, sg * 0.12); a.el.rotation.set(-0.15, 0, 0); a.hand.rotation.set(0, 0, 0);
      a.fing.rotation.set(0.5, 0, 0); a.th.rotation.set(0, 0, 0);
      const l = M.leg[s]; l.hip.rotation.set(0, 0, sg * 0.03); l.knee.rotation.set(0, 0, 0); l.ankle.rotation.set(0, 0, 0);
    }
    M.face({});
  };
  // face: blink 0..1, gaze [x,y], mouth open 0..1, smile -1..1, smirk, brows
  M.face = ({ blink = 0.25, gaze = [0, 0], open = 0, smile = 0, smirk = 0, brow = 0 }) => {
    for (const lid of M.lids) lid.rotation.x = lerp(-0.85, 1.55, blink);
    for (const e of M.eyes) e.rotation.set(-gaze[1] * 0.5, gaze[0] * 0.6, 0);
    M.mouthIn.scale.set(1.1 + smile * 0.25, 0.22 + open * 0.75, 0.35);
    M.teeth.visible = open > 0.08;
    M.teeth.position.y = 0.004 + open * 0.004;
    M.upperLip.position.y = 0.006 + open * 0.008; M.lowerLip.position.y = -0.006 - open * 0.012;
    M.mouth.rotation.z = smirk * 0.25;
    M.mouth.position.x = smirk * 0.008;
    M.upperLip.rotation.z = Math.PI / 2 + smile * 0.15; M.lowerLip.rotation.z = Math.PI / 2 - smile * 0.15;
    M.brows[0].position.y = 0.172 + brow * 0.008; M.brows[1].position.y = 0.172 + brow * 0.008 + smirk * 0.006;
  };
  // walk cycle; phase in cycles
  M.walk = (ph, amt = 1) => {
    const w = ph * Math.PI * 2;
    hips.position.y = 0.92 - 0.025 * amt + Math.abs(Math.cos(w)) * 0.03 * amt;
    hips.rotation.y = Math.sin(w) * 0.08 * amt; torso.rotation.y = -Math.sin(w) * 0.12 * amt;
    hips.rotation.z = Math.sin(w) * 0.025 * amt; torso.rotation.x = 0.06 * amt;
    for (const [s, sg] of [['L', 1], ['R', -1]]) {
      const p = sg * Math.sin(w);
      const l = M.leg[s];
      l.hip.rotation.x = -p * 0.42 * amt;
      l.knee.rotation.x = Math.max(0, Math.sin(w * sg + (sg > 0 ? 0 : Math.PI) - 1.2) * 0.75) * amt + 0.06;
      l.ankle.rotation.x = -l.hip.rotation.x * 0.3 - l.knee.rotation.x * 0.5;
      const a = M.arm[s];
      a.sh.rotation.x = p * 0.38 * amt; a.el.rotation.x = -0.25 - Math.max(0, p) * 0.3 * amt;
    }
  };
  M.reset();
  return M;
}

export function buildBoard() {
  const B = new THREE.Group();
  const deckM = new THREE.MeshStandardMaterial({ map: gripTex(), roughness: 0.9 });
  const ply = new THREE.MeshStandardMaterial({ color: 0xd8b98a, roughness: 0.7 });
  const under = new THREE.MeshStandardMaterial({ color: 0xc23a2c, roughness: 0.6 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.8, roughness: 0.35 });
  const wheelM = new THREE.MeshStandardMaterial({ color: 0xefe5c8, roughness: 0.45 });
  const deck = group(B, [0, 0.095, 0]);
  deck.add(mesh(rbox(0.6, 0.014, 0.205, 0.006), deckM, { pos: [0, 0.008, 0], noOutline: true }));
  deck.add(mesh(rbox(0.6, 0.012, 0.205, 0.006), under, { pos: [0, -0.005, 0] }));
  for (const s of [-1, 1]) {
    const tail = group(deck, [s * 0.3, 0, 0]); tail.rotation.z = s * 0.38;
    tail.add(mesh(new THREE.CylinderGeometry(0.1025, 0.1025, 0.024, 24, 1, false, s > 0 ? 0 : Math.PI, Math.PI), ply, { pos: [0, 0, 0], scale: [1.0, 1, 1], rot: [0, 0, 0] }));
    tail.children[0].position.x = s * 0.0;
  }
  deck.add(mesh(new THREE.BoxGeometry(0.6, 0.004, 0.2), ply, { pos: [0, -0.012, 0], noOutline: true }));
  B.wheels = [];
  for (const s of [-1, 1]) {
    const tr = group(B, [s * 0.2, 0.065, 0]);
    tr.add(mesh(rbox(0.06, 0.03, 0.16, 0.01), metal, { pos: [0, 0.01, 0] }));
    tr.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 8), metal, { rot: [Math.PI / 2, 0, 0], pos: [0, -0.01, 0] }));
    for (const z of [-0.095, 0.095]) {
      const w = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.035, 18), wheelM, { rot: [Math.PI / 2, 0, 0], pos: [0, -0.012, z] });
      tr.add(w); B.wheels.push(w);
    }
  }
  inkify(B, 0.8);
  B.roll = (dist) => { for (const w of B.wheels) w.rotation.y = -dist / 0.03; };
  return B;
}

export function buildCan(label = 'GLOW') {
  const tex = canvasTex(256, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#39d17a'); gr.addColorStop(1, '#0f7a45');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#111'; g.font = '52px "Bangers"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const x of [w * 0.25, w * 0.75]) {
      g.lineWidth = 6; g.strokeStyle = '#111'; g.fillStyle = '#f7f3d8';
      g.strokeText(label, x, h * 0.48); g.fillText(label, x, h * 0.48);
    }
    g.fillStyle = '#f2d43a'; g.fillRect(0, h * 0.82, w, 6);
  });
  const C = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.4 });
  const al = new THREE.MeshStandardMaterial({ color: 0xc9cdd1, metalness: 0.9, roughness: 0.3 });
  C.add(mesh(new THREE.CylinderGeometry(0.033, 0.033, 0.11, 24, 1, true), body, { pos: [0, 0.055, 0] }));
  C.add(mesh(new THREE.CylinderGeometry(0.028, 0.033, 0.012, 24), al, { pos: [0, 0.116, 0] }));
  C.add(mesh(new THREE.CylinderGeometry(0.033, 0.028, 0.01, 24), al, { pos: [0, -0.004, 0] }));
  inkify(C, 0.7);
  return C;
}
