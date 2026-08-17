'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type HeroRefs = {
  wrapRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  counterNumRef: RefObject<HTMLElement | null>;
  counterBarRef: RefObject<HTMLElement | null>;
  scrollCueRef: RefObject<HTMLDivElement | null>;
};

type Seed = {
  t: number;
  jitter: number;
  cloud: [number, number, number];
  size: number;
  strand: number;
};

type FrameState = {
  progress: number;
  time: number;
  mouseX: number;
  mouseY: number;
};

const VERTEX_SHADER = /* glsl */ `
  precision highp float;

  uniform float uProgress;
  uniform float uTime;
  uniform float uMouseX;
  uniform float uMouseY;
  uniform float uPixelRatio;
  uniform float uPointScale;
  uniform vec2 uNdcScale;

  attribute float aT;
  attribute float aJitter;
  attribute vec3 aCloud;
  attribute float aSize;
  attribute float aStrand;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vFocus;

  const float TAU = 6.28318530718;

  float eased(float value) {
    value = clamp(value, 0.0, 1.0);
    return value * value * (3.0 - 2.0 * value);
  }

  void segmentAt(float p, out int fromId, out int toId, out float blend) {
    float a;
    float b;
    if (p < 0.07) { fromId = 0; toId = 1; a = 0.00; b = 0.07; }
    else if (p < 0.13) { fromId = 1; toId = 1; a = 0.07; b = 0.13; }
    else if (p < 0.20) { fromId = 1; toId = 2; a = 0.13; b = 0.20; }
    else if (p < 0.255) { fromId = 2; toId = 2; a = 0.20; b = 0.255; }
    else if (p < 0.31) { fromId = 2; toId = 3; a = 0.255; b = 0.31; }
    else if (p < 0.42) { fromId = 3; toId = 3; a = 0.31; b = 0.42; }
    else if (p < 0.49) { fromId = 3; toId = 4; a = 0.42; b = 0.49; }
    else if (p < 0.60) { fromId = 4; toId = 4; a = 0.49; b = 0.60; }
    else if (p < 0.67) { fromId = 4; toId = 5; a = 0.60; b = 0.67; }
    else if (p < 0.78) { fromId = 5; toId = 5; a = 0.67; b = 0.78; }
    else if (p < 0.88) { fromId = 5; toId = 6; a = 0.78; b = 0.88; }
    else { fromId = 6; toId = 6; a = 0.88; b = 1.00; }
    blend = eased((p - a) / max(0.0001, b - a));
  }

  vec3 monolith(float strand, float t, float jitter, float time) {
    float angle = t * TAU * 3.0 + strand * (TAU / 3.0) + time * 0.3;
    float radius = 0.17 + sin(jitter + time * 1.4) * 0.022;
    return vec3(cos(angle) * radius, (t - 0.5) * 2.7, sin(angle) * radius);
  }

  vec3 bloom(float strand, float t, float time) {
    float originAngle = strand * (TAU / 3.0) + time * 0.12;
    vec2 origin = vec2(cos(originAngle), sin(originAngle)) * 0.9;
    float angle = t * TAU * 2.4 + time * 0.5;
    return vec3(origin.x + cos(angle) * 0.3, (t - 0.5) * 2.1, origin.y + sin(angle) * 0.3);
  }

  vec3 signature(float strand, float t, float jitter, float time) {
    if (strand < 0.5) {
      float angle = t * TAU * 1.7 + time * 0.32;
      float radius = 0.5 + t * 0.72;
      return vec3(cos(angle) * radius, (t - 0.5) * 2.35, sin(angle) * radius);
    }
    if (strand < 1.5) {
      float golden = t * 220.0 * 2.39996323;
      float y = 1.0 - t * 2.0;
      float radial = sqrt(max(0.0, 1.0 - y * y));
      float radius = 1.18 + sin(time * 1.3 + jitter) * 0.05;
      return vec3(cos(golden) * radial * radius, y * radius, sin(golden) * radial * radius);
    }
    float angle = t * TAU * 3.4 + time * 0.55;
    float radius = 0.14 + t * 1.55;
    return vec3(cos(angle) * radius, sin(t * TAU * 2.0 + time * 1.1) * 0.13, sin(angle) * radius * 0.62);
  }

  vec3 orbit(float strand, float t, float jitter, float time) {
    float angle = t * TAU + strand * 2.1 + time * 0.14;
    return vec3(cos(angle) * 2.0, sin(angle * 2.0 + jitter) * 0.16 + (strand - 1.0) * -0.42, sin(angle) * 2.0);
  }

  vec3 lattice(float strand, float t, float jitter, float time) {
    float u = t * TAU * 3.0 + strand * (TAU / 3.0) + time * 0.18;
    float w = t * TAU * 7.0 + jitter;
    float radius = 1.05 + 0.42 * cos(w);
    return vec3(radius * cos(u), 0.42 * sin(w), radius * sin(u));
  }

  vec3 formation(int id, float strand, float t, float jitter, vec3 cloudPos, float time) {
    if (id == 0) return cloudPos;
    if (id == 1) return monolith(strand, t, jitter, time);
    if (id == 2) return bloom(strand, t, time);
    if (id == 3) return strand < 0.5 ? signature(strand, t, jitter, time) : orbit(strand, t, jitter, time);
    if (id == 4) return strand > 0.5 && strand < 1.5 ? signature(strand, t, jitter, time) : orbit(strand, t, jitter, time);
    if (id == 5) return strand > 1.5 ? signature(strand, t, jitter, time) : orbit(strand, t, jitter, time);
    return lattice(strand, t, jitter, time);
  }

  float formationAlpha(int id, float strand) {
    if (id == 0) return 0.48;
    if (id == 3) return strand < 0.5 ? 1.0 : 0.13;
    if (id == 4) return strand > 0.5 && strand < 1.5 ? 1.0 : 0.13;
    if (id == 5) return strand > 1.5 ? 1.0 : 0.13;
    if (id == 6) return 0.92;
    return 0.96;
  }

  float focusWeight(int id, float strand) {
    if (id == 3 && strand < 0.5) return 1.0;
    if (id == 4 && strand > 0.5 && strand < 1.5) return 1.0;
    if (id == 5 && strand > 1.5) return 1.0;
    return 0.0;
  }

  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    int fromId;
    int toId;
    float blend;
    segmentAt(p, fromId, toId, blend);

    vec3 fromPos = formation(fromId, aStrand, aT, aJitter, aCloud, uTime);
    vec3 toPos = formation(toId, aStrand, aT, aJitter, aCloud, uTime);
    vec3 position = mix(fromPos, toPos, blend);

    float ry = p * 4.4 + uTime * 0.05 + uMouseX * 0.28;
    float rx = -0.16 + sin(p * 3.14159265) * 0.12 + uMouseY * 0.2;
    float cy = cos(ry);
    float sy = sin(ry);
    float cx = cos(rx);
    float sx = sin(rx);
    float x1 = position.x * cy - position.z * sy;
    float z1 = position.x * sy + position.z * cy;
    float y2 = position.y * cx - z1 * sx;
    float z2 = position.y * sx + z1 * cx;
    float perspective = 3.6 / max(0.65, 3.6 + z2);

    gl_Position = vec4(x1 * perspective * uNdcScale.x, -y2 * perspective * uNdcScale.y + 0.04, 0.0, 1.0);
    gl_PointSize = max(1.0, aSize * perspective * uPointScale * uPixelRatio);

    vAlpha = mix(formationAlpha(fromId, aStrand), formationAlpha(toId, aStrand), blend);
    vFocus = mix(focusWeight(fromId, aStrand), focusWeight(toId, aStrand), blend);
    vColor = aStrand < 0.5
      ? vec3(0.486, 0.361, 1.0)
      : aStrand < 1.5
        ? vec3(1.0, 0.361, 0.541)
        : vec3(0.0, 0.898, 0.627);
  }
`;

