import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function initAtmosPole(apRoot, options = {}) {
  if (!apRoot) return () => {};

  const glCanvas = apRoot.querySelector('#ap-gl');
  if (!glCanvas) return () => {};

  let animId = null;
  const intervals = [];

  /* ================= renderer / scene ================= */
  const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  const pmremGen = new THREE.PMREMGenerator(renderer);
  const roomEnvTexture = pmremGen.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = roomEnvTexture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 300);
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(4, 8, 9);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x7fb4ff, 2.2);
  rim.position.set(-6, 7, -6);
  scene.add(rim);

  const rim2 = new THREE.DirectionalLight(0xffc48a, 1.0);
  rim2.position.set(7, 3, -4);
  scene.add(rim2);

  const fill = new THREE.HemisphereLight(0xbcd4ff, 0x1a1410, 0.9);
  scene.add(fill);

  /* ================= helpers ================= */
  const ORANGE = '#f6a02c',
    GREEN = '#41d66b',
    WHITE = '#f2f2f2';
  const FONT = '"Saira Semi Condensed", "Arial Narrow", sans-serif';
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const rnd = (a, b) => a + Math.random() * (b - a);

  function canvasTex(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  const PX = 420;
  function makeScreen(w, h, transparent = false, px = PX) {
    const c = document.createElement('canvas');
    c.width = Math.round(w * px);
    c.height = Math.round(h * px);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: tex, transparent, toneMapped: false })
    );
    return { c, g: c.getContext('2d'), tex, mesh, W: c.width, H: c.height };
  }

  /* ================= materials ================= */
  const metal = new THREE.MeshStandardMaterial({ color: 0x4a4f57, metalness: 0.55, roughness: 0.38 });
  const metalD = new THREE.MeshStandardMaterial({ color: 0x2a2d33, metalness: 0.5, roughness: 0.42 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xdfe3e8, metalness: 0.9, roughness: 0.22 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x050608, metalness: 0.3, roughness: 0.12 });
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xfff1d0, toneMapped: false });

  const ventTex = canvasTex(1024, 128, (g, W, H) => {
    g.fillStyle = '#25282d';
    g.fillRect(0, 0, W, H);
    for (let x = 8; x < W; x += 32) {
      g.fillStyle = '#060607';
      g.fillRect(x, 26, 14, 76);
      g.fillStyle = 'rgba(255,255,255,.08)';
      g.fillRect(x, 102, 14, 2);
    }
  });
  ventTex.wrapS = THREE.RepeatWrapping;
  ventTex.repeat.x = 3;
  const ventMat = new THREE.MeshStandardMaterial({ map: ventTex, metalness: 0.6, roughness: 0.45 });

  const solarTex = canvasTex(1024, 640, (g, W, H) => {
    g.fillStyle = '#8e97a4';
    g.fillRect(0, 0, W, H);
    const p = 18,
      cols = 10,
      rows = 6,
      gap = 5;
    const cw = (W - 2 * p - gap * (cols - 1)) / cols,
      ch = (H - 2 * p - gap * (rows - 1)) / rows;
    g.fillStyle = '#c9d0da';
    g.fillRect(p - 3, p - 3, W - 2 * p + 6, H - 2 * p + 6);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const x = p + c * (cw + gap),
          y = p + r * (ch + gap);
        const gr = g.createLinearGradient(x, y, x + cw, y + ch);
        gr.addColorStop(0, '#16305e');
        gr.addColorStop(0.55, '#0b1b3c');
        gr.addColorStop(1, '#14295a');
        g.fillStyle = gr;
        g.fillRect(x, y, cw, ch);
        g.strokeStyle = 'rgba(160,190,240,.18)';
        g.lineWidth = 1.2;
        for (let k = 1; k < 4; k++) {
          g.beginPath();
          g.moveTo(x + (cw * k) / 4, y);
          g.lineTo(x + (cw * k) / 4, y + ch);
          g.stroke();
        }
      }
    const sheen = g.createLinearGradient(0, 0, W, H);
    sheen.addColorStop(0, 'rgba(255,255,255,.18)');
    sheen.addColorStop(0.4, 'rgba(255,255,255,0)');
    sheen.addColorStop(1, 'rgba(255,255,255,.06)');
    g.fillStyle = sheen;
    g.fillRect(0, 0, W, H);
  });

  const glowTex = canvasTex(128, 128, (g, W) => {
    const gr = g.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.3, 'rgba(255,255,255,.35)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, W, W);
  });

  const shadowTex = canvasTex(256, 256, (g, W) => {
    const gr = g.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
    gr.addColorStop(0, 'rgba(0,0,0,.75)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, W, W);
  });

  const glows = [];

  /* ================= build the pole ================= */
  const pole = new THREE.Group();
  scene.add(pole);

  function add(parent, geo, mat, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }

  function anchor(parent, x, y, z) {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  }

  const G = {};
  for (const k of ['solar', 'head', 'cap', 'nozL', 'nozR', 'displays', 'ad']) {
    G[k] = new THREE.Group();
    pole.add(G[k]);
  }
  const EXPLODE = {
    solar: [0, 2.4, 0],
    head: [0, 1.4, 0],
    cap: [0, 0.6, 0],
    nozL: [-0.9, 0, 0],
    nozR: [0.9, 0, 0],
    displays: [0, 0, 1.3],
    ad: [0, 0, 2.2],
  };

  // ground shadow
  const shadow = add(
    pole,
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.005;

  // base + column
  add(pole, new RoundedBoxGeometry(2.1, 0.3, 1.45, 4, 0.05), metalD, 0, 0.15, 0);
  add(pole, new RoundedBoxGeometry(1.68, 11.25, 1.0, 5, 0.07), metal, 0, 0.28 + 11.25 / 2, 0);
  add(pole, new THREE.CylinderGeometry(0.15, 0.17, 2.4, 32), metal, 0, 13.3, 0);

  // cap: vented drum + disc + top
  add(G.cap, new THREE.CylinderGeometry(0.98, 0.92, 0.52, 72, 1), [ventMat, metal, metal], 0, 11.78, 0);
  add(G.cap, new THREE.CylinderGeometry(1.12, 1.02, 0.07, 72), metalD, 0, 12.07, 0);
  add(G.cap, new THREE.CylinderGeometry(1.2, 1.2, 0.12, 72), metal, 0, 12.16, 0);
  add(G.cap, new THREE.CylinderGeometry(0.42, 1.08, 0.2, 72), metal, 0, 12.32, 0);
  add(G.cap, new THREE.CylinderGeometry(0.92, 0.9, 0.06, 72), metalD, 0, 11.5, 0);

  // solar crown
  add(G.solar, new THREE.BoxGeometry(0.34, 0.22, 0.34), metalD, 0, 14.43, 0);
  const panel = add(
    G.solar,
    new THREE.BoxGeometry(2.15, 0.07, 1.35),
    [
      metalD,
      metalD,
      new THREE.MeshStandardMaterial({ map: solarTex, metalness: 0.5, roughness: 0.25 }),
      metalD,
      metalD,
      metalD,
    ],
    0,
    14.6,
    0
  );
  panel.rotation.x = 0.26;

  // light & camera head
  for (const s of [-1, 1]) {
    const arm = add(G.head, new RoundedBoxGeometry(1.75, 0.1, 0.14, 2, 0.03), metalD, s * 0.98, 13.28, 0);
    arm.rotation.z = s * 0.13;
    const head = add(G.head, new RoundedBoxGeometry(1.3, 0.17, 0.62, 4, 0.07), metal, s * 2.05, 13.43, 0);
    head.rotation.z = s * 0.05;
    add(G.head, new RoundedBoxGeometry(0.6, 0.05, 0.32, 2, 0.02), ledMat, s * 2.1, 13.33, 0.06);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xffe6b5,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    glows.push(glow);
    glow.scale.set(1.5, 0.7, 1);
    glow.position.set(s * 2.1, 13.25, 0.25);
    G.head.add(glow);
  }
  add(G.head, new RoundedBoxGeometry(0.24, 0.3, 0.22, 2, 0.04), metalD, 0, 13.15, 0.2);
  const bullet = add(G.head, new THREE.CylinderGeometry(0.1, 0.11, 0.36, 32), silver, 0, 13.08, 0.42);
  bullet.rotation.x = Math.PI / 2 - 0.18;
  add(G.head, new THREE.BoxGeometry(0.26, 0.03, 0.42), silver, 0, 13.2, 0.44).rotation.x = -0.18;
  const lens = add(G.head, new THREE.CylinderGeometry(0.065, 0.065, 0.03, 32), glass, 0, 13.04, 0.61);
  lens.rotation.x = Math.PI / 2 - 0.18;

  // mist nozzles (5 levels, both sides)
  const NOZZLE_Y = [11.78, 10.68, 9.56, 8.31, 6.98];
  const emitters = [];
  NOZZLE_Y.forEach((y, k) => {
    for (const s of [-1, 1]) {
      const grp = s < 0 ? G.nozL : G.nozR;
      const x0 = (k === 0 ? 0.96 : 0.84) * s;
      const n = add(grp, new THREE.CylinderGeometry(0.04, 0.05, 0.2, 20), metalD, x0 + s * 0.1, y, 0);
      n.rotation.z = Math.PI / 2;
      add(grp, new THREE.CylinderGeometry(0.06, 0.06, 0.04, 20), silver, x0 + s * 0.2, y, 0).rotation.z = Math.PI / 2;
      emitters.push({ o: anchor(grp, x0 + s * 0.24, y, 0), dir: s });
    }
  });

  /* ================= screens ================= */
  const FACE = 0.505;
  function bezel(parent, w, h, y) {
    add(parent, new THREE.BoxGeometry(w + 0.07, h + 0.07, 0.02), glass, 0, y, FACE - 0.014);
  }

  const header = makeScreen(1.6, 0.3, true);
  header.mesh.position.set(0, 11.33, FACE);
  G.displays.add(header.mesh);

  const amb = makeScreen(1.38, 2.86);
  amb.mesh.position.set(0, 9.72, FACE);
  G.displays.add(amb.mesh);
  bezel(G.displays, 1.38, 2.86, 9.72);

  const logo = makeScreen(1.55, (1.55 * 508) / 2000, true, 1200);
  logo.mesh.position.set(0, 7.88, FACE);
  G.displays.add(logo.mesh);

  const trt = makeScreen(1.38, 3.6);
  trt.mesh.position.set(0, 5.71, FACE);
  G.displays.add(trt.mesh);
  bezel(G.displays, 1.38, 3.6, 5.71);

  const ad = makeScreen(1.38, 2.39);
  ad.mesh.position.set(0, 2.575, FACE);
  G.ad.add(ad.mesh);
  bezel(G.ad, 1.38, 2.39, 2.575);

  function font(w, s) {
    return `${w} ${s}px ${FONT}`;
  }
  function pmLabel(g, x, y, sub) {
    g.textAlign = 'left';
    g.fillStyle = WHITE;
    g.font = font(600, 78);
    g.fillText('PM', x, y);
    const w = g.measureText('PM').width;
    g.font = font(600, 40);
    g.fillText(sub, x + w + 4, y + 12);
    g.font = font(500, 34);
    g.fillStyle = '#cfcfcf';
    g.fillText('(µg/m³)', x, y + 52);
  }
  function rule(g, W, y) {
    g.fillStyle = 'rgba(255,255,255,.28)';
    g.fillRect(48, y, W - 96, 3);
  }

  let screensDirty = true;
  const vals = {};
  function setVal(k, text) {
    const v = vals[k];
    if (!v || v.text !== text) {
      vals[k] = { text, t0: performance.now() };
      screensDirty = true;
    }
  }

  function drawVal(g, k, x, y, size, color, now, align = 'right', maxW) {
    const v = vals[k];
    if (!v) return;
    const t = clamp((now - v.t0) / 450, 0, 1),
      e = easeOut(t);
    g.save();
    g.globalAlpha = e;
    g.textAlign = align;
    g.font = font(700, size);
    g.fillStyle = color;
    g.shadowColor = color;
    g.shadowBlur = 18;
    g.fillText(v.text, x, y - (1 - e) * 30, maxW);
    g.restore();
    if (t < 1) screensDirty = true;
  }

  function drawHeader() {
    const { g, W, H } = header;
    g.clearRect(0, 0, W, H);
    g.font = font(700, 86);
    g.textBaseline = 'middle';
    const a = g.measureText('Atmos').width,
      p = g.measureText('POLE').width,
      x = (W - a - p - 20) / 2;
    g.fillStyle = WHITE;
    g.fillText('Atmos', x, H / 2 + 4);
    g.fillStyle = ORANGE;
    g.fillText('POLE', x + a, H / 2 + 4);
    g.font = font(600, 26);
    g.fillStyle = WHITE;
    g.fillText('TM', x + a + p + 2, H / 2 - 22);
    header.tex.needsUpdate = true;
  }

  const logoImg = new Image();
  logoImg.src = '/atmospole/tributum-logo-light.png';
  logoImg.onload = () => drawLogo();

  function drawLogo() {
    const { g, W, H } = logo;
    g.clearRect(0, 0, W, H);
    if (logoImg.complete && logoImg.naturalWidth) {
      g.imageSmoothingQuality = 'high';
      g.drawImage(logoImg, 0, 0, W, H);
    }
    logo.tex.needsUpdate = true;
  }

  function lcdBase(s) {
    const { g, W, H } = s;
    g.fillStyle = '#040404';
    g.fillRect(0, 0, W, H);
    const gl = g.createLinearGradient(0, 0, W, H);
    gl.addColorStop(0, 'rgba(255,255,255,.035)');
    gl.addColorStop(0.5, 'rgba(255,255,255,0)');
    g.fillStyle = gl;
    g.fillRect(0, 0, W, H);
    g.textBaseline = 'alphabetic';
  }

  function drawAmb(now) {
    const { g, W } = amb;
    lcdBase(amb);
    g.textAlign = 'left';
    g.fillStyle = WHITE;
    g.font = font(600, 66);
    g.fillText('Ambient', 48, 120);
    g.fillText('Air Quality', 48, 196);
    pmLabel(g, 48, 345, '10');
    drawVal(g, 'a10', W - 48, 352, 100, ORANGE, now);
    rule(g, W, 445);
    pmLabel(g, 48, 560, '2.5');
    drawVal(g, 'a25', W - 48, 567, 100, ORANGE, now);
    rule(g, W, 660);
    drawVal(g, 'aStatus', 48, 870, 124, vals.aStatus?.text === 'Very Poor' ? '#ff4d3a' : ORANGE, now, 'left', W - 96);
    g.textAlign = 'left';
    g.font = font(500, 40);
    g.fillStyle = '#e6e6e6';
    g.fillText('Updated every 5 mins', 48, 1120);
    amb.tex.needsUpdate = true;
  }

  function drawTrt(now) {
    const { g, W } = trt;
    lcdBase(trt);
    g.textAlign = 'left';
    g.fillStyle = WHITE;
    g.font = font(600, 66);
    g.fillText('Treated', 48, 120);
    g.fillText('Air Quality', 48, 196);
    pmLabel(g, 48, 345, '2.5');
    drawVal(g, 't25', W - 48, 352, 100, ORANGE, now);
    rule(g, W, 445);
    pmLabel(g, 48, 560, '10');
    drawVal(g, 't10', W - 48, 567, 100, ORANGE, now);
    rule(g, W, 650);
    g.textAlign = 'left';
    g.font = font(500, 40);
    g.fillStyle = '#e6e6e6';
    g.fillText('Updated every 5 mins', 48, 730);
    g.fillStyle = WHITE;
    g.font = font(600, 58);
    g.fillText('Total Air Cleaned', 48, 880);
    g.font = font(500, 36);
    g.fillStyle = '#cfcfcf';
    g.fillText('(cu ft)', 48, 932);

    const on = Math.floor(now / 600) % 2 === 0;
    g.fillStyle = on ? '#ff4d3a' : 'rgba(255,77,58,.25)';
    g.beginPath();
    g.arc(W - 150, 920, 10, 0, 7);
    g.fill();
    g.fillStyle = '#ff4d3a';
    g.font = font(700, 32);
    g.fillText('LIVE', W - 130, 932);
    g.font = font(600, 34);
    g.fillStyle = WHITE;
    g.fillText('24', 48, 1030);
    g.fillText('Hours', 48, 1068);
    g.save();
    g.textAlign = 'right';
    g.font = font(700, 92);
    g.fillStyle = ORANGE;
    g.shadowColor = ORANGE;
    g.shadowBlur = 18;
    g.fillText(cleaned.toLocaleString('en-IN'), W - 48, 1068, W - 200);
    g.restore();
    rule(g, W, 1130);
    g.textAlign = 'left';
    g.fillStyle = WHITE;
    g.font = font(600, 58);
    g.fillText('Air Pulse™', 48, 1235);
    g.fillText('Index', 48, 1300);

    const pulse = 0.75 + 0.25 * Math.sin(now / 300);
    g.save();
    g.shadowColor = GREEN;
    g.shadowBlur = 24 * pulse;
    g.fillStyle = GREEN;
    g.fillRect(W - 124, 1196, 12, 80);
    g.fillRect(W - 158, 1230, 80, 12);
    g.font = font(700, 128);
    g.fillText('Good', 48, 1450);
    g.strokeStyle = GREEN;
    g.lineWidth = 9;
    g.beginPath();
    g.arc(W - 118, 1405, 54, 0, 7);
    g.stroke();
    g.beginPath();
    g.arc(W - 118, 1410, 30, 0.2, Math.PI - 0.2);
    g.stroke();
    g.beginPath();
    g.arc(W - 136, 1388, 7, 0, 7);
    g.arc(W - 100, 1388, 7, 0, 7);
    g.fill();
    g.restore();
    trt.tex.needsUpdate = true;
  }

  /* ---------- ad slides ---------- */
  const origImg = new Image();
  origImg.src = '/atmospole/atmospole.webp';
  origImg.onload = () => {
    screensDirty = true;
  };

  const ADS = [
    (g, W, H) => {
      g.fillStyle = '#f4ece9';
      g.fillRect(0, 0, W, H);
      if (origImg.complete && origImg.naturalWidth) {
        g.imageSmoothingQuality = 'high';
        g.drawImage(origImg, 276, 1070, 137, 237, 0, 0, W, H);
      }
    },
    (g, W, H) => {
      const gr = g.createLinearGradient(0, 0, W, H);
      gr.addColorStop(0, '#ffd23f');
      gr.addColorStop(1, '#ff7a00');
      g.fillStyle = gr;
      g.fillRect(0, 0, W, H);
      g.fillStyle = '#1a1200';
      g.textAlign = 'left';
      g.font = '800 46px Inter';
      g.fillText('MEGA', 50, 100);
      g.font = '800 110px Inter';
      g.fillText('SUMMER', 46, 210, W - 92);
      g.fillText('SALE', 46, 315);
      g.font = '800 280px Inter';
      g.fillText('50', 40, 640);
      g.font = '800 120px Inter';
      g.fillText('%', 360, 640);
      g.font = '700 58px Inter';
      g.fillText('OFF ON ALL', 50, 760);
      g.fillText('ELECTRONICS', 50, 830, W - 100);
      g.fillStyle = '#1a1200';
      g.beginPath();
      g.roundRect(50, 880, W - 100, 76, 14);
      g.fill();
      g.fillStyle = '#ffd23f';
      g.font = '700 40px Inter';
      g.textAlign = 'center';
      g.fillText('SHOP NOW', W / 2, 932);
    },
    (g, W, H) => {
      const gr = g.createRadialGradient(W * 0.7, H * 0.3, 10, W * 0.7, H * 0.3, H * 0.8);
      gr.addColorStop(0, '#2f6bff');
      gr.addColorStop(1, '#071a4d');
      g.fillStyle = gr;
      g.fillRect(0, 0, W, H);
      g.textAlign = 'left';
      g.fillStyle = 'rgba(255,255,255,.8)';
      g.font = '600 40px Inter';
      g.fillText('NEW LAUNCH', 50, 100);
      g.fillStyle = '#fff';
      g.font = '800 104px Inter';
      g.fillText('RIDE', 46, 220);
      g.fillStyle = '#4dffb5';
      g.fillText('ELECTRIC', 46, 325, W - 92);
      g.strokeStyle = '#fff';
      g.lineWidth = 20;
      g.beginPath();
      g.arc(150, 700, 70, 0, 7);
      g.stroke();
      g.beginPath();
      g.arc(430, 700, 70, 0, 7);
      g.stroke();
      g.fillStyle = '#4dffb5';
      g.beginPath();
      g.roundRect(150, 600, 280, 60, [30, 90, 10, 10]);
      g.fill();
      g.strokeStyle = '#fff';
      g.lineWidth = 18;
      g.beginPath();
      g.moveTo(400, 610);
      g.lineTo(450, 470);
      g.lineTo(500, 470);
      g.stroke();
      g.fillStyle = '#fff';
      g.font = '600 48px Inter';
      g.fillText('Zero emissions.', 50, 880);
      g.fillText('Book a test ride.', 50, 940);
    },
    (g, W, H) => {
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, '#3b2316');
      gr.addColorStop(1, '#140b06');
      g.fillStyle = gr;
      g.fillRect(0, 0, W, H);
      g.textAlign = 'center';
      g.fillStyle = '#e0a96d';
      g.font = '600 40px Inter';
      g.fillText('C A F É', W / 2, 100);
      g.fillStyle = '#f5e6d3';
      g.font = '800 104px Inter';
      g.fillText('FRESH', W / 2, 220);
      g.fillText('BREW', W / 2, 325);
      g.fillStyle = '#f5e6d3';
      g.beginPath();
      g.roundRect(170, 470, 200, 190, [0, 0, 70, 70]);
      g.fill();
      g.strokeStyle = '#f5e6d3';
      g.lineWidth = 18;
      g.beginPath();
      g.arc(380, 540, 45, -1.3, 1.3);
      g.stroke();
      g.fillStyle = 'rgba(245,230,211,.3)';
      g.beginPath();
      g.roundRect(225, 360, 24, 90, 12);
      g.roundRect(290, 345, 24, 105, 12);
      g.fill();
      g.fillStyle = '#e0a96d';
      g.font = '700 58px Inter';
      g.fillText('Buy 1 Get 1', W / 2, 800);
      g.fillStyle = 'rgba(245,230,211,.7)';
      g.font = '500 40px Inter';
      g.fillText('Every morning 8–11 am', W / 2, 870, W - 80);
    },
    (g, W, H) => {
      g.fillStyle = '#07120b';
      g.fillRect(0, 0, W, H);
      g.strokeStyle = '#3ddc84';
      g.lineWidth = 10;
      g.strokeRect(5, 5, W - 10, H - 10);
      g.textAlign = 'left';
      g.fillStyle = '#3ddc84';
      g.font = '600 40px Inter';
      g.fillText('ADVERTISE', 50, 110);
      g.fillStyle = '#fff';
      g.font = '800 112px Inter';
      g.fillText('YOUR', 46, 240);
      g.fillText('BRAND', 46, 350, W - 92);
      g.fillText('HERE', 46, 460);
      g.fillStyle = 'rgba(255,255,255,.85)';
      g.font = '500 44px Inter';
      ['Reach thousands of', 'commuters every day', 'on AtmosPOLE screens.'].forEach((t, i) =>
        g.fillText(t, 50, 620 + i * 62, W - 100)
      );
      g.fillStyle = '#3ddc84';
      g.font = '700 44px Inter';
      g.fillText('Tributum Power', 50, 920);
    },
  ];

  let adIdx = 0,
    adT0 = -1e9;
  function drawAd(now) {
    const { g, W, H } = ad;
    const k = ease(clamp((now - adT0) / 900, 0, 1));
    const prev = (adIdx - 1 + ADS.length) % ADS.length;
    g.save();
    g.translate(-k * W, 0);
    ADS[prev](g, W, H);
    g.restore();
    g.save();
    g.translate((1 - k) * W, 0);
    ADS[adIdx](g, W, H);
    g.restore();
    if (k < 1) screensDirty = true;
    ad.tex.needsUpdate = true;
  }

  intervals.push(
    setInterval(() => {
      adIdx = (adIdx + 1) % ADS.length;
      adT0 = performance.now();
      screensDirty = true;
    }, 3200)
  );

  /* ---------- live data ---------- */
  let amb10 = 125,
    amb25 = 125,
    cleaned = 806400;
  function tickData() {
    amb10 = Math.round(clamp(amb10 + rnd(-9, 9), 100, 175));
    amb25 = Math.round(clamp(amb25 + rnd(-8, 8), 90, 160));
    setVal('a10', String(amb10));
    setVal('a25', String(amb25));
    setVal('aStatus', amb25 > 140 ? 'Very Poor' : 'Unhealthy');
    setVal('t25', rnd(3.6, 4.9).toFixed(2));
    setVal('t10', rnd(3.2, 4.4).toFixed(2));
    screensDirty = true;
  }
  setVal('a10', '125');
  setVal('a25', '125');
  setVal('aStatus', 'Unhealthy');
  setVal('t25', '4.16');
  setVal('t10', '3.81');

  intervals.push(setInterval(tickData, 2200));
  intervals.push(
    setInterval(() => {
      cleaned += Math.round(rnd(6, 18));
      screensDirty = true;
    }, 250)
  );

  function drawStatic() {
    drawHeader();
    drawLogo();
  }
  drawStatic();
  if (typeof document !== 'undefined' && document.fonts) {
    document.fonts.ready.then(() => {
      drawStatic();
      screensDirty = true;
    });
    document.fonts.load(`600 40px ${FONT}`).then(() => {
      drawStatic();
      screensDirty = true;
    });
  }

  /* ================= mist particles ================= */
  const isMobile =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || ''));
  const MAXP = isMobile ? 1800 : 7000;
  const pPos = new Float32Array(MAXP * 3),
    pCol = new Float32Array(MAXP * 4),
    pVel = new Float32Array(MAXP * 3);
  const pLife = new Float32Array(MAXP).fill(1),
    pMax = new Float32Array(MAXP).fill(1);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 4));

  const mist = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 1.7,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
  );
  mist.frustumCulled = false;
  scene.add(mist);

  let pHead = 0,
    mistLevel = 0.3,
    mistRGB = [0.92, 0.96, 1],
    mistAlpha = 0.034;

  /* ================= light / dark theme ================= */
  function siteTheme() {
    for (const el of [document.documentElement, document.body]) {
      const v = (
        el.getAttribute('data-theme') ||
        el.getAttribute('data-bs-theme') ||
        el.getAttribute('data-mode') ||
        ''
      ).toLowerCase();
      if (v.includes('dark')) return 'dark';
      if (v.includes('light')) return 'light';
    }
    const apAttr = apRoot.getAttribute('data-ap-theme');
    if (apAttr === 'light' || apAttr === 'dark') return apAttr;
    if (options.theme === 'light' || options.theme === 'dark') return options.theme;
    const cls = ' ' + document.documentElement.className + ' ' + document.body.className + ' ';
    if (/\s(dark|dark-mode|dark-theme|theme-dark)\s/i.test(cls)) return 'dark';
    if (/\s(light|light-mode|light-theme|theme-light)\s/i.test(cls)) return 'light';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme() {
    const light = siteTheme() === 'light';
    apRoot.dataset.apTheme = light ? 'light' : 'dark';
    apRoot.setAttribute('data-ap-theme', light ? 'light' : 'dark');
    mist.material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    mist.material.needsUpdate = true;
    mistRGB = light ? [0.5, 0.58, 0.68] : [0.92, 0.96, 1];
    mistAlpha = light ? 0.26 : 0.034;
    glows.forEach((g) => (g.material.opacity = light ? 0.25 : 0.55));
    renderer.toneMappingExposure = light ? 1.15 : 1.25;
    fill.intensity = light ? 1.4 : 0.9;
    shadow.material.opacity = light ? 0.55 : 1;
  }

  const themeWatch = new MutationObserver(applyTheme);
  for (const el of [document.documentElement, document.body]) {
    themeWatch.observe(el, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme', 'data-mode'] });
  }
  const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  if (mediaQuery) mediaQuery.addEventListener('change', applyTheme);
  applyTheme();

  const tmp = new THREE.Vector3();
  function updateMist(dt) {
    for (const e of emitters) {
      e.acc = (e.acc || 0) + dt * (stacked ? 95 : 150) * mistLevel;
      e.o.getWorldPosition(tmp);
      while (e.acc >= 1) {
        e.acc--;
        const i = pHead++ % MAXP,
          j = i * 3;
        pPos[j] = tmp.x;
        pPos[j + 1] = tmp.y;
        pPos[j + 2] = tmp.z;
        const v = rnd(1.6, 2.8);
        pVel[j] = e.dir * v;
        pVel[j + 1] = rnd(-0.35, 0.45);
        pVel[j + 2] = rnd(-0.8, 0.8);
        pLife[i] = 0;
        pMax[i] = rnd(1.1, 2.1);
      }
    }
    const drag = Math.exp(-dt * 1.7);
    for (let i = 0; i < MAXP; i++) {
      const j = i * 3;
      const c = i * 4;
      if (pLife[i] >= pMax[i]) {
        pCol[c + 3] = 0;
        continue;
      }
      pLife[i] += dt;
      pPos[j] += pVel[j] * dt;
      pPos[j + 1] += pVel[j + 1] * dt;
      pPos[j + 2] += pVel[j + 2] * dt;
      pVel[j] *= drag;
      pVel[j + 1] = pVel[j + 1] * drag + 0.12 * dt;
      pVel[j + 2] *= drag;
      pCol[c] = mistRGB[0];
      pCol[c + 1] = mistRGB[1];
      pCol[c + 2] = mistRGB[2];
      pCol[c + 3] = Math.sin((Math.PI * pLife[i]) / pMax[i]) * mistAlpha;
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;
  }

  /* ================= tour: camera stations ================= */
  const STEPS = [
    { y: 7.6, view: 'full', az: -24, el: 0.06 },
    { y: 14.2, view: 'zoom', az: 16, el: 0.32 },
    { y: 13.2, view: 'zoom', az: 10, el: 0.08 },
    { y: 13.2, view: 'zoomW', az: 0, el: 0.06 },
    { y: 9.9, view: 'zoom', az: -12, el: 0.04 },
    { y: 9.7, view: 'zoom', az: 8, el: 0.02 },
    { y: 5.8, view: 'zoom', az: 8, el: 0.02 },
    { y: 2.6, view: 'zoom', az: 10, el: 0.02 },
    { y: 7.6, view: 'full', az: 26, el: 0.06 },
    { y: 8.4, view: 'explode', az: 38, el: 0.1 },
  ];
  const MIST_STEP = 4;
  const HOTSPOTS = {
    1: [anchor(G.solar, 0.45, 14.6, 0.15)],
    2: [anchor(G.head, 0, 13.04, 0.62)],
    3: [anchor(G.head, -2.1, 13.31, 0.2), anchor(G.head, 2.1, 13.31, 0.2)],
    4: [emitters[2].o, emitters[5].o],
    5: [anchor(G.displays, -0.42, 10.62, FACE)],
    6: [anchor(G.displays, -0.42, 7.0, FACE)],
    7: [anchor(G.ad, -0.45, 3.2, FACE)],
  };

  const labelsEl = apRoot.querySelector('#ap-labels');
  const TAGS = [
    [G.solar, 1.2, 14.6, 0, 'Solar Crown'],
    [G.head, 2.75, 13.43, 0, 'Light & Camera Head'],
    [G.cap, 1.25, 12.1, 0, 'Mist Cap'],
    [G.nozR, 1.1, 9.0, 0, 'Nozzle Banks'],
    [G.displays, 0.8, 9.7, FACE, 'AQI Display Stack'],
    [G.ad, 0.8, 2.6, FACE, 'Ad Screen'],
  ].map(([grp, x, y, z, text]) => {
    const el = document.createElement('div');
    el.className = 'tag';
    el.innerHTML = `<span>${text}</span>`;
    if (labelsEl) labelsEl.appendChild(el);
    return { o: anchor(grp, x, y, z), oL: anchor(grp, -x, y, z), el };
  });

  const tour = apRoot.querySelector('#ap-tour');
  const cards = [...apRoot.querySelectorAll('.card')];
  const dots = apRoot.querySelector('#ap-dots');
  const stepsEl = apRoot.querySelector('#ap-steps');

  if (dots && stepsEl) {
    dots.innerHTML = '';
    stepsEl.innerHTML = '';
    STEPS.forEach(() => {
      dots.appendChild(document.createElement('i'));
      stepsEl.appendChild(document.createElement('section'));
    });
  }
  const dotEls = dots ? [...dots.children] : [];

  const svg = apRoot.querySelector('#ap-links'),
    NS = 'http://www.w3.org/2000/svg';
  let LINKS = [];
  if (svg) {
    svg.innerHTML = '';
    LINKS = [0, 1].map(() => {
      const path = document.createElementNS(NS, 'path'),
        dot = document.createElementNS(NS, 'circle'),
        ring = document.createElementNS(NS, 'circle');
      ring.setAttribute('class', 'ring');
      dot.setAttribute('r', '4.5');
      path.setAttribute('pathLength', '1');
      path.setAttribute('stroke-dasharray', '1');
      svg.append(path, ring, dot);
      return { path, dot, ring };
    });
  }

  const stage = apRoot.querySelector('.stage');
  let sp = 0,
    current = -1,
    lineStart = 0,
    W = 0,
    H = 0,
    stacked = false,
    cardH = 0,
    cardR = 0,
    lastResizeW = 0,
    lastResizeH = 0,
    lastTagOp = 0,
    activeCardRect = null;

  function updateActiveCardRect() {
    if (!cards[current] || !stage) {
      activeCardRect = null;
      return;
    }
    const cr = cards[current].getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    activeCardRect = {
      left: cr.left - sr.left,
      right: cr.right - sr.left,
      top: cr.top - sr.top,
      width: cr.width,
      height: cr.height,
    };
  }

  function resize() {
    if (!stage) return;
    const newW = stage.clientWidth;
    const newH = stage.clientHeight;
    if (newW <= 0 || newH <= 0) return;

    // Avoid costly GPU WebGL buffer re-allocations on minor mobile address-bar height shifts (<70px)
    const isMinorHeightShift = lastResizeW === newW && Math.abs(newH - lastResizeH) < 70;

    W = newW;
    H = newH;
    stacked = W < 760 || W / H < 0.85;
    stage.classList.toggle('stacked', stacked);

    if (!isMinorHeightShift) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(W, H, false);
      lastResizeW = W;
      lastResizeH = H;
    }
    camera.aspect = W / H;

    cardH = Math.max(...cards.map((c) => c.offsetHeight || 0), 100);
    cardR = Math.max(...cards.map((c) => (c.offsetLeft || 0) + (c.offsetWidth || 0)), 300);

    const availW = stacked ? W - 28 : Math.max(W * 0.4, W - cardR - 70);
    const availH = stacked ? Math.max(H * 0.35, H - cardH - 40) : H;
    if (stacked) {
      camera.setViewOffset(W, H, 0, (H - availH) / 2, W, H);
    } else {
      camera.setViewOffset(W, H, W / 2 - (cardR + 20 + availW / 2), 0, W, H);
    }
    camera.updateProjectionMatrix();

    if (dots) {
      if (stacked) dots.style.top = Math.max(16, (H - cardH - 32) / 2 - 60) + 'px';
      else dots.style.top = '';
    }
    updateActiveCardRect();
  }

  const resizeObs = new ResizeObserver(resize);
  if (stage) resizeObs.observe(stage);
  resize();
  if (typeof document !== 'undefined' && document.fonts) {
    document.fonts.ready.then(resize);
  }

  const v3 = new THREE.Vector3();
  function toScreen(o) {
    o.getWorldPosition(v3);
    v3.project(camera);
    return [((v3.x + 1) / 2) * W, ((1 - v3.y) / 2) * H, v3.z < 1];
  }

  function drawLinks(now, mobile, vis) {
    const spots = HOTSPOTS[current] || [];
    if (!cards[current] || vis <= 0.01) {
      LINKS.forEach((L) => {
        L.path.style.display = L.dot.style.display = L.ring.style.display = 'none';
      });
      return;
    }
    if (!activeCardRect) updateActiveCardRect();
    const cr = activeCardRect;
    if (!cr) return;

    const grow = clamp((now - lineStart - 180) / 450, 0, 1) * vis;
    LINKS.forEach((L, k) => {
      const o = spots[k];
      if (!o) {
        L.path.style.display = L.dot.style.display = L.ring.style.display = 'none';
        return;
      }
      const [hx, hy] = toScreen(o);
      let d;
      if (mobile) {
        const ax = clamp(hx, cr.left + 30, cr.right - 30);
        const ay = cr.top;
        d = `M${ax},${ay} L${ax},${ay - 20} L${hx},${hy}`;
      } else {
        const ax = cr.right;
        const ay = cr.top + 34 + k * 26;
        const ex = Math.max(ax + 36, Math.min(hx - 40, ax + 120));
        d = `M${ax},${ay} L${ex},${ay} L${hx},${hy}`;
      }
      L.path.style.display = '';
      L.path.setAttribute('d', d);
      L.path.setAttribute('stroke-dashoffset', String(1 - grow));
      L.path.style.opacity = String(vis);
      const showDot = grow > 0.95 ? '' : 'none';
      L.dot.style.display = L.ring.style.display = showDot;
      const ph = (now / 1600) % 1;
      L.dot.setAttribute('cx', String(hx));
      L.dot.setAttribute('cy', String(hy));
      L.ring.setAttribute('cx', String(hx));
      L.ring.setAttribute('cy', String(hy));
      L.ring.setAttribute('r', String(6 + ph * 14));
      L.ring.style.opacity = String((1 - ph) * vis);
    });
  }

  const clock = new THREE.Clock();
  let blinkCounter = 0;

  function frame() {
    animId = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05),
      now = performance.now(),
      time = clock.elapsedTime;
    const mobile = stacked;

    if (!tour) return;
    const r = tour.getBoundingClientRect();
    const target = clamp(-r.top / Math.max(1, tour.offsetHeight - H), 0, 1) * (STEPS.length - 1);

    // Responsive, mathematically continuous smoothing without snap vibration during slow scroll
    const smoothRate = mobile ? 12.0 : 8.5;
    sp += (target - sp) * (1 - Math.exp(-dt * smoothRate));
    if (Math.abs(target - sp) < 0.00002) sp = target;

    const i = Math.min(Math.floor(sp), STEPS.length - 2);
    const A = STEPS[i],
      B = STEPS[i + 1];
    let f = sp - i;
    const isZoom = (v) => v === 'zoom' || v === 'zoomW';
    if (!isZoom(A.view) || !isZoom(B.view)) f = f * f * (3 - 2 * f);

    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const availW = stacked ? W - 28 : Math.max(W * 0.4, W - cardR - 70);
    const availH = stacked ? Math.max(H * 0.35, H - cardH - 40) : H;
    const fit = (w, h) =>
      Math.max((h * H) / (2 * tanH * availH), (w * W) / (2 * tanH * camera.aspect * availW));
    const zw = Math.max(3.0, availW / 160),
      zh = Math.max(3.6, availH / 150);
    const dZoom = stacked ? fit(zw, zh) : fit(5.6, 5.0);
    const dFull = fit(stacked ? 6.2 : 6.8, 16.6);
    const D = {
      zoom: dZoom,
      zoomW: stacked ? fit(Math.max(5.8, zw), zh) : dZoom,
      full: dFull,
      explode: fit(stacked ? 7.2 : 8.5, 19.5),
    };
    const dist = Math.exp(lerp(Math.log(D[A.view]), Math.log(D[B.view]), f));

    // Zero sine-wave wobble: camera smoothly tracks scroll position without artificial oscillation
    const az = THREE.MathUtils.degToRad(lerp(A.az, B.az, f));
    const el = lerp(A.el, B.el, f),
      ty = lerp(A.y, B.y, f);
    const ex = lerp(A.view === 'explode' ? 1 : 0, B.view === 'explode' ? 1 : 0, f);

    camera.position.set(
      Math.sin(az) * Math.cos(el) * dist,
      ty + Math.sin(el) * dist,
      Math.cos(az) * Math.cos(el) * dist
    );
    camera.lookAt(0, ty, 0);

    for (const k in G) {
      const o = EXPLODE[k];
      G[k].position.set(o[0] * ex, o[1] * ex, o[2] * ex);
    }

    const tagOp = clamp((ex - 0.6) / 0.4, 0, 1);
    if (tagOp > 0 || lastTagOp > 0) {
      lastTagOp = tagOp;
      TAGS.forEach((t) => {
        t.el.style.opacity = String(tagOp);
        if (!tagOp) return;
        let [x, y] = toScreen(t.o),
          flip = false;
        const w = t.el.offsetWidth;
        if (x + w > W - 8) {
          [x, y] = toScreen(t.oL);
          flip = true;
          x = Math.max(x, w + 8);
        }
        t.el.classList.toggle('flip', flip);
        t.el.style.left = x + 'px';
        t.el.style.top = y + 'px';
      });
    }

    mistLevel += (Math.max(0.3, 1 - Math.abs(sp - MIST_STEP) * 0.6) - mistLevel) * (1 - Math.exp(-dt * 3));
    updateMist(dt);

    const currentBlink = Math.floor(now / 600);
    if (screensDirty || currentBlink !== blinkCounter) {
      blinkCounter = currentBlink;
      screensDirty = false;
      drawAmb(now);
      drawAd(now);
      drawTrt(now);
    }

    // Hysteresis on step activation: prevents rapid toggling between two cards on mobile
    let nextActive = current;
    if (current < 0) {
      nextActive = Math.round(sp);
    } else if (sp > current + 0.52 && current < STEPS.length - 1) {
      nextActive = current + 1;
    } else if (sp < current - 0.52 && current > 0) {
      nextActive = current - 1;
    }

    if (nextActive !== current) {
      current = nextActive;
      lineStart = now;
      cards.forEach((c, k) => c.classList.toggle('on', k === nextActive));
      dotEls.forEach((d, k) => d.classList.toggle('on', k === nextActive));
      updateActiveCardRect();
    }

    // Stable connector line visibility when paused on a step
    const distFromStep = Math.abs(sp - current);
    const linkVis = distFromStep < 0.2 ? 1 : clamp((0.55 - distFromStep) / 0.35, 0, 1);
    drawLinks(now, mobile, linkVis);

    renderer.render(scene, camera);
  }

  const loadingEl = apRoot.querySelector('#ap-loading');
  if (loadingEl) loadingEl.remove();
  animId = requestAnimationFrame(frame);

  return function destroy() {
    if (animId) cancelAnimationFrame(animId);
    intervals.forEach(clearInterval);
    themeWatch.disconnect();
    if (mediaQuery) mediaQuery.removeEventListener('change', applyTheme);
    if (stage) resizeObs.disconnect();
    renderer.dispose();
  };
}
