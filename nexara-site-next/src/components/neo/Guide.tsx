// @ts-nocheck -- deep canvas/GSAP animation-state closures left untyped deliberately;
// forcing types here without runtime insight into each closure risks silently
// changing animation timing. Revisit during a dedicated animation-code pass, not
// as a rushed tail-end of this decomposition.
'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HAS_SCROLL_ANIMATION } from '@/lib/shared';

interface NeoAvatarSVGProps {
  id?: string;
  className?: string;
}

const SPARKLE_DATA = [
  { left: "8%",  top: "18%", delay: "0s",   duration: "10s", char: "✦" },
  { left: "84%", top: "12%", delay: "1.5s", duration: "12s", char: "✸" },
  { left: "70%", top: "65%", delay: "3s",   duration: "11s", char: "✦" },
  { left: "15%", top: "72%", delay: "0.8s", duration: "13s", char: "✸" },
  { left: "48%", top: "28%", delay: "2s",   duration: "8s",  char: "✦" },
  { left: "92%", top: "50%", delay: "4s",   duration: "14s", char: "✸" },
];

function Sparkles() {
  const layerRef = React.useRef(null);
  React.useEffect(() => {
    let raf = 0;
    let visible = true;
    const tick = () => {
      if (visible && layerRef.current)
        layerRef.current.style.transform = `translateY(${window.scrollY * 0.45}px)`;
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    if (layerRef.current) io.observe(layerRef.current.closest(".neo-hero-sticky") || layerRef.current);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  return (
    <div className="sparkles-layer" ref={layerRef}>
      {SPARKLE_DATA.map((p, i) => (
        <span key={i} className="sparkle-star" style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }}>{p.char}</span>
      ))}
    </div>
  );
}


function NeoAvatarSVG({ id = "neo-avatar", className = "" }: NeoAvatarSVGProps) {
  return (
    <svg id={id} className={`neo-avatar-svg ${className}`} viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Signal rings */}
      <circle className="neo-sig-ring-3" cx="50" cy="38" r="46" stroke="#ccff00" strokeWidth="0.4"/>
      <circle className="neo-sig-ring-2" cx="50" cy="38" r="37" stroke="#00f0ff" strokeWidth="0.4"/>
      <circle className="neo-sig-ring-1" cx="50" cy="38" r="28" stroke="#ccff00" strokeWidth="0.5"/>
      {/* Core glow */}
      <polygon className="neo-core-glow" points="50,8 76,23 76,53 50,68 24,53 24,23" fill="rgba(0,240,255,0.04)"/>
      {/* Face plate */}
      <polygon id={`${id}-hex`} points="50,8 76,23 76,53 50,68 24,53 24,23" fill="rgba(0,4,2,0.97)" stroke="#ccff00" strokeWidth="1.4"/>
      {/* Inner ring */}
      <polygon points="50,16 69,27 69,49 50,60 31,49 31,27" fill="none" stroke="#00f0ff" strokeWidth="0.4" strokeOpacity="0.32"/>
      {/* Circuit traces */}
      <path d="M 24 38 L 33 38 L 33 29" stroke="#ccff00" strokeWidth="0.4" strokeOpacity="0.48" fill="none"/>
      <path d="M 76 38 L 67 38 L 67 29" stroke="#ccff00" strokeWidth="0.4" strokeOpacity="0.48" fill="none"/>
      <line x1="38" y1="21" x2="62" y2="21" stroke="#ccff00" strokeWidth="0.3" strokeOpacity="0.22"/>
      {/* Left eye */}
      <g id={`${id}-eye-l`} className="neo-eye-l">
        <circle cx="38" cy="36" r="5.5" fill="#001616"/>
        <g id={`${id}-pupil-l`} className="neo-pupil">
          <circle cx="38" cy="36" r="4"   fill="#00f0ff"/>
          <circle cx="38" cy="36" r="6.5" fill="#00f0ff" fillOpacity="0.1"/>
          <circle cx="39.2" cy="34.8" r="1.4" fill="rgba(255,255,255,0.88)"/>
          <circle cx="37"   cy="37.5" r="0.7" fill="rgba(255,255,255,0.4)"/>
        </g>
        {/* Sass brow — hidden until expression engine raises it */}
        <line id={`${id}-brow-l`} x1="33" y1="29" x2="43" y2="29" stroke="#ccff00" strokeWidth="1.2" strokeLinecap="round" opacity="0"/>
      </g>
      {/* Right eye */}
      <g id={`${id}-eye-r`} className="neo-eye-r">
        <circle cx="62" cy="36" r="5.5" fill="#001616"/>
        <g id={`${id}-pupil-r`} className="neo-pupil">
          <circle cx="62" cy="36" r="4"   fill="#00f0ff"/>
          <circle cx="62" cy="36" r="6.5" fill="#00f0ff" fillOpacity="0.1"/>
          <circle cx="63.2" cy="34.8" r="1.4" fill="rgba(255,255,255,0.88)"/>
          <circle cx="61"   cy="37.5" r="0.7" fill="rgba(255,255,255,0.4)"/>
        </g>
        <line id={`${id}-brow-r`} x1="57" y1="29" x2="67" y2="29" stroke="#ccff00" strokeWidth="1.2" strokeLinecap="round" opacity="0"/>
      </g>
      {/* Mouth */}
      <path id={`${id}-mouth`} d="M 37 54 Q 50 60 63 54" stroke="#ccff00" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      {/* Antenna */}
      <line x1="50" y1="8" x2="50" y2="1" stroke="#ccff00" strokeWidth="1"/>
      <circle cx="50" cy="0" r="2.2" fill="#ccff00" className="neo-led-inner"/>
      <circle cx="50" cy="0" r="4.5" fill="#ccff00" fillOpacity="0.18" className="neo-led-outer"/>
      {/* Body stem */}
      <line x1="50" y1="68" x2="50" y2="81" stroke="#ccff00" strokeWidth="0.9" strokeOpacity="0.7"/>
      <circle cx="50" cy="84" r="3.8" fill="#ccff00" fillOpacity="0.88"/>
      <circle cx="50" cy="84" r="6.5" fill="#ccff00" fillOpacity="0.12"/>
      {/* Left arm */}
      <g id={`${id}-arm-l`}>
        <line id={`${id}-arm-l-line`} x1="24" y1="38" x2="13" y2="31" stroke="#00f0ff" strokeWidth="0.7" strokeOpacity="0.6"/>
        <circle id={`${id}-arm-l-node`} cx="11" cy="30" r="2.8" fill="#00f0ff" fillOpacity="0.72"/>
        <circle cx="11" cy="30" r="5" fill="#00f0ff" fillOpacity="0.11"/>
      </g>
      {/* Right arm */}
      <g id={`${id}-arm-r`}>
        <line id={`${id}-arm-r-line`} x1="76" y1="38" x2="87" y2="31" stroke="#00f0ff" strokeWidth="0.7" strokeOpacity="0.6"/>
        <circle id={`${id}-arm-r-node`} cx="89" cy="30" r="2.8" fill="#00f0ff" fillOpacity="0.72"/>
        <circle cx="89" cy="30" r="5" fill="#00f0ff" fillOpacity="0.11"/>
      </g>
      {/* Bottom float nodes */}
      <line x1="50" y1="84" x2="35" y2="97" stroke="#ccff00" strokeWidth="0.5" strokeOpacity="0.4"/>
      <circle cx="33" cy="99" r="2.2" fill="#ccff00" fillOpacity="0.55"/>
      <line x1="50" y1="84" x2="65" y2="97" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.4"/>
      <circle cx="67" cy="99" r="2.2" fill="#00f0ff" fillOpacity="0.55"/>
    </svg>
  );
}


