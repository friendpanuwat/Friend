import * as THREE from 'three';
import { mesh, rbox, group, inkify, canvasTex, rng, grime, speckle, lerp, fabricTex } from './util.js';

function furTex() {
  const r = rng(42);
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#d98a3a'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(120,50,10,0.55)';
    for (let i = 0; i < 18; i++) {
      const x = (i / 18) * w + r() * 10; g.lineWidth = 8 + r() * 10;
      g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 30, h * 0.3, x - 30, h * 0.6, x + 10, h); g.stroke();
    }
    grime(g, w, h, r, 60, 'rgba(255,230,180,A)', 0.15, [10, 50]);
    speckle(g, w, h, r, 6000, 'rgba(80,30,0,0.15)', 1.5);
  });
}
function tagTex() {
  return canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#f4f1e6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8);
    g.fillStyle = '#c7322e'; g.font = '30px "Bangers"'; g.textAlign = 'center'; g.fillText('HELLO MY NAME IS', w / 2, 40);
    g.fillStyle = '#111'; g.font = '64px "Permanent Marker"'; g.fillText('BOSS', w / 2, 108);
  });
}

export function buildCat() {
  const C = {};
  const fur = new THREE.MeshStandardMaterial({ map: furTex(), roughness: 0.95 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xf1e2c4, roughness: 0.9 });
  const pink = new THREE.MeshStandardMaterial({ color: 0xd9727a, roughness: 0.6 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1c0c0a, roughness: 0.5 });
  const eyeM = new THREE.MeshStandardMaterial({ color: 0xcfe04a, roughness: 0.2, emissive: 0x2a3300, emissiveIntensity: 0.4 });
  const vest = new THREE.MeshStandardMaterial({ map: fabricTex('#2f6b4a', { seed: 8, dark: 0.3, folds: 14 }), roughness: 0.85 });
  const root = new THREE.Group(); C.root = root;
  const body = group(root, [0, 0, 0]); C.body = body;
  body.add(mesh(new THREE.SphereGeometry(0.34, 32, 24), fur, { pos: [0, 0.32, 0], scale: [1.05, 1.15, 0.9] }));
  body.add(mesh(new THREE.SphereGeometry(0.25, 24, 16), cream, { pos: [0, 0.3, 0.13], scale: [0.95, 1.15, 0.8], noOutline: true }));
  // vest (open front)
  body.add(mesh(new THREE.SphereGeometry(0.355, 32, 24, Math.PI * 0.65, Math.PI * 1.7, Math.PI * 0.18, Math.PI * 0.58), vest, { pos: [0, 0.33, 0], scale: [1.06, 1.15, 0.92] }));
  body.add(mesh(new THREE.PlaneGeometry(0.16, 0.08), new THREE.MeshStandardMaterial({ map: tagTex(), roughness: 0.6 }), { pos: [0.17, 0.42, 0.275], rot: [-0.15, 0.5, 0], noOutline: true }));
  // head
  const head = group(body, [0, 0.72, 0.02]); C.head = head;
  head.add(mesh(new THREE.SphereGeometry(0.2, 32, 24), fur, { scale: [1.18, 0.95, 1.0] }));
  for (const s of [-1, 1]) {
    head.add(mesh(new THREE.SphereGeometry(0.1, 16, 12), fur, { pos: [s * 0.15, -0.06, 0.05], scale: [1.1, 0.8, 0.9] })); // cheek fluff
    const ear = group(head, [s * 0.14, 0.15, -0.01]); ear.rotation.z = s * -0.35;
    ear.add(mesh(new THREE.ConeGeometry(0.075, 0.15, 4), fur, { rot: [0, Math.PI / 4, 0] }));
    ear.add(mesh(new THREE.ConeGeometry(0.045, 0.1, 4), pink, { pos: [0, -0.01, 0.03], rot: [0, Math.PI / 4, 0], noOutline: true }));
  }
  // muzzle
  for (const s of [-1, 1]) head.add(mesh(new THREE.SphereGeometry(0.055, 16, 12), cream, { pos: [s * 0.045, -0.06, 0.175], scale: [1, 0.85, 0.8] }));
  head.add(mesh(new THREE.SphereGeometry(0.022, 12, 8), pink, { pos: [0, -0.02, 0.215], scale: [1.3, 0.8, 0.8] }));
  // mouth (yawn)
  const mouth = group(head, [0, -0.1, 0.17]); C.mouth = mouth;
  C.mouthIn = mesh(new THREE.SphereGeometry(0.05, 20, 14), new THREE.MeshStandardMaterial({ color: 0x5a1520, roughness: 0.6 }), { scale: [1, 0.1, 0.5], noOutline: true });
  mouth.add(C.mouthIn);
  C.tongue = mesh(new THREE.SphereGeometry(0.03, 14, 10), pink, { pos: [0, -0.01, 0.012], scale: [1, 0.4, 0.8], noOutline: true });
  mouth.add(C.tongue);
  C.fangs = [];
  for (const s of [-1, 1]) { const f = mesh(new THREE.ConeGeometry(0.008, 0.025, 6), cream, { pos: [s * 0.025, 0.0, 0.03], rot: [Math.PI, 0, 0], noOutline: true }); mouth.add(f); C.fangs.push(f); }
  // eyes (sleepy)
  C.lids = [];
  for (const s of [-1, 1]) {
    const eg = group(head, [s * 0.085, 0.03, 0.155]); eg.rotation.y = s * 0.35;
    eg.add(mesh(new THREE.SphereGeometry(0.042, 20, 14), eyeM, { scale: [1, 0.9, 0.6], noOutline: true }));
    eg.add(mesh(new THREE.SphereGeometry(0.02, 12, 10), dark, { pos: [0, 0, 0.022], scale: [0.35, 1.2, 0.3], noOutline: true }));
    const lid = group(eg, [0, 0, 0]);
    lid.add(mesh(new THREE.SphereGeometry(0.046, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), fur, { scale: [1, 0.95, 0.68], noOutline: true }));
    lid.add(mesh(new THREE.TorusGeometry(0.044, 0.004, 6, 20, Math.PI), dark, { rot: [Math.PI / 2, 0, 0], scale: [1.02, 1, 0.68], noOutline: true }));
    C.lids.push(lid);
  }
  // whiskers
  const wm = new THREE.MeshBasicMaterial({ color: 0xf6f2e8 });
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
    const w = mesh(new THREE.CylinderGeometry(0.0018, 0.0012, 0.2, 4), wm, { pos: [s * 0.15, -0.06 + i * 0.018, 0.17], rot: [0, 0, Math.PI / 2 + s * (i - 1) * 0.15], noOutline: true, cast: false });
    head.add(w);
  }
  // paws (arms)
  C.paw = {};
  for (const [k, s] of [['L', 1], ['R', -1]]) {
    const sh = group(body, [s * 0.25, 0.48, 0.12]);
    sh.add(mesh(new THREE.CapsuleGeometry(0.065, 0.2, 4, 12), fur, { pos: [0, -0.12, 0] }));
    sh.add(mesh(new THREE.SphereGeometry(0.075, 16, 12), cream, { pos: [0, -0.26, 0.01], scale: [1, 0.8, 1.1] }));
    C.paw[k] = sh;
  }
  // tail
  const tailPts = [[0.0, 0.1, -0.25], [0.25, 0.05, -0.35], [0.45, 0.2, -0.3], [0.5, 0.45, -0.2]].map((p) => new THREE.Vector3(...p));
  C.tail = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tailPts), 24, 0.045, 10), fur);
  root.add(C.tail);
  inkify(root, 1.0);
  C.pose = ({ yawn = 0, blink = 0.55, headTilt = 0, breathe = 0, pawR = 0 }) => {
    for (const l of C.lids) l.rotation.x = lerp(-0.9, 1.5, Math.max(blink, yawn * 0.95));
    C.mouthIn.scale.set(1 + yawn * 0.15, 0.1 + yawn * 1.0, 0.5);
    C.tongue.position.y = -0.01 - yawn * 0.025;
    for (const f of C.fangs) f.position.y = yawn * 0.04;
    C.mouth.position.y = -0.1 - yawn * 0.02;
    head.rotation.set(-yawn * 0.35, 0, headTilt);
    body.scale.set(1, 1 + breathe * 0.02, 1);
    C.paw.R.rotation.x = -pawR * 1.2; C.paw.L.rotation.x = -0.9;
    C.paw.R.rotation.z = 0; C.paw.L.rotation.z = 0;
  };
  C.pose({});
  return C;
}
