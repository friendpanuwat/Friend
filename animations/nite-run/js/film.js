import * as THREE from 'three';
import { buildMilo, buildBoard, buildCan } from './milo.js';
import { buildExterior } from './exterior.js';
import { buildInterior, drawLCD } from './interior.js';
import * as OV from './overlay.js';
import { clamp, lerp, smooth, easeOut, easeIn, easeInOut, range, keys, noise1, rng, canvasTex, mesh } from './util.js';

// 96 BPM -> beat 0.625 s, bar 2.5 s. Every cut lands on a beat.
export const SHOTS = [
  ['s1_establish', 0.0, 3.75],
  ['s2_rollin', 3.75, 6.25],
  ['s3_hero', 6.25, 8.75],
  ['s4_aisle', 8.75, 11.25],
  ['s5_fridge', 11.25, 13.75],
  ['s6_face', 13.75, 16.25],
  ['s7_cat', 16.25, 18.75],
  ['s8_lcd', 18.75, 20.0],
  ['s9_skate', 20.0, 23.75],
  ['s10_crane', 23.75, 27.5],
  ['s11_title', 27.5, 30.0],
];

export async function build({ renderer, post, overlay }) {
  const E = buildExterior(renderer);
  const I = buildInterior(renderer);
  const M = buildMilo();
  const B = buildBoard();
  const can = buildCan('GLOW');
  const cam = new THREE.PerspectiveCamera(50, 1080 / 1920, 0.03, 400);
  const u = post.u;
  // coins
  const coinM = new THREE.MeshStandardMaterial({ color: 0xd8c9a0, metalness: 0.9, roughness: 0.3 });
  const coins = new THREE.Group();
  for (let i = 0; i < 4; i++) coins.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.003, 16), coinM, { pos: [i * 0.02 - 0.03, 0.0015 + (i % 2) * 0.003, (i % 3) * 0.012] }));
  // can spray droplets (S9)
  const dropM = new THREE.MeshBasicMaterial({ color: 0xdfffe8, transparent: true, opacity: 0.8 });
  const drops = Array.from({ length: 10 }, () => new THREE.Mesh(new THREE.SphereGeometry(0.004, 6, 4), dropM));
  // title scene
  const TS = new THREE.Scene(); TS.background = new THREE.Color(0x050806);
  const bokehT = canvasTex(128, 128, (g) => { const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.7, 'rgba(255,255,255,0.6)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(0, 0, 128, 128); });
  const br = rng(12); const bokeh = [];
  for (let i = 0; i < 26; i++) {
    const c = [0xff3a5c, 0x39ff88, 0xffd23a, 0xd8ffe0][i % 4];
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: bokehT, color: c, transparent: true, opacity: 0.25 + br() * 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
    sp.userData = { x: (br() - .5) * 6, y: (br() - .5) * 10, z: -4 - br() * 6, s: 0.4 + br() * 1.4, sp: br() };
    TS.add(sp); bokeh.push(sp);
  }

  const attach = (obj, parent, pos = [0, 0, 0], rot = [0, 0, 0]) => { parent.add(obj); obj.position.set(...pos); obj.rotation.set(...rot); obj.visible = true; };
  const shake = (t, amt, seed = 1) => [noise1(t * 1.3, seed) * amt, noise1(t * 1.1, seed + 3) * amt, noise1(t * 0.9, seed + 7) * amt];
  const setCam = (pos, tgt, fov, roll = 0, sh = 0, t = 0) => {
    cam.position.set(...pos); cam.fov = fov;
    const s = shake(t, sh);
    cam.lookAt(tgt[0] + s[0], tgt[1] + s[1], tgt[2] + s[2]);
    cam.rotateZ(roll + s[2] * 0.3);
  };
  const plant = (groundY) => {
    M.root.updateMatrixWorld(true);
    let minY = Infinity; const v = new THREE.Vector3();
    for (const s of ['L', 'R']) { const sole = M.leg[s].shoe.children[0]; sole.getWorldPosition(v); minY = Math.min(minY, v.y - 0.0325); }
    M.hips.position.y += groundY - minY;
  };
  const skatePose = (t, lean = 0) => {
    M.hips.position.y = 0.9;
    for (const [s, sg] of [['L', 1], ['R', -1]]) {
      const l = M.leg[s];
      l.hip.rotation.set(-0.32, 0, sg * 0.2); l.knee.rotation.x = 0.62; l.ankle.rotation.set(-0.3, 0, -sg * 0.2);
    }
    M.hips.rotation.set(0, 0, lean * 0.1);
    M.torso.rotation.set(0.18, -0.35, -lean * 0.15);
    M.head.rotation.set(0, -0.55, 0);
    M.arm.L.sh.rotation.set(-0.2, 0, 0.55 + Math.sin(t * 2) * 0.05); M.arm.L.el.rotation.x = -0.5;
    M.arm.R.sh.rotation.set(0.15, 0, -0.5); M.arm.R.el.rotation.x = -0.4;
  };
  const boardUnderArm = () => { attach(B, M.torso, [-0.3, 0.08, 0.03], [0, Math.PI / 2, Math.PI / 2 - 0.12]); M.arm.R.sh.rotation.set(0.05, 0, -0.42); M.arm.R.el.rotation.set(-0.9, 0, 0); };
  const resetPost = () => {
    u.uFish.value = 0.2; u.uCA.value = 0.003; u.uVig.value = 0.6; u.uGrain.value = 0.075; u.uFade.value = 0; u.uFlash.value = 0;
    u.uLift.value.set(0.015, 0.03, 0.022); u.uGain.value.set(1.0, 1.03, 0.92); u.uGamma.value.set(0.98, 1.04, 0.98); u.uSat.value = 0.9;
    u.uTint.value.set(-0.005, 0.012, 0.004);
    post.bloom.strength = 0.4; post.bloom.threshold = 0.92; post.bloom.radius = 0.5;
  };
  const neonFlicker = (t) => {
    const f = (t > 1.2 && t < 1.32) || (t > 1.45 && t < 1.5) || (t > 9.3 && t < 9.36) || (t > 22.1 && t < 22.2) ? 0.15 : 1.0;
    const buzz = 0.93 + 0.07 * noise1(t * 40, 3);
    E.neon.owl.color.setScalar(3 * f * buzz); E.neon.nite.color.setScalar(3 * buzz); E.neon.icon.color.setScalar(2.6 * buzz);
    E.neonLights[1].intensity = 10 * f; E.refl[1].material.opacity = 0.35 * f;
  };
  const mistUpdate = (lt, on) => {
    I.mist.forEach((sp, i) => {
      const r = rng(i * 7 + 1); const a = r(), b = r(), c = r();
      const life = clamp((lt - on - a * 0.4) / 1.6);
      sp.visible = life > 0 && life < 1;
      sp.position.set(-0.65 + (b - .5) * 1.0 + life * (b - .5) * 0.6, 0.4 + c * 1.0 - life * 0.3, -9.4 + life * 0.7);
      sp.scale.setScalar(0.25 + life * 0.5);
      sp.material.opacity = Math.sin(life * Math.PI) * 0.09;
    });
  };
  const hideMist = () => I.mist.forEach((s) => (s.visible = false));

  const shots = {
    s1_establish(t, d) {
      E.scene.add(M.root); M.root.visible = false; B.visible = false;
      const k = easeInOut(t / d);
      setCam([lerp(4.6, 2.3, k), lerp(0.45, 0.8, k), lerp(15.5, 10.2, k)], [lerp(0.3, 0, k), lerp(1.9, 2.15, k), 0], 52, -0.03, 0.02, t);
      u.uFish.value = 0.22; u.uFade.value = 1 - smooth(range(t, 0, 1.0));
      E.placeStreet([11, -9, 999]);
      OV.text({ txt: '1:12 AM', x: 250, y: 330, size: 92, rot: -6, fill: '#f4f1e6', p: range(t, 1.25, 1.9), out: range(t, 3.3, 3.7), stagger: 0.12 });
      return { scene: E.scene, exposure: 1.05 };
    },
    s2_rollin(t, d) {
      E.scene.add(M.root); E.scene.add(B); M.root.visible = true;
      const stopT = 1.35;
      const x = t < stopT ? lerp(7.5, 0.55, easeOut(t / stopT)) : 0.55;
      const z = 2.0;
      B.position.set(x, 0.097, z); B.rotation.set(0, 0, 0); B.roll(7.5 - x);
      const kick = keys(t, [[stopT - 0.05, 0], [stopT + 0.12, -0.28], [stopT + 0.6, -0.26], [stopT + 0.85, 0]]);
      B.rotation.z = kick; B.position.y = 0.097 + Math.abs(kick) * 0.32;
      M.root.position.set(x, 0, z); M.root.rotation.set(0, 0, 0);
      M.reset(); skatePose(t, Math.sin(t * 3) * 0.3);
      M.torso.rotation.z += kick * -0.6; M.torso.rotation.y = -0.35 + smooth(range(t, stopT, d)) * 0.35;
      M.head.rotation.y = lerp(-0.55, -0.1, smooth(range(t, stopT, d))); M.head.rotation.x = -0.1;
      M.face({ blink: 0.35, gaze: [-0.4, 0.1], smirk: 0.3 });
      M.hips.position.y = 0.94; plant(0.097 + 0.11 + Math.abs(kick) * 0.2);
      setCam([-0.55, 0.16, 2.28], [2.4, lerp(0.55, 0.8, smooth(range(t, 0.8, 2.2))), 1.95], 82, 0.05, 0.015, t + 10);
      u.uFish.value = 0.42; u.uCA.value = 0.005;
      E.placeStreet([-9, 11, 999]);
      return { scene: E.scene, exposure: 1.1 };
    },
    s3_hero(t, d) {
      E.scene.add(M.root); M.root.visible = true;
      M.reset();
      M.root.position.set(0.32, 0, 1.55); M.root.rotation.set(0, 0.12, 0);
      boardUnderArm();
      // left hand up to beanie, look up at the sign, then glance back at the door when called
      const up = smooth(range(t, 0.15, 0.6)) * (1 - smooth(range(t, 1.45, 1.9)));
      M.arm.L.sh.rotation.set(lerp(0.05, -2.5, up), 0, lerp(0.12, 0.45, up)); M.arm.L.el.rotation.x = lerp(-0.15, -1.7, up);
      const call = smooth(range(t, 1.25, 1.6));
      M.head.rotation.set(lerp(-0.3, -0.05, call), lerp(0, 0.9, call), 0);
      M.torso.rotation.y = call * 0.25;
      M.face({ blink: t > 1.1 && t < 1.2 ? 1 : 0.3, gaze: [call * 0.9, 0.3 - call * 0.3], smirk: call * 0.8, smile: call * 0.5, brow: call });
      plant(0.12);
      const k = easeInOut(t / d);
      setCam([0.22, 0.3, lerp(2.95, 2.62, k)], [0.3, 1.5, 1.35], 74, -0.06, 0.012, t + 20);
      u.uFish.value = 0.3;
      E.placeStreet([-9, 11, 999]);
      OV.text({ txt: 'YO MILO!', x: 500, y: 430, size: 150, rot: -14, p: range(t, 1.25, 1.65), stagger: 0.09, fill: '#e8222a', jitter: 6 });
      return { scene: E.scene, exposure: 1.05 };
    },
    s4_aisle(t, d) {
      I.scene.add(M.root); M.root.visible = true; hideMist(); I.doors.forEach((h) => (h.rotation.y = 0));
      M.reset();
      const dist = t * 1.3; const mz = -1.1 - dist;
      M.root.position.set(0.05, 0, mz); M.root.rotation.set(0, Math.PI + Math.sin(t * 1.1) * 0.04, 0);
      M.walk(dist / 1.25 + 0.1, 1);
      boardUnderArm();
      M.head.rotation.set(0.05, Math.sin(t * 1.4) * 0.35, 0);
      M.face({ blink: (t > 1.6 && t < 1.7) ? 1 : 0.3, gaze: [Math.sin(t * 1.4) * 0.6, 0], smirk: 0.2 });
      plant(0);
      setCam([0.25, 0.42, mz - 1.75], [0.05, 1.25, mz], 96, 0.04, 0.02, t + 30);
      u.uFish.value = 0.55; u.uCA.value = 0.006;
      u.uLift.value.set(0.02, 0.04, 0.025);
      return { scene: I.scene, exposure: 1.0 };
    },
    s5_fridge(t, d) {
      I.scene.add(M.root); M.root.visible = true; B.visible = false;
      M.reset();
      M.root.position.set(-0.6, 0, -8.85); M.root.rotation.set(0, Math.PI + 0.05, 0);
      M.torso.rotation.x = 0.2; M.hips.rotation.x = 0.05;
      const open = easeOut(range(t, 0.15, 0.75));
      I.doors[3].rotation.y = -open * 1.45;
      I.fridgeLight.intensity = open * 3.2;
      mistUpdate(t, 0.25);
      // reach in and take the can
      const reach = smooth(range(t, 0.75, 1.25)), back = smooth(range(t, 1.55, 2.2));
      const r = reach * (1 - back);
      M.arm.R.sh.rotation.set(lerp(0.05, -1.45, reach) + back * 0.6, lerp(0, -0.2, reach), lerp(-0.12, 0.12, reach));
      M.arm.R.el.rotation.x = lerp(-0.15, -0.25, r) - back * 1.1;
      M.arm.R.hand.rotation.set(0, lerp(0, 1.5, reach), 0);
      const grabbed = t > 1.42;
      if (grabbed) attach(can, M.arm.R.hand, [0, -0.07, 0.03], [Math.PI / 2, 0, 0]);
      else attach(can, I.scene, [-0.5, 1.47, -9.99], [0, 0, 0]);
      M.arm.R.fing.rotation.x = grabbed ? 1.3 : 0.4;
      M.head.rotation.set(lerp(0.15, 0.32, smooth(range(t, 0.6, 1.4))), -0.05, 0);
      M.face({ blink: t > 0.4 && t < 0.5 ? 1 : 0.2 + open * 0.05, gaze: [0.1, -0.5 * reach], smile: 0.35 * back, smirk: 0.4 * back, open: 0.12 * open });
      plant(0);
      setCam([-0.42, 1.63, -10.22], [-0.6, 1.6, -8.9], 66, 0.02, 0.008, t + 40);
      u.uFish.value = 0.5; u.uCA.value = 0.007;
      u.uLift.value.set(0.03, 0.05, 0.05); u.uGain.value.set(0.96, 1.04, 1.02);
      post.bloom.strength = 0.45; post.bloom.threshold = 0.9;
      return { scene: I.scene, exposure: 0.95 };
    },
    s6_face(t, d) {
      I.scene.add(M.root); M.root.visible = true; B.visible = false;
      M.reset();
      I.doors[3].rotation.y = -1.45 * (1 - smooth(range(t, 0.2, 1.2))); I.fridgeLight.intensity = 3 * (1 - smooth(range(t, 0.2, 1.2)));
      mistUpdate(t + 2.2, 0.25);
      M.root.position.set(-0.55, 0, -8.85); M.root.rotation.set(0, lerp(2.2, 0.35, easeOut(range(t, 0, 0.6))), 0);
      attach(can, M.arm.R.hand, [0, -0.07, 0.03], [Math.PI / 2, 0, 0]);
      const lift = smooth(range(t, 0.2, 0.8));
      M.arm.R.sh.rotation.set(lerp(-0.3, -1.05, lift), 0.25, lerp(-0.1, 0.12, lift)); M.arm.R.el.rotation.x = lerp(-1.0, -1.85, lift);
      M.arm.R.hand.rotation.set(0.0, lerp(1.0, 1.9, lift), 0); M.arm.R.fing.rotation.x = 1.3;
      const sm = smooth(range(t, 0.7, 1.1));
      M.head.rotation.set(0.04 - sm * 0.06, -0.15 + sm * 0.08, sm * 0.08);
      M.face({ blink: (t > 1.9 && t < 2.0) ? 1 : 0.32, gaze: [-0.35 * (1 - sm) + 0.25 * sm, 0.05], smirk: sm, smile: 0.6 * sm, brow: 0.9 * smooth(range(t, 0.85, 1.1)) });
      plant(0);
      const k = easeInOut(t / d);
      setCam([lerp(0.12, 0.0, k), 1.5, lerp(-7.55, -7.75, k)], [-0.6, 1.58, -8.85], 34, 0.08 - k * 0.04, 0.004, t + 50);
      I.key.position.set(0.8, 2.2, -7.6); I.key.target.position.set(-0.6, 1.6, -8.85); I.key.intensity = 14;
      u.uFish.value = 0.12;
      u.uLift.value.set(0.025, 0.04, 0.035);
      OV.text({ txt: 'the usual.', x: 560, y: 1460, size: 104, rot: -8, fill: '#f4f1e6', p: range(t, 1.0, 1.5), stagger: 0.08 });
      return { scene: I.scene, exposure: 1.0 };
    },
    s7_cat(t, d) {
      I.key.intensity = 0; I.fridgeLight.intensity = 0; I.doors[3].rotation.y = 0; hideMist();
      I.scene.add(M.root); M.root.visible = true;
      M.reset();
      M.root.position.set(3.82, 0, -0.68); M.root.rotation.set(0, Math.PI - 0.1, 0);
      // hand places the can, then slides coins
      const place = smooth(range(t, 0.0, 0.45)), withdraw = smooth(range(t, 0.55, 1.0));
      if (t < 0.5) { attach(can, M.arm.R.hand, [0, -0.07, 0.03], [Math.PI / 2, 0, 0]); }
      else attach(can, I.scene, [3.76, 1.02, -1.58], [0, 0.6, 0]);
      M.arm.R.sh.rotation.set(lerp(-0.9, -1.25, place) + withdraw * 1.0, 0, 0.15); M.arm.R.el.rotation.x = lerp(-0.6, -0.3, place) - withdraw * 0.4;
      M.arm.R.hand.rotation.set(-0.4, 1.4, 0);
      const coin = smooth(range(t, 0.8, 1.25)), cw = smooth(range(t, 1.35, 1.8));
      M.arm.L.sh.rotation.set(lerp(0.05, -1.2, coin) + cw * 1.1, 0, -0.1); M.arm.L.el.rotation.x = lerp(-0.15, -0.35, coin);
      M.arm.L.hand.rotation.set(-0.5, -1.4, 0);
      if (t < 1.25) attach(coins, M.arm.L.hand, [0, -0.09, 0.02], [Math.PI / 2, 0, 0]);
      else attach(coins, I.scene, [3.92, 1.022, -1.42], [0, 0.3, 0]);
      plant(0);
      // the cat yawns, blinks, taps the register
      const yawn = Math.sin(clamp(range(t, 0.15, 1.35)) * Math.PI);
      const tap = Math.sin(clamp(range(t, 1.7, 2.15)) * Math.PI);
      I.cat.pose({ yawn, blink: 0.6 + 0.3 * smooth(range(t, 1.3, 1.5)) * (1 - smooth(range(t, 1.9, 2.1))), headTilt: 0.12 * Math.sin(t * 1.2), breathe: Math.sin(t * 3), pawR: 0.3 + tap * 0.35 });
      I.cat.head.rotation.y = -0.15;
      setCam([3.98, 1.1, -1.3], [4.35, 1.5, -2.55], 80, -0.05, 0.01, t + 60);
      u.uFish.value = 0.55; u.uCA.value = 0.007;
      u.uLift.value.set(0.02, 0.045, 0.025);
      drawLCD(I, ['GLOW SODA   1.99'], Math.floor(t * 3) % 2 === 0);
      OV.text({ txt: '*yawn*', x: 760, y: 560, size: 80, rot: 10, fill: '#f4f1e6', p: range(t, 0.45, 0.8), out: range(t, 1.4, 1.6), stagger: 0.1 });
      return { scene: I.scene, exposure: 1.0 };
    },
    s8_lcd(t, d) {
      I.scene.add(M.root); M.root.visible = false;
      I.cat.pose({ blink: 0.85, pawR: 0.5 + Math.sin(clamp(range(t, 0.05, 0.3)) * Math.PI) * 0.3 + Math.sin(clamp(range(t, 0.62, 0.85)) * Math.PI) * 0.3, breathe: Math.sin(t * 3) });
      const L = ['GLOW SODA   1.99'];
      if (t > 0.18) L.push('TOTAL       1.99');
      if (t > 0.5) L.push('PAID        2.00');
      if (t > 0.82) L.push('CHANGE      0.01');
      drawLCD(I, L, Math.floor(t * 4) % 2 === 0);
      const k = easeOut(t / d);
      setCam([4.66, lerp(1.72, 1.66, k), lerp(-0.72, -0.86, k)], [4.6, 1.31, -1.95], 36, -0.05, 0.004, t + 70);
      u.uFish.value = 0.35; u.uCA.value = 0.008;
      post.bloom.strength = 0.5; post.bloom.threshold = 0.8;
      OV.text({ txt: '1 cent. nice.', x: 540, y: 1430, size: 84, rot: -5, fill: '#f4f1e6', p: range(t, 0.95, 1.2), stagger: 0.05 });
      return { scene: I.scene, exposure: 1.0 };
    },
    s9_skate(t, d) {
      E.scene.add(M.root); E.scene.add(B); M.root.visible = true; B.visible = true;
      const v = 4.2, x = -1.0 - v * t, z = 2.6;
      B.position.set(x, 0.097, z); B.rotation.set(0, 0, 0); B.roll(v * t);
      M.reset();
      M.root.position.set(x, 0, z); M.root.rotation.set(0, 0, 0);
      skatePose(t, Math.sin(t * 2.4) * 0.5);
      M.head.rotation.set(0, -0.35, 0);
      // can in right hand: crack it, then drink
      attach(can, M.arm.R.hand, [0, -0.07, 0.03], [Math.PI / 2, 0, 0]);
      const hold = 1, crack = Math.sin(clamp(range(t, 0.55, 1.0)) * Math.PI), drink = Math.sin(clamp(range(t, 1.5, 2.9)) * Math.PI);
      M.arm.R.sh.rotation.set(-0.7 - drink * 0.8, 0.2, 0.15 + drink * 0.15); M.arm.R.el.rotation.x = -1.3 - drink * 0.9;
      M.arm.R.hand.rotation.set(-drink * 0.6, 1.6, 0); M.arm.R.fing.rotation.x = 1.3;
      M.arm.L.sh.rotation.set(lerp(-0.2, -0.8, crack), lerp(0, 0.4, crack), lerp(0.55, -0.1, crack)); M.arm.L.el.rotation.x = lerp(-0.5, -1.5, crack);
      M.head.rotation.x = -drink * 0.45; M.head.rotation.y = -0.35 + drink * 0.3;
      M.face({ blink: drink > 0.5 ? 0.9 : 0.3, open: drink * 0.3, smirk: 0.5 * (1 - drink), smile: 0.4 });
      plant(0.097 + 0.11);
      // spray on crack
      drops.forEach((dr, i) => {
        const r = rng(i + 3), life = range(t, 0.78 + r() * 0.05, 1.15 + r() * 0.1);
        dr.visible = life > 0 && life < 1;
        can.add(dr); dr.position.set((r() - .5) * 0.02 + (r() - .5) * 0.12 * life, 0.12 + life * 0.1 * r() + 0.05 * life, (r() - .5) * 0.12 * life);
      });
      const ahead = 1.1 - t * 0.05;
      setCam([x - ahead, 0.5, z + 1.75], [x + 0.15, 1.05, z], 62, 0.06, 0.03, t + 80);
      u.uFish.value = 0.32;
      E.placeStreet([-9, -27, 11]);
      OV.text({ txt: 'PSSHT', x: 300, y: 760, size: 120, rot: -12, fill: '#39ff88', p: range(t, 0.8, 1.0), out: range(t, 1.35, 1.6), stagger: 0.05, font: 'Bangers', sw: 20 });
      return { scene: E.scene, exposure: 1.1 };
    },
    s10_crane(t, d) {
      E.scene.add(M.root); E.scene.add(B); M.root.visible = true; B.visible = true;
      const v = 4.2, T0 = 3.75, x = -1.0 - v * (T0 + t), z = 2.6;
      B.position.set(x, 0.097, z); B.rotation.set(0, 0, 0); B.roll(v * (T0 + t));
      M.reset(); M.root.position.set(x, 0, z); M.root.rotation.set(0, 0, 0);
      skatePose(t + T0, Math.sin((t + T0) * 2.4) * 0.5);
      attach(can, M.arm.R.hand, [0, -0.07, 0.03], [Math.PI / 2, 0, 0]);
      M.arm.R.sh.rotation.set(0.1, 0, -0.55); M.arm.R.el.rotation.x = -0.4; M.arm.R.fing.rotation.x = 1.3;
      // raise the can like a toast near the end
      const toast = smooth(range(t, 1.2, 1.8));
      M.arm.L.sh.rotation.set(-0.2 - toast * 2.4, 0, 0.55 - toast * 0.2); M.arm.L.el.rotation.x = -0.5 + toast * 0.2;
      M.face({});
      plant(0.097 + 0.11);
      drops.forEach((dr) => (dr.visible = false));
      const k = easeInOut(t / d);
      setCam([lerp(-12.5, -11.0, k), lerp(0.9, 9.5, k), lerp(4.2, 7.5, k)], [lerp(x - 1, -44, k), lerp(0.9, 0.4, k), lerp(2.6, 3.0, k)], lerp(50, 44, k), 0, 0.01, t + 90);
      u.uFish.value = 0.18;
      u.uFade.value = smooth(range(t, d - 0.55, d));
      E.placeStreet([-27, -45, -9]);
      return { scene: E.scene, exposure: 1.35 };
    },
    s11_title(t, d) {
      bokeh.forEach((sp) => { const q = sp.userData; sp.position.set(q.x + Math.sin(t * 0.5 + q.sp * 6) * 0.2, q.y + t * 0.15 * (q.sp - 0.5), q.z); sp.scale.setScalar(q.s); });
      setCam([0, 0, 2], [0, 0, 0], 50, 0, 0.0, t);
      u.uFish.value = 0.1; u.uVig.value = 0.8;
      u.uFade.value = 1 - smooth(range(t, 0, 0.35)) + smooth(range(t, d - 0.45, d));
      OV.text({ txt: 'NITE', x: 540, y: 880, size: 290, rot: -6, p: range(t, 0.1, 0.55), stagger: 0.12, fill: '#e8222a', sw: 34, jitter: 5 });
      OV.text({ txt: 'RUN', x: 560, y: 1150, size: 290, rot: -4, p: range(t, 0.35, 0.8), stagger: 0.12, fill: '#e8222a', sw: 34, jitter: 5 });
      OV.scribble({ d: 'M 250 1230 C 420 1210, 640 1250, 850 1200', p: range(t, 0.85, 1.2), sw: 16, stroke: '#f4f1e6', len: 700 });
      OV.text({ txt: 'ep.01 — loose change', x: 540, y: 1340, size: 64, rot: -3, p: range(t, 1.1, 1.6), stagger: 0.03, fill: '#f4f1e6', sw: 10 });
      OV.rect({ fill: '#000', opacity: u.uFade.value });
      return { scene: TS, exposure: 1.0 };
    },
  };

  return {
    duration: 30,
    apply(t, frame) {
      t = clamp(t, 0, 29.999);
      const [name, a, b] = SHOTS.find(([, a, b]) => t >= a && t < b) || SHOTS[SHOTS.length - 1];
      OV.clear(); resetPost(); neonFlicker(t);
      B.visible = true; can.visible = true;
      const r = shots[name](t - a, b - a);
      OV.draw(overlay, frame);
      return { scene: r.scene, camera: cam, exposure: r.exposure };
    },
  };
}