function NeoGuide() {
  const guideRef    = React.useRef(null);
  const charWrapRef = React.useRef(null);
  const bubbleRef   = React.useRef(null);
  const tagRef      = React.useRef(null);
  const beaconRef   = React.useRef(null);
  const spotlightRef= React.useRef(null);
  const burstRef    = React.useRef(null);

  React.useEffect(() => {
    if (!HAS_SCROLL_ANIMATION) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const guide     = guideRef.current;
    const charWrap  = charWrapRef.current;
    const bubble    = bubbleRef.current;
    const tag       = tagRef.current;
    const beacon    = beaconRef.current;
    const spotlight = spotlightRef.current;
    const burst     = burstRef.current;
    const triggers  = [];
    const guideHomeHero = document.querySelector(".neo-scrolly-hero-wrap");
    const isDesktopFollower = window.matchMedia("(pointer: fine) and (min-width: 761px)").matches;

    guide.classList.toggle("is-cursor-guide", isDesktopFollower);
    guide.classList.toggle("is-scroll-guide", !isDesktopFollower);
    gsap.set(guide,     { autoAlpha: 0 });
    gsap.set(charWrap,  { y: "58vh", x: 0 });
    gsap.set(bubble,    { autoAlpha: 0, y: 10 });
    gsap.set(tag,       { autoAlpha: 0, x: 14 });
    gsap.set(beacon,    { width: 0 });
    gsap.set(spotlight, { autoAlpha: 0, top: "58vh" });
    if (burst) gsap.set(burst, { autoAlpha: 0, scale: 0.2 });

    // --- shared brain: defined once, driven by desktop (cursor) AND mobile (touch/scroll) ---
      const clean = (text) => (text || "").replace(/\s+/g, " ").trim();
      const shorten = (text, max = 46) => {
        const t = clean(text);
        return t.length > max ? `${t.slice(0, max).trim()}…` : t;
      };
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const textFrom = (node, selector) => clean(node?.querySelector(selector)?.textContent);
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      let guideLive = false;
      let lastKey = "";
      let activeInfo = null;
      const lineCounts = {};
      const rotateLine = (bucket, lines, targetKey = bucket) => {
        if (targetKey === lastKey && activeInfo?.line) return activeInfo.line;
        const index = lineCounts[bucket] || 0;
        lineCounts[bucket] = index + 1;
        return lines[index % lines.length];
      };
      // generic brain — reads ANY meaningful element so Neo always has something
      // real to say instead of falling back to "hover something".
      const GENERIC_SEL = [
        "a[href]", "button", "[role='button']", "summary", "[role='link']",
        "h1", "h2", "h3", "h4", "h5",
        ".eyebrow", ".pill", ".badge", ".tag", ".chip",
        "label", "input", "textarea", "select",
        "li", "figcaption", "blockquote", "th", "td",
        "img", "svg", "video", "p", "strong", "em", "code"
      ].join(",");
      const keyOf = (s) => clean(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
      const genericRead = (node) => {
        const el = node?.closest?.(GENERIC_SEL);
        if (!el) return null;
        const tag = el.tagName.toLowerCase();
        const raw = clean(el.getAttribute?.("aria-label") || el.textContent || el.getAttribute?.("alt") || el.getAttribute?.("placeholder"));
        const txt = shorten(raw, 44);
        const lc = raw.toLowerCase();

        // interactive — links + buttons
        const isCta = tag === "button" || el.matches("[role='button'],[role='link']") || (tag === "a" && el.getAttribute("href"));
        if (isCta && raw) {
          const looksLikeNav = /^(home|about|work|academy|marketing|labs|contact|pricing|services|blog|menu)\b/i.test(raw) || el.closest("nav");
          const lines = looksLikeNav
            ? [`“${txt}”? whole vibe lives back there. go touch it.`, `${lc} is one click away bestie, don't be delulu.`, `tap “${txt}”. i'll wait. impatiently. always.`, `this door leads to ${lc}. main character behavior is clicking it.`]
            : [`“${txt}” — push the button bestie, make something happen fr.`, `this does ${lc}. lowkey the whole point. click it.`, `“${txt}” is THE move rn, no cap.`, `stop hovering, start clicking. “${txt}” said so.`, `not you sitting on “${txt}” like it bites. it doesn't. go.`];
          return { key: `cta-${keyOf(raw)}`, label: looksLikeNav ? "nav route" : "action", line: pick(lines) };
        }

        // headings — quote the actual copy back
        if (/^h[1-5]$/.test(tag) && raw) {
          return { key: `head-${keyOf(raw)}`, label: "headline", line: pick([
            `“${txt}” — ok they understood the assignment.`,
            `they really opened with “${txt}”. respectfully, slay.`,
            `“${txt}”. read it twice, it's giving thesis statement.`,
            `“${txt}” living rent free now. that's the whole energy.`,
            `not “${txt}” being the realest line on the page fr.`
          ]) };
        }

        // labels / eyebrows / pills / badges
        if (el.matches(".eyebrow,.pill,.badge,.tag,.chip") && raw) {
          return { key: `tag-${keyOf(raw)}`, label: "label", line: pick([
            `“${txt}” — tiny label, big aura.`, `the ${lc} flag just dropped. vibe check passed.`, `“${txt}”. iykyk. moving on.`, `lil ${lc} tag setting the whole mood. iconic.`
          ]) };
        }

        // form fields
        if (/^(input|textarea|select)$/.test(tag) || tag === "label") {
          const name = shorten(el.getAttribute?.("name") || el.getAttribute?.("placeholder") || raw || "this field", 28).toLowerCase();
          return { key: `field-${keyOf(name)}`, label: "field", line: pick([
            `drop ${name} here. don't fumble the bag.`, `${name} goes in this one. easy W.`, `type ${name}, casually, like it's nothing. you got this.`, `${name}? say less. fill it and we move.`, `c'mon bestie, ${name} isn't gonna type itself.`
          ]) };
        }

        // media
        if (/^(img|svg|video)$/.test(tag)) {
          return { key: `media-${keyOf(el.getAttribute?.("alt") || el.className || tag)}`, label: "visual", line: pick([
            "this visual? it's giving art gallery fr.", "pixels ate and left no crumbs.", "lil graphic doing the MOST. respect.", "ok the visuals are not mid. we love to see it.", "this pic has aura ngl."
          ]) };
        }

        // body copy / list items
        if (raw && raw.length > 4) {
          return { key: `read-${keyOf(raw)}`, label: "reading", line: pick([
            `“${txt}” — yeah i'm reading over your shoulder, deal w it.`,
            `this part says ${lc}. lowkey worth the read fr.`,
            `“${txt}”. don't skim this one, it's not mid.`,
            `caught “${txt}” — sneaky important, you're welcome.`,
            `“${txt}”. the way this is actually kinda based.`
          ]) };
        }
        return null;
      };

      const classifyTarget = (node) => {
        const target = node?.closest?.([
          ".currency-btn",
          ".roi-slider-group",
          ".roi-metric-big",
          ".timeline-node",
          ".slider-handle",
          ".before-after-band",
          ".faq-band details",
          ".intake-cta button",
          ".form-group",
          ".unbox-word-play button",
          ".unbox-route-card",
          ".unbox-quick-actions button",
          ".unbox-system-panel",
          ".unbox-wrap",
          ".market-cities span",
          ".super-play-feature",
          ".play-sequence",
          ".super-skill-card",
          ".section-card",
          ".module-card",
          ".stack-detail-card",
          ".package-card",
          ".process-grid article",
          ".detail-hero",
          ".market-context",
          ".super-skills",
          ".section-grid-wrap",
          ".callout"
        ].join(","));

        if (!target) {
          const generic = genericRead(node);
          if (generic) return generic;
          return {
            key: "idle",
            label: "your guide",
            line: rotateLine("idle", [
              "take your time — i'm your guide, just vibing up here.",
              "hover anything and i'll break it down. no rush tho.",
              "read it properly, i'll wait. that's literally my job.",
              "chillin right here whenever you want the tour.",
              "explore at your pace fr, i'm not going anywhere."
            ], "idle")
          };
        }

        if (target.matches(".currency-btn")) {
          const mode = clean(target.textContent).toLowerCase();
          const key = `currency-${mode}`;
          return {
            key,
            label: "currency toggle",
            line: rotateLine("currency", [
              `swapping coins to ${mode}. respect.`,
              `maths is mathing in any currency.`,
              `${mode} mode engaged.`,
              `counting in ${mode}. let's go.`
            ], key)
          };
        }

        if (target.matches(".roi-slider-group")) {
          const label = clean(target.querySelector("span")?.textContent || "slider").toLowerCase();
          const key = `roi-slider-${label}`;
          return {
            key,
            label: `roi target: ${label}`,
            line: rotateLine("roi-slider", [
              `tweak the ${label}. watch the money build.`,
              `cranking the ${label}. high IQ adjustments.`,
              `moving ${label} up. numbers go brrr.`,
              `modulating ${label}. details count.`
            ], key)
          };
        }

        if (target.matches(".roi-metric-big")) {
          return {
            key: "roi-payout",
            label: "scenario value",
            line: rotateLine("roi-payout", [
              "your inputs, your number.",
              "that's the what-if total.",
              "sandbox math. play with it.",
              "move a slider. watch it shift."
            ], "roi-payout")
          };
        }

        if (target.matches(".timeline-node")) {
          const stepNum = clean(target.querySelector(".node-circle")?.textContent || "01");
          const key = `timeline-${stepNum}`;
          return {
            key,
            label: `process stage ${stepNum}`,
            line: rotateLine("timeline", [
              `stage ${stepNum} unlocked. we follow rules.`,
              `on step ${stepNum}. details compounding.`,
              `that's stage ${stepNum}. check it.`,
              `moving step by step. no shortcuts.`
            ], key)
          };
        }

        if (target.matches(".slider-handle")) {
          return {
            key: "slider-handle",
            label: "design slider",
            line: rotateLine("slider-handle", [
              "drag it. slide it. reveal it.",
              "legacy vs nexara standard. slide it.",
              "interactive revealing. no brainer.",
              "reveal the premium standard."
            ], "slider-handle")
          };
        }

        if (target.matches(".before-after-band")) {
          return {
            key: "before-after",
            label: "design comparison",
            line: rotateLine("before-after", [
              "slide the handle to reveal standard styling.",
              "boring legacy vs nexara standard.",
              "spot the difference. it's night and day.",
              "visual systems check."
            ], "before-after")
          };
        }

        if (target.matches(".faq-band details")) {
          const summary = clean(target.querySelector("summary")?.textContent || "faq").toLowerCase();
          const key = `faq-${summary}`;
          return {
            key,
            label: "faq details",
            line: rotateLine("faq", [
              "got questions? click to reveal response.",
              "accordion drop. check the details.",
              "the fine print is all nominal.",
              "deep lore drop."
            ], key)
          };
        }

        if (target.matches(".intake-cta button")) {
          return {
            key: "intake-btn",
            label: "intake action",
            line: rotateLine("intake-btn", [
              "click it. launch sequence.",
              "project incoming. start building.",
              "stop talking. let's build.",
              "push the button. deploy."
            ], "intake-btn")
          };
        }

        if (target.matches(".unbox-word-play button, .unbox-route-card")) {
          const label = clean(target.querySelector("strong")?.textContent || target.textContent).toLowerCase();
          const key = `unbox-${label}`;
          return {
            key,
            label: "unbox route",
            line: rotateLine("unbox-card", [
              `${label}. click it.`,
              `${label} is a door bestie.`,
              `that's ${label}. tap.`,
              `${label} goes somewhere. go find out.`
            ], key)
          };
        }

        if (target.matches(".unbox-quick-actions button")) {
          const action = clean(target.textContent).toLowerCase();
          const key = `unbox-action-${action}`;
          return {
            key,
            label: "quick move",
            line: rotateLine("unbox-action", [
              `${action}. fast.`,
              `${action}. no detours.`,
              `${action}. why are you still reading this.`,
              `${action}. we go now.`
            ], key)
          };
        }

        if (target.matches(".unbox-system-panel, .unbox-wrap")) {
          return {
            key: "unbox-system",
            label: "core reveal",
            line: rotateLine("unbox-system", [
              "the whole company in a cube. relax.",
              "scroll. it opens.",
              "three sections. one weird little box.",
              "lore dropping."
            ], "unbox-system")
          };
        }

        if (target.matches(".market-cities span")) {
          const city = clean(target.textContent);
          const key = `city-${city}`;
          return { key, label: "city tea", line: rotateLine("city", [
            `${city.toLowerCase()}. that's the market.`,
            `${city.toLowerCase()} said hi.`,
            `we know ${city.toLowerCase()}.`,
            `${city.toLowerCase()} is in the recipe.`
          ], key) };
        }

        if (target.matches(".form-group")) {
          const key = `field-${textFrom(target, "label")}`;
          return {
            key,
            label: (textFrom(target, "label") || "input").toLowerCase(),
            line: rotateLine("field", [
              "move this. stuff happens.",
              "small tweak. big consequences.",
              "go on.",
              "that's a setting btw."
            ], key)
          };
        }

        if (target.matches(".super-play-feature")) {
          return {
            key: "lead-play",
            label: (textFrom(target, "h3") || "lead play").toLowerCase(),
            line: rotateLine("lead-play", [
              "all three. at once.",
              "the full squad.",
              "combo move unlocked.",
              "academy + marketing + labs. bold."
            ], "lead-play")
          };
        }

        if (target.matches(".play-sequence")) {
          return {
            key: "sequence",
            label: "combo logic",
            line: rotateLine("sequence", [
              "order matters. who knew.",
              "step by step. groundbreaking.",
              "this is the order. trust.",
              "choreographed chaos."
            ], "sequence")
          };
        }

        if (target.matches(".super-skill-card, .section-card, .module-card, .stack-detail-card, .package-card, .process-grid article")) {
          const key = `card-${textFrom(target, "h3")}`;
          return {
            key,
            label: (textFrom(target, "h3") || "card").toLowerCase(),
            line: rotateLine("card", [
              "click it.",
              "there's more inside.",
              "door.",
              "a whole thing in here."
            ], key)
          };
        }

        if (target.matches(".detail-hero")) {
          return {
            key: "detail-hero",
            label: (textFrom(target, ".eyebrow") || "inside page").toLowerCase(),
            line: rotateLine("detail-hero", [
              "deeper now.",
              "lore unlocked.",
              "inside the engine.",
              "more detail, same energy."
            ], "detail-hero")
          };
        }

        if (target.matches(".market-context")) {
          return {
            key: "market",
            label: (textFrom(target, "h2") || "operating context").toLowerCase(),
            line: rotateLine("market", [
              "city check.",
              "the where matters.",
              "local context loaded.",
              "geography entered the chat."
            ], "market")
          };
        }

        if (target.matches(".super-skills")) {
          return {
            key: "super-skills",
            label: (textFrom(target, "h2") || "super skills").toLowerCase(),
            line: rotateLine("super", [
              "all three sections at once.",
              "the combo play.",
              "squad move.",
              "three engines. one team."
            ], "super-skills")
          };
        }

        if (target.matches(".section-grid-wrap")) {
          return { key: "sections", label: "engines", line: rotateLine("sections", [
            "three doors.",
            "pick one.",
            "academy. marketing. labs. go.",
            "choose."
          ], "sections") };
        }

        if (target.matches(".callout")) {
          return { key: "callout", label: (textFrom(target, "h2") || "callout").toLowerCase(), line: rotateLine("callout", [
            "act.",
            "the page is nudging you.",
            "read. then click.",
            "this one matters."
          ], "callout") };
        }

        const generic = genericRead(node);
        if (generic) return generic;
        return { key: "spot", label: "spotted", line: rotateLine("spot", [
          "noted. unbothered. moving on.",
          "seen it. it's giving... fine i guess.",
          "tracking this, lowkey.",
          "logged it bestie. you're welcome.",
          "mid, but i respect the hover."
        ], "spot") };
      };

      const setInfo = (info) => {
        if (!bubble || !tag) return;
        tag.textContent = info.label;
        bubble.textContent = info.line;
      };
      const boomAt = (x, y) => {
        if (!burst) return;
        gsap.killTweensOf(burst);
        gsap.fromTo(burst,
          { x, y, scale: 0.18, autoAlpha: 0.95, rotate: 0 },
          { scale: 2.7, autoAlpha: 0, rotate: 24, duration: 0.42, ease: "power3.out" }
        );
      };
      /* ── Expression engine — gives Neo his face energy ──────────── */
      const A = "#neo-guide-avatar";
      const faceSvg = guide.querySelector(A);
      const pupL = guide.querySelector(`${A}-pupil-l`);
      const pupR = guide.querySelector(`${A}-pupil-r`);
      const eyeL = guide.querySelector(`${A}-eye-l`);
      const eyeR = guide.querySelector(`${A}-eye-r`);
      const browL= guide.querySelector(`${A}-brow-l`);
      const browR= guide.querySelector(`${A}-brow-r`);
      const mouth= guide.querySelector(`${A}-mouth`);
      const led  = guide.querySelector('.neo-led-inner');
      const hasFace = !!(pupL && pupR && eyeL && eyeR && mouth);
      let blinkT, idleT;
      if (hasFace) {
        gsap.set(eyeL, { transformOrigin: "38px 36px" });
        gsap.set(eyeR, { transformOrigin: "62px 36px" });
      }
      const MOUTH = {
        smirk: "M 37 56 Q 50 57 64 50",   // lopsided "sure, whatever"
        smile: "M 37 54 Q 50 60 63 54",
        grin:  "M 36 53 Q 50 64 64 53",
        flat:  "M 39 55 L 61 55",          // unimpressed
        oh:    "M 44 53 Q 50 62 56 53",
      };
      const setMouth = (d, dur = 0.28) =>
        hasFace && gsap.to(mouth, { attr: { d }, duration: dur, ease: "power2.out", overwrite: "auto" });
      const look = (nx, ny) => {
        if (!hasFace) return;
        gsap.to([pupL, pupR], { x: nx * 2.6, y: ny * 2.4, duration: 0.32, ease: "power2.out", overwrite: "auto" });
      };
      const blink = (which = "both") => {
        if (!hasFace) return;
        const eyes = which === "r" ? [eyeR] : which === "l" ? [eyeL] : [eyeL, eyeR];
        gsap.timeline()
          .to(eyes, { scaleY: 0.08, duration: 0.06, ease: "power2.in" })
          .to(eyes, { scaleY: 1,    duration: 0.13, ease: "power2.out" });
      };
      const ledFlash = () => led && gsap.fromTo(led,
        { scale: 1 }, { scale: 2.1, duration: 0.16, yoyo: true, repeat: 1, transformOrigin: "50px 0px", ease: "power2.out" });
      const brows = (up) => hasFace && gsap.to([browL, browR],
        { opacity: up ? 0.9 : 0, y: up ? -1.5 : 0, duration: 0.2, overwrite: "auto" });
      const eyeRoll = () => {
        if (!hasFace) return;
        gsap.timeline({ onComplete: () => look(0, 0) })
          .to([pupL, pupR], { y: -2.6, x: 0, duration: 0.16, ease: "power1.in" })
          .to([pupL, pupR], { x: 2.6,  duration: 0.15 })
          .to([pupL, pupR], { y: 2,    x: 0, duration: 0.15 });
      };
      const moodFor = (key) => {
        if (key === "idle") return "smirk";   // chill guide, not annoyed-at-you
        if (/^(currency|roi)/.test(key)) return "money";
        if (/(intake|callout|sections|cta|btn|unbox|head|tag|media)/.test(key)) return "hype";
        return "smirk";
      };
      const express = (mood) => {
        if (!hasFace) return;
        if (mood === "bored") { setMouth(MOUTH.flat); if (Math.random() < 0.45) eyeRoll(); brows(false); }
        else if (mood === "money") { setMouth(MOUTH.grin); brows(true); ledFlash(); }
        else if (mood === "hype")  { setMouth(MOUTH.grin); blink("r"); ledFlash(); brows(true); }
        else { setMouth(MOUTH.smirk); brows(true); if (Math.random() < 0.3) blink("r"); }
      };
      // random idle blinks = "alive"
      const scheduleBlink = () => {
        blinkT = setTimeout(() => { if (guideLive) blink(); scheduleBlink(); }, 2400 + Math.random() * 3600);
      };
      // long-idle nudge — only after the user's been still a good while, and
      // strictly no pressure (no "do something / move / your turn" energy).
      const idleChatter = [
        "whenever you're ready — there's good stuff below.",
        "no pressure, scroll on when you wanna.",
        "still here. take all the time you need.",
        "ready when you are, bestie.",
        "keep going whenever — i'll keep up.",
      ];
      let idleIdx = 0;
      const scheduleIdleSass = () => {
        idleT = setTimeout(() => {
          if (guideLive && lastKey === "idle") {
            idleIdx++;
            setInfo({ label: "no rush", line: idleChatter[idleIdx % idleChatter.length] });
            gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.22, overwrite: "auto" });
            blink();                     // gentle blink, no eyeroll
          }
          scheduleIdleSass();
        }, 22000 + Math.random() * 10000);   // 22–32s: only nudge after a long pause
      };
      // --- shared scroll narration: Vibe explains each beat of the home scroll
      //     (Nexara → premise → Academy / Labs / Marketing → close). Authored,
      //     no-pressure lines. On desktop a later hover takes over; on mobile the
      //     bubble auto-collapses so it never sits on the copy. ---
      let narrateT;
      const narrate = (key, label, line, mood) => {
        if (key === lastKey) return;               // only on a real beat change
        lastKey = key;
        activeInfo = { label, line };
        setInfo(activeInfo);
        if (bubble) bubble.textContent = line;
        if (tag)    tag.textContent    = label;
        try { express(mood); } catch (_) {}
        if (hasFace) blink("r");
        clearTimeout(narrateT);
        gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.25, overwrite: "auto" });
        if (!isDesktopFollower) {
          narrateT = setTimeout(() => gsap.to([bubble, tag], { autoAlpha: 0, y: 8, duration: 0.3, overwrite: "auto" }), 4600);
        }
      };

      // Premise + closing beats (single-enter sections).
      [
        { sel: ".neo-manifesto", key: "narr-premise", label: "the premise", mood: "smirk",
          line: "the premise: we build people, systems and brands — shipped from one house. this part's the thesis." },
        { sel: ".neo-final-cta", key: "narr-close", label: "your move", mood: "hype",
          line: "that's the tour. your move whenever — no rush." },
      ].forEach((n) => {
        const el = document.querySelector(n.sel);
        if (!el) return;
        triggers.push(ScrollTrigger.create({
          trigger: el, start: "top 70%", end: "bottom 30%",
          onEnter:     () => narrate(n.key, n.label, n.line, n.mood),
          onEnterBack: () => narrate(n.key, n.label, n.line, n.mood),
        }));
      });

      // Divisions: three panels inside one pinned rail — fire per active panel
      // (same 0/1/2 index the rail itself uses).
      const railNarrEl = document.querySelector(".neo-rail-wrap");
      if (railNarrEl) {
        const divisions = [
          { key: "narr-academy",   label: "academy",   mood: "money", line: "Academy — we grow engineers who actually ship. talent, forged in public." },
          { key: "narr-labs",      label: "labs",      mood: "hype",  line: "Labs — we build the intelligence. real AI systems, not slideware." },
          { key: "narr-marketing", label: "marketing", mood: "hype",  line: "Marketing — we make brands move. every campaign wired to a metric." },
        ];
        triggers.push(ScrollTrigger.create({
          trigger: railNarrEl, start: "top top", end: "bottom bottom", scrub: true,
          onUpdate: (self) => {
            const d = divisions[Math.min(2, Math.floor(self.progress * 2.99))];
            if (d) narrate(d.key, d.label, d.line, d.mood);
          },
        }));
      }

      // --- desktop driver: cursor-follow + hover-classify (mobile drives the same brain via its own branch) ---
      if (isDesktopFollower) {
      if (hasFace) { scheduleBlink(); scheduleIdleSass(); setMouth(MOUTH.smirk, 0); }
      else { scheduleIdleSass(); }

      const onMove = (event) => {
        if (!guideLive) return;
        const offsetRight = event.clientX > window.innerWidth - 180;
        const x = clamp(event.clientX + (offsetRight ? -340 : 24), 12, window.innerWidth - 340);
        const y = clamp(event.clientY + 18, 84, window.innerHeight - 108);
        gsap.to(charWrap, { x, y, duration: 0.2, ease: "power3.out", overwrite: "auto" });
        gsap.to(spotlight, { autoAlpha: 1, top: y + 38, duration: 0.18, overwrite: "auto" });

        // pupils watch the actual cursor → side-eye sass (never let face code break the voice)
        try {
          if (hasFace && faceSvg) {
            const r = faceSvg.getBoundingClientRect();
            look(clamp((event.clientX - (r.left + r.width / 2)) / 130, -1, 1),
                 clamp((event.clientY - (r.top + r.height * 0.34)) / 130, -1, 1));
          }
        } catch (_) {}

        const info = classifyTarget(document.elementFromPoint(event.clientX, event.clientY));
        if (info.key !== lastKey) {
          lastKey = info.key;
          activeInfo = info;
          setInfo(info);
          try { express(moodFor(info.key)); } catch (_) {}
          boomAt(event.clientX, event.clientY);
          gsap.fromTo([bubble, tag], { autoAlpha: 0.55, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.18, overwrite: "auto" });
        }
      };
      const onLeave = () => {
        setInfo({ label: "your guide", line: "no worries — i'll be right here when you're back." });
        setMouth(MOUTH.flat); brows(false); look(0, 0);
      };
      // click = smug little wink + antenna flash
      const onClick = () => {
        if (!guideLive || !hasFace) return;
        blink("r"); ledFlash(); setMouth(MOUTH.grin);
        gsap.delayedCall(0.5, () => setMouth(lastKey === "idle" ? MOUTH.flat : MOUTH.smirk));
      };
      const showFollower = () => {
        guideLive = true;
        guide.classList.remove("is-offscreen");
        gsap.to(guide, { autoAlpha: 1, duration: 0.28, ease: "power2.out", overwrite: true });
        gsap.to(spotlight, { autoAlpha: 1, duration: 0.28, overwrite: true });
      };
      const hideFollower = () => {
        guideLive = false;
        guide.classList.add("is-offscreen");
        gsap.to(guide, { autoAlpha: 0, duration: 0.22, ease: "power2.in", overwrite: true });
        gsap.to(spotlight, { autoAlpha: 0, duration: 0.22, overwrite: true });
      };

      const homeHero = guideHomeHero;
      if (homeHero) {
        triggers.push(ScrollTrigger.create({
          trigger: homeHero,
          start: "bottom top+=80",
          onEnter: showFollower,
          onEnterBack: showFollower,
          onLeaveBack: hideFollower,
        }));
      }
      if (!homeHero || window.scrollY > homeHero.offsetHeight - window.innerHeight + 80) {
        showFollower();
      }
      gsap.set(charWrap, { x: window.innerWidth - 360, y: 150 });
      gsap.set([bubble, tag], { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(beacon, { width: 0 });
      gsap.set(spotlight, { autoAlpha: 0, top: 188 });
      setInfo({ label: "your guide", line: "ok so — Nexara. three engines, one roof. lemme walk you through." });
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("click", onClick);

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("click", onClick);
        clearTimeout(blinkT);
        clearTimeout(idleT);
        clearTimeout(narrateT);
        gsap.killTweensOf([charWrap, bubble, tag, spotlight, burst, pupL, pupR, eyeL, eyeR, mouth]);
        triggers.forEach(t => t.kill());
        guide.classList.remove("is-cursor-guide", "is-scroll-guide");
      };
    }

    /* ── Option A: collapse-to-launcher (mobile) ──
       Bubble stays hidden; tapping the avatar (or a page element) expands it,
       then it auto-collapses so the guide never sits over the copy. */
    let collapseT;
    const expandBubble = () => {
      clearTimeout(collapseT);
      gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.2, overwrite: "auto" });
      collapseT = setTimeout(() => gsap.to([bubble, tag], { autoAlpha: 0, y: 8, duration: 0.3, overwrite: "auto" }), 3600);
    };

    /* Phase 2: breakout — guide fades in as hero-wrap scrolls out.
       Parks low in the corner (82vh) instead of mid-screen, so it stays
       out of the reading column. */
    const homeHero = guideHomeHero;
    const showScrollGuide = () => {
      guideLive = true;
      gsap.timeline()
        .to(guide,     { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0)
        .to(charWrap,  { y: "82vh", duration: 1.2, ease: "power3.out" }, 0)
        .to(spotlight, { autoAlpha: 1, top: "82vh", duration: 1 }, 0.3);
    };
    const hideScrollGuide = () => {
      guideLive = false;
      gsap.killTweensOf([charWrap, bubble, tag, beacon, spotlight]);
      gsap.to(guide, { autoAlpha: 0, duration: 0.35 });
      gsap.to(spotlight, { autoAlpha: 0, duration: 0.35 });
      gsap.set(beacon, { width: 0 });
      gsap.set(charWrap, { x: 0 });
      const armLine = guide.querySelector('#neo-guide-avatar-arm-l-line');
      const armNode = guide.querySelector('#neo-guide-avatar-arm-l-node');
      if (armLine) gsap.set(armLine, { attr: { x1: 24, y1: 38, x2: 13, y2: 31 } });
      if (armNode) gsap.set(armNode, { attr: { cx: 11, cy: 30 } });
    };
    if (homeHero) {
      triggers.push(ScrollTrigger.create({
        trigger: homeHero,
        start: "bottom top+=80",
        onEnter: showScrollGuide,
        onLeaveBack: hideScrollGuide,
      }));
    } else {
      showScrollGuide();
    }

    // Mobile: keep the face alive (blink) but DON'T auto-pop the bubble on idle —
    // launcher mode means he only speaks when tapped, so reading stays clear.
    if (hasFace) { scheduleBlink(); setMouth(MOUTH.smirk, 0); }
    // Seed a launcher hint as the first-tap line, but keep the bubble collapsed.
    lastKey = "idle";
    setInfo({ label: "your guide", line: "ok so — Nexara. three engines, one roof. scroll, i'll walk you through." });
    if (bubble) bubble.textContent = "ok so — Nexara. three engines, one roof. scroll, i'll walk you through.";
    gsap.set([bubble, tag], { autoAlpha: 0, y: 8 });

    // Section narration (premise / divisions / close) is handled by the shared
    // `narrate` system defined above — it drives both desktop and mobile, so the
    // old mobile-only "dock + travel" system was removed. The avatar simply parks
    // low (82vh) via showScrollGuide and speaks its authored line per beat.

    // Mobile: tap a page element → classify + react (touch analog of desktop hover)
    let lastTapT = 0;
    const onTapClassify = (e) => {
      if (guide.contains(e.target)) return;        // tapping HIM is handled below
      const now = performance.now();
      if (now - lastTapT < 250) return;            // throttle
      lastTapT = now;
      const info = classifyTarget(e.target);
      if (info && info.key !== lastKey) { lastKey = info.key; activeInfo = info; setInfo(info); }
      try { express(moodFor(info && info.key)); } catch (_) {}
      boomAt(e.clientX || 0, e.clientY || 0);
      if (hasFace) { blink("r"); ledFlash(); }
      expandBubble();
    };
    window.addEventListener("pointerdown", onTapClassify, { passive: true });

    // Mobile: tap HIM → self-aware quip (rotating, no immediate repeat)
    const selfLines = [
      "ayo you tapped me. bold. iconic.",
      "yes hi it's me, your guide. obsessed already?",
      "careful, tap me again and i get ideas.",
      "main character energy. i respect it.",
      "stop poking, start scrolling bestie.",
      "you rang? scroll down, i'll keep up.",
    ];
    let selfIdx = 0;
    const onTapSelf = (e) => {
      e.stopPropagation();                          // don't also fire onTapClassify
      selfIdx++;
      setInfo({ label: "neo", line: selfLines[selfIdx % selfLines.length] });
      if (hasFace) {
        blink("r"); ledFlash(); setMouth(MOUTH.grin); express("hype");
        gsap.delayedCall(0.5, () => setMouth(MOUTH.smirk));
      }
      expandBubble();
    };
    charWrap.addEventListener("pointerdown", onTapSelf);

    // Mobile: pause the blink loop when the tab is hidden (battery). No idle
    // nag loop on mobile — launcher mode only speaks on tap or section beats.
    const onVisibility = () => {
      if (document.hidden) { clearTimeout(blinkT); }
      else if (guideLive && hasFace) { scheduleBlink(); }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      triggers.forEach(t => t.kill());
      clearTimeout(blinkT);
      clearTimeout(idleT);
      clearTimeout(collapseT);
      clearTimeout(narrateT);
      window.removeEventListener("pointerdown", onTapClassify);
      charWrap.removeEventListener("pointerdown", onTapSelf);
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.killTweensOf([charWrap, bubble, tag, spotlight, burst]);
    };
  }, []);

  return (
    <>
      <div ref={spotlightRef} className="neo-guide-spotlight" aria-hidden="true"/>
      <div ref={guideRef} className="neo-guide-overlay" aria-hidden="true">
        <div ref={burstRef} className="neo-guide-burst"/>
        <div ref={charWrapRef} className="neo-guide-char-wrap">
          <div ref={bubbleRef} className="neo-guide-bubble"/>
          <div style={{ position: "relative" }}>
            <div ref={beaconRef} className="neo-guide-beacon"/>
            <NeoAvatarSVG id="neo-guide-avatar" className="neo-guide-char-svg"/>
            <div ref={tagRef} className="neo-guide-tag"/>
          </div>
        </div>
      </div>
    </>
  );
}

export { Sparkles, NeoAvatarSVG, NeoGuide };
