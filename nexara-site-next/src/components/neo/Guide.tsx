// @ts-nocheck -- deep canvas/GSAP animation-state closures left untyped deliberately;
// forcing types here without runtime insight into each closure risks silently
// changing animation timing. Revisit during a dedicated animation-code pass, not
// as a rushed tail-end of this decomposition.
'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HAS_SCROLL_ANIMATION } from '@/lib/shared';
import { DATA } from '@/lib/data';
import { CLIENTS } from '@/lib/clients';
import { LOCAL_FAQS } from '@/lib/seo';
import { answer as agentAnswer, suggestions as agentSuggestions } from './guideAgent';
import { startBrief, nextBrief } from './briefFlow';
import '@/styles/neo-guide.css';

// See trust/Hero.tsx for why this is repeated per-file rather than centralized.
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

interface NeoAvatarSVGProps {
  id?: string;
  className?: string;
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
  const chipsRef    = React.useRef(null);
  const uiRef       = React.useRef(null);
  const panelRef    = React.useRef(null);
  const logRef      = React.useRef(null);
  const sugRef      = React.useRef(null);
  const formRef     = React.useRef(null);
  const inputRef    = React.useRef(null);
  const askBtnRef   = React.useRef(null);
  const panelCloseRef = React.useRef(null);

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
    const chipsEl   = chipsRef.current;
    const uiEl      = uiRef.current;
    const panelEl   = panelRef.current;
    const logEl     = logRef.current;
    const sugEl     = sugRef.current;
    const formEl    = formRef.current;
    const inputEl   = inputRef.current;
    const askBtn    = askBtnRef.current;
    const panelClose = panelCloseRef.current;
    const body      = charWrap.querySelector(".neo-guide-body");
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
      const clean = (text) => (typeof text === "string" ? text : "").replace(/\s+/g, " ").trim();
      const shorten = (text, max = 46) => {
        const t = clean(text);
        return t.length > max ? `${t.slice(0, max).trim()}…` : t;
      };
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const textFrom = (node, selector) => clean(node?.querySelector(selector)?.textContent);
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      let guideLive = false;
      let engageT;
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

        // interactive: links + buttons
        const isCta = tag === "button" || el.matches("[role='button'],[role='link']") || (tag === "a" && el.getAttribute("href"));
        if (isCta && raw) {
          const href = el.getAttribute?.("href") || "";
          const isNav = el.closest("nav,.nx-nav,.nx-finder");
          const isContact = /contact/.test(href) || /(talk|contact|start|scope|begin|discuss|call)/i.test(raw);
          const isWork = /(customers|work|proof|case|live)/i.test(href + " " + raw);
          if (isContact) return { key: `cta-${keyOf(raw)}`, label: "talk to us", line: pick([
            `“${txt}” goes to a real person, not a form graveyard. reply within two working days.`,
            `this one's the shortcut. tell us the problem, we'll tell you who should take it.`,
            `“${txt}”: the brief doesn't need to be polished. messy is fine.`
          ]) };
          if (isWork) return { key: `cta-${keyOf(raw)}`, label: "proof", line: pick([
            `“${txt}” opens live sites you can poke at. nothing staged.`,
            `every case behind this is a real client with a real domain.`,
            `skip the pitch, open the work. “${txt}”.`
          ]) };
          if (isNav) return { key: `cta-${keyOf(raw)}`, label: "route", line: pick([
            `“${txt}”: same site, different room.`,
            `“${txt}” is a quick hop. i'll tag along.`,
            `heading to “${txt}”? good pick.`
          ]) };
          return { key: `cta-${keyOf(raw)}`, label: "action", line: pick([
            `“${txt}”. go on, it's the clickable one.`,
            `that's a button, and it does what it says: “${txt}”.`,
            `“${txt}” is worth the tap.`
          ]) };
        }

        // headings: quote the copy, then react to it
        if (/^h[1-5]$/.test(tag) && raw) {
          return { key: `head-${keyOf(raw)}`, label: "headline", line: pick([
            `“${txt}”. short and it lands.`,
            `“${txt}” is the point of this whole section.`,
            `if you only read one line here, make it “${txt}”.`,
            `“${txt}”: they said it plainly, which is rare.`
          ]) };
        }

        // labels / eyebrows / pills / badges
        if (el.matches(".eyebrow,.pill,.badge,.tag,.chip") && raw) {
          return { key: `tag-${keyOf(raw)}`, label: "label", line: pick([
            `“${txt}”. a small tag, but it tells you where you are.`, `${lc}: filed under useful.`, `“${txt}”. noted.`
          ]) };
        }

        // form fields
        if (/^(input|textarea|select)$/.test(tag) || tag === "label") {
          const name = shorten(el.getAttribute?.("name") || el.getAttribute?.("placeholder") || raw || "this field", 28).toLowerCase();
          return { key: `field-${keyOf(name)}`, label: "form", line: pick([
            `${name}: plain words are fine, no need to sound formal.`, `put your ${name} here. the more specific, the better the reply.`, `${name} next. you're nearly there.`, `fill ${name} and we've got what we need to start.`
          ]) };
        }

        // media
        if (/^(img|svg|video)$/.test(tag)) {
          return { key: `media-${keyOf(el.getAttribute?.("alt") || el.getAttribute?.("class") || tag)}`, label: "visual", line: pick([
            "that visual is carrying some of the story. worth a second look.", "good one to look at slowly.", "the design team cared about this one."
          ]) };
        }

