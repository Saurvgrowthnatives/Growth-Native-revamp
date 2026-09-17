import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INK = 0x03080f;
const BLUE = 0x0074f8;
const GREEN = 0x19c027;
const BG_COLOR = new THREE.Color(0xf5f6f3);

// ---------------------------------------------------------------- geometry
// One architecture, one grid. 200+ and 94% are the two outer walls of the
// system; 3x / 15+ / the GN core assemble between them, in the same
// coordinate space they occupy in the final state — only their z-depth,
// scale and opacity animate, never their x/y.
// Sized generously (and the camera pulled closer, below) so every label has
// real breathing room — the previous scale left descriptions touching edges.
const FULL_W = 6.6;
const OUTER_H = 1.2; // thin, wide card ratio matching the reference
const GRID_GAP = 0.22;
// 3x/15+ each get a full 2-line label + 3-line description in a row half
// this tall — measured against actual type metrics (not guessed) after the
// previous value left their descriptions spilling into the row/box below.
const MID_H = 4.7;
const ROW_H = (MID_H - GRID_GAP) / 2;
// Left/right split shifted toward the right so the GN-core (icon) panel gets
// a noticeably bigger box, per explicit request.
const LEFT_COL_W = FULL_W * 0.52;
const RIGHT_COL_W = FULL_W - LEFT_COL_W - GRID_GAP;

const TOTAL_H_FINAL = OUTER_H * 2 + GRID_GAP * 2 + MID_H;
const TOP_Y_FINAL = TOTAL_H_FINAL / 2 - OUTER_H / 2;
const BOTTOM_Y_FINAL = -TOP_Y_FINAL;

// Tighter gap between the two outer walls in the pre-scroll starting state —
// was a full OUTER_H (1.2) apart, now well under half that.
const INITIAL_GAP = 0.5;
const TOP_Y_INITIAL = OUTER_H / 2 + INITIAL_GAP / 2;
const BOTTOM_Y_INITIAL = -TOP_Y_INITIAL;

const TOP_Y_OPEN = 3.45;
const BOTTOM_Y_OPEN = -3.45;

const MID_X = -FULL_W / 2 + LEFT_COL_W / 2;
const CORE_X = -FULL_W / 2 + LEFT_COL_W + GRID_GAP + RIGHT_COL_W / 2;
const ROW_Y = ROW_H / 2 + GRID_GAP / 2;

const HALF_OUTER_W = FULL_W / 2;
const HALF_MID_H = MID_H / 2;

export type LabelProjection = {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  /** Live projected pixel budget for this panel's text, recomputed every
   *  frame from the panel's actual on-screen size — the DOM label is capped
   *  to this instead of a fixed px value, so text can never overflow the
   *  visible box regardless of viewport width or camera zoom. */
  maxWidth: number;
  maxHeight: number;
  /** On-screen angle (degrees) of the panel's own top edge after the 3D
   *  architecture rotation + camera projection — applied as a CSS `rotate()`
   *  so the DOM label visually tilts with its panel instead of staying flat
   *  while the box underneath rotates during separation/resolve. */
  rotation: number;
};

// Every corner extends in this same fixed direction — a single consistent
// "depth axis" for the whole composition, not each corner radiating outward
// on its own. Matches the reference: all extension lines lean the same way.
const CORNER_FADE_DIR = new THREE.Vector2(0.82, 0.52).normalize();

/**
 * Thin lines from each of the 4 corners that fade from ink to the page
 * background colour along their own length — so they dissolve to nothing
 * with no visible endpoint, rather than stopping on a hard edge.
 */
function cornerFadeGeometry(w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  const len = Math.min(w, h) * 0.5;
  const corners: [number, number][] = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ];
  const ink = new THREE.Color(INK);
  const pts: number[] = [];
  const colors: number[] = [];

  for (const [cx, cy] of corners) {
    const ex = cx + CORNER_FADE_DIR.x * len;
    const ey = cy + CORNER_FADE_DIR.y * len;
    pts.push(cx, cy, 0, ex, ey, 0);
    colors.push(ink.r, ink.g, ink.b, BG_COLOR.r, BG_COLOR.g, BG_COLOR.b);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geo;
}

