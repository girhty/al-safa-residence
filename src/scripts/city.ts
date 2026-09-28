import * as THREE from 'three';

export type ZoneKey = 'overview' | 'penthouses' | 'towers' | 'villas' | 'retail' | 'park' | 'marina' | 'pools';
export type Category = 'penthouses' | 'towers' | 'villas' | 'retail' | 'context';

export const ZONES: Record<ZoneKey, { look: [number, number, number]; radius: number; polar: number }> = {
  overview: { look: [2, 4, 0], radius: 132, polar: 0.98 },
  penthouses: { look: [-18, 18, -14], radius: 60, polar: 1.12 },
  towers: { look: [16, 12, -16], radius: 56, polar: 1.1 },
  villas: { look: [-20, 3, 17], radius: 44, polar: 0.95 },
  retail: { look: [10, 2, 13], radius: 44, polar: 1.05 },
  park: { look: [0, 0, 0], radius: 40, polar: 0.85 },
  marina: { look: [42, 0, 4], radius: 54, polar: 1.05 },
  pools: { look: [-2, 0, 23], radius: 30, polar: 0.9 }
};

export interface CityMarker {
  el: HTMLElement;
  pos: number[];
}

export interface CityOptions {
  scrollEl?: HTMLElement | null;
  autoRotate?: boolean;
  markers?: CityMarker[];
  onProgress?: (p: number) => void;
  onSelect?: (cat: Category) => void;
  onReady?: () => void;
}

export interface CityAPI {
  focus(z: ZoneKey): void;
  focusPoint(x: number, y: number, z: number, r?: number): void;
  highlight(c: Category | null): void;
  zoom(f: number): void;
  dispose(): void;
}

const GOLD = new THREE.Vector3(0.831, 0.686, 0.216);
const AMBER = new THREE.Vector3(1.0, 0.62, 0.12);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

function softTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.4)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

const WORLD_VERT = /* glsl */ `
varying vec3 vPos;
varying vec3 vN;
varying float vDepth;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPos = wp.xyz;
  vN = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vec4 mv = viewMatrix * wp;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const BUILDING_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uMouse;
uniform vec3 uGold;
uniform vec3 uAmber;
uniform float uHi;
uniform float uDim;
uniform float uSeed;
varying vec3 vPos;
varying vec3 vN;
varying float vDepth;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec3 n = normalize(vN);
  float side = 1.0 - abs(n.y);
  vec2 t = normalize(vec2(-n.z, n.x) + 1e-5);
  float hcoord = dot(vPos.xz, t);
  vec2 uv = vec2(hcoord * 1.35, vPos.y * 1.05);
  vec2 g = fract(uv);
  float win = step(0.14, g.x) * step(g.x, 0.86) * step(0.2, g.y) * step(g.y, 0.78);
  float r = hash(floor(uv) + uSeed);
  float lit = win * step(0.72, r) * side;

  float shade = 0.55 + 0.45 * max(dot(n, normalize(vec3(0.5, 0.85, 0.3))), 0.0);
  vec3 col = vec3(0.062, 0.058, 0.054) * shade;
  col += win * side * vec3(0.028, 0.026, 0.022);
  col += uAmber * lit * (0.5 + 0.22 * sin(uTime * 0.6 + r * 24.0));

  // Gold light sweep across facades
  float s = fract((vPos.x * 0.7 + vPos.z * 0.3) * 0.012 - uTime * 0.05);
  float band = smoothstep(0.0, 0.03, s) * (1.0 - smoothstep(0.03, 0.09, s));
  col += uGold * band * (0.3 + side * 0.5);

  // Cursor-reactive ambient glow
  float d = distance(vPos.xz, uMouse.xz);
  float m = exp(-d * d * 0.0028);
  col += uGold * m * (0.12 + 0.38 * side) * (0.4 + 0.6 * clamp(vPos.y / 30.0, 0.0, 1.0));

  float crown = pow(clamp(vPos.y / 45.0, 0.0, 1.0), 2.0);
  col += uGold * crown * 0.12;

  col = mix(col, col * 0.22, uDim);
  col += uGold * uHi * (0.07 + 0.28 * lit + 0.14 * band);

  float fog = smoothstep(90.0, 280.0, vDepth);
  col = mix(col, vec3(0.039), fog);
  gl_FragColor = vec4(col, 1.0);
}
`;

