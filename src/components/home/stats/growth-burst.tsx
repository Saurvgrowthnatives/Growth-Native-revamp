"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * "Growth burst" — a fan of fibres radiating out of one hub at the bottom
 * edge: one core powering many outcomes. Built in three.js as real 3D
 * (fibres spread in depth too), rendered on a transparent canvas over the
 * section's white background.
 *
 * Motion:
 *  - idle: the fan sways slowly and every fibre breathes a little;
 *  - hover: the fan tilts toward the pointer, and the fibres pointing at it
 *    reach further out and brighten, falling off smoothly either side;
 *  - `pulseKey` change (the active stat above): a soft pulse runs out.
 * Only renders while on screen; reduced motion renders one still frame.
 * If WebGL is unavailable it renders nothing.
 */

type Props = { pulseKey: number };

// deterministic so the fan looks the same on every visit
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HUB = new THREE.Color("#0A4FD6");
const TIP = new THREE.Color("#4DA3FF");
const TIP_GREEN = new THREE.Color("#19C027");
const TIP_LIT = new THREE.Color("#E6F2FF");

const FAN_HALF_WIDTH = 1.05;
const FOV = 35;

function circleTexture() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.55, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    g.fill();
  }
  return new THREE.CanvasTexture(c);
}

export function GrowthBurst({ pulseKey }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef(0);

  // every change of the active stat (including the first) sends a pulse;
  // it plays out once the burst is on screen
  useEffect(() => {
    pulseRef.current = 1;
  }, [pulseKey]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return; // no WebGL — the area simply stays empty
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const COUNT = small ? 170 : 320;

    // ── fibres ──
    const rand = mulberry32(7);
    const fibres = Array.from({ length: COUNT }, () => {
      const u = rand() * 2 - 1;
      const theta = Math.sign(u) * Math.pow(Math.abs(u), 0.85) * 1.42; // ±81°
      const phi = (rand() * 2 - 1) * 0.55; // depth
      const dir = new THREE.Vector3(
        Math.sin(theta) * Math.cos(phi),
        Math.cos(theta) * Math.cos(phi),
        Math.sin(phi),
      );
      return {
        theta,
        dir,
        len: 0.5 + 0.5 * Math.pow(rand(), 0.7),
        tip: rand() < 0.14 ? TIP_GREEN : TIP,
        phase: rand() * Math.PI * 2,
        speed: 0.4 + rand() * 0.6,
      };
    });

    const linePos = new Float32Array(COUNT * 6);
    const lineCol = new Float32Array(COUNT * 6);
    const pointPos = new Float32Array(COUNT * 3);
    const pointCol = new Float32Array(COUNT * 3);
    fibres.forEach((_, i) => {
      // vertex 0 sits on the hub and never moves
      lineCol.set([HUB.r, HUB.g, HUB.b], i * 6);
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);

    const dot = circleTexture();
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(pointPos, 3));
    pointGeo.setAttribute("color", new THREE.BufferAttribute(pointCol, 3));
    const pointMat = new THREE.PointsMaterial({
      size: small ? 4 : 5.5,
      sizeAttenuation: false,
      vertexColors: true,
      map: dot,
      transparent: true,
      alphaTest: 0.05,
      depthWrite: false,
    });
    const points = new THREE.Points(pointGeo, pointMat);

    const fan = new THREE.Group();
    fan.add(lines, points);
    const scene = new THREE.Scene();
    scene.add(fan);

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 20);

    // fit the fan: hub on the bottom edge, full width visible, top in frame
    function resize() {
      if (!wrap) return;
      const w = Math.max(wrap.clientWidth, 1);
      const h = Math.max(wrap.clientHeight, 1);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const viewH = Math.max(1.12, (FAN_HALF_WIDTH * 2) / camera.aspect);
      const dist = viewH / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      // hub exactly on the bottom edge, so the burst meets the footer
      const cy = viewH / 2;
      camera.position.set(0, cy, dist);
      camera.lookAt(0, cy, 0);
      camera.updateProjectionMatrix();
    }

    // ── pointer ──
    const pointer = { theta: 0, tiltX: 0, tiltY: 0 };
    const target = { hover: 0, theta: 0, tiltX: 0, tiltY: 0 };
    let hover = 0;

    function onMove(e: PointerEvent) {
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      // angle from the hub (bottom centre): 0 = straight up, + = right
      target.theta = Math.atan2(px - r.width / 2, r.height - py);
      target.tiltY = ((px / r.width) * 2 - 1) * 0.35;
      target.tiltX = ((py / r.height) * 2 - 1) * 0.12;
      target.hover = 1;
    }
    function onLeave() {
      target.hover = 0;
      target.tiltX = 0;
      target.tiltY = 0;
    }
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    // ── frame ──
    const tmp = new THREE.Color();
    const clock = new THREE.Clock();

    function draw(animate: boolean) {
      const t = animate ? clock.getElapsedTime() : 0;
      if (animate) {
        pointer.theta += (target.theta - pointer.theta) * 0.12;
        pointer.tiltX += (target.tiltX - pointer.tiltX) * 0.06;
        pointer.tiltY += (target.tiltY - pointer.tiltY) * 0.06;
        hover += (target.hover - hover) * 0.08;
        pulseRef.current *= 0.965;
      }
      const pulse = animate ? pulseRef.current : 0;

      fan.rotation.y = (animate ? Math.sin(t * 0.22) * 0.14 : 0) + pointer.tiltY;
      fan.rotation.x = pointer.tiltX;

      for (let i = 0; i < COUNT; i++) {
        const f = fibres[i];
        const breathe = animate ? Math.sin(t * f.speed + f.phase) * 0.035 : 0;
        const d = f.theta - pointer.theta;
        const reach = hover * Math.exp(-(d * d) / 0.03);
        const L = f.len * (1 + breathe + 0.16 * reach + pulse * (0.06 + 0.05 * Math.sin(f.phase)));

        const x = f.dir.x * L;
        const y = f.dir.y * L;
        const z = f.dir.z * L;
        linePos[i * 6 + 3] = x;
        linePos[i * 6 + 4] = y;
        linePos[i * 6 + 5] = z;
        pointPos[i * 3] = x;
        pointPos[i * 3 + 1] = y;
        pointPos[i * 3 + 2] = z;

        tmp.copy(f.tip).lerp(TIP_LIT, reach * 0.8);
        lineCol[i * 6 + 3] = tmp.r;
        lineCol[i * 6 + 4] = tmp.g;
        lineCol[i * 6 + 5] = tmp.b;
        pointCol[i * 3] = tmp.r;
        pointCol[i * 3 + 1] = tmp.g;
        pointCol[i * 3 + 2] = tmp.b;
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      pointGeo.attributes.position.needsUpdate = true;
      pointGeo.attributes.color.needsUpdate = true;
      renderer.render(scene, camera);
    }

    // ── loop: only while on screen ──
    let raf = 0;
    let running = false;
    function loop() {
      draw(true);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start();
      else stop();
    });
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(false);
    });
    ro.observe(wrap);
    resize();
    draw(false);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      lineGeo.dispose();
      pointGeo.dispose();
      lineMat.dispose();
      pointMat.dispose();
      dot.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </div>
  );
}