type Panel = {
  group: THREE.Group;
  surfaceMat: THREE.MeshBasicMaterial;
  edgeMat: THREE.LineDashedMaterial;
  markMat: THREE.LineBasicMaterial;
  anchor: THREE.Vector3;
  w: number;
  h: number;
  insetX: number;
  insetY: number;
  geometries: THREE.BufferGeometry[];
};

function makePanel(w: number, h: number): Panel {
  // A single flat plane with its own edge outline — a box's back-face edges
  // sit close enough to the front under this camera to read as a doubled,
  // slightly-offset stroke rather than a deliberate depth cue, so the panel
  // is one clean rectangle, not an extruded box. Depth is instead suggested
  // by the fading corner lines below.
  const frontGeo = new THREE.PlaneGeometry(w, h);
  const edgesGeo = new THREE.EdgesGeometry(frontGeo);
  const fadeGeo = cornerFadeGeometry(w, h);

  const surfaceMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  // Fine, uniform dotted stroke — flat colour, no gradient, tight dot spacing
  const edgeMat = new THREE.LineDashedMaterial({
    color: INK,
    transparent: true,
    opacity: 0,
    dashSize: 0.02,
    gapSize: 0.021,
  });
  // Solid (undashed) so the colour fade reads smoothly, with no dash steps
  const markMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0,
  });

  const group = new THREE.Group();

  const front = new THREE.Mesh(frontGeo, surfaceMat);
  group.add(front);

  const edgeLines = new THREE.LineSegments(edgesGeo, edgeMat);
  edgeLines.computeLineDistances();
  group.add(edgeLines);

  const marks = new THREE.LineSegments(fadeGeo, markMat);
  group.add(marks);

  // More inner padding around the text than before — kept as a fixed inset
  // (not a fraction of w/h) so it reads consistently across differently
  // shaped panels, same technique as before, just a bigger value.
  const insetX = 0.4;
  const insetY = 0.38;

  return {
    group,
    surfaceMat,
    edgeMat,
    markMat,
    anchor: new THREE.Vector3(-w / 2 + insetX, h / 2 - insetY, 0.02),
    w,
    h,
    insetX,
    insetY,
    geometries: [edgesGeo, frontGeo, fadeGeo],
  };
}

function setPanelOpacity(panel: Panel, t: number) {
  // Near-opaque white fill (was 0.4) so a panel reads as a solid card and
  // hides anything behind or crossing near it, instead of letting it show
  // through a translucent front face.
  panel.surfaceMat.opacity = t * 0.97;
  panel.edgeMat.opacity = t * 0.55;
  panel.markMat.opacity = t * 0.4;
}

export type WhyPartnerScene = {
  resize: (width: number, height: number) => void;
  setActive: (active: boolean) => void;
  dispose: () => void;
};

