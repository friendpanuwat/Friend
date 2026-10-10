import * as THREE from 'three';
import { mesh, rbox, group, canvasTex, rng, lerp, speckle, inkify } from './util.js';
import * as T from './env_tex.js';

function envFromScene(renderer, build) {
  const s = new THREE.Scene(); build(s);
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(s, 0.02); pm.dispose();
  return rt.texture;
}

export function buildExterior(renderer) {
  const S = new THREE.Scene(); const E = { scene: S };
  S.fog = new THREE.FogExp2(0x0b1612, 0.018);
  // sky dome
  const r = rng(77);
  const sky = canvasTex(1024, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#02060a'); gr.addColorStop(0.42, '#071513'); gr.addColorStop(0.5, '#123024'); gr.addColorStop(1, '#0a120e');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    speckle(g, w, h * 0.42, r, 400, 'rgba(220,255,230,0.6)', 1.2);
    const mg = g.createRadialGradient(w * 0.7, h * 0.18, 0, w * 0.7, h * 0.18, 60);
    mg.addColorStop(0, 'rgba(230,255,220,0.9)'); mg.addColorStop(0.15, 'rgba(210,240,200,0.6)'); mg.addColorStop(1, 'rgba(120,180,140,0)');
    g.fillStyle = mg; g.fillRect(0, 0, w, h);
  });
  S.add(new THREE.Mesh(new THREE.SphereGeometry(200, 32, 16), new THREE.MeshBasicMaterial({ map: sky, side: THREE.BackSide, fog: false })));

  // env map for wet reflections
  S.environment = envFromScene(renderer, (s) => {
    s.background = new THREE.Color(0x050a08);
    const add = (c, i, p, sc) => { const m = new THREE.Mesh(new THREE.BoxGeometry(...sc), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i) })); m.position.set(...p); s.add(m); };
    add(0xff3a5c, 3, [-3, 4, 6], [4, 1, 0.2]); add(0x39ff88, 3, [3, 4, 6], [4, 1, 0.2]);
    add(0xdfffe0, 2, [0, 1.5, 6], [8, 2, 0.2]); add(0xffb060, 2, [-8, 6, -4], [1, 1, 1]); add(0xffb060, 2, [8, 6, -4], [1, 1, 1]);
  });
  S.environmentIntensity = 0.7;

  // ----- ground -----
  const asphalt = new THREE.MeshStandardMaterial({ map: T.asphaltTex(), roughness: 0.38, metalness: 0.0, color: 0xb0b0b0 });
  const road = mesh(new THREE.PlaneGeometry(130, 14), asphalt, { rot: [-Math.PI / 2, 0, 0], pos: [-30, 0, 11], cast: false });
  S.add(road);
  // lane dashes
  const dashM = new THREE.MeshStandardMaterial({ color: 0xc9a83a, roughness: 0.5 });
  for (let x = -94; x < 34; x += 4) S.add(mesh(new THREE.PlaneGeometry(2, 0.14), dashM, { rot: [-Math.PI / 2, 0, 0], pos: [x, 0.005, 11], cast: false }));
  const conc = new THREE.MeshStandardMaterial({ map: T.concreteTex(), roughness: 0.55 });
  S.add(mesh(new THREE.BoxGeometry(130, 0.12, 4), conc, { pos: [-30, 0.06, 2], cast: false }));
  const curbM = new THREE.MeshStandardMaterial({ color: 0x6d6e66, roughness: 0.7 });
  S.add(mesh(new THREE.BoxGeometry(130, 0.14, 0.18), curbM, { pos: [-30, 0.07, 4.05] }));
  // far sidewalk
  S.add(mesh(new THREE.BoxGeometry(130, 0.12, 4), conc, { pos: [-30, 0.06, 20], cast: false }));
  // fake neon reflections on wet ground (additive streaks)
  const reflTex = canvasTex(256, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.filter = 'blur(12px)'; g.fillRect(w * 0.2, 0, w * 0.6, h);
  });
  const refl = (col, x, z, wdt, len, op = 0.5) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(wdt, len), new THREE.MeshBasicMaterial({ map: reflTex, color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.125, z + len / 2); S.add(m); return m;
  };
  E.refl = [refl(0xff3a5c, -1.3, 0.1, 2.4, 3.8, 0.35), refl(0x39ff88, 1.3, 0.1, 2.0, 3.8, 0.35), refl(0xd8ffd8, -3.4, 0.1, 3.5, 3.2, 0.1), refl(0xd8ffd8, 3.4, 0.1, 3.5, 3.2, 0.1)];

  // ----- store -----
  const facade = new THREE.MeshStandardMaterial({ map: T.facadeTex(), roughness: 0.85 });
  const store = group(S, [0, 0, 0]);
  // front wall pieces around windows/door (x -6..6, y 0..4.4)
  const wallPiece = (x0, x1, y0, y1) => {
    const g = new THREE.PlaneGeometry(x1 - x0, y1 - y0);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) { uv.setXY(i, lerp((x0 + 6) / 12, (x1 + 6) / 12, uv.getX(i)), lerp(y0 / 4.4, y1 / 4.4, uv.getY(i))); }
    store.add(mesh(g, facade, { pos: [(x0 + x1) / 2, (y0 + y1) / 2, 0], cast: false }));
  };
  wallPiece(-6, 6, 2.75, 4.4); wallPiece(-6, 6, 0, 0.55);
  wallPiece(-6, -5.4, 0.55, 2.75); wallPiece(5.4, 6, 0.55, 2.75); wallPiece(-1.2, -0.95, 0.55, 2.75); wallPiece(0.95, 1.2, 0.55, 2.75);
  wallPiece(-0.95, 0.95, 2.5, 2.75);
  // side walls / roof
  const sideM = new THREE.MeshStandardMaterial({ color: 0x4e5f55, roughness: 0.9 });
  store.add(mesh(new THREE.BoxGeometry(12, 4.4, 0.3), sideM, { pos: [0, 2.2, -10] }));
  store.add(mesh(new THREE.BoxGeometry(0.3, 4.4, 10), sideM, { pos: [-6, 2.2, -5] }));
  store.add(mesh(new THREE.BoxGeometry(0.3, 4.4, 10), sideM, { pos: [6, 2.2, -5] }));
  store.add(mesh(new THREE.BoxGeometry(12.4, 0.35, 0.35), sideM, { pos: [0, 4.5, 0] }));
  store.add(mesh(new THREE.BoxGeometry(12, 0.2, 10), sideM, { pos: [0, 4.35, -5] }));
  store.add(mesh(rbox(1.6, 0.9, 1.0, 0.05), new THREE.MeshStandardMaterial({ color: 0x8b8f88, roughness: 0.6 }), { pos: [3.5, 5.0, -2.5] }));
  // windows: emissive interior view + glass
  const view = T.windowViewTex();
  const winMat = new THREE.MeshStandardMaterial({ map: view, emissiveMap: view, emissive: 0xffffff, emissiveIntensity: 0.6, roughness: 0.2 });
  E.winMat = winMat;
  for (const [x0, x1] of [[-5.4, -1.2], [1.2, 5.4]]) {
    const g = new THREE.PlaneGeometry(x1 - x0, 2.2);
    store.add(mesh(g, winMat, { pos: [(x0 + x1) / 2, 1.65, -0.08], cast: false }));
    // frame
    const fm = new THREE.MeshStandardMaterial({ color: 0x2b2f2e, metalness: 0.6, roughness: 0.4 });
    store.add(mesh(new THREE.BoxGeometry(x1 - x0, 0.08, 0.12), fm, { pos: [(x0 + x1) / 2, 0.57, 0] }));
    store.add(mesh(new THREE.BoxGeometry(x1 - x0, 0.08, 0.12), fm, { pos: [(x0 + x1) / 2, 2.73, 0] }));
    store.add(mesh(new THREE.BoxGeometry(0.06, 2.2, 0.1), fm, { pos: [(x0 + x1) / 2, 1.65, 0] }));
  }
  // flyers on windows
  const flyers = [['HOT DOGS 99¢', '#e33b3b', '#fff'], ['OPEN 24H', '#f2d43a', '#111'], ['NO SKATING!', '#ffffff', '#e33b3b'], ['ATM', '#2e8fe6', '#fff']];
  flyers.forEach(([txt, bg, fg], i) => {
    const t = T.textSignTex([[txt, txt.length > 8 ? 70 : 96, fg]], { bg, w: 512, h: 300, seed: i + 30, border: '#111' });
    const x = [-4.5, -2.0, 2.2, 4.6][i], y = [1.0, 2.2, 1.1, 2.3][i];
    store.add(mesh(new THREE.PlaneGeometry(0.8, 0.47), new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.8 }), { pos: [x, y, 0.01], rot: [0, 0, (i % 2 ? 1 : -1) * 0.04], cast: false }));
  });
  // door
  const doorFrame = new THREE.MeshStandardMaterial({ color: 0x2b2f2e, metalness: 0.6, roughness: 0.4 });
  store.add(mesh(new THREE.BoxGeometry(0.08, 2.4, 0.12), doorFrame, { pos: [-0.92, 1.3, 0] }));
  store.add(mesh(new THREE.BoxGeometry(0.08, 2.4, 0.12), doorFrame, { pos: [0.92, 1.3, 0] }));
  store.add(mesh(new THREE.BoxGeometry(1.9, 0.08, 0.12), doorFrame, { pos: [0, 2.5, 0] }));
  store.add(mesh(new THREE.BoxGeometry(0.04, 2.35, 0.1), doorFrame, { pos: [0, 1.3, 0] }));
  store.add(mesh(new THREE.PlaneGeometry(1.84, 2.35), winMat, { pos: [0, 1.3, -0.1], cast: false }));
  store.add(mesh(new THREE.BoxGeometry(0.6, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xc9cdd1, metalness: 0.9, roughness: 0.3 }), { pos: [-0.45, 1.2, 0.06] }));
  store.add(mesh(new THREE.BoxGeometry(0.6, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xc9cdd1, metalness: 0.9, roughness: 0.3 }), { pos: [0.45, 1.2, 0.06] }));
  // neon sign
  const ns = T.neonSignTex();
  const signG = group(store, [0, 3.52, 0.1]);
  signG.add(mesh(new THREE.BoxGeometry(6.4, 1.6, 0.18), new THREE.MeshStandardMaterial({ map: ns.map, roughness: 0.6 }), { pos: [0, 0, 0] }));
  E.neon = {};
  for (const [k, tex] of Object.entries(ns.parts)) {
    const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: new THREE.Color(3, 3, 3) });
    signG.add(mesh(new THREE.PlaneGeometry(6.4, 1.6), m, { pos: [0, 0, 0.1], cast: false, noOutline: true }));
    E.neon[k] = m;
  }
  // "24 HRS" small neon box on window
  const hrs = canvasTex(512, 200, (g, w, h) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.font = '150px "Bangers"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = '#ff3a5c'; g.shadowBlur = 30; g.lineWidth = 10; g.strokeStyle = '#ff3a5c'; g.strokeText('24 HRS', w / 2, h / 2 + 8);
    g.shadowBlur = 0; g.lineWidth = 4; g.strokeStyle = '#fff'; g.strokeText('24 HRS', w / 2, h / 2 + 8);
  });
  E.hrs = new THREE.MeshBasicMaterial({ map: hrs, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: new THREE.Color(2.5, 2.5, 2.5) });
  store.add(mesh(new THREE.PlaneGeometry(1.4, 0.55), E.hrs, { pos: [3.4, 2.25, 0.03], cast: false }));
  // props on sidewalk
  const iceT = T.textSignTex([['ICE', 150, '#2e8fe6'], ['ice cold · 24/7', 40, '#111', 'Permanent Marker']], { bg: '#eef3f3', w: 512, h: 400 });
  store.add(mesh(rbox(1.2, 1.0, 0.7, 0.04), new THREE.MeshStandardMaterial({ map: iceT, roughness: 0.5 }), { pos: [-4.4, 0.62, 0.55] }));
  const canM = new THREE.MeshStandardMaterial({ color: 0x2f4b3a, roughness: 0.6, metalness: 0.3 });
  store.add(mesh(new THREE.CylinderGeometry(0.3, 0.27, 0.9, 20), canM, { pos: [5.2, 0.57, 0.6] }));
  store.add(mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 20), canM, { pos: [5.2, 1.04, 0.6] }));
  // newspaper box
  store.add(mesh(rbox(0.5, 1.0, 0.45, 0.03), new THREE.MeshStandardMaterial({ color: 0x2e6fb6, roughness: 0.5 }), { pos: [-2.2, 0.62, 0.9] }));

  // ----- neighbours -----
  const brick = new THREE.MeshStandardMaterial({ map: T.brickTex('#5a2e26', 7), roughness: 0.9 });
  const brick2 = new THREE.MeshStandardMaterial({ map: T.brickTex('#3e4a44', 9), roughness: 0.9 });
  const shut = new THREE.MeshStandardMaterial({ map: T.shutterTex(), roughness: 0.6, metalness: 0.3 });
  const litWin = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffd99a, emissiveIntensity: 0.9 });
  const darkWin = new THREE.MeshStandardMaterial({ color: 0x0b1210, roughness: 0.2, metalness: 0.5 });
  const R = rng(55);
  const block = (x0, x1, hgt, mat, zf = 0, face = 1) => {
    const w = x1 - x0, cx = (x0 + x1) / 2;
    S.add(mesh(new THREE.BoxGeometry(w, hgt, 10), mat, { pos: [cx, hgt / 2, zf - face * 5] }));
    for (let y = 3.2; y < hgt - 0.8; y += 2.6) for (let x = x0 + 1.2; x < x1 - 1; x += 2.4) {
      const lit = R() < 0.22;
      S.add(mesh(new THREE.PlaneGeometry(1.1, 1.4), lit ? litWin : darkWin, { pos: [x, y, zf + face * 0.02], rot: [0, face > 0 ? 0 : Math.PI, 0], cast: false }));
    }
  };
  block(6.2, 18, 5.4, brick2); // right neighbour with shutter
  S.add(mesh(new THREE.PlaneGeometry(7, 2.8), shut, { pos: [12, 1.5, 0.03], cast: false }));
  block(-24, -6.2, 8, brick);
  let x = -24;
  while (x > -100) { const w = 8 + R() * 10; block(x - w, x - 0.2, 5 + R() * 9, R() < .5 ? brick : brick2); x -= w; }
  x = 30; while (x > -100) { const w = 8 + R() * 12; block(x - w, x - 0.3, 5 + R() * 10, R() < .5 ? brick : brick2, 22, -1); x -= w; }
  // parked car across street
  const car = group(S, [-6, 0, 17.4]);
  const carM = new THREE.MeshStandardMaterial({ color: 0x6b1f22, roughness: 0.3, metalness: 0.5 });
  car.add(mesh(rbox(4.0, 0.75, 1.75, 0.2), carM, { pos: [0, 0.7, 0] }));
  car.add(mesh(rbox(2.3, 0.6, 1.6, 0.18), carM, { pos: [-0.3, 1.3, 0] }));
  car.add(mesh(rbox(2.2, 0.48, 1.62, 0.12), new THREE.MeshStandardMaterial({ color: 0x0c1412, roughness: 0.1, metalness: 0.8 }), { pos: [-0.3, 1.32, 0] }));
  for (const [cx, cz] of [[-1.3, -0.85], [1.3, -0.85], [-1.3, 0.85], [1.3, 0.85]]) car.add(mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 18), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }), { rot: [Math.PI / 2, 0, 0], pos: [cx, 0.34, cz] }));
  for (const s of [-1, 1]) car.add(mesh(new THREE.BoxGeometry(0.05, 0.12, 0.3), new THREE.MeshBasicMaterial({ color: 0x551010 }), { pos: [2.0, 0.85, s * 0.6] }));

  // ----- street lights + utility poles -----
  const poleM = new THREE.MeshStandardMaterial({ color: 0x3b3f3c, roughness: 0.6, metalness: 0.4 });
  const bulbM = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.4, 1.7) });
  E.lampX = [11, -9, -27, -45, -63, -81];
  E.bulbs = [];
  for (const lx of E.lampX) {
    S.add(mesh(new THREE.CylinderGeometry(0.07, 0.1, 6.2, 10), poleM, { pos: [lx, 3.1, 3.7] }));
    S.add(mesh(new THREE.BoxGeometry(0.08, 0.08, 1.6), poleM, { pos: [lx, 6.1, 4.4] }));
    S.add(mesh(rbox(0.6, 0.16, 0.34, 0.05), poleM, { pos: [lx, 6.05, 5.2] }));
    const b = mesh(new THREE.BoxGeometry(0.48, 0.03, 0.24), bulbM.clone(), { pos: [lx, 5.96, 5.2], cast: false });
    S.add(b); E.bulbs.push(b);
    // light pool decal on ground
    const pool = new THREE.Mesh(new THREE.CircleGeometry(3.2, 32), new THREE.MeshBasicMaterial({ map: reflTex, color: 0x8a7a40, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2; pool.position.set(lx, 0.13, 5); S.add(pool);
  }
  for (let px = 22; px > -100; px -= 20) {
    S.add(mesh(new THREE.CylinderGeometry(0.12, 0.14, 9, 8), new THREE.MeshStandardMaterial({ color: 0x3a2c22, roughness: 0.9 }), { pos: [px, 4.5, 19] }));
    S.add(mesh(new THREE.BoxGeometry(0.1, 0.1, 1.8), poleM, { pos: [px, 8.4, 19] }));
  }
  const wireM = new THREE.MeshBasicMaterial({ color: 0x050505 });
  for (const wz of [18.3, 19.7]) {
    const pts = []; for (let px = 22; px >= -98; px -= 2) pts.push(new THREE.Vector3(px, 8.4 - 0.5 * Math.pow(Math.sin(((22 - px) % 20) / 20 * Math.PI), 1), wz));
    S.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, 0.015, 4), wireM));
  }
  // payphone
  const pp = group(S, [-7.2, 0.12, 0.9]);
  pp.add(mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), poleM, { pos: [0, 0.8, 0] }));
  pp.add(mesh(rbox(0.55, 0.8, 0.35, 0.04), new THREE.MeshStandardMaterial({ color: 0x9aa3a5, metalness: 0.6, roughness: 0.4 }), { pos: [0, 1.5, 0.12] }));
  pp.add(mesh(rbox(0.12, 0.35, 0.1, 0.04), new THREE.MeshStandardMaterial({ color: 0x111111 }), { pos: [-0.2, 1.5, 0.32] }));

  // ----- lights -----
  S.add(new THREE.HemisphereLight(0x2b4a5a, 0x10140c, 0.55));
  const storeSpill = new THREE.SpotLight(0xcfffd9, 22, 16, 1.1, 0.7, 1.6);
  storeSpill.position.set(0, 2.2, -1.5); storeSpill.target.position.set(0, 0, 4); storeSpill.castShadow = true;
  storeSpill.shadow.mapSize.set(1024, 1024); storeSpill.shadow.bias = -0.0005;
  S.add(storeSpill, storeSpill.target);
  const neonL = new THREE.PointLight(0xff4a70, 10, 9, 1.6); neonL.position.set(-1.4, 3.3, 1.2); S.add(neonL);
  const neonG = new THREE.PointLight(0x39ff88, 10, 9, 1.6); neonG.position.set(1.5, 3.3, 1.2); S.add(neonG);
  E.neonLights = [neonL, neonG];
  E.street = [0, 1, 2].map(() => { const l = new THREE.PointLight(0xffd59a, 26, 14, 1.4); S.add(l); return l; });
  E.placeStreet = (xs) => E.street.forEach((l, i) => { l.position.set(xs[i] ?? 999, 5.8, 5.0); });
  E.placeStreet([-9, 11, -27]);
  const moon = new THREE.DirectionalLight(0x6f9fb0, 0.35); moon.position.set(-20, 30, 20); S.add(moon);
  return E;
}
