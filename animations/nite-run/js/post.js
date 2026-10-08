import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uRes: { value: new THREE.Vector2(1080, 1920) },
    uFrame: { value: 0 },
    uFish: { value: 0 },
    uCA: { value: 0.004 },
    uVig: { value: 0.55 },
    uGrain: { value: 0.07 },
    uLift: { value: new THREE.Vector3(0.02, 0.035, 0.025) },
    uGain: { value: new THREE.Vector3(1.0, 1.02, 0.94) },
    uGamma: { value: new THREE.Vector3(1.0, 1.04, 0.98) },
    uSat: { value: 0.92 },
    uTint: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
    uFade: { value: 0 },
    uFlash: { value: 0 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uFrame, uFish, uCA, uVig, uGrain, uSat, uFade, uFlash;
    uniform vec3 uLift, uGain, uGamma, uTint;
    varying vec2 vUv;
    float hash(vec2 p){ p = fract(p*vec2(443.897,441.423)); p += dot(p, p.yx+19.19); return fract((p.x+p.y)*p.x); }
    vec2 warp(vec2 uv, float k){
      vec2 asp = vec2(uRes.x/uRes.y, 1.0);
      vec2 p = (uv-0.5)*2.0*asp;
      float rmax2 = dot(asp,asp);
      float r2 = dot(p,p);
      p *= (1.0 + k*r2) / (1.0 + k*rmax2);
      return p/asp*0.5+0.5;
    }
    void main(){
      vec2 c = vUv-0.5;
      float r2 = dot(c,c);
      float ca = uCA * (0.3 + r2*3.0);
      vec3 col;
      col.r = texture2D(tDiffuse, warp(vUv, uFish + ca)).r;
      col.g = texture2D(tDiffuse, warp(vUv, uFish)).g;
      col.b = texture2D(tDiffuse, warp(vUv, uFish - ca)).b;
      // grade
      col = uLift + col*(uGain-uLift);
      col = pow(max(col, 0.0), 1.0/uGamma);
      float l = dot(col, vec3(0.299,0.587,0.114));
      col = mix(vec3(l), col, uSat);
      // split tone: green-teal shadows, warm highlights
      col += uTint * (1.0-l);
      col += vec3(0.02,0.012,-0.01) * smoothstep(0.5,1.0,l);
      // vignette
      vec2 vc = c*vec2(1.0, uRes.y/uRes.x)*vec2(1.0,0.62);
      col *= mix(1.0, smoothstep(0.95, 0.15, length(vc)*1.25), uVig);
      // grain (frame-seeded), stronger in mids
      float g = hash(vUv*uRes + vec2(uFrame*13.1, uFrame*7.7)) - 0.5;
      float g2 = hash(vUv*uRes*0.5 + vec2(uFrame*3.3, uFrame*1.9)) - 0.5;
      col += (g*0.7+g2*0.5) * uGrain * (0.4 + 0.6*(1.0-abs(l-0.45)*1.6));
      col = mix(col, vec3(1.0), uFlash);
      col *= 1.0-uFade;
      gl_FragColor = vec4(clamp(col,0.0,1.0), 1.0);
    }`,
};

export function makePost(renderer, W, H) {
  const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(1);
  composer.setSize(W, H);
  const renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
  const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.55, 0.6, 0.82);
  const out = new OutputPass();
  const grade = new ShaderPass(GradeShader);
  composer.addPass(renderPass); composer.addPass(bloom); composer.addPass(out); composer.addPass(grade);
  return { composer, renderPass, bloom, grade, u: grade.uniforms };
}
