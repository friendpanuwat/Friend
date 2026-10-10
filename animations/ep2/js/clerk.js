// The night-shift clerk: the user's scanned bust (OBJ + texture), made to move with a vertex shader.
// The scan has no rig, so the head is rotated about a neck pivot with a smooth weight falloff,
// the chest breathes and the shoulders can lift. The ink outline hull uses the same deformation.
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { mesh } from './util.js';

const NECK = new THREE.Vector3(0.04, 0.15, -0.02); // model units (measured from the scan)

const DEFORM = /* glsl */`
uniform vec3 uNeck; uniform vec3 uHead; uniform float uBreath; uniform float uShrug;
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
mat3 rotZ(float a){ float c=cos(a), s=sin(a); return mat3(c,s,0., -s,c,0., 0.,0.,1.); }
mat3 headMat(vec3 p){
  float w = smoothstep(0.125, 0.195, p.y);
  return rotY(uHead.y * w) * rotX(uHead.x * w) * rotZ(uHead.z * w);
}
vec3 deform(vec3 p){
  // breathing: chest expands a little
  float chest = smoothstep(-0.35, -0.05, p.y) * (1.0 - smoothstep(0.02, 0.12, p.y));
  p.xz += p.xz * uBreath * 0.012 * chest;
  p.y += uBreath * 0.004 * smoothstep(-0.3, 0.1, p.y);
  // shoulders lift (shrug)
  float sh = smoothstep(-0.12, 0.06, p.y) * smoothstep(0.08, 0.22, abs(p.x - 0.03)) * (1.0 - smoothstep(0.1, 0.14, p.y));
  float sh2 = smoothstep(-0.12, 0.08, p.y);
  p.y += uShrug * 0.035 * max(sh, sh2 * 0.7);
  // head
  vec3 q = p - uNeck;
  p = uNeck + headMat(p) * q;
  return p;
}`;

export async function buildClerk() {
  const tex = await new THREE.TextureLoader().loadAsync('model/texture_20250901.png');
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const obj = await new OBJLoader().loadAsync('model/char.obj');
  let geo; obj.traverse((m) => { if (m.isMesh) geo = m.geometry; });
  geo.computeVertexNormals();
  const uniforms = {
    uNeck: { value: NECK.clone() }, uHead: { value: new THREE.Vector3() },
    uBreath: { value: 0 }, uShrug: { value: 0 },
  };
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.72, metalness: 0.0, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.08 });
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + DEFORM)
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n objectNormal = headMat(position) * objectNormal;')
      .replace('#include <begin_vertex>', 'vec3 transformed = deform(position);');
  };
  const body = new THREE.Mesh(geo, mat);
  body.castShadow = true; body.receiveShadow = true;
  // ink outline with the same deformation
  const ink = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uThick: { value: 0.9 } },
    vertexShader: DEFORM + `
      uniform float uThick;
      void main(){
        vec3 p = deform(position);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vec3 n = normalize(normalMatrix * (headMat(position) * normal));
        mv.xyz += n * uThick * 0.0016 * clamp(-mv.z, 0.25, 30.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: 'void main(){ gl_FragColor = vec4(0.04,0.04,0.045,1.0); }',
    side: THREE.BackSide,
  });
  const hull = new THREE.Mesh(geo, ink); hull.renderOrder = -1;
  const root = new THREE.Group();
  const s = 0.82;
  const inner = new THREE.Group(); inner.scale.setScalar(s); inner.position.y = 0.467 * s; // bottom of scan at y=0
  inner.add(body, hull); root.add(inner);
  // lower body proxy so nothing looks hollow behind the counter
  const navy = new THREE.MeshStandardMaterial({ color: 0x15233a, roughness: 0.9 });
  root.add(mesh(new THREE.BoxGeometry(0.62, 0.6, 0.3), navy, { pos: [0.02, -0.25, -0.06] }));
  const C = { root, uniforms };
  C.pose = ({ yaw = 0, pitch = 0, roll = 0, breath = 0, shrug = 0 }) => {
    uniforms.uHead.value.set(pitch, yaw, roll);
    uniforms.uBreath.value = breath; uniforms.uShrug.value = shrug;
  };
  // world position of the head (for aiming cameras), roughly the face centre
  C.headWorld = () => root.localToWorld(new THREE.Vector3(0.045 * s, (0.33 + 0.467) * s, 0.1 * s));
  return C;
}
