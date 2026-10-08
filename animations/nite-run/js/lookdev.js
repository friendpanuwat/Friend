import * as THREE from 'three';
import { buildMilo, buildBoard, buildCan } from './milo.js';

export async function build({ post }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101814);
  scene.add(new THREE.HemisphereLight(0x8fb0c8, 0x202018, 0.6));
  const key = new THREE.DirectionalLight(0xfff0dd, 2.2); key.position.set(2, 4, 3); key.castShadow = true; scene.add(key);
  const rim = new THREE.PointLight(0x55ff99, 6, 6); rim.position.set(-1.5, 2, -1.5); scene.add(rim);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x333333 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const M = buildMilo(); scene.add(M.root);
  const B = buildBoard(); B.position.set(0.8, 0, 0.3); scene.add(B);
  const C = buildCan(); C.position.set(-0.6, 0, 0.4); scene.add(C);
  const cam = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.05, 100);
  return {
    duration: 4,
    apply(t) {
      M.reset();
      if (t < 1) { cam.fov = 35; cam.position.set(0.6, 1.1, 5.2); cam.lookAt(0, 0.85, 0); }
      else if (t < 2) { cam.fov = 18; cam.position.set(0.35, 1.72, 1.4); cam.lookAt(0, 1.7, 0); M.face({ smirk: 0.6, smile: 0.4 }); }
      else if (t < 3) { cam.fov = 35; cam.position.set(3.5, 1.0, 3.5); cam.lookAt(0, 0.85, 0); M.walk(0.25); }
      else { cam.fov = 18; cam.position.set(1.2, 1.75, 0.8); cam.lookAt(0, 1.7, 0); M.face({ open: 0.6, blink: 0.1 }); }
      post.u.uFish.value = 0;
      return { scene, camera: cam };
    },
  };
}