        // body copy / list items
        if (raw && raw.length > 4) {
          return { key: `read-${keyOf(raw)}`, label: "reading", line: pick([
            `“${txt}”. this is the useful part, so don't skim.`,
            `reading along: “${txt}”.`,
            `“${txt}” says more than it looks like it does.`,
            `you stopped on “${txt}”. good instinct.`
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
          ".nx-module",
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
              "hover over anything and i'll tell you what it is.",
              "take your time. i'm your guide, not your timer.",
              "ask me about a section: just point at it.",
              "i read the whole site so you don't have to. point at something."
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

        if (target.matches(".super-skill-card, .section-card, .module-card, .nx-module, .stack-detail-card, .package-card, .process-grid article")) {
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
        engage();
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
        blinkT = setTimeout(() => { if (guideLive && !guide.classList.contains("is-asleep")) blink(); scheduleBlink(); }, 2400 + Math.random() * 3600);
      };
      // long-idle nudge — only after the user's been still a good while, and
      // strictly no pressure (no "do something / move / your turn" energy).
      const idleChatter = [
        "still here. the live client work is further down.",
        "if you'd rather talk to a person, the contact page is one click.",
        "no rush. scroll when you're ready and i'll follow.",
        "fun fact: every case study on this site links to a live domain.",
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
        { sel: ".nx-manifesto", key: "narr-premise", label: "the premise", mood: "smirk",
          line: "the short version: one company that trains engineers, builds software and runs marketing. one process for all three." },
        { sel: ".nx-final-cta", key: "narr-close", label: "your move", mood: "hype",
          line: "that's the tour. got a project in mind? tell us the problem, we reply within two working days." },
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
      // (same order as DATA.sections, which the rail renders).
      const railNarrEl = document.querySelector(".nx-rail-wrap");
      if (railNarrEl) {
        const divisions = [
          { key: "narr-academy",   label: "academy",   mood: "money", line: "Academy: full-stack, AI, design and cloud tracks. learners ship real projects and a mentor reviews every one." },
          { key: "narr-marketing", label: "marketing", mood: "hype",  line: "Marketing: websites and campaigns, in that order. people should be able to find you before you pay for ads." },
          { key: "narr-labs",      label: "labs",      mood: "hype",  line: "Labs: custom software and SaaS from Vizag. AI goes in where it solves something, not as decoration." },
        ];
        triggers.push(ScrollTrigger.create({
          trigger: railNarrEl, start: "top top", end: "bottom bottom", scrub: true,
          onUpdate: (self) => {
            const d = divisions[Math.min(2, Math.floor(self.progress * 2.99))];
            if (d) narrate(d.key, d.label, d.line, d.mood);
          },
        }));
      }

      // ── liveliness layer: reactions that run on both drivers ──────────────
      // He used to wait for a hover or a tap. These make him notice what you do:
      // scroll speed, long silence, coming back to the tab, copying contact
      // details, typing in a form, rapid clicks, and clicking through to a CTA.
      const say = (label, line, { mood, hold = 0 } = {}) => {
        if (!guideLive) return;
        activeInfo = { label, line };
        setInfo(activeInfo);
        try { if (mood) express(mood); } catch (_) {}
        clearTimeout(narrateT);
        gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.22, overwrite: "auto" });
        if (!isDesktopFollower || hold) {
          narrateT = setTimeout(() => { if (!menuOpen) gsap.to([bubble, tag], { autoAlpha: 0, y: 8, duration: 0.3, overwrite: "auto" }); }, hold || 4200);
        }
      };
      const cooldowns = {};
      const ready = (key, ms) => {
        const now = performance.now();
        if (now - (cooldowns[key] || -1e9) < ms) return false;
        cooldowns[key] = now;
        return true;
      };
      let menuOpen = false;

      // ── motion layer: energy, arms, hop, idle antics, phone calm ──
      // Everything here is movement or state. Speech stays in setInfo/say/narrate.
      const armL = guide.querySelector(`${A}-arm-l`);
      const armR = guide.querySelector(`${A}-arm-r`);
      const hasArms = !!(armL && armR);
      if (hasArms) { gsap.set(armL, { svgOrigin: "24 38" }); gsap.set(armR, { svgOrigin: "76 38" }); }
      if (body) gsap.set(body, { transformOrigin: "50% 85%" });
      let anticT, scrollEndT, cursorLeanT;
      let lastMoveT = 0, lastMX = null;

      // Arms: positive rotation lifts the left arm, negative lifts the right.
      const armsTo = (l, r, dur = 0.25, ease = "back.out(2)") => {
        if (!hasArms) return;
        gsap.to(armL, { rotation: l, duration: dur, ease, overwrite: "auto" });
        gsap.to(armR, { rotation: r, duration: dur, ease, overwrite: "auto" });
      };
      const armsRest = () => armsTo(0, 0, 0.4, "power2.out");
      const wave = () => {
        if (!hasArms) return;
        gsap.timeline({ onComplete: armsRest })
          .to(armR, { rotation: -64, duration: 0.22, ease: "power2.out", overwrite: "auto" })
          .to(armR, { rotation: -30, duration: 0.14, repeat: 5, yoyo: true, ease: "sine.inOut" });
        setMouth(MOUTH.smile);
        gsap.delayedCall(1.4, () => setMouth(MOUTH.smirk));
      };
      const pump = () => {
        if (!hasArms) return;
        gsap.timeline()
          .to(armR, { rotation: -48, duration: 0.1, ease: "power2.out", overwrite: "auto" })
          .to(armR, { rotation: 0, duration: 0.3, ease: "back.out(3)" });
      };
      const hop = (h = 10) => {
        if (!body) return;
        gsap.timeline()
          .to(body, { scaleY: 0.9, scaleX: 1.07, duration: 0.07, ease: "power1.in", overwrite: "auto" })
          .to(body, { y: -h, scaleY: 1.08, scaleX: 0.95, duration: 0.14, ease: "power2.out" })
          .to(body, { y: 0, scaleY: 1, scaleX: 1, duration: 0.42, ease: "bounce.out" });
      };
      const cheer = () => {
        if (hasArms) {
          armsTo(72, -72, 0.18, "back.out(3)");
          gsap.delayedCall(0.9, armsRest);
        }
        hop(12);
      };
      const stretch = () => {
        armsTo(60, -60, 0.3);
        setMouth(MOUTH.oh, 0.2);
        gsap.delayedCall(1.1, () => { armsRest(); setMouth(MOUTH.smirk); });
      };
      const lookAround = () => {
        if (!hasFace) return;
        gsap.timeline({ onComplete: () => look(0, 0) })
          .call(() => look(-1, 0.1))
          .call(() => look(1, 0.2), null, 0.7)
          .call(() => look(0, -0.6), null, 1.3);
      };
      const tilt = () => {
        if (!body) return;
        gsap.timeline()
          .to(body, { rotation: pick([-7, 7]), duration: 0.35, ease: "power2.out" })
          .to(body, { rotation: 0, duration: 0.6, ease: "elastic.out(1,0.5)", delay: 0.7 });
        if (hasFace) blink("r");
      };
      // Point the nearer arm at a screen position (used for what you hover).
      const pointAt = (cx, cy) => {
        if (!hasArms || !faceSvg) return;
        const r = faceSvg.getBoundingClientRect();
        const left = cx < r.left + r.width / 2;
        const sx = r.left + r.width * (left ? 0.24 : 0.76), sy = r.top + r.height * (38 / 115);
        let deg = (Math.atan2(cy - sy, cx - sx) * 180) / Math.PI - (left ? -147.5 : -32.5);
        if (deg > 180) deg -= 360;
        if (deg < -180) deg += 360;
        deg = clamp(deg, -85, 85);
        if (left) armsTo(deg, 0, 0.3); else armsTo(0, deg, 0.3);
      };

      // Energy: interaction raises it, stillness lets it fall. Two classes (hyped,
      // calm) change float speed and glow; hysteresis keeps them from flapping.
      let energy = 0.25, energyMode = "";
      const syncEnergy = () => {
        let mode = "";
        if (energy > 0.65 || (energyMode === "hi" && energy > 0.4)) mode = "hi";
        else if (energy < 0.05 || (energyMode === "lo" && energy < 0.15)) mode = "lo";
        if (mode === energyMode) return;
        energyMode = mode;
        guide.classList.toggle("is-hyped", mode === "hi");
        guide.classList.toggle("is-calm", mode === "lo");
      };
      const bump = (n) => { energy = Math.min(1, energy + n); syncEnergy(); };

      // Idle antics: small unprompted moves while you read. Phones get the quiet ones.
      const ANTICS = isDesktopFollower
        ? [wave, lookAround, () => hop(9), stretch, tilt]
        : [lookAround, tilt, () => hop(5)];
      const scheduleAntic = () => {
        anticT = setTimeout(() => {
          const calm = performance.now() - lastInput > 2500 && !guide.classList.contains("is-scrolling");
          if (guideLive && calm && !asleep && !menuOpen && !askOpen && !document.hidden) pick(ANTICS)();
          scheduleAntic();
        }, 7000 + Math.random() * 7000);
      };
      let greeted = false;
      const greet = () => {
        if (greeted) return;
        greeted = true;
        gsap.delayedCall(0.7, () => { wave(); bump(0.3); });
        if (!isDesktopFollower) gsap.delayedCall(1.3, () => say("hi", "hi, i'm neo. tap me for shortcuts. i stay quiet while you scroll.", { hold: 4200 }));
      };

      // Phones: he tucks half off the right edge and only slides out when he has
      // something to say (engage), is tapped, or the shortcut menu is open.
      function engage(ms = 4800) {          // hoisted: setInfo runs during ScrollTrigger setup, before this block
        if (isDesktopFollower) return;
        guide.classList.add("is-engaged");
        clearTimeout(engageT);
        engageT = setTimeout(() => { if (!menuOpen) guide.classList.remove("is-engaged"); }, ms);
      }
      // Away: out of sight while a field has focus (keyboard up) or the Ask panel is open.
      let fieldFocused = false;
      const syncAway = () => guide.classList.toggle("is-away", !isDesktopFollower && (askOpen || fieldFocused));
      // Park above the bottom dock (.nx-finder) when it's showing, else low in the viewport.
      const parkY = () => {
        const H = window.innerHeight;
        const dock = document.querySelector(".nx-finder.is-shown");
        const floor = dock ? dock.getBoundingClientRect().top - 100 : H - 132;
        return Math.round(Math.max(120, Math.min(H * 0.82, floor)));
      };

      // 1. Sleep after a long silence; wake with a startle.
      let sleepT, asleep = false, lastInput = performance.now();
      const fallAsleep = () => {
        if (!guideLive || asleep || menuOpen) { sleepT = setTimeout(fallAsleep, 8000); return; }
        asleep = true;
        guide.classList.add("is-asleep");
        if (hasFace) { gsap.to([eyeL, eyeR], { scaleY: 0.14, duration: 0.8, ease: "power2.out", overwrite: "auto" }); setMouth(MOUTH.flat, 0.6); look(0, 0.8); }
        say("zzz", "...zzz... (i do this when nobody's around.)", { hold: 3200 });
      };
      const wake = () => {
        lastInput = performance.now();
        clearTimeout(sleepT);
        sleepT = setTimeout(fallAsleep, 38000);
        if (!asleep) return;
        asleep = false;
        guide.classList.remove("is-asleep");
        if (hasFace) {
          gsap.to([eyeL, eyeR], { scaleY: 1.18, duration: 0.12, ease: "power2.out", overwrite: "auto" });
          gsap.to([eyeL, eyeR], { scaleY: 1, duration: 0.3, delay: 0.5 });
          setMouth(MOUTH.oh, 0.12); ledFlash();
          gsap.delayedCall(0.9, () => setMouth(MOUTH.smirk));
        }
        if (body) gsap.fromTo(body, { y: -10 }, { y: 0, duration: 0.5, ease: "back.out(3)" });
        armsTo(55, -55, 0.15);
        gsap.delayedCall(0.7, armsRest);
        bump(0.5);
        say("awake", pick(["oh! hi. i was only resting my eyes.", "i'm up, i'm up. what did i miss?", "back already? good timing."]), { mood: "hype" });
      };
      ["pointerdown", "keydown", "wheel", "touchstart"].forEach((evt) => window.addEventListener(evt, wake, { passive: true }));
      sleepT = setTimeout(fallAsleep, 38000);

      // 2. Scroll speed: lean into the direction, widen the eyes on a hard scroll.
      let lastY = window.scrollY, lastScrollT = performance.now(), leanSmooth = 0;
      const leanTo = body ? gsap.quickTo(body, "rotation", { duration: 0.5, ease: "power3.out" }) : null;
      const onScrollReact = () => {
        const now = performance.now();
        const dy = window.scrollY - lastY, dt = Math.max(1, now - lastScrollT);
        lastY = window.scrollY; lastScrollT = now;
        if (!isDesktopFollower && Math.abs(dy) > 1) {
          guide.classList.add("is-scrolling");              // tuck + hide bubble while content moves
          clearTimeout(scrollEndT);
          scrollEndT = setTimeout(() => {
            guide.classList.remove("is-scrolling");
            if (guideLive) gsap.to(charWrap, { y: parkY(), duration: 0.4, ease: "power2.out", overwrite: "auto" });   // dock may have shown/hidden
          }, 450);
        }
        const v = dy / dt;                                   // px per ms
        leanSmooth += (v - leanSmooth) * 0.35;
        if (leanTo && guideLive) leanTo(clamp(leanSmooth * 7, -14, 14));
        if (Math.abs(leanSmooth) > 1.2) bump(0.04);
        if (Math.abs(leanSmooth) > 2.6 && guideLive && ready("whoosh", 9000)) {
          if (hasFace) { setMouth(MOUTH.oh, 0.1); gsap.to([pupL, pupR], { scale: 0.7, transformOrigin: "50% 50%", duration: 0.1, yoyo: true, repeat: 1 }); }
          say("whoa", pick(["whoa, slow down. you'll miss the good bits.", "that's a fast scroll. i'm getting motion sick.", "speed reader. respect."]), { mood: "hype", hold: 2600 });
          gsap.delayedCall(1.2, () => setMouth(MOUTH.smirk));
        }
      };
      window.addEventListener("scroll", onScrollReact, { passive: true });
      const settleLean = setInterval(() => {
        leanSmooth *= 0.6;
        if (Math.abs(leanSmooth) < 0.05 && leanTo && performance.now() - lastMoveT > 200) leanTo(0);
        energy = Math.max(0, energy - 0.03); syncEnergy();
      }, 400);

      // 3. Back to the tab after a while away.
      let hiddenAt = 0;
      const onVis = () => {
        if (document.hidden) { hiddenAt = performance.now(); return; }
        if (hiddenAt && performance.now() - hiddenAt > 25000 && guideLive) {
          say("welcome back", pick(["you're back. we were mid-scroll, i kept your place.", "oh good, you came back. i was getting dramatic."]), { mood: "hype" });
        }
      };
      document.addEventListener("visibilitychange", onVis);

      // 4. Copying a phone number or email.
      const onCopy = () => {
        const sel = String(window.getSelection?.() || "");
        if (/@|\+?\d[\d\s-]{7,}/.test(sel) && ready("copy", 8000)) {
          say("copied", pick(["copied. call or write, whichever is faster for you.", "good call. we answer within two working days."]), { mood: "money" });
          if (hasFace) { blink("r"); ledFlash(); }
        }
      };
      document.addEventListener("copy", onCopy);

      // 5. Typing in a form: look down at the field.
      const onFocusField = (e) => {
        const f = e.target;
        if (!f?.matches?.("input,textarea,select")) return;
        fieldFocused = true; syncAway();
        if (!guideLive) return;
        if (hasFace) { look(0, 1); setMouth(MOUTH.smile); }
        if (ready("form", 12000)) say("form", pick(["plain words are fine. we read every one.", "good, you're doing it. tell us the problem, not the solution.", "no need to sound formal in there."]), { mood: "money" });
      };
      const onBlurField = () => { fieldFocused = false; syncAway(); look(0, 0); setMouth(MOUTH.smirk); };
      document.addEventListener("focusin", onFocusField);
      document.addEventListener("focusout", onBlurField);

      // 6. Clicking through to a CTA: small celebration.
      const onCtaClick = (e) => {
        if (!guideLive || guide.contains(e.target)) return;
        const cta = e.target.closest?.("a.nx-btn,.btn-solid,.nx-final-cta a,a[href*='contact']");
        if (!cta) return;
        if (hasFace) { setMouth(MOUTH.grin); ledFlash(); blink("r"); }
        cheer(); bump(0.4);
        boomAt(e.clientX || window.innerWidth - 50, e.clientY || window.innerHeight * 0.8);
        gsap.delayedCall(0.8, () => setMouth(MOUTH.smirk));
      };
      document.addEventListener("click", onCtaClick, true);

      // 7. Rapid clicking anywhere (or on him): he spins.
      const clickTimes = [];
      const spin = (line) => {
        if (!body || !ready("spin", 4000)) return;
        gsap.timeline()
          .to(body, { rotation: 360, duration: 0.7, ease: "power3.inOut" })
          .set(body, { rotation: 0 });
        boomAt(window.innerWidth * (isDesktopFollower ? 0.5 : 0.9), window.innerHeight * 0.6);
        cheer(); bump(0.5);
        if (hasFace) { setMouth(MOUTH.grin); ledFlash(); gsap.delayedCall(1, () => setMouth(MOUTH.smirk)); }
        say("easter egg", line, { mood: "hype", hold: 3200 });
      };
      const onRapid = () => {
        const now = performance.now();
        clickTimes.push(now);
        while (clickTimes.length && now - clickTimes[0] > 1500) clickTimes.shift();
        if (clickTimes.length >= 5) { clickTimes.length = 0; spin(pick(["five clicks in a second. is this a stress test?", "ok ok, i'm dizzy. you win.", "rage clicking? it's not that deep."])); }
      };
      window.addEventListener("pointerdown", onRapid, { passive: true });

      // 8. Section beats on every page, not just the home hero: when a section
      //    with a heading scrolls in, he says what it's for. Curated lines first,
      //    then a read of the section's own heading.
      const SECTION_LINES = {
        divisions: ["three teams", "three teams, one process. academy trains, labs builds, marketing gets you found."],
        work:      ["the proof", "these are live client sites. open any of them, they're real."],
        "nx-cap-strip": ["what we build", "websites, SaaS, e-commerce, medical libraries, AI voice agents. the stuff that ships."],
        insights:  ["notes", "how we think about builds, in writing. short reads."],
        faqs:      ["questions", "the questions people actually ask us. the answers aren't fluffed."],
      };
      const seenSections = new Set();
      document.querySelectorAll("main section").forEach((sec) => {
        if (sec.matches(".nx-manifesto,.nx-final-cta")) return;
        const id = sec.id || [...sec.classList].find((c) => SECTION_LINES[c]) || "";
        const curated = SECTION_LINES[id];
        const heading = textFrom(sec, "h2");
        if (!curated && !heading) return;
        triggers.push(ScrollTrigger.create({
          trigger: sec, start: "top 62%", once: false,
          onEnter: () => {
            const key = `sec-${id || keyOf(heading)}`;
            if (seenSections.has(key) || !guideLive) return;
            seenSections.add(key);
            const [label, line] = curated || ["this section", `“${shorten(heading, 40)}”. that's what this part is about.`];
            narrate(key, label, line, "smirk");
          },
        }));
      });

      // 9. Quick-reply menu (touch / scroll mode): tapping him opens shortcuts.
      const base = location.pathname.startsWith("/neo") ? "/neo" : "";
      const goto = (href) => {
        const a = document.querySelector(`a[href="${href}"]`);
        if (a) a.click(); else window.location.assign(href);
      };
      const scrollToSel = (sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      };
      const MENU = [
        { label: "Show me the work", say: "good call. these are all live.", run: () => (document.querySelector("#work") ? scrollToSel("#work") : goto(`${base}/customers`)) },
        { label: "What do you build?", say: "websites, SaaS, e-commerce and AI. in that order of how often.", run: () => scrollToSel("#divisions, .nx-cap-strip") },
        { label: "Ask me anything", say: "go ahead. i answer from what's on this site.", run: () => openAsk() },
        { label: "Start a quick brief", say: "six questions, then you send it on WhatsApp or email.", run: () => beginBrief() },
      ];
      const closeMenu = () => {
        if (!menuOpen) return;
        menuOpen = false;
        guide.classList.remove("is-menu");
        engage(1500);
        gsap.to([bubble, tag], { autoAlpha: 0, y: 8, duration: 0.25, overwrite: "auto" });
      };
      const openMenu = (line = "where to? pick one, i'll take you.") => {
        menuOpen = true;
        menuScrollY = window.scrollY;
        guide.classList.add("is-menu");
        guide.classList.add("is-engaged");
        setInfo({ label: "shortcuts", line });
        gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.22, overwrite: "auto" });
        clearTimeout(menuT);
        menuT = setTimeout(closeMenu, 9000);
      };
      let menuT;
      if (chipsEl) {
        chipsEl.textContent = "";
        MENU.forEach((m) => {
          const b = document.createElement("button");
          b.type = "button"; b.setAttribute("role", "menuitem");
          b.textContent = m.label;
          b.addEventListener("click", (e) => {
            e.stopPropagation();
            closeMenu();
            if (m.say) {
              setInfo({ label: "on it", line: m.say });
              gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.2, overwrite: "auto" });
            }
            if (hasFace) { setMouth(MOUTH.grin); ledFlash(); gsap.delayedCall(1, () => setMouth(MOUTH.smirk)); }
            setTimeout(m.run, 350);
            clearTimeout(narrateT);
            narrateT = setTimeout(() => gsap.to([bubble, tag], { autoAlpha: 0, y: 8, duration: 0.3, overwrite: "auto" }), 3600);
          });
          chipsEl.appendChild(b);
        });
      }
      let menuScrollY = 0;
      const onScrollCloseMenu = () => { if (menuOpen && Math.abs(window.scrollY - menuScrollY) > 80) closeMenu(); };
      window.addEventListener("scroll", onScrollCloseMenu, { passive: true });

      // 10. Ask Neo: a scripted agent. It matches a typed question against facts
      //     already on the site (clients, packages, FAQs, contact) and can act:
      //     open a page, jump to a section, open a client's live site, call, email.
      const kb = {
        base,
        phone: DATA.contact.phone,
        email: "info@nexaragroups.com",
        address: `${DATA.contact.address.street}, ${DATA.contact.address.city}`,
        clients: CLIENTS.map((c) => ({ name: c.name, url: c.url, line: c.line, place: c.place, scope: c.scope })),
        teams: ["academy", "marketing", "labs"].map((id) => {
          const sec = DATA.sections[id];
          return {
            id, name: sec.name, pitch: (sec.short && (sec.short.neo || sec.short)) || "",
            packages: (sec.packages || []).map((pk) => ({ name: pk.name, fit: pk.fit, price: pk.price, duration: pk.duration })),
          };
        }),
        faqs: Object.values(LOCAL_FAQS).flat(),
      };
      let askOpen = false, askCount = 0;
      const runAction = (a) => {
        if (a.type === "goto") goto(a.path);
        else if (a.type === "scroll") { if (a.selector === "body") window.scrollTo({ top: 0, behavior: "smooth" }); else scrollToSel(a.selector); }
        else if (a.type === "open") window.open(a.url, "_blank", "noopener");
        else if (a.type === "tel" || a.type === "mailto") window.location.href = a.href;
        else if (a.type === "theme") goto(location.pathname.replace(/^\/neo/, "/trust") || "/trust");
        else if (a.type === "brief") { beginBrief(); return; }
        if (a.type === "goto" || a.type === "theme") closeAsk();
      };
      const renderReply = (query, reply) => {
        if (!logEl) return;
        logEl.textContent = "";
        if (query) { const qEl = document.createElement("p"); qEl.className = "neo-guide-ask-q"; qEl.textContent = query; logEl.appendChild(qEl); }
        const aEl = document.createElement("p"); aEl.className = "neo-guide-ask-a"; aEl.textContent = reply.line; logEl.appendChild(aEl);
        if (reply.actions.length) {
          const row = document.createElement("div"); row.className = "neo-guide-ask-actions";
          reply.actions.forEach((a) => {
            const b = document.createElement("button"); b.type = "button"; b.textContent = a.label;
            b.addEventListener("click", () => runAction(a));
            row.appendChild(b);
          });
          logEl.appendChild(row);
        }
        logEl.scrollTop = logEl.scrollHeight;
      };
      // Quick brief: guided questions, then a message the visitor sends themselves.
      const briefCfg = { whatsappNumber: String(DATA.contact.phone.href).replace(/\D/g, ""), email: kb.email };
      let brief = null;                       // BriefState while a brief is in progress
      const renderTurn = (query, turn) => {
        if (!logEl) return;
        logEl.textContent = "";
        if (query) { const qEl = document.createElement("p"); qEl.className = "neo-guide-ask-q"; qEl.textContent = query; logEl.appendChild(qEl); }
        const aEl = document.createElement("p"); aEl.className = "neo-guide-ask-a"; aEl.textContent = turn.line; logEl.appendChild(aEl);
        if (turn.done) {
          const pre = document.createElement("pre"); pre.className = "neo-guide-ask-summary"; pre.textContent = turn.done.text; logEl.appendChild(pre);
          const row = document.createElement("div"); row.className = "neo-guide-ask-actions";
          const wa = document.createElement("button"); wa.type = "button"; wa.textContent = "Send on WhatsApp";
          wa.addEventListener("click", () => window.open(turn.done.whatsapp, "_blank", "noopener"));
          const em = document.createElement("button"); em.type = "button"; em.textContent = "Send by email";
          em.addEventListener("click", () => { window.location.href = turn.done.mailto; });
          row.appendChild(wa); row.appendChild(em); logEl.appendChild(row);
        }
        // chips: step answers, plus Back / Cancel while a brief is running
        if (sugEl) {
          sugEl.textContent = "";
          const picked = new Set();
          let goBtn = null;
          const syncGo = () => { if (goBtn) { goBtn.hidden = picked.size === 0; goBtn.textContent = picked.size > 1 ? `Continue with ${picked.size}` : "Continue"; } };
          turn.chips.forEach((t) => {
            const b = document.createElement("button"); b.type = "button"; b.textContent = t;
            if (turn.multi) {
              b.setAttribute("aria-pressed", "false");
              b.addEventListener("click", () => {
                const on = !picked.has(t);
                if (on && t === turn.exclusive) { picked.clear(); sugEl.querySelectorAll("button[aria-pressed]").forEach((x) => x.setAttribute("aria-pressed", "false")); }
                else if (on && turn.exclusive) { picked.delete(turn.exclusive); sugEl.querySelectorAll("button[aria-pressed]").forEach((x) => { if (x.textContent === turn.exclusive) x.setAttribute("aria-pressed", "false"); }); }
                if (on) picked.add(t); else picked.delete(t);
                b.setAttribute("aria-pressed", on ? "true" : "false");
                syncGo();
              });
            } else {
              b.addEventListener("click", () => ask(t));
            }
            sugEl.appendChild(b);
          });
          if (turn.multi) {
            goBtn = document.createElement("button"); goBtn.type = "button"; goBtn.className = "neo-guide-ask-go"; goBtn.hidden = true;
            goBtn.addEventListener("click", () => ask([...picked].join(", ")));
            sugEl.appendChild(goBtn);
          }
          if (turn.state && turn.state.step !== "review") {
            if (turn.state.step !== "need") { const back = document.createElement("button"); back.type = "button"; back.textContent = "Back"; back.addEventListener("click", () => ask("Back")); sugEl.appendChild(back); }
            const cancel = document.createElement("button"); cancel.type = "button"; cancel.textContent = "Cancel"; cancel.addEventListener("click", () => ask("Cancel")); sugEl.appendChild(cancel);
          }
        }
        if (inputEl) {
          inputEl.placeholder = turn.placeholder;
          inputEl.inputMode = turn.state && turn.state.step === "phone" ? "tel" : "text";
          inputEl.maxLength = 160;
        }
        logEl.scrollTop = logEl.scrollHeight;
      };
      const settleFace = (good) => {
        if (!hasFace) return;
        setMouth(good ? MOUTH.grin : MOUTH.flat);
        if (good) { ledFlash(); blink("r"); } else { eyeRoll(); }
        gsap.delayedCall(1.1, () => setMouth(MOUTH.smirk));
      };
      const speakBubble = (label, line) => {
        setInfo({ label, line });
        gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.2, overwrite: "auto" });
      };
      function beginBrief() {
        const turn = startBrief();
        brief = turn.state;
        openAsk(true);
        renderTurn("", turn);
        speakBubble("quick brief", "six short questions. nothing is sent until you tap send.");
        settleFace(true);
      }
      const ask = (text) => {
        const query = clean(text);
        if (!query) return;
        if (inputEl) inputEl.value = "";
        // After the review, a normal question leaves the brief; only "start over" restarts it.
        if (brief && brief.step === "review" && !/^(start over|edit|restart|again|redo|cancel)$/i.test(query)) { brief = null; fillSuggestions(); }
        if (brief) {
          const turn = nextBrief(brief, query, briefCfg);
          brief = turn.state;
          renderTurn(query, turn);
          if (turn.done) speakBubble("brief ready", "that's your brief. tap WhatsApp or email to send it.");
          else if (turn.cancelled) { speakBubble("cancelled", "no problem, nothing was sent."); fillSuggestions(); }
          else if (turn.invalid) speakBubble("check that", turn.line);
          settleFace(!turn.invalid);
          return;
        }
        askCount++;
        const reply = agentAnswer(query, kb, askCount);
        renderReply(query, reply);
        speakBubble(reply.label, reply.short);
        settleFace(!reply.fallback);
      };
      const fillSuggestions = () => {
        if (!sugEl) return;
        sugEl.textContent = "";
        agentSuggestions().forEach((t) => {
          const b = document.createElement("button"); b.type = "button"; b.textContent = t;
          b.addEventListener("click", () => ask(t));
          sugEl.appendChild(b);
        });
        if (inputEl) { inputEl.placeholder = "try: what do you charge?"; inputEl.inputMode = "text"; }
      };
      function openAsk(keepContent) {
        if (!panelEl) return;
        closeMenu();
        askOpen = true;
        syncAway();
        panelEl.hidden = false;
        uiEl.classList.add("is-asking");
        if (keepContent !== true && !brief) {
          renderReply("", { line: "ask me about our work, prices, internships or how to reach us. i answer only from what's on this site.", actions: [{ type: "brief", label: "Start a quick brief" }] });
          fillSuggestions();
        }
        setTimeout(() => inputEl && inputEl.focus({ preventScroll: true }), 60);
      }
      function closeAsk() {
        if (!askOpen) return;
        askOpen = false;
        syncAway();
        panelEl.hidden = true;
        uiEl.classList.remove("is-asking");
        inputEl && inputEl.blur();
      }
      const onFormSubmit = (e) => { e.preventDefault(); ask(inputEl.value); };
      const onAskKey = (e) => {
        if (e.key === "Escape" && askOpen) { closeAsk(); return; }
        const typing = e.target?.closest?.("input,textarea,select,[contenteditable='true']");
        if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && guideLive) { e.preventDefault(); askOpen ? closeAsk() : openAsk(); }
      };
      formEl && formEl.addEventListener("submit", onFormSubmit);
      panelClose && panelClose.addEventListener("click", closeAsk);
      askBtn && askBtn.addEventListener("click", () => (askOpen ? closeAsk() : openAsk()));
      document.addEventListener("keydown", onAskKey);
      function syncUi() {
        if (!uiEl) return;
        uiEl.classList.toggle("is-live", guideLive);
        uiEl.classList.toggle("is-touch", !isDesktopFollower);
        if (!guideLive) closeAsk();
      }

      const livelinessCleanup = () => {
        clearTimeout(sleepT); clearTimeout(menuT); clearInterval(settleLean);
        clearTimeout(anticT); clearTimeout(engageT); clearTimeout(scrollEndT); clearTimeout(cursorLeanT);
        if (hasArms) gsap.killTweensOf([armL, armR]);
        document.removeEventListener("keydown", onAskKey);
        formEl && formEl.removeEventListener("submit", onFormSubmit);
        if (askOpen) closeAsk();
        ["pointerdown", "keydown", "wheel", "touchstart"].forEach((evt) => window.removeEventListener(evt, wake));
        window.removeEventListener("scroll", onScrollReact);
        window.removeEventListener("scroll", onScrollCloseMenu);
        window.removeEventListener("pointerdown", onRapid);
        document.removeEventListener("visibilitychange", onVis);
        document.removeEventListener("copy", onCopy);
        document.removeEventListener("focusin", onFocusField);
        document.removeEventListener("focusout", onBlurField);
        document.removeEventListener("click", onCtaClick, true);
        if (body) gsap.killTweensOf(body);
        guide.classList.remove("is-asleep", "is-menu", "is-engaged", "is-scrolling", "is-away", "is-hyped", "is-calm");
      };

      // --- desktop driver: cursor-follow + hover-classify (mobile drives the same brain via its own branch) ---
      if (isDesktopFollower) {
      if (hasFace) { scheduleBlink(); scheduleIdleSass(); setMouth(MOUTH.smirk, 0); }
      else { scheduleIdleSass(); }
      scheduleAntic();

      // Surfaces whose copy must stay readable: park Neo outside their rect.
      const READ_SURFACE = ".nx-rail-panel, .nx-card, .nx-client-card, article, h1, h2, h3, h4, p, li, blockquote, .nx-lab-card, .nx-pf-frame";
      const CHAR_W = 88;
      const STACK_H = 210; // face (~88) + below-bubble (~252px / 11.5px type) + gap
      const SIDE_GAP = 18;

      const onMove = (event) => {
        if (!guideLive) return;
        // Cursor speed leans him into the move and feeds his energy; he settles
        // 140ms after the cursor stops.
        const nowM = performance.now();
        if (lastMX !== null && leanTo) {
          const vx = (event.clientX - lastMX) / Math.max(8, nowM - lastMoveT);
          leanTo(clamp(vx * 10, -15, 15));
          clearTimeout(cursorLeanT); cursorLeanT = setTimeout(() => leanTo(0), 140);
          bump(Math.min(0.03, Math.abs(vx) * 0.02));
        }
        lastMX = event.clientX; lastMoveT = nowM;

        const navEl = document.querySelector(".nx-nav") || document.querySelector(".nav");
        const navBottom = navEl?.getBoundingClientRect().bottom ?? 74;
        guide.classList.toggle("is-nav-hover", event.clientY < navBottom);

        const dock = document.querySelector(".nx-finder.is-shown");
        const floorY = dock
          ? Math.min(window.innerHeight - 12, dock.getBoundingClientRect().top - 12)
          : window.innerHeight - 12;

        const hit = document.elementFromPoint(event.clientX, event.clientY);
        const surface = hit?.closest?.(READ_SURFACE);
        let x;
        let y;
        let bubbleAbove = false;

        if (surface) {
          // Park beside (or fully below/above) the read rect so avatar + bubble
          // never cover the copy under the pointer.
          const r = surface.getBoundingClientRect();
          const spaceRight = window.innerWidth - r.right - SIDE_GAP;
          const spaceLeft = r.left - SIDE_GAP;
          const midY = r.top + r.height * 0.58;

          if (spaceRight >= CHAR_W) {
            x = clamp(r.right + SIDE_GAP, 12, window.innerWidth - 100);
            charWrap.classList.toggle("is-flipped", false);
            y = clamp(midY - 40, navBottom + 16, floorY - STACK_H);
            bubbleAbove = y + STACK_H > floorY - 8;
          } else if (spaceLeft >= CHAR_W) {
            x = clamp(r.left - CHAR_W - SIDE_GAP, 12, window.innerWidth - 100);
            charWrap.classList.toggle("is-flipped", true);
            y = clamp(midY - 40, navBottom + 16, floorY - STACK_H);
            bubbleAbove = y + STACK_H > floorY - 8;
          } else if (r.bottom + SIDE_GAP + STACK_H <= floorY) {
            x = clamp(event.clientX + 80, 12, window.innerWidth - 100);
            charWrap.classList.toggle("is-flipped", x > window.innerWidth - 340);
            y = r.bottom + SIDE_GAP;
            bubbleAbove = false;
          } else {
            x = clamp(event.clientX + 80, 12, window.innerWidth - 100);
            charWrap.classList.toggle("is-flipped", x > window.innerWidth - 340);
            y = clamp(r.top - STACK_H - SIDE_GAP, navBottom + 16, floorY - STACK_H);
            bubbleAbove = true;
          }
        } else {
          // Default trail below-right of the cursor; flip above near the floor.
          x = clamp(event.clientX + 80, 12, window.innerWidth - 100);
          charWrap.classList.toggle("is-flipped", x > window.innerWidth - 340);
          const preferBelow = event.clientY + 36;
          const canSitBelow = preferBelow + STACK_H < floorY;
          bubbleAbove = !canSitBelow;
          y = canSitBelow
            ? clamp(preferBelow, navBottom + 16, floorY - STACK_H)
            : clamp(event.clientY - 110, navBottom + 96, floorY - 108);
        }

        guide.classList.toggle("is-bubble-above", bubbleAbove);
        gsap.to(charWrap, { x, y, duration: 0.2, ease: "power3.out", overwrite: "auto" });
        gsap.to(spotlight, { autoAlpha: 1, top: y + 38, duration: 0.18, overwrite: "auto" });

        // pupils watch the actual cursor → side-eye sass (never let face code break the voice)
        try {
          if (hasFace && faceSvg) {
            const fr = faceSvg.getBoundingClientRect();
            look(clamp((event.clientX - (fr.left + fr.width / 2)) / 130, -1, 1),
                 clamp((event.clientY - (fr.top + fr.height * 0.34)) / 130, -1, 1));
          }
        } catch (_) {}

        const info = classifyTarget(hit);
        if (info.key !== lastKey) {
          lastKey = info.key;
          activeInfo = info;
          setInfo(info);
          try { express(moodFor(info.key)); } catch (_) {}
          boomAt(event.clientX, event.clientY);
          bump(0.06);
          // Point at things you can act on; drop the arm for everything else.
          if (/^(cta|field|faq|intake|unbox|card|currency)/.test(info.key)) {
            pointAt(event.clientX, event.clientY);
            if (/^cta/.test(info.key) && ready("hop-hover", 900)) hop(6);
          } else armsRest();
          gsap.fromTo([bubble, tag], { autoAlpha: 0.55, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.18, overwrite: "auto" });
        }
      };
      const onLeave = () => {
        setInfo({ label: "your guide", line: "i'll hold your place. come back when you're ready." });
        setMouth(MOUTH.flat); brows(false); look(0, 0); armsRest();
      };
      // click = smug little wink + antenna flash
      const onClick = () => {
        if (!guideLive || !hasFace) return;
        blink("r"); ledFlash(); setMouth(MOUTH.grin); pump(); bump(0.12);
        gsap.delayedCall(0.5, () => setMouth(lastKey === "idle" ? MOUTH.flat : MOUTH.smirk));
      };
      const showFollower = () => {
        guideLive = true; syncUi(); greet();
        guide.classList.remove("is-offscreen");
        gsap.to(guide, { autoAlpha: 1, duration: 0.28, ease: "power2.out", overwrite: true });
        gsap.to(spotlight, { autoAlpha: 1, duration: 0.28, overwrite: true });
      };
      const hideFollower = () => {
        guideLive = false; syncUi();
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
      // Stay clear of the footer — never park over link columns.
      const footerEl = document.querySelector("footer");
      if (footerEl) {
        triggers.push(ScrollTrigger.create({
          trigger: footerEl,
          start: "top bottom-=48",
          onEnter: hideFollower,
          onLeaveBack: () => {
            if (!homeHero || window.scrollY > homeHero.offsetHeight - window.innerHeight + 80) showFollower();
          },
        }));
      }
      if (!homeHero || window.scrollY > homeHero.offsetHeight - window.innerHeight + 80) {
        showFollower();
      }
      gsap.set(charWrap, { x: window.innerWidth - 360, y: 150 });
      gsap.set([bubble, tag], { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(beacon, { width: 0 });
      gsap.set(spotlight, { autoAlpha: 0, top: 188 });
      setInfo({ label: "your guide", line: "hi, i'm neo. i'll tag along and tell you what you're looking at." });
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("click", onClick);

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("click", onClick);
        livelinessCleanup();
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
      collapseT = setTimeout(() => { if (!menuOpen) gsap.to([bubble, tag], { autoAlpha: 0, y: 8, duration: 0.3, overwrite: "auto" }); }, 3600);
    };
    // His eyes follow wherever you touch.
    let lastGaze = 0;
    const onGaze = (e) => {
      const now = performance.now();
      if (now - lastGaze < 70 || !hasFace || !guideLive || asleep) return;
      lastGaze = now;
      const r = faceSvg.getBoundingClientRect();
      look(clamp((e.clientX - (r.left + r.width / 2)) / 160, -1, 1), clamp((e.clientY - (r.top + r.height * 0.34)) / 160, -1, 1));
    };
    window.addEventListener("pointermove", onGaze, { passive: true });
    window.addEventListener("pointerdown", onGaze, { passive: true });

    /* Phase 2: breakout — guide fades in as hero-wrap scrolls out.
       Parks low in the corner (82vh) instead of mid-screen, so it stays
       out of the reading column. */
    const homeHero = guideHomeHero;
    const showScrollGuide = () => {
      guideLive = true; syncUi(); greet();
      gsap.timeline()
        .to(guide,     { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0)
        .to(charWrap,  { y: parkY(), duration: 1.2, ease: "power3.out" }, 0)
        .to(spotlight, { autoAlpha: 1, top: "82vh", duration: 1 }, 0.3);
    };
    const hideScrollGuide = () => {
      guideLive = false; syncUi();
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
    // Mobile guide sits in a fixed right rail — hide it over the footer so links stay tappable.
    const footerEl = document.querySelector("footer");
    if (footerEl) {
      triggers.push(ScrollTrigger.create({
        trigger: footerEl,
        start: "top bottom-=48",
        onEnter: hideScrollGuide,
        onLeaveBack: () => {
          if (!homeHero || homeHero.getBoundingClientRect().bottom < 80) showScrollGuide();
        },
      }));
    }

    // Mobile: keep the face alive (blink) but DON'T auto-pop the bubble on idle —
    // launcher mode means he only speaks when tapped, so reading stays clear.
    if (hasFace) { scheduleBlink(); setMouth(MOUTH.smirk, 0); }
    scheduleAntic();
    // Re-park on rotation / toolbar resize so he never sits below the fold.
    const onResize = () => { if (guideLive) gsap.set(charWrap, { y: parkY() }); };
    window.addEventListener("resize", onResize, { passive: true });
    // Seed a launcher hint as the first-tap line, but keep the bubble collapsed.
    lastKey = "idle";
    setInfo({ label: "your guide", line: "hi, i'm neo. tap me for shortcuts, or just scroll and i'll narrate." });
    if (bubble) bubble.textContent = "hi, i'm neo. tap me for shortcuts, or just scroll and i'll narrate.";
    gsap.set([bubble, tag], { autoAlpha: 0, y: 8 });

    // Section narration (premise / divisions / close) is handled by the shared
    // `narrate` system defined above — it drives both desktop and mobile, so the
    // old mobile-only "dock + travel" system was removed. The avatar simply parks
    // low (82vh) via showScrollGuide and speaks its authored line per beat.

    // Mobile: tap a page element → classify + react (touch analog of desktop hover)
    let lastTapT = 0;
    const onTapClassify = (e) => {
      if (guide.contains(e.target)) return;        // tapping HIM is handled below
      bump(0.08);
      const now = performance.now();
      if (now - lastTapT < 250) return;            // throttle
      lastTapT = now;
      if (menuOpen) closeMenu();
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
      "where to? pick one, i'll take you.",
      "you rang? i do tours, shortcuts and bad jokes.",
      "i'm a guide, not a button. but fine, here are the shortcuts.",
      "shortcuts, as requested. (tap me five times fast for a surprise.)",
      "hey. what are you after?",
    ];
    let selfIdx = 0;
    const onTapSelf = (e) => {
      e.stopPropagation();                          // don't also fire onTapClassify
      if (e.target.closest?.(".neo-guide-chips")) return;   // chip taps are theirs, not a tap on him
      selfIdx++;
      if (menuOpen) { closeMenu(); return; }
      // Tap = shortcuts menu with a rotating opener. Tap again to dismiss.
      openMenu(selfLines[selfIdx % selfLines.length]);
      if (hasFace) {
        blink("r"); ledFlash(); setMouth(MOUTH.grin); express("hype");
        gsap.delayedCall(0.5, () => setMouth(MOUTH.smirk));
      }
      hop(8); wave(); bump(0.3);
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
      livelinessCleanup();
      clearTimeout(blinkT);
      clearTimeout(idleT);
      clearTimeout(collapseT);
      clearTimeout(narrateT);
      window.removeEventListener("pointerdown", onTapClassify);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onGaze);
      window.removeEventListener("pointerdown", onGaze);
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
          <div ref={chipsRef} className="neo-guide-chips" role="menu" aria-label="Quick links"/>
          <div className="neo-guide-tuck">
            <div className="neo-guide-body" style={{ position: "relative" }}>
              <div ref={beaconRef} className="neo-guide-beacon"/>
              <NeoAvatarSVG id="neo-guide-avatar" className="neo-guide-char-svg"/>
              <div ref={tagRef} className="neo-guide-tag"/>
            </div>
          </div>
        </div>
      </div>
      <div ref={uiRef} className="neo-guide-ui">
        <div ref={panelRef} className="neo-guide-ask" role="dialog" aria-label="Ask Neo" hidden>
          <div className="neo-guide-ask-head">
            <span>Ask Neo</span>
            <button ref={panelCloseRef} type="button" aria-label="Close">&times;</button>
          </div>
          <div ref={logRef} className="neo-guide-ask-log" aria-live="polite"/>
          <div ref={sugRef} className="neo-guide-ask-sug"/>
          <form ref={formRef} className="neo-guide-ask-form" autoComplete="off">
            <label className="neo-guide-sr" htmlFor="neo-guide-q">Ask Neo a question</label>
            <input ref={inputRef} id="neo-guide-q" type="text" placeholder="try: what do you charge?" maxLength={160} enterKeyHint="send"/>
            <button type="submit">Ask</button>
          </form>
        </div>
        <div className="neo-guide-fabs">
          <button ref={askBtnRef} type="button" className="neo-guide-fab neo-guide-fab--ask" aria-label="Ask Neo a question (press /)"><span className="neo-guide-fab-ico" aria-hidden="true">?</span><span className="neo-guide-fab-txt">Ask Neo</span></button>
        </div>
      </div>
    </>
  );
}

export { NeoGuide };
