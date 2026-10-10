import * as THREE from 'three';
import { buildMilo, buildBoard } from './milo.js';
import { buildExterior } from './exterior.js';
import { buildInterior, drawLCD } from './interior.js';
import { buildClerk } from './clerk.js';
import * as OV from './overlay.js';
import { clamp, lerp, smooth, easeOut, easeInOut, range, keys, noise1, backOut } from './util.js';

// 96 BPM: beat 0.625 s, bar 2.5 s. Six one-bar shots.
export const SHOTS = [
  ['e1_ext', 0.0, 2.5],
  ['e2_doze', 2.5, 5.0],
  ['e3_ding', 5.0, 7.5],
  ['e4_board', 7.5, 10.0],
  ['e5_look', 10.0, 12.5],
  ['e6_milo', 12.5, 15.0],
];

export async function build({ renderer, post, overlay }) {
  const E = buildExterior(renderer);
  const I = buildInterior(renderer);
  const K = await buildClerk();
  const M = buildMilo();
  const B = buildBoard();
  const cam = new THREE.PerspectiveCamera(40, 16 / 9, 0.03, 400);
  const u = post.u;

  // staging inside the shop
  K.root.position.set(4.0, 1.03, -2.38);
  I.scene.add(K.root);
  const cat = I.cat;
  cat.root.position.set(2.98, 1.04, -1.9); cat.root.rotation.y = 0.75; cat.root.scale.setScalar(0.62);
  drawLCD(I, ['NITE OWL 24H', 'HAVE A NICE', 'NIGHT :)'], false);
  // the clerk's own key light (warm, from the register side)
  const kl = new THREE.SpotLight(0xffe6c8, 9, 5, 0.6, 0.7, 1.5);
  kl.position.set(4.9, 2.2, -0.9); kl.target.position.set(4.0, 1.6, -2.3); I.scene.add(kl, kl.target);

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
    for (const s of ['L', 'R']) { M.leg[s].shoe.children[0].getWorldPosition(v); minY = Math.min(minY, v.y - 0.0325); }
    M.hips.position.y += groundY - minY;
  };
  const resetPost = () => {
    u.uFish.value = 0.2; u.uCA.value = 0.003; u.uVig.value = 0.6; u.uGrain.value = 0.075; u.uFade.value = 0; u.uFlash.value = 0;
    u.uLift.value.set(0.015, 0.03, 0.022); u.uGain.value.set(1.0, 1.03, 0.92); u.uGamma.value.set(0.98, 1.04, 0.98); u.uSat.value = 0.9;
    u.uTint.value.set(-0.005, 0.012, 0.004);
    post.bloom.strength = 0.4; post.bloom.threshold = 0.92; post.bloom.radius = 0.5;
  };
  const neon = (t) => {
    const off = (t > 0.9 && t < 1.0) || (t > 13.6 && t < 13.75) ? 0.15 : 1;
    const buzz = 0.93 + 0.07 * noise1(t * 40, 3);
    E.neon.owl.color.setScalar(3 * off * buzz); E.neon.nite.color.setScalar(3 * buzz); E.neon.icon.color.setScalar(2.6 * buzz);
    E.neonLights[1].intensity = 10 * off; E.refl[1].material.opacity = 0.35 * off;
  };
  const breath = (t) => Math.sin(t * 2 * Math.PI / 3.4);
  // board path inside: through the door, across the floor, stops by the counter
  const boardAt = (T) => {
    const k = easeOut(clamp(T / 3.2));
    const x = lerp(-0.05, 3.0, k), z = lerp(0.7, -1.05, k);
    B.position.set(x, 0, z); B.rotation.set(0, 0.52 - k * 0.3, 0); B.roll(k * 3.1);
    B.visible = T > 0;
  };
  const doorAt = (T) => {
    const open = smooth(range(T, 0.0, 0.45)) * (1 - smooth(range(T, 1.4, 2.6)));
    I.frontDoor.rotation.y = 1.1 * open; // opens outward
    I.bell.rotation.z = Math.sin(T * 22) * Math.exp(-Math.max(0, T) * 2.5) * 0.5 * (T > 0 ? 1 : 0);
  };

  const shots = {
    e1_ext(t, d) {
      const k = easeInOut(t / d);
      setCam([lerp(5.2, 3.6, k), lerp(0.9, 1.05, k), lerp(15.5, 12.0, k)], [lerp(0.8, 0.4, k), 1.85, 0], 36, -0.02, 0.015, t);
      u.uFish.value = 0.18; u.uFade.value = 1 - smooth(range(t, 0, 0.8));
      E.placeStreet([11, -9, 999]);
      E.scene.add(M.root); M.root.visible = false; B.visible = false;
      OV.text({ txt: '3:04 AM', x: 300, y: 190, size: 96, rot: -5, fill: '#f4f1e6', p: range(t, 0.7, 1.3), stagger: 0.12 });
      return { scene: E.scene, exposure: 1.05 };
    },
    e2_doze(t, d) {
      I.scene.add(B); B.visible = false; doorAt(-1);
      // dozing off: head sinks, little nod, sinks again
      const pitch = keys(t, [[0, 0.06], [1.0, 0.32], [1.25, 0.12], [1.5, 0.16], [2.5, 0.34]]);
      K.pose({ pitch, yaw: 0.08, roll: 0.06 * smooth(range(t, 1.5, 2.5)), breath: breath(t + 2.5) });
      cat.pose({ blink: 1, breathe: Math.sin(t * 2.5) });
      const k = easeInOut(t / d);
      setCam([lerp(2.55, 2.8, k), 1.08, lerp(0.15, -0.25, k)], [3.75, 1.38, -2.05], 46, 0.03, 0.006, t + 10);
      u.uFish.value = 0.28; u.uLift.value.set(0.02, 0.04, 0.025);
      OV.text({ txt: 'hour 7 of 8', x: 1500, y: 200, size: 84, rot: 6, fill: '#f4f1e6', p: range(t, 0.6, 1.1), out: range(t, 2.1, 2.4), stagger: 0.06 });
      return { scene: I.scene, exposure: 1.0 };
    },
    e3_ding(t, d) {
      I.scene.add(B); B.visible = false; doorAt(t - 0.55 - 2.0); // door swings in the next shot; bell starts here
      I.bell.rotation.z = t > 0.55 ? Math.sin((t - 0.55) * 22) * Math.exp(-(t - 0.55) * 2.5) * 0.5 : 0;
      const wake = range(t, 0.6, 0.85);
      const pitch = t < 0.6 ? 0.34 + Math.sin(t * 3) * 0.01 : lerp(0.34, -0.08, backOut(wake, 2.2)) + smooth(range(t, 0.9, 1.4)) * 0.08;
      const yaw = lerp(0.08, -0.52, smooth(range(t, 0.95, 1.5)));
      K.pose({ pitch, yaw, roll: lerp(0.06, -0.04, smooth(range(t, 0.6, 1.2))), breath: breath(t + 5) * (t > 0.6 ? 1.6 : 1), shrug: Math.sin(clamp(range(t, 0.6, 1.0)) * Math.PI) * 0.6 });
      cat.pose({ blink: 1, breathe: Math.sin(t * 2.5) });
      const h = K.headWorld();
      const kick = Math.sin(clamp(range(t, 0.6, 0.8)) * Math.PI) * 0.01;
      const kk = easeInOut(t / d);
      setCam([lerp(2.75, 2.9, kk), 1.5 + kick, lerp(-0.25, -0.5, kk)], [h.x - 0.12, h.y - 0.22, h.z], 33, -0.04, 0.004, t + 20);
      u.uFish.value = 0.12; u.uLift.value.set(0.02, 0.04, 0.03);
      OV.text({ txt: '*ding*', x: 420, y: 230, size: 110, rot: -10, fill: '#f2d43a', p: range(t, 0.55, 0.75), out: range(t, 1.7, 2.0), stagger: 0.05 });
      return { scene: I.scene, exposure: 1.0 };
    },
    e4_board(t, d) {
      I.scene.add(B);
      doorAt(t); boardAt(t - 0.35);
      K.pose({ pitch: -0.0, yaw: -0.52, breath: breath(t + 7.5) });
      cat.pose({ blink: 1, breathe: Math.sin(t * 2.5) });
      const bx = B.position.x, bz = B.position.z;
      const follow = smooth(range(t, 0.8, 2.3));
      setCam([0.05, 0.12, -0.8], [lerp(1.2, 2.9, follow), lerp(0.35, 0.3, follow), lerp(-0.05, -1.1, follow)], 54, 0.04, 0.006, t + 30);
      u.uFish.value = 0.32; u.uCA.value = 0.006; u.uLift.value.set(0.02, 0.045, 0.025);
      OV.text({ txt: '...?', x: 1500, y: 260, size: 120, rot: 8, fill: '#f4f1e6', p: range(t, 1.6, 1.9), stagger: 0.1 });
      return { scene: I.scene, exposure: 1.0 };
    },
    e5_look(t, d) {
      I.scene.add(B); doorAt(t + 2.5); boardAt(t + 2.15);
      // follows the board down, then looks at us and shrugs
      const yaw = keys(t, [[0, -0.48], [0.6, -0.22], [1.35, -0.22], [1.7, 0.02]]);
      const pitch = keys(t, [[0, 0.0], [0.6, 0.28], [1.35, 0.28], [1.7, -0.02]]);
      K.pose({ pitch, yaw, roll: keys(t, [[1.3, 0], [1.8, 0.1]]), breath: breath(t + 10), shrug: Math.sin(clamp(range(t, 1.75, 2.35)) * Math.PI) });
      cat.pose({ blink: lerp(1, 0.6, smooth(range(t, 1.0, 1.3))), breathe: Math.sin(t * 2.5), headTilt: 0.1 * smooth(range(t, 1.0, 1.5)) });
      const k = easeInOut(t / d);
      setCam([lerp(3.35, 3.45, k), 1.22, lerp(-0.15, -0.4, k)], [3.65, 1.25, -1.95], 44, -0.02, 0.006, t + 40);
      u.uFish.value = 0.22; u.uLift.value.set(0.02, 0.04, 0.025);
      OV.text({ txt: '...milo?', x: 1420, y: 250, size: 110, rot: -6, fill: '#e8222a', p: range(t, 0.75, 1.15), stagger: 0.08 });
      return { scene: I.scene, exposure: 1.0 };
    },
    e6_milo(t, d) {
      E.scene.add(M.root); M.root.visible = true;
      M.reset();
      const v = 3.6, x = Math.max(1.0, 8.5 - v * t);
      const arrived = 8.5 - v * t < 1.0;
      M.root.position.set(x, 0, 1.9); M.root.rotation.set(0, arrived ? lerp(-Math.PI / 2, Math.PI, smooth(range(t, 2.08, 2.4))) : -Math.PI / 2, 0);
      M.walk((8.5 - x) / 1.7, arrived ? 0.6 : 1.45);
      M.torso.rotation.x = arrived ? 0.06 : 0.22;
      M.arm.L.sh.rotation.x *= 1.6; M.arm.R.sh.rotation.x *= 1.6;
      M.arm.L.el.rotation.x = -1.3; M.arm.R.el.rotation.x = -1.3;
      M.face({ blink: 0.25, open: 0.35, brow: 0.6 });
      M.head.rotation.set(-0.05, arrived ? 0 : 0.5, 0);
      plant(0.12);
      const k = easeInOut(t / d);
      setCam([lerp(4.4, 3.6, k), 1.0, lerp(9.5, 8.8, k)], [lerp(3.0, 1.6, k), 1.55, 1.2], 34, -0.02, 0.01, t + 50);
      u.uFish.value = 0.18; u.uFade.value = smooth(range(t, d - 0.45, d));
      E.placeStreet([11, -9, 999]);
      OV.text({ txt: 'NITE', x: 420, y: 330, size: 210, rot: -6, p: range(t, 0.55, 0.95), stagger: 0.12, fill: '#e8222a', sw: 26 });
      OV.text({ txt: 'SHIFT', x: 470, y: 530, size: 210, rot: -4, p: range(t, 0.75, 1.15), stagger: 0.12, fill: '#e8222a', sw: 26 });
      OV.text({ txt: 'ep.02', x: 470, y: 640, size: 64, rot: -3, p: range(t, 1.2, 1.5), stagger: 0.06, fill: '#f4f1e6', sw: 10 });
      return { scene: E.scene, exposure: 1.1 };
    },
  };

  return {
    duration: 15,
    apply(t, frame) {
      t = clamp(t, 0, 14.999);
      const [name, a, b] = SHOTS.find(([, a, b]) => t >= a && t < b) || SHOTS[SHOTS.length - 1];
      OV.clear(); resetPost(); neon(t);
      B.visible = true;
      const r = shots[name](t - a, b - a);
      OV.draw(overlay, frame);
      return { scene: r.scene, camera: cam, exposure: r.exposure };
    },
  };
}
