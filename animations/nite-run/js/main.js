import * as THREE from 'three';
import { makePost } from './post.js';

const W = 1080, H = 1920;
const params = new URLSearchParams(location.search);

async function loadFonts() {
  const fonts = [
    ['Permanent Marker', 'fonts/permanent-marker-latin-400-normal.woff2'],
    ['VT323', 'fonts/vt323-latin-400-normal.woff2'],
    ['Bangers', 'fonts/bangers-latin-400-normal.woff2'],
  ];
  for (const [name, url] of fonts) {
    const f = new FontFace(name, `url(${url})`);
    await f.load(); document.fonts.add(f);
  }
}

async function init() {
  await loadFonts();
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  const post = makePost(renderer, W, H);
  const mod = await import(`./${params.get('mod') || 'film'}.js`);
  const film = await mod.build({ renderer, post, W, H, overlay: document.getElementById('ov') });
  window.DURATION = film.duration;
  window.FPS = 30;
  window.renderAt = (t) => {
    const frame = Math.round(t * 30);
    const s = film.apply(t, frame);
    post.renderPass.scene = s.scene;
    post.renderPass.camera = s.camera;
    s.camera.aspect = W / H; s.camera.updateProjectionMatrix();
    post.u.uFrame.value = frame % 997;
    renderer.toneMappingExposure = s.exposure ?? 1.0;
    post.composer.render();
    return true;
  };
  window.READY = true;
}
init().catch((e) => { console.error('INIT FAIL', e?.stack || e); window.INIT_ERROR = String(e?.stack || e); });
