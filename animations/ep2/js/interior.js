import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { mesh, rbox, group, canvasTex, rng, lerp, grime, speckle, inkify } from './util.js';
import * as T from './env_tex.js';
import { buildCat } from './cat.js';

function envFromScene(renderer, build) {
  const s = new THREE.Scene(); build(s);
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(s, 0.03); pm.dispose();
  return rt.texture;
}

function bagGeo() {
  const w = 0.2, h = 0.27, g = new THREE.PlaneGeometry(w, h, 10, 10);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) / (w / 2), y = p.getY(i) / (h / 2);
    p.setZ(i, 0.05 * (1 - x * x) * (1 - Math.pow(Math.abs(y), 3)) + 0.004 * Math.sin(x * 9 + y * 4));
    p.setX(i, p.getX(i) * (1 - 0.08 * Math.pow(Math.abs(y), 4)));
  }
  g.computeVertexNormals(); g.translate(0, h / 2, 0);
  return g;
}

export function buildInterior(renderer) {
  RectAreaLightUniformsLib.init();
  const S = new THREE.Scene(); const I = { scene: S };
  S.background = new THREE.Color(0x0b100d);
  S.fog = new THREE.Fog(0x6f8a78, 12, 30);
  S.environment = envFromScene(renderer, (s) => {
    s.background = new THREE.Color(0x3a4a40);
    for (let z = -8; z <= 0; z += 2) for (const x of [-2, 2]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 4.2, 3.8) })); m.position.set(x, 3.1, z); s.add(m);
    }
    const f = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 0.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 2.2, 2.1) })); f.position.set(0, 1.2, -9.6); s.add(f);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), new THREE.MeshBasicMaterial({ color: 0x3f5a4c })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, -5); s.add(fl);
  });
  S.environmentIntensity = 0.55;

  // ----- room -----
  const floor = mesh(new THREE.PlaneGeometry(12, 10.6), new THREE.MeshStandardMaterial({ map: T.checkerTex(), roughness: 0.22, metalness: 0.05 }), { rot: [-Math.PI / 2, 0, 0], pos: [0, 0, -5.1], cast: false });
  S.add(floor);
  const wall = new THREE.MeshStandardMaterial({ map: T.wallTex(), roughness: 0.9 });
  S.add(mesh(new THREE.PlaneGeometry(10.6, 3.3), wall, { pos: [-6, 1.65, -5.1], rot: [0, Math.PI / 2, 0], cast: false }));
  S.add(mesh(new THREE.PlaneGeometry(10.6, 3.3), wall, { pos: [6, 1.65, -5.1], rot: [0, -Math.PI / 2, 0], cast: false }));
  S.add(mesh(new THREE.PlaneGeometry(12, 3.3), wall, { pos: [0, 1.65, -10.45], cast: false }));
  const ceil = mesh(new THREE.PlaneGeometry(12, 10.6), new THREE.MeshStandardMaterial({ map: T.ceilTex(), roughness: 0.9 }), { rot: [Math.PI / 2, 0, 0], pos: [0, 3.25, -5.1], cast: false });
  S.add(ceil);
  // front wall with night windows
  const night = canvasTex(1024, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#04090a'); gr.addColorStop(1, '#0d1a14');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const glow = (x, y, rad, c) => { const rg = g.createRadialGradient(x, y, 0, x, y, rad); rg.addColorStop(0, c); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, h); };
    glow(w * 0.3, 20, 160, 'rgba(255,60,90,0.5)'); glow(w * 0.7, 20, 160, 'rgba(60,255,140,0.45)');
    glow(w * 0.85, h * 0.35, 90, 'rgba(255,210,140,0.7)');
    g.fillStyle = '#0a0f0d'; g.fillRect(0, h * 0.72, w, h * 0.28);
    g.fillStyle = 'rgba(255,220,150,0.6)'; for (let i = 0; i < 12; i++) g.fillRect(40 + i * 80, h * 0.5, 14, 18);
  });
  const nightM = new THREE.MeshBasicMaterial({ map: night, color: new THREE.Color(2.0, 2.0, 2.0) });
  const frontWall = new THREE.MeshStandardMaterial({ map: T.wallTex('#9ab7a1', 9), roughness: 0.9 });
  for (const [x0, x1] of [[-6, -5.4], [-1.2, -0.95], [0.95, 1.2], [5.4, 6]]) S.add(mesh(new THREE.PlaneGeometry(x1 - x0, 3.3), frontWall, { pos: [(x0 + x1) / 2, 1.65, 0], rot: [0, Math.PI, 0], cast: false }));
  S.add(mesh(new THREE.PlaneGeometry(12, 0.55), frontWall, { pos: [0, 0.275, 0], rot: [0, Math.PI, 0], cast: false }));
  S.add(mesh(new THREE.PlaneGeometry(12, 0.75), frontWall, { pos: [0, 2.9, 0], rot: [0, Math.PI, 0], cast: false }));
  S.add(mesh(new THREE.PlaneGeometry(10.8, 2.0), nightM, { pos: [0, 1.55, 0.05], rot: [0, Math.PI, 0], cast: false }));
  // swinging glass entrance door (hinge on the left as seen from inside)
  const dfM = new THREE.MeshStandardMaterial({ color: 0x1d2220, metalness: 0.6, roughness: 0.35 });
  const dg = new THREE.MeshStandardMaterial({ color: 0xdfffee, transparent: true, opacity: 0.12, roughness: 0.05, depthWrite: false });
  const door = group(S, [0.92, 0, -0.02]); I.frontDoor = door;
  door.add(mesh(new THREE.BoxGeometry(0.05, 2.35, 0.05), dfM, { pos: [-0.025, 1.3, 0] }));
  door.add(mesh(new THREE.BoxGeometry(0.05, 2.35, 0.05), dfM, { pos: [-1.82, 1.3, 0] }));
  door.add(mesh(new THREE.BoxGeometry(1.84, 0.06, 0.05), dfM, { pos: [-0.92, 0.15, 0] }));
  door.add(mesh(new THREE.BoxGeometry(1.84, 0.06, 0.05), dfM, { pos: [-0.92, 2.45, 0] }));
  door.add(mesh(new THREE.PlaneGeometry(1.76, 2.26), dg, { pos: [-0.92, 1.3, 0], cast: false }));
  door.add(mesh(new THREE.BoxGeometry(0.5, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xc9cdd1, metalness: 0.9, roughness: 0.3 }), { pos: [-1.5, 1.15, -0.05] }));
  const bellM = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.25 });
  I.bell = mesh(new THREE.SphereGeometry(0.035, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6), bellM, { pos: [-1.6, 2.62, -0.06], rot: [Math.PI, 0, 0] });
  S.add(I.bell);

  // ----- ceiling fixtures -----
  const tubeM = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.7, 1.5) });
  const housing = new THREE.MeshStandardMaterial({ color: 0xbfc4bb, roughness: 0.6 });
  I.tubes = [];
  for (let z = -9; z <= -0.8; z += 2) for (const x of [-3.9, 0, 3.9]) {
    S.add(mesh(new THREE.BoxGeometry(0.34, 0.06, 1.3), housing, { pos: [x, 3.2, z], cast: false }));
    const t = mesh(new THREE.BoxGeometry(0.26, 0.02, 1.22), tubeM.clone(), { pos: [x, 3.165, z], cast: false });
    S.add(t); I.tubes.push(t);
  }
  // ----- gondola shelves with snacks -----
  const shelfM = new THREE.MeshStandardMaterial({ color: 0xd9ddd2, roughness: 0.5, metalness: 0.3 });
  const shelfEdge = new THREE.MeshStandardMaterial({ color: 0xc7322e, roughness: 0.5 });
  const bg = bagGeo();
  const snackMats = T.SNACKS.map((s, i) => new THREE.MeshStandardMaterial({ map: T.snackTex(s, i + 1), roughness: 0.35, metalness: 0.15 }));
  const R = rng(91);
  const placements = snackMats.map(() => []);
  const boxPl = [];
  const gondola = (cx, z0, z1, faces) => {
    const len = z1 - z0, cz = (z0 + z1) / 2;
    S.add(mesh(new THREE.BoxGeometry(0.12, 1.75, len), shelfM, { pos: [cx, 0.875, cz] }));
    S.add(mesh(new THREE.BoxGeometry(0.9, 0.12, len), shelfM, { pos: [cx, 0.06, cz] }));
    for (const y of [0.12, 0.55, 0.98, 1.4]) {
      S.add(mesh(new THREE.BoxGeometry(0.86, 0.025, len), shelfM, { pos: [cx, y, cz] }));
      for (const f of faces) {
        S.add(mesh(new THREE.BoxGeometry(0.015, 0.05, len), shelfEdge, { pos: [cx + f * 0.43, y - 0.005, cz], cast: false }));
        for (let z = z0 + 0.13; z < z1 - 0.1; z += 0.22 + R() * 0.03) {
          if (y < 0.3) { boxPl.push([cx + f * 0.3, y + 0.0125, z, f, R()]); continue; }
          const k = Math.floor(R() * snackMats.length);
          placements[k].push([cx + f * (0.34 + R() * 0.04), y + 0.0125, z + (R() - .5) * 0.03, f, (R() - .5) * 0.25]);
        }
      }
    }
  };
  gondola(-2.0, -7.6, -2.4, [1, -1]);
  gondola(2.0, -7.6, -3.0, [1, -1]);
  gondola(-5.6, -8.8, -1.0, [1]); // wall shelf left
  const dummy = new THREE.Object3D();
  placements.forEach((pl, k) => {
    const im = new THREE.InstancedMesh(bg, snackMats[k], pl.length);
    pl.forEach(([x, y, z, f, tilt], i) => {
      dummy.position.set(x, y, z); dummy.rotation.set(0, f > 0 ? Math.PI / 2 : -Math.PI / 2, 0); dummy.rotateX(-0.12 + tilt * 0.3); dummy.rotateZ(tilt * 0.4);
      dummy.scale.setScalar(0.9 + (i % 5) * 0.04); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
    });
    im.castShadow = false; im.receiveShadow = true; S.add(im);
  });
  {
    const boxM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.32, 0.2), boxM, boxPl.length);
    const cols = [0xe33b3b, 0xf2d43a, 0x2e8fe6, 0xff8a2a, 0x3ad16b].map((c) => new THREE.Color(c));
    boxPl.forEach(([x, y, z, f, rr], i) => { dummy.position.set(x, y + 0.16, z); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 0.8 + rr * 0.4, 1); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); im.setColorAt(i, cols[i % cols.length]); });
    S.add(im);
  }
  // hanging aisle signs
  const signs = [['SNACKS', '#f2d43a', '#c7322e', -2.0, -4.5], ['DRINKS', '#2e8fe6', '#ffffff', 2.0, -6.2], ['ICE COLD', '#ffffff', '#2e8fe6', 0, -8.6]];
  for (const [txt, bgc, fg, x, z] of signs) {
    const t = T.textSignTex([[txt, 120, fg]], { bg: bgc, w: 512, h: 200, border: '#111' });
    const sm = new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: 0.25 });
    const sg = mesh(new THREE.BoxGeometry(1.1, 0.42, 0.03), sm, { pos: [x, 2.55, z] });
    S.add(sg);
    S.add(mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.5, 4), shelfM, { pos: [x - 0.4, 3.0, z] }));
    S.add(mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.5, 4), shelfM, { pos: [x + 0.4, 3.0, z] }));
  }
  // posters on walls
  [['skate', -5.98, 2.1, -4.0, Math.PI / 2], ['band', -5.98, 2.1, -6.2, Math.PI / 2], ['hotdog', 5.98, 2.0, -5.0, -Math.PI / 2], ['glow', 5.98, 2.0, -7.2, -Math.PI / 2]].forEach(([k, x, y, z, ry], i) => {
    S.add(mesh(new THREE.PlaneGeometry(0.8, 1.12), new THREE.MeshStandardMaterial({ map: T.posterTex(k, i + 3), roughness: 0.7 }), { pos: [x, y, z], rot: [0, ry, (i % 2 ? 1 : -1) * 0.03], cast: false }));
  });

  // ----- fridge wall -----
  const fr = group(S, [0, 0, 0]); I.fridge = fr;
  const frameM = new THREE.MeshStandardMaterial({ color: 0x1d2220, metalness: 0.6, roughness: 0.35 });
  const backM = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xd9fff2, emissiveIntensity: 0.9 });
  fr.add(mesh(new THREE.PlaneGeometry(10, 2.2), backM, { pos: [0, 1.25, -10.42], cast: false }));
  fr.add(mesh(new THREE.BoxGeometry(10.2, 0.16, 0.9), frameM, { pos: [0, 0.08, -9.98] }));
  fr.add(mesh(new THREE.BoxGeometry(10.2, 0.95, 0.9), frameM, { pos: [0, 2.82, -9.98] }));
  fr.add(mesh(new THREE.BoxGeometry(0.1, 2.2, 0.85), frameM, { pos: [-5.05, 1.25, -10] }));
  fr.add(mesh(new THREE.BoxGeometry(0.1, 2.2, 0.85), frameM, { pos: [5.05, 1.25, -10] }));
  // header sign
  const hdr = T.textSignTex([['ICE COLD DRINKS', 110, '#ffffff']], { bg: '#1f6fb8', w: 1024, h: 160 });
  fr.add(mesh(new THREE.PlaneGeometry(4, 0.62), new THREE.MeshStandardMaterial({ map: hdr, emissiveMap: hdr, emissive: 0xffffff, emissiveIntensity: 0.5 }), { pos: [0, 2.85, -9.52], cast: false }));
  const wireM = new THREE.MeshStandardMaterial({ color: 0xd8dcdc, metalness: 0.8, roughness: 0.3 });
  const drinkMats = T.DRINKS.map((d) => new THREE.MeshStandardMaterial({ map: T.drinkTex(d), roughness: 0.3, metalness: 0.45 }));
  const canGeo = new THREE.CylinderGeometry(0.033, 0.033, 0.12, 16); canGeo.translate(0, 0.06, 0);
  const bottleGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.26, 14); bottleGeo.translate(0, 0.13, 0);
  const drinkPl = drinkMats.map(() => []);
  const RR = rng(33);
  const shelfYs = [0.2, 0.62, 1.04, 1.46, 1.88];
  for (const y of shelfYs) {
    for (let rz = 0; rz < 4; rz++) for (let x = -4.95; x < 4.95; x += 0.085) {
      const z = -10.32 + rz * 0.1;
      // brand blocks of 6
      const k = Math.floor((x + 5) / 0.51 + y * 3) % drinkMats.length;
      drinkPl[k].push([x, y + 0.01, z, (y > 1.3) ? 0 : 1, RR()]);
    }
    fr.add(mesh(new THREE.BoxGeometry(10, 0.012, 0.48), wireM, { pos: [0, y, -10.18], cast: false }));
    // price strip
    fr.add(mesh(new THREE.BoxGeometry(10, 0.04, 0.01), new THREE.MeshStandardMaterial({ color: 0xf2d43a, roughness: 0.6 }), { pos: [0, y - 0.01, -9.94], cast: false }));
  }
  {
    const n = shelfYs.length * 167, im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.006, 0.006, 0.48), wireM, n);
    let i = 0;
    for (const y of shelfYs) for (let x = -5; x < 5; x += 0.06) { dummy.position.set(x, y + 0.009, -10.18); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); im.setMatrixAt(i++, dummy.matrix); }
    im.count = i; fr.add(im);
  }
  I.cans = [];
  drinkPl.forEach((pl, k) => {
    const im = new THREE.InstancedMesh(bottleGeo, drinkMats[k], pl.length);
    const im2 = new THREE.InstancedMesh(canGeo, drinkMats[k], pl.length);
    let a = 0, b = 0;
    pl.forEach(([x, y, z, bottle, rr]) => {
      dummy.position.set(x, y, z); dummy.rotation.set(0, rr * 6, 0); dummy.scale.setScalar(1); dummy.updateMatrix();
      if (bottle) im.setMatrixAt(a++, dummy.matrix); else im2.setMatrixAt(b++, dummy.matrix);
    });
    im.count = a; im2.count = b; im.castShadow = im2.castShadow = false;
    fr.add(im, im2);
  });
  // doors
  const glassM = new THREE.MeshStandardMaterial({ color: 0xe8fff6, transparent: true, opacity: 0.14, roughness: 0.05, metalness: 0.2, depthWrite: false, envMapIntensity: 1.6 });
  const frost = canvasTex(256, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const gr = g.createLinearGradient(0, h, 0, h * 0.6); gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const gr2 = g.createLinearGradient(0, 0, w * 0.15, 0); gr2.addColorStop(0, 'rgba(255,255,255,0.4)'); gr2.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr2; g.fillRect(0, 0, w, h);
    const r = rng(5); speckle(g, w, h, r, 900, 'rgba(255,255,255,0.35)', 2);
  });
  const frostM = new THREE.MeshBasicMaterial({ map: frost, transparent: true, opacity: 0.6, depthWrite: false });
  I.doors = [];
  for (let i = 0; i < 8; i++) {
    const x0 = -5 + i * 1.25;
    const hinge = group(fr, [x0 + 0.02, 0, -9.56]);
    const d = group(hinge, [0, 0, 0]);
    d.add(mesh(new THREE.BoxGeometry(1.21, 0.06, 0.05), frameM, { pos: [0.605, 0.19, 0] }));
    d.add(mesh(new THREE.BoxGeometry(1.21, 0.06, 0.05), frameM, { pos: [0.605, 2.32, 0] }));
    d.add(mesh(new THREE.BoxGeometry(0.06, 2.19, 0.05), frameM, { pos: [0.03, 1.255, 0] }));
    d.add(mesh(new THREE.BoxGeometry(0.06, 2.19, 0.05), frameM, { pos: [1.18, 1.255, 0] }));
    d.add(mesh(new THREE.PlaneGeometry(1.1, 2.07), glassM, { pos: [0.605, 1.255, 0], cast: false, recv: false }));
    d.add(mesh(new THREE.PlaneGeometry(1.1, 2.07), frostM, { pos: [0.605, 1.255, 0.002], cast: false, recv: false }));
    d.add(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 8), wireM, { pos: [1.08, 1.3, 0.06] }));
    // LED strip
    d.add(mesh(new THREE.BoxGeometry(0.015, 2.1, 0.01), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.5, 3, 3) }), { pos: [0.065, 1.255, -0.03], cast: false }));
    I.doors.push(hinge);
  }
  // cold mist sprites (for the open door)
  const mistTex = canvasTex(128, 128, (g, w, h) => { const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, 'rgba(255,255,255,0.8)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, h); });
  I.mist = [];
  for (let i = 0; i < 14; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTex, transparent: true, opacity: 0, depthWrite: false, color: 0xe8fffa }));
    sp.userData.seed = i; S.add(sp); I.mist.push(sp);
  }

  // ----- counter + register -----
  const ctr = group(S, [4.2, 0, -1.8]); I.counter = ctr;
  const ctrTex = canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#2b5a46'; g.fillRect(0, 0, w, h);
    const r = rng(19); grime(g, w, h, r, 60, 'rgba(0,0,0,A)', 0.3, [20, 100]);
    // stickers
    const st = [['SK8', '#f2d43a', '#111'], ['NR', '#e33b3b', '#fff'], ['GLOW', '#39d17a', '#111'], ['OWL', '#fff', '#111'], ['2AM', '#2e8fe6', '#fff']];
    st.forEach(([t, b, f], i) => { g.save(); g.translate(120 + i * 180 + r() * 40, 200 + r() * 200); g.rotate((r() - .5) * 0.6); g.fillStyle = b; g.fillRect(-70, -40, 140, 80); g.fillStyle = f; g.font = '56px "Bangers"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); });
    graffitiLite(g, w, h, r);
  });
  ctr.add(mesh(new THREE.BoxGeometry(3.0, 0.98, 0.72), new THREE.MeshStandardMaterial({ map: ctrTex, roughness: 0.7 }), { pos: [0, 0.49, 0] }));
  const topM = new THREE.MeshStandardMaterial({ color: 0xcfc7b0, roughness: 0.35 });
  ctr.add(mesh(new THREE.BoxGeometry(3.1, 0.04, 0.8), topM, { pos: [0, 1.0, 0] }));
  // register
  const reg = group(ctr, [0.45, 1.02, -0.05]); I.reg = reg;
  const regM = new THREE.MeshStandardMaterial({ color: 0x3a3d3a, roughness: 0.5 });
  reg.add(mesh(rbox(0.46, 0.14, 0.38, 0.02), regM, { pos: [0, 0.07, 0] }));
  for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) reg.add(mesh(rbox(0.05, 0.02, 0.045, 0.008), new THREE.MeshStandardMaterial({ color: (i === 3 && j === 4) ? 0xc7322e : 0xd8d4c4, roughness: 0.6 }), { pos: [-0.12 + j * 0.06, 0.15, 0.12 - i * 0.055], noOutline: true }));
  const lcdC = document.createElement('canvas'); lcdC.width = 512; lcdC.height = 256;
  const lcdT = new THREE.CanvasTexture(lcdC); lcdT.colorSpace = THREE.SRGBColorSpace;
  I.lcd = { c: lcdC, g: lcdC.getContext('2d'), t: lcdT };
  const scr = group(reg, [0, 0.26, -0.1]); scr.rotation.x = -0.35;
  scr.add(mesh(rbox(0.4, 0.22, 0.06, 0.015), regM, {}));
  scr.add(mesh(new THREE.PlaneGeometry(0.34, 0.17), new THREE.MeshBasicMaterial({ map: lcdT, color: new THREE.Color(1.4, 1.4, 1.4) }), { pos: [0, 0, 0.031], cast: false, noOutline: true }));
  reg.add(mesh(new THREE.BoxGeometry(0.06, 0.14, 0.05), regM, { pos: [0, 0.16, -0.1] }));
  I.screen = scr;
  // candy rack + tip jar
  const jar = new THREE.MeshStandardMaterial({ color: 0xdff2ee, transparent: true, opacity: 0.35, roughness: 0.05 });
  ctr.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 18), jar, { pos: [-0.6, 1.12, 0.05] }));
  const tipT = T.textSignTex([['TIPS', 60, '#111']], { bg: '#ffffff', w: 256, h: 100 });
  ctr.add(mesh(new THREE.PlaneGeometry(0.12, 0.05), new THREE.MeshStandardMaterial({ map: tipT }), { pos: [-0.6, 1.1, 0.132], cast: false }));
  const rack = group(ctr, [0.95, 1.02, 0.1]);
  rack.add(mesh(new THREE.BoxGeometry(0.5, 0.35, 0.25), new THREE.MeshStandardMaterial({ color: 0xc7322e, roughness: 0.5 }), { pos: [0, 0.175, 0] }));
  for (let i = 0; i < 8; i++) rack.add(mesh(new THREE.BoxGeometry(0.1, 0.03, 0.08), new THREE.MeshStandardMaterial({ color: [0xf2d43a, 0x2e8fe6, 0x39d17a, 0xff8a2a][i % 4] }), { pos: [-0.18 + (i % 4) * 0.12, 0.2 + Math.floor(i / 4) * 0.1, 0.1], rot: [-0.4, 0, 0], noOutline: true }));
  // back shelf behind cashier
  const bs = group(S, [4.2, 0, -3.35]);
  bs.add(mesh(new THREE.BoxGeometry(3.0, 2.4, 0.3), shelfM, { pos: [0, 1.2, 0] }));
  for (let i = 0; i < 4; i++) for (let j = 0; j < 14; j++) bs.add(mesh(new THREE.BoxGeometry(0.15, 0.22, 0.12), new THREE.MeshStandardMaterial({ color: [0xe33b3b, 0xf2d43a, 0x2e8fe6, 0xffffff, 0x39d17a][(i * 3 + j) % 5], roughness: 0.6 }), { pos: [-1.35 + j * 0.2, 1.05 + i * 0.36, 0.2], noOutline: true, cast: false }));
  const emp = T.textSignTex([['EMPLOYEE', 64, '#111'], ['OF THE MONTH', 50, '#111'], ['(again)', 46, '#c7322e', 'Permanent Marker']], { bg: '#f4efe0', w: 400, h: 300, border: '#c7322e' });
  bs.add(mesh(new THREE.PlaneGeometry(0.5, 0.38), new THREE.MeshStandardMaterial({ map: emp, roughness: 0.7 }), { pos: [-1.0, 2.55, 0.17], cast: false }));

  // cat
  const cat = buildCat(); I.cat = cat;
  cat.root.position.set(4.35, 0.62, -2.55);
  S.add(cat.root);
  const stool = new THREE.MeshStandardMaterial({ color: 0x8a1f22, roughness: 0.5 });
  S.add(mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 20), stool, { pos: [4.35, 0.6, -2.55] }));
  S.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), frameM, { pos: [4.35, 0.3, -2.55] }));

  // ----- lights -----
  S.add(new THREE.HemisphereLight(0xe8f5df, 0x39463a, 0.7));
  for (const x of [-3.9, 0, 3.9]) {
    const ra = new THREE.RectAreaLight(0xf2fff0, 3.2, 0.35, 9);
    ra.position.set(x, 3.15, -4.8); ra.lookAt(x, 0, -4.8); S.add(ra);
  }
  const sun = new THREE.DirectionalLight(0xf4ffee, 1.1);
  sun.position.set(1.5, 6, -3.5); sun.target.position.set(0, 0, -5); sun.castShadow = true;
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 0.5, far: 15 });
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -0.0008;
  S.add(sun, sun.target);
  I.fridgeLight = new THREE.PointLight(0xd8fff0, 0, 3.5, 1.5); I.fridgeLight.position.set(-0.6, 1.5, -9.8); S.add(I.fridgeLight);
  I.key = new THREE.SpotLight(0xffe2c0, 0, 6, 0.5, 0.8, 1.5); S.add(I.key, I.key.target); // per-shot key light
  return I;
}

function graffitiLite(g, w, h, r) {
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 4;
  for (let i = 0; i < 6; i++) { g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - .5) * 80; y += (r() - .5) * 40; g.lineTo(x, y); } g.stroke(); }
}

export function drawLCD(I, lines, cursor) {
  const { g, c, t } = I.lcd;
  g.fillStyle = '#071a10'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = 'rgba(80,255,150,0.06)'; for (let y = 0; y < c.height; y += 4) g.fillRect(0, y, c.width, 2);
  g.font = '50px "VT323"'; g.fillStyle = '#7dffb0'; g.shadowColor = '#3dff8a'; g.shadowBlur = 10;
  lines.forEach((ln, i) => g.fillText(ln, 22, 58 + i * 56));
  if (cursor) { const i = lines.length - 1; const wdt = g.measureText(lines[i] || '').width; g.fillRect(26 + wdt, 22 + i * 56, 20, 42); }
  g.shadowBlur = 0;
  t.needsUpdate = true;
}