const POINT_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float radius = length(centered) * 2.0;
    float halo = pow(max(0.0, 1.0 - radius), 2.35);
    float core = smoothstep(0.34, 0.0, radius);
    float alpha = (halo * 0.48 + core * 0.9) * vAlpha;
    if (alpha < 0.012) discard;
    gl_FragColor = vec4(vColor * (0.78 + core * 0.8), alpha);
  }
`;

const LINE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFocus;

  void main() {
    float alpha = vAlpha * vFocus * 0.2;
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function createSeeds(countPerStrand: number): Seed[] {
  const seeds: Seed[] = [];
  for (let strand = 0; strand < 3; strand += 1) {
    for (let index = 0; index < countPerStrand; index += 1) {
      let x = Math.random() * 2 - 1;
      let y = Math.random() * 2 - 1;
      let z = Math.random() * 2 - 1;
      const length = Math.hypot(x, y, z) || 1;
      const radius = 1.6 + Math.random() * 1.5;
      x = (x / length) * radius;
      y = (y / length) * radius;
      z = (z / length) * radius;
      seeds.push({
        t: index / countPerStrand,
        jitter: Math.random() * Math.PI * 2,
        cloud: [x, y, z],
        size: 0.58 + Math.random() * 1.08,
        strand,
      });
    }
  }
  return seeds;
}

function geometryFromSeeds(seeds: Seed[]): THREE.BufferGeometry {
  const count = seeds.length;
  // Three.js uses the conventional position attribute to determine draw
  // count, even though our vertex shader derives positions from seed data.
  const position = new Float32Array(count * 3);
  const t = new Float32Array(count);
  const jitter = new Float32Array(count);
  const cloud = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const strand = new Float32Array(count);

  seeds.forEach((seed, index) => {
    t[index] = seed.t;
    jitter[index] = seed.jitter;
    size[index] = seed.size;
    strand[index] = seed.strand;
    cloud[index * 3] = seed.cloud[0];
    cloud[index * 3 + 1] = seed.cloud[1];
    cloud[index * 3 + 2] = seed.cloud[2];
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geometry.setAttribute('aT', new THREE.BufferAttribute(t, 1));
  geometry.setAttribute('aJitter', new THREE.BufferAttribute(jitter, 1));
  geometry.setAttribute('aCloud', new THREE.BufferAttribute(cloud, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geometry.setAttribute('aStrand', new THREE.BufferAttribute(strand, 1));
  return geometry;
}

function lineSeeds(seeds: Seed[], countPerStrand: number): Seed[] {
  const result: Seed[] = [];
  const stride = Math.max(3, Math.round(countPerStrand / 48));
  for (let strand = 0; strand < 3; strand += 1) {
    const start = strand * countPerStrand;
    for (let index = 0; index + stride < countPerStrand; index += stride) {
      const from = seeds[start + index];
      const to = seeds[start + index + stride];
      if (from && to) result.push(from, to);
    }
  }
  return result;
}

class NeoHeroRenderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.Camera();
  private readonly pointGeometry: THREE.BufferGeometry;
  private readonly lineGeometry: THREE.BufferGeometry;
  private readonly pointMaterial: THREE.ShaderMaterial;
  private readonly lineMaterial: THREE.ShaderMaterial;
  private readonly uniforms: Record<string, THREE.IUniform>;
  private width = 1;
  private height = 1;
  private quality = 1;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly lowPower: boolean,
  ) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);

    const countPerStrand = lowPower ? 84 : 240;
    const seeds = createSeeds(countPerStrand);
    this.pointGeometry = geometryFromSeeds(seeds);
    this.lineGeometry = geometryFromSeeds(lineSeeds(seeds, countPerStrand));
    this.uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointScale: { value: lowPower ? 6.7 : 7.2 },
      uNdcScale: { value: new THREE.Vector2(1, 1) },
    };

    this.pointMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: POINT_FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.lineMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: LINE_FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(this.pointGeometry, this.pointMaterial);
    points.frustumCulled = false;
    const lines = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
    lines.frustumCulled = false;
    this.scene.add(lines, points);
  }

  setQuality(quality: number): void {
    this.quality = THREE.MathUtils.clamp(quality, 0.72, 1);
    this.resize(this.width, this.height);
  }

  resize(width: number, height: number): void {
    this.width = Math.max(1, Math.round(width));
    this.height = Math.max(1, Math.round(height));
    const nativeDpr = window.devicePixelRatio || 1;
    const dprCap = this.lowPower ? 1 : 1.75;
    const pixelBudget = this.lowPower ? 1_600_000 : 5_200_000;
    const budgetDpr = Math.sqrt(pixelBudget / Math.max(1, this.width * this.height));
    const effectiveDpr = Math.max(0.7, Math.min(nativeDpr, dprCap, budgetDpr)) * this.quality;
    const scale = Math.min(this.width, this.height) * 0.305;

    this.renderer.setPixelRatio(effectiveDpr);
    this.renderer.setSize(this.width, this.height, false);
    this.uniforms.uPixelRatio!.value = effectiveDpr;
    (this.uniforms.uNdcScale!.value as THREE.Vector2).set(
      (2 * scale) / this.width,
      (2 * scale) / this.height,
    );
    this.canvas.dataset.renderScale = effectiveDpr.toFixed(3);
    this.canvas.dataset.renderQuality = this.quality.toFixed(2);
  }

  render(frame: FrameState): void {
    this.uniforms.uProgress!.value = frame.progress;
    this.uniforms.uTime!.value = frame.time;
    this.uniforms.uMouseX!.value = frame.mouseX;
    this.uniforms.uMouseY!.value = frame.mouseY;
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.pointGeometry.dispose();
    this.lineGeometry.dispose();
    this.pointMaterial.dispose();
    this.lineMaterial.dispose();
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    delete this.canvas.dataset.renderScale;
    delete this.canvas.dataset.renderQuality;
    delete this.canvas.dataset.frameMs;
  }
}

type ChapterState = {
  el: HTMLElement;
  from: number;
  to: number;
  visible: boolean | null;
};

function opacityForAnchoredChapter(progress: number, index: number, anchors: number[]): number {
  const crossfade = 0.035;
  const isFirst = index === 0;
  const isLast = index === anchors.length - 1;
  const leftBoundary = isFirst ? 0 : ((anchors[index - 1] ?? 0) + (anchors[index] ?? 0)) / 2;
  const rightBoundary = isLast ? 1 : ((anchors[index] ?? 1) + (anchors[index + 1] ?? 1)) / 2;
  const fadeIn = isFirst
    ? 1
    : THREE.MathUtils.smoothstep(progress, leftBoundary - crossfade / 2, leftBoundary + crossfade / 2);
  const fadeOut = isLast
    ? 1
    : 1 - THREE.MathUtils.smoothstep(progress, rightBoundary - crossfade / 2, rightBoundary + crossfade / 2);
  return Math.min(fadeIn, fadeOut);
}

export function useNeoHeroWebGL({
  wrapRef,
  canvasRef,
  titleRef,
  counterNumRef,
  counterBarRef,
  scrollCueRef,
}: HeroRefs): void {
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const originalHeight = wrap.style.height;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    const lowPower = window.matchMedia('(max-width: 760px)').matches
      || saveData
      || (navigator.hardwareConcurrency || 8) <= 4;

    const chapters: ChapterState[] = Array.from(wrap.querySelectorAll<HTMLElement>('.neo-hero-chapter')).map((el) => ({
      el,
      from: Number.parseFloat(el.dataset.from || '0'),
      to: Number.parseFloat(el.dataset.to || '1'),
      visible: null,
    }));
    const chapterAnchors = chapters.map((chapter) => (
      chapter.from === 0 ? 0 : (chapter.from + chapter.to) / 2
    ));
    // The explicit exit anchor prevents the final chapter from trapping the
    // page. Every other anchor is a stable, fully readable narrative state.
    const snapAnchors = [...chapterAnchors, 1];
    const nearestAnchor = (progress: number, anchors = snapAnchors): number => anchors.reduce(
      (nearest, anchor) => (
        Math.abs(anchor - progress) < Math.abs(nearest - progress) ? anchor : nearest
      ),
      anchors[0] ?? 0,
    );
    const dots = Array.from(wrap.querySelectorAll<HTMLButtonElement>('.neo-hero-rail button'));
    const titleSpans = Array.from(titleRef.current?.querySelectorAll<HTMLElement>('span') || []);
    const state = { current: 0, target: 0 };
    const mouse = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
    let activeChapter = -1;
    let engine: NeoHeroRenderer | null = null;
    let rafId = 0;
    let ambientTimerId = 0;
    let heroVisible = true;
    let contextLost = false;
    let lastFrame = 0;
    let activeTime = 0;
    let frameEma = 16.7;
    let frameSamples = 0;
    let lastQualityChange = 0;
    let quality = 1;
    let renderSampleStarted = 0;
    let renderSampleCount = 0;

    const updateChapters = (progress: number): void => {
      chapters.forEach((chapter, index) => {
        const opacity = opacityForAnchoredChapter(progress, index, chapterAnchors);
        const visible = opacity > 0.01;
        chapter.el.style.opacity = opacity.toFixed(3);
        chapter.el.style.transform = `translate3d(0, ${((1 - opacity) * 26).toFixed(1)}px, 0)`;
        if (visible !== chapter.visible) {
          chapter.visible = visible;
          chapter.el.style.pointerEvents = visible ? 'auto' : 'none';
          chapter.el.setAttribute('aria-hidden', visible ? 'false' : 'true');
        }
      });

      const activeAnchor = nearestAnchor(progress, chapterAnchors);
      const nextActive = Math.max(0, chapterAnchors.indexOf(activeAnchor));

      if (nextActive !== activeChapter) {
        dots.forEach((dot, index) => dot.classList.toggle('is-active', index === nextActive));
        if (counterNumRef.current) counterNumRef.current.textContent = `0${nextActive + 1}`;
        activeChapter = nextActive;
      }
      if (counterBarRef.current) counterBarRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      if (scrollCueRef.current) scrollCueRef.current.style.opacity = progress > 0.02 ? '0' : '1';
      canvas.dataset.chapterProgress = progress.toFixed(4);

      const spread = THREE.MathUtils.smoothstep(progress, 0, 0.07);
      titleSpans.forEach((span, index) => {
        const direction = index - (titleSpans.length - 1) / 2;
        span.style.transform = `translate3d(${(direction * spread * 34).toFixed(1)}px, 0, 0)`;
        span.style.opacity = (1 - spread).toFixed(3);
      });
    };

    const resize = (): void => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width > 0 && height > 0) engine?.resize(width, height);
    };

    const cancelAmbientTimer = (): void => {
      if (!ambientTimerId) return;
      window.clearTimeout(ambientTimerId);
      ambientTimerId = 0;
    };

    const ensureRender = (): void => {
      cancelAmbientTimer();
      if (engine && heroVisible && !contextLost && !document.hidden && !rafId) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    const scheduleAmbientRender = (): void => {
      if (reducedMotion || !engine || !heroVisible || contextLost || document.hidden || rafId || ambientTimerId) return;
      ambientTimerId = window.setTimeout(() => {
        ambientTimerId = 0;
        ensureRender();
      }, lowPower ? 40 : 33);
    };

    const renderFrame = (now: number): void => {
      rafId = 0;
      if (!engine || !heroVisible || contextLost || document.hidden) return;
      const deltaMs = lastFrame ? Math.min(50, now - lastFrame) : 16.7;
      const deltaSeconds = deltaMs / 1000;
      lastFrame = now;
      activeTime += deltaSeconds;

      const progressFollow = 1 - Math.exp(-24 * deltaSeconds);
      const pointerFollow = 1 - Math.exp(-16 * deltaSeconds);
      state.current += (state.target - state.current) * progressFollow;
      mouse.currentX += (mouse.targetX - mouse.currentX) * pointerFollow;
      mouse.currentY += (mouse.targetY - mouse.currentY) * pointerFollow;
      if (Math.abs(state.target - state.current) < 0.00025) state.current = state.target;
      const stillMoving = Math.abs(state.target - state.current) > 0.0005
        || Math.abs(mouse.targetX - mouse.currentX) > 0.0015
        || Math.abs(mouse.targetY - mouse.currentY) > 0.0015;

      // DOM and WebGL share one smoothed visual clock. Previously the copy
      // followed raw scroll while particles followed this value, allowing the
      // two layers to stop in visibly different states.
      updateChapters(state.current);

      engine.render({
        progress: state.current,
        time: activeTime,
        mouseX: mouse.currentX,
        mouseY: mouse.currentY,
      });
      renderSampleCount += 1;
      if (!renderSampleStarted) renderSampleStarted = now;
      else if (now - renderSampleStarted >= 1000) {
        canvas.dataset.renderFps = ((renderSampleCount * 1000) / (now - renderSampleStarted)).toFixed(1);
        renderSampleStarted = now;
        renderSampleCount = 0;
      }

      // Quality decisions use interaction frames only. Ambient rendering is
      // intentionally throttled and must not be mistaken for a slow device.
      if (stillMoving && deltaMs < 45) {
        frameEma = frameEma * 0.92 + deltaMs * 0.08;
        frameSamples += 1;
      }
      if (frameSamples >= 24 && now - lastQualityChange > 1400) {
        canvas.dataset.frameMs = frameEma.toFixed(2);
        const previousQuality = quality;
        if (frameEma > 20.5) quality = Math.max(0.72, quality - 0.08);
        else if (frameEma < 17.25) quality = Math.min(1, quality + 0.04);
        if (quality !== previousQuality) {
          engine.setQuality(quality);
          lastQualityChange = now;
        }
        frameSamples = 0;
      }

      canvas.dataset.renderMode = reducedMotion ? 'reduced' : stillMoving ? 'interactive' : 'ambient';
      if (stillMoving) ensureRender();
      else scheduleAmbientRender();
    };

    const onContextLost = (event: Event): void => {
      event.preventDefault();
      contextLost = true;
      wrap.classList.add('neo-webgl-fallback');
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      cancelAmbientTimer();
      canvas.dataset.renderMode = 'paused';
    };
    const onContextRestored = (): void => {
      contextLost = false;
      wrap.classList.remove('neo-webgl-fallback');
      resize();
      ensureRender();
    };
    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    try {
      engine = new NeoHeroRenderer(canvas, lowPower);
      wrap.classList.add('neo-webgl-ready');
      resize();
    } catch (error) {
      console.error('Neo hero WebGL initialization failed; using static fallback.', error);
      wrap.classList.add('neo-webgl-fallback');
    }

    updateChapters(0);
    let scrollTrigger: ScrollTrigger | null = null;
    if (reducedMotion) {
      state.target = 0.95;
      state.current = state.target;
      wrap.style.height = '100svh';
      updateChapters(state.target);
    } else {
      scrollTrigger = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        snap: {
          snapTo: (progress) => nearestAnchor(progress),
          delay: 0.06,
          duration: { min: 0.14, max: 0.28 },
          ease: 'power2.out',
          inertia: false,
          onStart: () => wrap.classList.add('neo-hero-settling'),
          onInterrupt: () => wrap.classList.remove('neo-hero-settling'),
          onComplete: () => wrap.classList.remove('neo-hero-settling'),
        },
        onUpdate: (self) => {
          state.target = self.progress;
          ensureRender();
        },
      });
      state.target = scrollTrigger.progress;
      state.current = state.target;
      updateChapters(state.target);
    }

    const onMouseMove = (event: MouseEvent): void => {
      mouse.targetX = (event.clientX - window.innerWidth / 2) / Math.max(1, window.innerWidth / 2);
      mouse.targetY = (event.clientY - window.innerHeight / 2) / Math.max(1, window.innerHeight / 2);
      ensureRender();
    };
    if (!lowPower) window.addEventListener('mousemove', onMouseMove, { passive: true });

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      heroVisible = Boolean(entry?.isIntersecting);
      if (heroVisible) ensureRender();
      else {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = 0;
        cancelAmbientTimer();
        canvas.dataset.renderMode = 'paused';
      }
    });
    intersectionObserver.observe(wrap);

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => resize())
      : null;
    resizeObserver?.observe(canvas);
    window.addEventListener('resize', resize, { passive: true });

    const onVisibilityChange = (): void => {
      if (document.hidden) {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = 0;
        cancelAmbientTimer();
        canvas.dataset.renderMode = 'paused';
      } else if (!document.hidden) {
        lastFrame = 0;
        ensureRender();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const railHandlers = dots.map((dot, index) => {
      const handler = (): void => {
        const chapter = chapters[index];
        if (!chapter) return;
        const midpoint = chapter.from === 0 ? 0 : (chapter.from + chapter.to) / 2;
        const rect = wrap.getBoundingClientRect();
        const top = rect.top + window.scrollY + midpoint * (rect.height - window.innerHeight);
        window.scrollTo({ top, behavior: 'smooth' });
      };
      dot.addEventListener('click', handler);
      return { dot, handler };
    });

    ensureRender();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      cancelAmbientTimer();
      scrollTrigger?.kill();
      intersectionObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      railHandlers.forEach(({ dot, handler }) => dot.removeEventListener('click', handler));
      engine?.dispose();
      delete canvas.dataset.chapterProgress;
      delete canvas.dataset.renderMode;
      delete canvas.dataset.renderFps;
      wrap.classList.remove('neo-webgl-ready', 'neo-webgl-fallback', 'neo-hero-settling');
      wrap.style.height = originalHeight;
    };
  }, [canvasRef, counterBarRef, counterNumRef, scrollCueRef, titleRef, wrapRef]);
}