const WATER_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uGold;
varying vec3 vPos;
varying vec3 vN;
varying float vDepth;
void main() {
  float w = sin(vPos.z * 0.28 + uTime * 0.8) * 0.5 + 0.5;
  float w2 = sin(vPos.x * 0.45 - uTime * 0.55 + vPos.z * 0.12) * 0.5 + 0.5;
  float glint = pow(w * w2, 7.0);
  vec3 c = vec3(0.018, 0.026, 0.032) + uGold * glint * 0.4;
  float fog = smoothstep(90.0, 280.0, vDepth);
  c = mix(c, vec3(0.039), fog);
  gl_FragColor = vec4(c, 1.0);
}
`;

const RAY_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const RAY_FRAG = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
void main() {
  float a = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
  a *= pow(vUv.y, 1.6) * (0.6 + 0.4 * sin(uTime * 0.35 + vUv.x * 6.0));
  gl_FragColor = vec4(0.96, 0.76, 0.36, a * 0.075);
}
`;

export function createCity(container: HTMLElement, opts: CityOptions = {}): CityAPI | null {
  if (!supportsWebGL()) return null;

  const mobile = window.matchMedia('(max-width: 768px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.3 : 1.75));
  renderer.setClearColor(0x0a0a0a, 1);
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;outline:none;';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 900);
  const rand = mulberry32(20240927);
  const shared = { uTime: { value: 0 }, uMouse: { value: new THREE.Vector3(999, 0, 999) } };

  // ——— Materials per category ———
  const cats: Category[] = ['penthouses', 'towers', 'villas', 'retail', 'context'];
  const mats = {} as Record<Category, THREE.ShaderMaterial>;
  const edgeMats = {} as Record<Category, THREE.LineBasicMaterial>;
  const hiState = {} as Record<Category, { hi: number; dim: number; base: number }>;

  cats.forEach((c, i) => {
    const baseDim = c === 'context' ? 0.55 : 0;
    mats[c] = new THREE.ShaderMaterial({
      uniforms: {
        uTime: shared.uTime,
        uMouse: shared.uMouse,
        uGold: { value: GOLD },
        uAmber: { value: AMBER },
        uHi: { value: 0 },
        uDim: { value: baseDim },
        uSeed: { value: i * 17.0 }
      },
      vertexShader: WORLD_VERT,
      fragmentShader: BUILDING_FRAG
    });
    edgeMats[c] = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: c === 'context' ? 0.07 : 0.42,
      depthWrite: false
    });
    hiState[c] = { hi: 0, dim: baseDim, base: baseDim };
  });

  const city = new THREE.Group();
  scene.add(city);
  const pickables: THREE.Mesh[] = [];
  const crownMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.92 });

  type Shape = 'box' | 'hex' | 'diamond';
  function addBuilding(cat: Category, x: number, z: number, w: number, d: number, h: number, shape: Shape, rot: number) {
    let geo: THREE.BufferGeometry;
    if (shape === 'box') geo = new THREE.BoxGeometry(w, h, d);
    else if (shape === 'hex') geo = new THREE.CylinderGeometry(w * 0.4, w * 0.5, h, 6, 1);
    else geo = new THREE.CylinderGeometry(w * 0.34, w * 0.52, h, 4, 1);
    geo.translate(0, h / 2, 0);
    const mesh = new THREE.Mesh(geo, mats[cat]);
    mesh.position.set(x, 0, z);
    mesh.rotation.y = rot;
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 15), edgeMats[cat]);
    mesh.add(edges);
    mesh.userData = { cat, top: new THREE.Vector3(x, h, z) };
    city.add(mesh);
    if (cat !== 'context') pickables.push(mesh);
    return mesh;
  }

  function crown(x: number, z: number, h: number, w: number, rot: number) {
    const g = new THREE.ConeGeometry(w * 0.38, 6, 6);
    g.translate(0, 3, 0);
    const m = new THREE.Mesh(g, crownMat);
    m.position.set(x, h, z);
    m.rotation.y = rot;
    city.add(m);
  }

  // Penthouse crown towers (Binghatti-style faceted hex prisms)
  addBuilding('penthouses', -18, -14.2, 20, 20, 3, 'box', 0);
  const pent: [number, number, number, number][] = [
    [-18, -14, 46, 7],
    [-25, -7.5, 38, 6],
    [-11, -21, 40, 6],
    [-25.5, -21, 33, 5.5],
    [-11, -7.5, 29, 5.5]
  ];
  pent.forEach(([x, z, h, w], i) => {
    const m = addBuilding('penthouses', x, z, w, w, h, 'hex', i * 0.35);
    (m.userData.top as THREE.Vector3).y = h + 6;
    crown(x, z, h, w, i * 0.35);
  });

  // Tower residences
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const x = 10 + i * 6.5 + (rand() - 0.5) * 1.2;
      const z = -22 + j * 6.5 + (rand() - 0.5) * 1.2;
      const h = 16 + rand() * 16;
      const alt = (i + j) % 2 === 0;
      addBuilding('towers', x, z, 4.4, 4.4, h, alt ? 'hex' : 'diamond', alt ? rand() : Math.PI / 4);
    }

  // Sky villas (stepped terraces)
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      const x = -27.5 + i * 5;
      const z = 9.5 + j * 5;
      const h = 3.5 + rand() * 4.5;
      addBuilding('villas', x, z, 3.4, 3.4, h, 'box', 0);
      addBuilding('villas', x + 0.45, z + 0.45, 2.3, 2.3, h + 2.2, 'box', 0);
    }

  // Retail promenade
  for (let k = 0; k < 5; k++) {
    addBuilding('retail', -1 + k * 6, 13.5, 5.2, 3, 2.6 + rand() * 1.6, 'box', 0);
  }

  // Context city
  const ctxCount = mobile ? 45 : 100;
  let placed = 0;
  let guard = 0;
  while (placed < ctxCount && guard < 900) {
    guard++;
    const a = rand() * Math.PI * 2;
    const r = 44 + rand() * 82;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (x > 24 && x < 78) continue;
    const w = 3 + rand() * 5;
    const h = 2 + rand() * (r < 72 ? 14 : 8);
    addBuilding('context', x, z, w, w * (0.6 + rand() * 0.8), h, rand() > 0.8 ? 'hex' : 'box', rand() * Math.PI);
    placed++;
  }

  // ——— Ground, grid, roads ———
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: 0x0c0c0c }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const grid = new THREE.GridHelper(280, 56, 0x3b3018, 0x1b170e);
  grid.position.y = 0.02;
  const gm = grid.material as THREE.Material;
  gm.transparent = true;
  gm.opacity = 0.55;
  scene.add(grid);

  const roadMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.35 });
  const roadPts = [
    [-80, 10.5, 27, 10.5],
    [-7.5, -70, -7.5, 70],
    [27.5, -140, 27.5, 140]
  ];
  const rp: number[] = [];
  roadPts.forEach(([x1, z1, x2, z2]) => rp.push(x1, 0.05, z1, x2, 0.05, z2));
  const roadGeo = new THREE.BufferGeometry();
  roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3));
  scene.add(new THREE.LineSegments(roadGeo, roadMat));

  const hexPts: THREE.Vector3[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    hexPts.push(new THREE.Vector3(Math.cos(a) * 11.5, 0.06, Math.sin(a) * 11.5));
  }
  scene.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(hexPts), roadMat));

  // Central park
  const park = new THREE.Mesh(new THREE.CircleGeometry(9, 6), new THREE.MeshBasicMaterial({ color: 0x121810 }));
  park.rotation.x = -Math.PI / 2;
  park.position.y = 0.04;
  scene.add(park);
  const treeGeo = new THREE.ConeGeometry(0.5, 1.7, 5);
  treeGeo.translate(0, 0.85, 0);
  const treeMat = new THREE.MeshBasicMaterial({ color: 0x3a4a2a });
  for (let i = 0; i < (mobile ? 18 : 36); i++) {
    const a = rand() * Math.PI * 2;
    const r = 2.4 + rand() * 5.6;
    const t = new THREE.Mesh(treeGeo, treeMat);
    t.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    t.scale.setScalar(0.7 + rand() * 0.8);
    scene.add(t);
  }
  const fountain = new THREE.Mesh(
    new THREE.RingGeometry(1.3, 1.6, 6),
    new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide })
  );
  fountain.rotation.x = -Math.PI / 2;
  fountain.position.y = 0.08;
  scene.add(fountain);

  // Shatt Al-Arab river
  const waterMat = new THREE.ShaderMaterial({
    uniforms: { uTime: shared.uTime, uGold: { value: GOLD } },
    vertexShader: WORLD_VERT,
    fragmentShader: WATER_FRAG
  });
  const river = new THREE.Mesh(new THREE.PlaneGeometry(44, 600, 1, 1), waterMat);
  river.rotation.x = -Math.PI / 2;
  river.position.set(50, 0.03, 0);
  scene.add(river);

  const pierMat = new THREE.MeshBasicMaterial({ color: 0x241f15 });
  const pierEdge = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.5 });
  [-20, -8, 4, 16].forEach((z) => {
    const g = new THREE.BoxGeometry(9, 0.4, 1.2);
    const p = new THREE.Mesh(g, pierMat);
    p.position.set(32.5, 0.2, z);
    p.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), pierEdge));
    scene.add(p);
  });

  // Infinity pools
  const poolMat = new THREE.MeshBasicMaterial({ color: 0x1b5d66, transparent: true, opacity: 0.85 });
  [19.5, 23, 26.5].forEach((z) => {
    const g = new THREE.PlaneGeometry(6, 2.2);
    const p = new THREE.Mesh(g, poolMat);
    p.rotation.x = -Math.PI / 2;
    p.position.set(-2, 0.07, z);
    p.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), pierEdge));
    scene.add(p);
  });

  // ——— Atmosphere: particles, rays, clouds ———
  const dotTex = softTexture();
  const pc = mobile ? 260 : 720;
  const pPos = new Float32Array(pc * 3);
  for (let i = 0; i < pc; i++) {
    pPos[i * 3] = (rand() - 0.5) * 230;
    pPos[i * 3 + 1] = rand() * 95;
    pPos[i * 3 + 2] = (rand() - 0.5) * 230;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: mobile ? 1.5 : 1.15,
      map: dotTex,
      color: 0xe8c565,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })
  );
  scene.add(particles);

  const rayMat = new THREE.ShaderMaterial({
    uniforms: { uTime: shared.uTime },
    vertexShader: RAY_VERT,
    fragmentShader: RAY_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  for (let i = 0; i < (mobile ? 2 : 4); i++) {
    const ray = new THREE.Mesh(new THREE.PlaneGeometry(16, 150), rayMat);
    ray.position.set(-40 + i * 26, 70, -30 + rand() * 30);
    ray.rotation.set(0, rand() * Math.PI, 0.32);
    scene.add(ray);
  }

  const clouds: THREE.Sprite[] = [];
  if (opts.scrollEl) {
    const cloudCount = mobile ? 18 : 36;
    for (let i = 0; i < cloudCount; i++) {
      const m = new THREE.SpriteMaterial({
        map: dotTex,
        color: 0xd8cfb8,
        transparent: true,
        opacity: 0.1,
        depthWrite: false
      });
      const s = new THREE.Sprite(m);
      const a = rand() * Math.PI * 2;
      const r = rand() * 100;
      s.position.set(Math.cos(a) * r, 40 + rand() * 32, Math.sin(a) * r);
      const sc = 36 + rand() * 50;
      s.scale.set(sc, sc * 0.55, 1);
      s.userData.base = 0.06 + rand() * 0.08;
      clouds.push(s);
      scene.add(s);
    }
  }

  // ——— Camera rig ———
  const start = ZONES.overview;
  let az = 0.62;
  let tAz = az;
  let radius = start.radius * 1.25;
  let tRadius = start.radius;
  let polar = start.polar;
  let tPolar = start.polar;
  let pOff = 0;
  let tPOff = 0;
  const look = new THREE.Vector3(...start.look);
  const tLook = new THREE.Vector3(...start.look);
  let selected: Category | null = null;
  let sp = 0;
  let lastP = -1;
  let autoRotate = opts.autoRotate !== false && !reduced;
  let idleUntil = 0;

  // ——— Pointer interaction ———
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const mouseHit = new THREE.Vector3();
  const mouseTarget = new THREE.Vector3(999, 0, 999);
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let moved = 0;

  const setNdc = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  };
  const onDown = (e: PointerEvent) => {
    dragging = true;
    moved = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    setNdc(e);
  };
  const onMove = (e: PointerEvent) => {
    setNdc(e);
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(groundPlane, mouseHit)) mouseTarget.copy(mouseHit);
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    moved += Math.abs(dx) + Math.abs(dy);
    lastX = e.clientX;
    lastY = e.clientY;
    tAz -= dx * 0.006;
    if (e.pointerType === 'mouse') tPOff = clamp(tPOff + dy * 0.003, -0.4, 0.35);
    idleUntil = performance.now() + 4000;
  };
  const onUp = (e: PointerEvent) => {
    if (dragging && moved < 6) {
      setNdc(e);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(pickables, false)[0];
      if (hit) {
        const obj = hit.object as THREE.Mesh;
        const top = obj.userData.top as THREE.Vector3;
        api.focusPoint(top.x, top.y * 0.6, top.z, Math.max(28, top.y * 1.35));
        opts.onSelect?.(obj.userData.cat as Category);
      }
    }
    dragging = false;
  };
  const onCancel = () => (dragging = false);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);

  // ——— Sizing ———
  let W = 1;
  let H = 1;
  const resize = () => {
    W = Math.max(1, container.clientWidth);
    H = Math.max(1, container.clientHeight);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // ——— Loop ———
  const markers = (opts.markers || []).map((m) => ({ el: m.el, v: new THREE.Vector3(m.pos[0], m.pos[1], m.pos[2]) }));
  const proj = new THREE.Vector3();
  const clock = new THREE.Clock();
  let raf = 0;
  let visible = true;
  let readyFired = false;

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const now = performance.now();
    shared.uTime.value += reduced ? 0 : dt;

    // Scroll progress (dive)
    if (opts.scrollEl) {
      const r = opts.scrollEl.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
      sp += (p - sp) * (1 - Math.exp(-dt * 6));
      if (Math.abs(sp - lastP) > 0.001) {
        lastP = sp;
        opts.onProgress?.(sp);
      }
    }

    if (autoRotate && !dragging && now > idleUntil) tAz += dt * 0.035;

    const f = 1 - Math.exp(-dt * 2.2);
    az += (tAz - az) * f;
    radius += (tRadius - radius) * f;
    polar += (tPolar - polar) * f;
    pOff += (tPOff - pOff) * f;
    look.lerp(tLook, f);

    shared.uMouse.value.lerp(mouseTarget, 1 - Math.exp(-dt * 5));

    // Highlights
    const hf = 1 - Math.exp(-dt * 4);
    cats.forEach((c) => {
      const st = hiState[c];
      const tHi = selected === c ? 1 : 0;
      const tDim = selected && selected !== c ? (c === 'context' ? 0.82 : 0.75) : st.base;
      st.hi += (tHi - st.hi) * hf;
      st.dim += (tDim - st.dim) * hf;
      mats[c].uniforms.uHi.value = st.hi;
      mats[c].uniforms.uDim.value = st.dim;
      edgeMats[c].opacity = c === 'context' ? 0.07 : 0.18 + 0.24 * (1 - st.dim) + 0.4 * st.hi;
    });

    const aspectBoost = camera.aspect < 1 ? 1.45 : camera.aspect < 1.3 ? 1.15 : 1;
    const dr = radius * aspectBoost * (1 - 0.6 * sp);
    const dp = clamp(polar + pOff + (1.45 - polar) * sp, 0.25, 1.52);
    const ly = look.y + 9 * sp;
    const breathe = reduced ? 0 : Math.sin(shared.uTime.value * 0.25) * 0.6;
    camera.position.set(
      look.x + dr * Math.sin(dp) * Math.sin(az),
      ly + dr * Math.cos(dp) + breathe,
      look.z + dr * Math.sin(dp) * Math.cos(az)
    );
    camera.lookAt(look.x, ly, look.z);

    if (!reduced) {
      particles.rotation.y += dt * 0.012;
      particles.position.y = Math.sin(shared.uTime.value * 0.3) * 1.5;
    }

    for (const c of clouds) {
      const d = c.position.distanceTo(camera.position);
      const k = clamp((d - 6) / 26, 0, 1);
      (c.material as THREE.SpriteMaterial).opacity = (c.userData.base as number) * k;
    }

    for (const m of markers) {
      proj.copy(m.v).project(camera);
      const vis = proj.z < 1 && Math.abs(proj.x) < 1.05 && Math.abs(proj.y) < 1.05;
      const x = (proj.x * 0.5 + 0.5) * W;
      const y = (-proj.y * 0.5 + 0.5) * H;
      m.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
      const o = vis ? clamp(1 - sp * 1.8, 0, 1) : 0;
      m.el.style.opacity = o.toFixed(2);
      m.el.style.pointerEvents = o > 0.4 ? 'auto' : 'none';
    }

    renderer.render(scene, camera);
    if (!readyFired) {
      readyFired = true;
      opts.onReady?.();
    }
  }

  const startLoop = () => {
    if (!raf) {
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    }
  };
  const stopLoop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible && !document.hidden) startLoop();
      else stopLoop();
    },
    { threshold: 0 }
  );
  io.observe(container);
  const onVis = () => (document.hidden || !visible ? stopLoop() : startLoop());
  document.addEventListener('visibilitychange', onVis);
  startLoop();

  const api: CityAPI = {
    focus(z) {
      const Z = ZONES[z] ?? ZONES.overview;
      tLook.set(Z.look[0], Z.look[1], Z.look[2]);
      tRadius = Z.radius;
      tPolar = Z.polar;
      tPOff = 0;
      idleUntil = performance.now() + (z === 'overview' ? 0 : 6000);
    },
    focusPoint(x, y, z, r = 36) {
      tLook.set(x, y, z);
      tRadius = r;
      tPolar = 1.12;
      tPOff = 0;
      idleUntil = performance.now() + 6000;
    },
    highlight(c) {
      selected = c;
    },
    zoom(f) {
      tRadius = clamp(tRadius * f, 18, 220);
      idleUntil = performance.now() + 4000;
    },
    dispose() {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointerup', onUp);
      renderer.dispose();
      canvas.remove();
      autoRotate = false;
    }
  };

  return api;
}