export function createWhyPartnerScene(opts: {
  canvas: HTMLCanvasElement;
  section: HTMLElement;
  width: number;
  height: number;
  allowParallax: boolean;
  onFrame: (labels: LabelProjection[]) => void;
}): WhyPartnerScene | null {
  const { canvas, section, allowParallax, onFrame } = opts;
  let width = opts.width;
  let height = opts.height;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();
  const FOV = 32;
  const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
  const cameraTarget = new THREE.Vector3(0.02, 0.1, 0);

  // Every cameraBase.z tween below was tuned by eye at a "typical" canvas
  // aspect ratio. On a narrower/taller canvas (small laptop widths, where the
  // 64%-width column can end up taller than it is wide) the SAME z leaves
  // less horizontal frustum, and wide panels start clipping/crowding even
  // though nothing else changed — this is the actual root cause behind
  // "boxes too small / text cramped" reports on smaller screens, not just an
  // absolute-size problem. Correct for it structurally: scale z up whenever
  // the live aspect is narrower than the tuned reference, recomputed on
  // resize, so the horizontal fit is guaranteed regardless of screen shape.
  // Capped modestly: a full correction to the reference aspect shrinks the
  // vertical frustum by the same factor, which starves label height exactly
  // where it's already tightest (narrow desktop widths) — worse than the
  // horizontal crowding it's meant to fix. A small, capped nudge still helps
  // without fighting the vertical-space fix below.
  const REFERENCE_ASPECT = 1.25;
  const computeAspectZoomScale = (w: number, h: number) =>
    Math.min(1.1, Math.max(1, REFERENCE_ASPECT / (w / h)));
  let aspectZoomScale = computeAspectZoomScale(width, height);

  // growthArchitecture
  const architecture = new THREE.Group();
  scene.add(architecture);

  // ├── top200Panel / bottom94Panel — the two persistent outer walls
  const top200 = makePanel(FULL_W, OUTER_H);
  top200.group.position.set(0, TOP_Y_INITIAL, 0);
  architecture.add(top200.group);

  const bottom94 = makePanel(FULL_W, OUTER_H);
  bottom94.group.position.set(0, BOTTOM_Y_INITIAL, 0);
  architecture.add(bottom94.group);

  // ├── middleGroup — never itself translates; only its children reveal
  const middleGroup = new THREE.Group();
  middleGroup.position.set(0, 0, 0);
  architecture.add(middleGroup);

  const MID_Z_START = -2.17;

  const efficiency3x = makePanel(LEFT_COL_W, ROW_H);
  efficiency3x.group.position.set(MID_X, ROW_Y, MID_Z_START);
  efficiency3x.group.scale.setScalar(0.92);
  middleGroup.add(efficiency3x.group);

  const ai15 = makePanel(LEFT_COL_W, ROW_H);
  ai15.group.position.set(MID_X, -ROW_Y, MID_Z_START);
  ai15.group.scale.setScalar(0.92);
  middleGroup.add(ai15.group);

  const growthCore = makePanel(RIGHT_COL_W, MID_H);
  growthCore.group.position.set(CORE_X, 0, MID_Z_START);
  growthCore.group.scale.setScalar(0.92);
  middleGroup.add(growthCore.group);

  // GN system icon — original ascending node path, contained inside its panel
  const coreVisual = new THREE.Group();
  coreVisual.position.z = 0.02;
  growthCore.group.add(coreVisual);

  const SPINE: [number, number][] = [
    [-0.89, -0.64],
    [-0.29, -0.21],
    [0.29, 0.24],
    [0.89, 0.68],
  ];
  const BRANCHES: [number, number][] = [
    [-0.43, 0.54],
    [0.54, -0.43],
  ];
  const nodeGeo = new THREE.CircleGeometry(0.1, 20);
  const branchGeo = new THREE.CircleGeometry(0.065, 16);
  const coreNodeMats: THREE.MeshBasicMaterial[] = [];

  SPINE.forEach(([x, y], i) => {
    const mat = new THREE.MeshBasicMaterial({
      color: i >= 2 ? GREEN : BLUE,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.position.set(x, y, 0.01);
    coreNodeMats.push(mat);
    coreVisual.add(mesh);
  });
  BRANCHES.forEach(([x, y]) => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0x484d57,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(branchGeo, mat);
    mesh.position.set(x, y, 0.01);
    coreNodeMats.push(mat);
    coreVisual.add(mesh);
  });

  const corePathPts: number[] = [];
  for (let i = 0; i < SPINE.length - 1; i++) {
    corePathPts.push(SPINE[i][0], SPINE[i][1], 0, SPINE[i + 1][0], SPINE[i + 1][1], 0);
  }
  corePathPts.push(BRANCHES[0][0], BRANCHES[0][1], 0, SPINE[1][0], SPINE[1][1], 0);
  corePathPts.push(BRANCHES[1][0], BRANCHES[1][1], 0, SPINE[2][0], SPINE[2][1], 0);
  const corePathGeo = new THREE.BufferGeometry();
  corePathGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(corePathPts, 3)
  );
  const corePathMat = new THREE.LineBasicMaterial({
    color: INK,
    transparent: true,
    opacity: 0,
  });
  const corePaths = new THREE.LineSegments(corePathGeo, corePathMat);
  coreVisual.add(corePaths);

  // ├── structuralLines — the grid seams, static geometry, opacity-only reveal
  const vDividerPts = [
    -FULL_W / 2 + LEFT_COL_W + GRID_GAP / 2,
    -HALF_MID_H,
    0,
    -FULL_W / 2 + LEFT_COL_W + GRID_GAP / 2,
    HALF_MID_H,
    0,
  ];
  const hDividerPts = [
    -HALF_OUTER_W,
    0,
    0,
    -FULL_W / 2 + LEFT_COL_W,
    0,
    0,
  ];
  const structGeo = new THREE.BufferGeometry();
  structGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([...vDividerPts, ...hDividerPts], 3)
  );
  const structMat = new THREE.LineBasicMaterial({
    color: INK,
    transparent: true,
    opacity: 0,
  });
  const structuralLines = new THREE.LineSegments(structGeo, structMat);
  middleGroup.add(structuralLines);

  // ------------------------------------------------------------------ camera
  const cameraBase = { x: 0.04, y: 0.06, z: 11.3 };
  let parallaxX = 0;
  let parallaxY = 0;
  const pointer = { x: 0, y: 0 };

  // -------------------------------------------------------------- reveal state
  const reveal = { outer: 0, mid3x: 0, mid15: 0, core: 0, grid: 0 };

  // ---------------------------------------------------------------- timeline
  // ONE scrubbed timeline, CSS sticky does the pinning. Every property is only
  // ever touched inside the window it's meant to move in, so holds need no
  // code of their own — outside a tween's window the object simply keeps its
  // last value, and reversal is exact because scrub just re-seeks progress.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
    defaults: { ease: "none" },
  });

  // quick settle-in so the two outer panels are never on-screen at zero opacity
  tl.to(reveal, { outer: 1, duration: 0.05 }, 0);

  // 0.18 -> 0.42: the two outer walls separate into a tilted architecture,
  // opening a large empty cavity between them
  // positive z lifts the right edge upward (CCW as seen from the camera) —
  // the specific tilt direction the reference uses
  tl.to(architecture.rotation, { x: -0.07, y: -0.1, z: 0.05, duration: 0.24 }, 0.18);
  tl.to(top200.group.position, { y: TOP_Y_OPEN, duration: 0.24 }, 0.18);
  tl.to(bottom94.group.position, { y: BOTTOM_Y_OPEN, duration: 0.24 }, 0.18);
  tl.to(cameraBase, { x: 0.6, y: 0.7, z: 15.5, duration: 0.24 }, 0.18);

  // 0.42 -> 0.54 / 0.50 -> 0.64 / 0.56 -> 0.70: content assembles INTO the
  // cavity, only after the outer walls have fully separated (0.42)
  tl.to(reveal, { mid3x: 1, duration: 0.12 }, 0.42);
  tl.to(reveal, { mid15: 1, duration: 0.14 }, 0.5);
  tl.to(reveal, { core: 1, duration: 0.14 }, 0.56);
  tl.to(reveal, { grid: 1, duration: 0.1 }, 0.64);
  // camera pulls back further so the whole assembling cavity stays in frame
  tl.to(cameraBase, { y: 0.85, z: 17.0, duration: 0.28 }, 0.42);

  // 0.70 -> 0.78: hold the complete tilted composition (no tweens placed here)

  // 0.78 -> 0.96: the whole system resolves back to a straight, frontal,
  // tightly-aligned technical diagram
  tl.to(architecture.rotation, { x: 0, y: 0, z: 0, duration: 0.18 }, 0.78);
  tl.to(top200.group.position, { y: TOP_Y_FINAL, duration: 0.18 }, 0.78);
  tl.to(bottom94.group.position, { y: BOTTOM_Y_FINAL, duration: 0.18 }, 0.78);
  tl.to(cameraBase, { x: 0.04, y: 0.06, z: 15.1, duration: 0.18 }, 0.78);

  // ------------------------------------------------------------------ ticker
  const labels: LabelProjection[] = [
    { x: 0, y: 0, opacity: 0, scale: 1, maxWidth: 400, maxHeight: 200, rotation: 0 }, // 200+
    { x: 0, y: 0, opacity: 0, scale: 1, maxWidth: 400, maxHeight: 200, rotation: 0 }, // 94%
    { x: 0, y: 0, opacity: 0, scale: 1, maxWidth: 260, maxHeight: 200, rotation: 0 }, // 3x
    { x: 0, y: 0, opacity: 0, scale: 1, maxWidth: 260, maxHeight: 200, rotation: 0 }, // 15+
  ];
  const scratch = new THREE.Vector3();
  const rightScratch = new THREE.Vector3();
  const bottomScratch = new THREE.Vector3();

  const computeLabelScale = (w: number) => Math.max(0.74, Math.min(1.06, w / 820));
  let labelScale = computeLabelScale(width);

  // Projects the anchor (top-left text origin) AND the panel's own safe
  // right/bottom bounds every frame, so the DOM label is capped to the
  // panel's real live on-screen size — not a hand-picked px constant that
  // only matches one tested viewport/zoom combination.
  function projectAnchor(panel: Panel, target: LabelProjection, opacity: number) {
    scratch.copy(panel.anchor);
    panel.group.localToWorld(scratch);
    const dist = camera.position.distanceTo(scratch);
    scratch.project(camera);
    const screenX = (scratch.x * 0.5 + 0.5) * width;
    const screenY = (-scratch.y * 0.5 + 0.5) * height;

    rightScratch.set(panel.w / 2 - panel.insetX, panel.anchor.y, panel.anchor.z);
    panel.group.localToWorld(rightScratch);
    rightScratch.project(camera);
    const rightX = (rightScratch.x * 0.5 + 0.5) * width;
    const rightY = (-rightScratch.y * 0.5 + 0.5) * height;

    bottomScratch.set(panel.anchor.x, -panel.h / 2 + panel.insetY, panel.anchor.z);
    panel.group.localToWorld(bottomScratch);
    bottomScratch.project(camera);
    const bottomX = (bottomScratch.x * 0.5 + 0.5) * width;
    const bottomY = (-bottomScratch.y * 0.5 + 0.5) * height;

    target.x = screenX;
    target.y = screenY;
    target.opacity = opacity;
    // maxWidth/maxHeight below are already an exact match to the panel's
    // true projected edges, so `scale` must never exceed 1 — a >1 pop would
    // render the (already edge-matched) label bigger than the panel itself,
    // pushing text visibly past the box border even though it's correctly
    // wrapped/clipped inside its own container. The depth-based "grows as it
    // approaches" pop and the narrow-viewport shrink are both kept, just
    // hard-capped so they can only ever shrink the label, never enlarge it
    // past the box's real size.
    const depthPop = Math.max(0, Math.min(1, (15.2 - dist) / 3.4)) * 0.14 + 0.92;
    target.scale = Math.min(1, depthPop * labelScale);
    // Straight-line (not axis-only) distance to each edge — needed once the
    // label can be rotated, since a tilted edge's true on-screen length isn't
    // just its horizontal/vertical delta.
    const dxRight = rightX - screenX;
    const dyRight = rightY - screenY;
    const dxBottom = bottomX - screenX;
    const dyBottom = bottomY - screenY;
    target.maxWidth = Math.max(80, Math.hypot(dxRight, dyRight));
    target.maxHeight = Math.max(60, Math.hypot(dxBottom, dyBottom));
    // Angle of the panel's own top edge on screen, after the 3D architecture
    // rotation + camera projection — this is what makes the label visually
    // tilt with its box instead of staying flat through the separation and
    // resolve phases.
    target.rotation = Math.atan2(dyRight, dxRight) * (180 / Math.PI);
  }

  let active = true;

  function tick() {
    if (!active) return;

    // outer panels
    setPanelOpacity(top200, reveal.outer);
    setPanelOpacity(bottom94, reveal.outer);
    top200.group.scale.setScalar(0.97 + 0.03 * reveal.outer);
    bottom94.group.scale.setScalar(0.97 + 0.03 * reveal.outer);

    // mid content — z / scale / opacity only, x/y are already final
    setPanelOpacity(efficiency3x, reveal.mid3x);
    efficiency3x.group.position.z = MID_Z_START * (1 - reveal.mid3x);
    efficiency3x.group.scale.setScalar(0.92 + 0.08 * reveal.mid3x);

    setPanelOpacity(ai15, reveal.mid15);
    ai15.group.position.z = MID_Z_START * (1 - reveal.mid15);
    ai15.group.scale.setScalar(0.92 + 0.08 * reveal.mid15);

    setPanelOpacity(growthCore, reveal.core);
    growthCore.group.position.z = MID_Z_START * (1 - reveal.core);
    growthCore.group.scale.setScalar(0.92 + 0.08 * reveal.core);
    for (const m of coreNodeMats) m.opacity = reveal.core;
    corePathMat.opacity = reveal.core * 0.32;

    structMat.opacity = reveal.grid * 0.2;

    // camera: scrolled base position plus a very small continuous pointer parallax
    if (allowParallax) {
      parallaxX += (pointer.x * 0.1 - parallaxX) * 0.06;
      parallaxY += (pointer.y * 0.07 - parallaxY) * 0.06;
    }
    camera.position.set(
      cameraBase.x + parallaxX,
      cameraBase.y + parallaxY,
      cameraBase.z * aspectZoomScale
    );
    camera.lookAt(cameraTarget);

    scene.updateMatrixWorld(true);
    renderer.render(scene, camera);

    projectAnchor(top200, labels[0], reveal.outer);
    projectAnchor(bottom94, labels[1], reveal.outer);
    projectAnchor(efficiency3x, labels[2], reveal.mid3x);
    projectAnchor(ai15, labels[3], reveal.mid15);
    onFrame(labels);
  }

  gsap.ticker.add(tick);

  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  if (allowParallax) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  function resize(w: number, h: number) {
    width = w;
    height = h;
    labelScale = computeLabelScale(w);
    aspectZoomScale = computeAspectZoomScale(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    ScrollTrigger.refresh();
  }

  function setActive(next: boolean) {
    active = next;
  }

  function dispose() {
    gsap.ticker.remove(tick);
    tl.scrollTrigger?.kill();
    tl.kill();
    if (allowParallax) window.removeEventListener("pointermove", onPointerMove);

    for (const panel of [top200, bottom94, efficiency3x, ai15, growthCore]) {
      for (const geo of panel.geometries) geo.dispose();
      panel.surfaceMat.dispose();
      panel.edgeMat.dispose();
      panel.markMat.dispose();
    }
    nodeGeo.dispose();
    branchGeo.dispose();
    corePathGeo.dispose();
    corePathMat.dispose();
    for (const m of coreNodeMats) m.dispose();
    structGeo.dispose();
    structMat.dispose();

    scene.clear();
    renderer.dispose();
  }

  return { resize, setActive, dispose };
}
