// Creativia reel engine v3 — GSAP timelines (HyperFrames-style: one paused timeline, seeked frame by frame).
// Same spec as engine 2 (scenes: hook, point, image, video, list, compare, statement, end) with "engine": 3.
// Brand: Creativia liquid glass, Rubik + Playpen Sans Arabic, Kreti. Rules: words appear one by one (never letters),
// reveals move right -> left, titles land and stay still, transitions have a cause, Instagram safe band y 62..440 on 360x640.
// Usage: node engine/reel3.js <post-id>   (FRAMES=1,2.5 renders stills only)
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');
const puppeteer = require('puppeteer');
const { kreti, mark } = require('./kreti');

const ROOT = path.join(__dirname, '..');
const FPS = 30;
const FONT_CSS = ['rubik/400', 'rubik/500', 'rubik/700', 'rubik/800', 'playpen-sans-arabic/400', 'playpen-sans-arabic/600']
  .map(f => `<link rel="stylesheet" href="file://${path.join(ROOT, 'node_modules/@fontsource', f)}.css">`).join('');
const GSAP = ['gsap.min.js', 'MorphSVGPlugin.min.js'].map(f => `<script src="file://${path.join(ROOT, 'node_modules/gsap/dist', f)}"></script>`).join('');

const THEME = {
  dark: { text: '#EFF7F1', muted: '#A3B8AB', bg1: '#0B2219', bg2: '#030806', b1: 'rgba(46,232,107,0.42)', b2: 'rgba(16,185,166,0.30)', b3: 'rgba(155,255,194,0.16)',
    glass: 'rgba(255,255,255,0.07)', rim: 'rgba(255,255,255,0.18)', glow: 'rgba(46,232,107,0.30)', accent: '#2EE86B', soft: '#9BFFC2', cut: '#0C2219', ink: '#9BFFC2', shadow: 'rgba(0,0,0,0.38)', flood: '#2EE86B' },
  light: { text: '#0B1410', muted: '#46594D', bg1: '#E2F6E9', bg2: '#F8FCF9', b1: 'rgba(46,232,107,0.40)', b2: 'rgba(16,185,166,0.22)', b3: 'rgba(255,226,130,0.45)',
    glass: 'rgba(255,255,255,0.45)', rim: 'rgba(255,255,255,0.95)', glow: 'rgba(46,232,107,0.22)', accent: '#16A34A', soft: '#1F6B49', cut: '#E6F7EC', ink: '#1F6B49', shadow: 'rgba(20,60,40,0.18)', flood: '#9BFFC2' }
};

async function toDataUri(src) {
  const local = path.join(ROOT, src);
  if (!/^https?:/.test(src) && fs.existsSync(local)) {
    const ext = path.extname(local).slice(1).toLowerCase();
    return `data:image/${ext === 'jpg' ? 'jpeg' : ext === 'svg' ? 'svg+xml' : ext};base64,${fs.readFileSync(local).toString('base64')}`;
  }
  const res = await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/126', 'Referer': new URL(src).origin + '/' } });
  if (!res.ok) throw new Error(`Image download failed (${res.status}): ${src}`);
  return `data:${(res.headers.get('content-type') || 'image/jpeg').split(';')[0]};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
}

// ---------------- page script ----------------
const PAGE = String.raw`
const D = window.REEL, C = D.theme;
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cred = x => esc(x).replace(/@[A-Za-z0-9._]+/g, m => '⁦' + m + '⁩');
const W = 360, H = 640;
const CUES = [];               // [time, role, volume]
const cue = (t, role, vol) => CUES.push([Math.round(t * 1000) / 1000, role, vol]);
const stage = document.getElementById('stage');
const el = (tag, cls, html, style) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (style) e.style.cssText = style; return e; };
const words = (text, cls) => {
  const toks = esc(text).split(' ').filter(Boolean), out = [];
  const latin = w => /^[A-Za-z0-9.%$+#&:/'-]+$/.test(w);
  for (let i = 0; i < toks.length; i++) {
    if (latin(toks[i])) { let j = i; while (j + 1 < toks.length && latin(toks[j + 1])) j++; out.push('<span class="w ' + (cls || '') + '" dir="ltr" style="unicode-bidi:isolate">' + toks.slice(i, j + 1).join(' ') + '</span>'); i = j; }
    else out.push('<span class="w ' + (cls || '') + '">' + toks[i] + '</span>');
  }
  return out.join(' ');
};

// ---------- persistent layers ----------
const bg = el('div', 'layer', '', 'background:radial-gradient(120% 90% at 70% 10%,' + C.bg1 + ',' + C.bg2 + ')');
const blobs = [[C.b1, 560, 260, 120], [C.b2, 520, 60, 470], [C.b3, 380, 300, 560]].map(([c, s, x, y]) => el('div', 'blob', '', 'width:' + s + 'px;height:' + s + 'px;left:' + (x - s / 2) + 'px;top:' + (y - s / 2) + 'px;background:radial-gradient(circle,' + c + ' 0%,rgba(0,0,0,0) 66%)'));
blobs.forEach(b => bg.appendChild(b));
const ring = el('div', 'ring', '', 'border-color:' + C.b3); bg.appendChild(ring);
bg.appendChild(el('div', 'layer', '', 'opacity:0.07;background-image:url(' + D.grain + ');background-size:180px'));
const flood = el('div', 'layer', '', 'background:' + C.flood + ';opacity:0;mix-blend-mode:soft-light');
stage.appendChild(bg); stage.appendChild(flood);
const cam = el('div', 'layer cam'); stage.appendChild(cam);
const hero = el('div', 'glass hero', '<div class="rim"></div><div class="sheen"></div>'); cam.appendChild(hero);
const header = el('div', 'header', '<span class="badge"><i></i>' + esc(D.badge || 'كريتيفيا') + '</span><span class="mk">' + D.mark + '</span>');
stage.appendChild(header);

// ---------- scene builders: each returns {root, card:{x,y,w,h,r}|null, build(tl, t0, dur)} ----------
function sceneRoot() { const r = el('section', 'scene'); cam.appendChild(r); return r; }
function cardBox(r, rect, inner) {
  const c = el('div', 'card', inner, 'left:' + rect.x + 'px;top:' + rect.y + 'px;width:' + rect.w + 'px;height:' + rect.h + 'px;border-radius:' + rect.r + 'px');
  r.appendChild(c); return c;
}
function wordsIn(tl, scope, at, stagger) {
  const ws = scope.querySelectorAll('.w');
  if (!ws.length) return at;
  tl.fromTo(ws, { opacity: 0, x: 14, filter: 'blur(6px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.42, ease: 'expo.out', stagger: stagger || 0.08 }, at);
  return at + ws.length * (stagger || 0.08) + 0.42;
}
function kretiEl(r, pose, size, x, y) {
  const k = el('div', 'kreti', D.kreti[pose].replace(/width="\d+" height="\d+"/, 'width="' + size + '" height="' + size + '"'), 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px');
  r.appendChild(k); return k;
}
function kretiIn(tl, k, at, dur) {
  tl.fromTo(k, { scale: 0.2, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'elastic.out(1,0.6)' }, at);
  tl.to(k, { y: -5, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor((dur - at - 0.8) / 0.9)) }, at + 0.7); // acting, not a title loop
}
function sparkle(r, x, y, s) {
  return r.appendChild(el('div', 'spark', '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24"><path fill="' + C.soft + '" d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"/></svg>', 'left:' + x + 'px;top:' + y + 'px'));
}
function sparkIn(tl, s, at) { tl.fromTo(s, { scale: 0, rotate: -90, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, at); }
function chip(r, text, x, y, right) {
  return r.appendChild(el('div', 'chip', '✦ ' + esc(text), 'top:' + y + 'px;' + (right ? 'right:' : 'left:') + x + 'px'));
}
function media(src, fit) { return '<div class="kb"><img src="' + src + '" style="object-fit:' + (fit || 'cover') + '"></div>'; }

const B = {
  hook(s) {
    const r = sceneRoot();
    r.appendChild(el('div', 'title hook-t', words(s.title), 'top:150px;font-size:' + (s.size || 38) + 'px'));
    if (s.sub) r.appendChild(el('div', 'sub', words(s.sub), 'top:' + (s.subTop || 300) + 'px;text-align:center'));
    const pill = s.pill ? { x: 50, y: 340, w: 260, h: 56, r: 28 } : null;
    let pc; if (pill) pc = cardBox(r, pill, '<div class="pill-in"><i></i><span dir="ltr">' + esc(s.pill) + '</span></div>');
    const k = kretiEl(r, s.pose || 'point', 92, 24, 66);
    const sp = [sparkle(r, 292, 98, 18), sparkle(r, 40, 300, 12)];
    return { root: r, card: pill, build(tl, t0, dur) {
      // frame 0 is the thumbnail: the title is already there; we only light the accent word and bring the rest in
      const first = t0 === 0;
      if (!first) wordsIn(tl, r.querySelector('.hook-t'), t0 + 0.1, 0.09);
      const ws = r.querySelectorAll('.hook-t .w');
      if (ws.length) tl.fromTo(ws[ws.length - 1], { color: C.text }, { color: C.accent, duration: 0.4, ease: 'power2.out' }, t0 + (first ? 0.5 : 0.9));
      kretiIn(tl, k, t0 + 0.35, dur);
      sp.forEach((x, i) => sparkIn(tl, x, t0 + 0.8 + i * 0.3));
      if (s.sub) wordsIn(tl, r.querySelector('.sub'), t0 + 1.0, 0.07);
      if (pill) { tl.fromTo(pc, { scaleX: 0.15, opacity: 0, filter: 'blur(10px)' }, { scaleX: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'expo.out' }, t0 + 1.3); tl.fromTo(hero, { opacity: 0, scaleX: 0.15 }, { opacity: 1, scaleX: 1, duration: 0.55, ease: 'expo.out' }, t0 + 1.3); cue(t0 + 1.34, 'pop', 0.55); }
    } };
  },
  image(s) {
    const r = sceneRoot(); const rect = { x: 24, y: 96, w: 312, h: s.tall ? 270 : 232, r: 28 };
    const c = cardBox(r, rect, media(s.image, s.fit));
    if (s.chip) chip(r, s.chip, 36, 108, true);
    const ty = rect.y + rect.h + 16;
    r.appendChild(el('div', 'title', words(s.title || ''), 'top:' + ty + 'px;font-size:' + (s.size || 24) + 'px'));
    if (s.credit) r.appendChild(el('div', 'credit', cred(s.credit), 'top:' + (ty + 70) + 'px'));
    return { root: r, card: rect, build(tl, t0, dur) {
      tl.fromTo(c.querySelector('.kb'), { scale: 1.12 }, { scale: 1.02, duration: dur, ease: 'none' }, t0);
      wordsIn(tl, r.querySelector('.title'), t0 + 0.35, 0.09);
      if (s.chip) { tl.fromTo(r.querySelector('.chip'), { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, t0 + 0.5); cue(t0 + 0.53, 'pop', 0.4); }
      if (s.credit) tl.fromTo(r.querySelector('.credit'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, t0 + 0.9);
    } };
  },
  video(s) {
    const r = sceneRoot(); const rect = { x: 24, y: 96, w: 312, h: s.tall ? 270 : 232, r: 28 };
    const c = cardBox(r, rect, '<div class="kb"><img class="vf" data-dir="' + s.frameDir + '" data-n="' + s.frames + '" style="object-fit:' + (s.fit || 'cover') + '"></div><div class="vtag">▶</div>');
    const ty = rect.y + rect.h + 16;
    r.appendChild(el('div', 'title', words(s.title || ''), 'top:' + ty + 'px;font-size:' + (s.size || 24) + 'px'));
    if (s.credit) r.appendChild(el('div', 'credit', cred(s.credit), 'top:' + (ty + 70) + 'px'));
    return { root: r, card: rect, video: { img: c.querySelector('.vf'), t0: 0 }, build(tl, t0, dur) {
      this.video.t0 = t0;
      wordsIn(tl, r.querySelector('.title'), t0 + 0.35, 0.09);
      if (s.credit) tl.fromTo(r.querySelector('.credit'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, t0 + 0.9);
    } };
  },
  point(s) {
    const r = sceneRoot(); const rect = s.image ? { x: 24, y: 96, w: 312, h: 210, r: 28 } : { x: 24, y: 100, w: 312, h: 180, r: 30 };
    let inner = s.image ? media(s.image, s.fit) : '<div class="num"><span dir="ltr">' + esc(s.num) + '</span></div>';
    const c = cardBox(r, rect, inner);
    if (s.image && s.num) c.appendChild(el('div', 'num-s', '<span dir="ltr">' + esc(s.num) + '</span>'));
    const k = s.kreti && !s.image ? kretiEl(r, s.kreti, 88, 40, 146) : null;
    const ty = rect.y + rect.h + 18;
    r.appendChild(el('div', 'title', words(s.title), 'top:' + ty + 'px;font-size:' + (s.size || 26) + 'px'));
    if (s.body) r.appendChild(el('div', 'body', words(s.body), 'top:' + (ty + 44) + 'px'));
    if (s.credit) r.appendChild(el('div', 'credit', cred(s.credit), 'top:' + (rect.y + rect.h - 2) + 'px;color:#fff;opacity:0.85;padding:0 14px;transform:translateY(-18px);text-shadow:0 1px 6px #000'));
    return { root: r, card: rect, build(tl, t0, dur) {
      const n = c.querySelector('.num') || c.querySelector('.num-s');
      if (n) { tl.fromTo(n, { scale: 0.4, rotate: -12, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, t0 + 0.25); cue(t0 + 0.29, 'pop', 0.55); }
      if (s.image) tl.fromTo(c.querySelector('.kb'), { scale: 1.1 }, { scale: 1.02, duration: dur, ease: 'none' }, t0);
      if (k) kretiIn(tl, k, t0 + 0.6, dur);
      const e = wordsIn(tl, r.querySelector('.title'), t0 + 0.4, 0.09);
      if (s.body) wordsIn(tl, r.querySelector('.body'), e - 0.2, 0.05);
    } };
  },
  list(s) {
    const r = sceneRoot(); const pts = (s.points || []).slice(0, 4);
    const rect = { x: 24, y: 176, w: 312, h: 56, r: 18 };
    if (s.tag) chip(r, s.tag, 26, 92, true);
    r.appendChild(el('div', 'title', words(s.title), 'top:' + (s.tag ? 126 : 104) + 'px;font-size:' + (s.size || 25) + 'px'));
    const rows = pts.map((p, i) => cardBox(r, { x: 24, y: 176 + i * 64, w: 312, h: 56, r: 18 }, '<div class="row"><span class="rn" dir="ltr">' + (i + 1) + '</span><span>' + esc(p) + '</span></div>'));
    const k = s.kreti ? kretiEl(r, s.kreti, 58, 20, Math.min(384, 176 + pts.length * 64)) : null;
    return { root: r, card: rect, build(tl, t0, dur) {
      if (s.tag) tl.fromTo(r.querySelector('.chip'), { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, t0 + 0.05);
      wordsIn(tl, r.querySelector('.title'), t0 + 0.15, 0.08);
      rows.forEach((row, i) => { const at = t0 + 0.55 + i * 0.32; tl.fromTo(row, { x: 90, opacity: 0, filter: 'blur(8px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'expo.out' }, at); cue(at + 0.04, i % 2 ? 'tick' : 'pop', 0.35); });
      if (k) kretiIn(tl, k, t0 + 0.6 + pts.length * 0.32, dur);
    } };
  },
  compare(s) {
    const r = sceneRoot();
    r.appendChild(el('div', 'title', words(s.title), 'top:96px;font-size:' + (s.size || 24) + 'px'));
    const box = (o, good, y) => cardBox(r, { x: 24, y, w: 312, h: 118, r: 22 }, '<div class="cmp"><div class="cmp-h"><span class="dot" style="background:' + (good ? '#2EE86B' : '#FF6B6B') + '">' + (good ? '✓' : '✕') + '</span>' + esc(o.label) + '</div><div class="cmp-b">' + esc(o.text) + '</div></div>');
    const a = box(s.bad, false, 160), b = box(s.good, true, 290);
    return { root: r, card: { x: 24, y: 160, w: 312, h: 118, r: 22 }, build(tl, t0) {
      wordsIn(tl, r.querySelector('.title'), t0 + 0.1, 0.08);
      tl.fromTo(a, { x: 90, opacity: 0, filter: 'blur(8px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, t0 + 0.5); cue(t0 + 0.54, 'pop', 0.4);
      tl.fromTo(b, { x: 90, opacity: 0, filter: 'blur(8px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, t0 + 1.3); cue(t0 + 1.34, 'pop', 0.45);
    } };
  },
  statement(s) {
    const r = sceneRoot();
    r.appendChild(el('div', 'title big', words(s.text), 'top:' + (s.top || 170) + 'px;font-size:' + (s.size || 40) + 'px;text-align:center'));
    if (s.sub) r.appendChild(el('div', 'sub', words(s.sub), 'top:360px;text-align:center'));
    const sp = [sparkle(r, 290, 140, 18), sparkle(r, 50, 330, 13)];
    return { root: r, card: null, payoff: true, build(tl, t0, dur) {
      const ws = r.querySelectorAll('.big .w');
      cue(Math.max(0, t0 - 0.2), 'riser', 0.3);
      tl.fromTo(ws, { opacity: 0, scale: 1.7, filter: 'blur(12px)', x: 26 }, { opacity: 1, scale: 1, filter: 'blur(0px)', x: 0, duration: 0.6, ease: 'expo.out', stagger: 0.14 }, t0 + 0.25);
      cue(t0 + 0.27 + (ws.length - 1) * 0.14, 'impact', 0.6);
      tl.fromTo(cam, { scale: 1.0 }, { scale: 1.04, duration: 0.5, ease: 'power2.out' }, t0 + 0.25 + ws.length * 0.14);   // punch-in on the payoff
      tl.to(cam, { scale: 1.0, duration: 0.4, ease: 'power2.inOut' }, t0 + dur - 0.45);
      sp.forEach((x, i) => sparkIn(tl, x, t0 + 0.6 + i * 0.25));
      if (s.sub) wordsIn(tl, r.querySelector('.sub'), t0 + 0.6 + ws.length * 0.14, 0.07);
    } };
  },
  end(s) {
    const r = sceneRoot(); const rect = { x: 50, y: 282, w: 260, h: 58, r: 29 };
    const k = kretiEl(r, 'wave', 150, 105, 104);
    const pc = cardBox(r, rect, '<div class="pill-in big">تابع كريتيفيا</div>');
    r.appendChild(el('div', 'handle', '<span dir="ltr">@creativia.mag</span>', 'top:354px'));
    r.appendChild(el('div', 'hand', esc(s.note || 'كل يوم شي مبدع، الساعة 9 بالليل'), 'top:388px'));
    const sp = [sparkle(r, 70, 120, 18), sparkle(r, 282, 240, 14)];
    return { root: r, card: rect, build(tl, t0, dur) {
      kretiIn(tl, k, t0 + 0.1, dur);
      tl.fromTo(pc.firstChild, { opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.4 }, t0 + 0.55); cue(t0 + 0.6, 'shimmer', 0.35);
      tl.fromTo(r.querySelector('.handle'), { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, t0 + 0.8);
      tl.fromTo(r.querySelector('.hand'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.8, ease: 'power2.out' }, t0 + 1.1);
      sp.forEach((x, i) => sparkIn(tl, x, t0 + 0.5 + i * 0.3));
    } };
  }
};

// ---------- master timeline ----------
const master = gsap.timeline({ paused: true });
let t = 0; const built = [];
D.scenes.forEach((s, k) => { const b = B[s.type](s); b.root.style.opacity = 0; built.push({ s, b, t0: t }); t += s.dur; });
const TOTAL = t;
// background: slow orbit (the world moves, the titles do not)
blobs.forEach((b, i) => master.to(b, { x: [40, -40, 30][i], y: [30, 35, -25][i], duration: TOTAL, ease: 'sine.inOut' }, 0));
master.to(ring, { rotate: TOTAL * 4, duration: TOTAL, ease: 'none' }, 0);
master.to(hero.querySelector('.rim'), { '--a': TOTAL * 60 + 'deg', duration: TOTAL, ease: 'none' }, 0);
master.fromTo(hero.querySelector('.sheen'), { xPercent: -160 }, { xPercent: 260, duration: 3.2, ease: 'power1.inOut', repeat: Math.floor(TOTAL / 3.2) }, 0.6);


const KINDS = ['morph', 'whip', 'zoom', 'blur', 'flood'];
let kIdx = 0;
built.forEach(({ s, b, t0 }, k) => {
  const prev = built[k - 1];
  const kind = k === 0 ? 'none' : (s.transition || (prev.b.card && b.card ? (kIdx++ % 2 ? KINDS[1 + (kIdx % 4)] : 'morph') : KINDS[1 + (kIdx++ % 4)]));
  b.kind = kind;
  // hero glass follows the scene's card
  if (b.card) {
    if (k === 0) Object.assign(hero.style, { left: b.card.x + 'px', top: b.card.y + 'px', width: b.card.w + 'px', height: b.card.h + 'px', borderRadius: b.card.r + 'px' });
    else if (!prev.b.card) master.set(hero, { left: b.card.x, top: b.card.y, width: b.card.w, height: b.card.h, borderRadius: b.card.r, opacity: 0 }, t0);
    if (kind === 'morph') {
      master.to(hero, { left: b.card.x, top: b.card.y, width: b.card.w, height: b.card.h, borderRadius: b.card.r, opacity: 1, duration: 0.6, ease: 'power3.inOut' }, t0 - 0.15);
      master.fromTo(hero, { filter: 'blur(0px)' }, { filter: 'blur(4px)', duration: 0.3, ease: 'power2.in', yoyo: true, repeat: 1 }, t0 - 0.15);
    } else if (k > 0) master.to(hero, { opacity: 1, duration: 0.3 }, t0 + 0.1);
  } else master.to(hero, { opacity: 0, duration: 0.25, ease: 'power2.in' }, t0 - 0.1);
  // entrance of the scene root
  const R = b.root;
  if (kind === 'none') { R.style.opacity = 1; if (b.card && s.type !== 'hook') hero.style.opacity = 1; }
  else if (kind === 'morph') { master.fromTo(R, { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out' }, t0 + 0.08); cue(t0 - 0.12, 'whoosh-soft', 0.4); }
  else if (kind === 'whip') { master.fromTo(R, { opacity: 0, x: 70, filter: 'blur(14px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.38, ease: 'expo.out' }, t0); cue(t0 - 0.02, 'whip', 0.5); }
  else if (kind === 'zoom') { master.fromTo(R, { opacity: 0, scale: 1.18, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.55, ease: 'expo.out' }, t0); cue(t0 - 0.2, 'whoosh', 0.5); }
  else if (kind === 'flood') { master.fromTo(flood, { opacity: 0 }, { opacity: 0.55, duration: 0.2, ease: 'power2.in', yoyo: true, repeat: 1 }, t0 - 0.2); master.fromTo(R, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t0 + 0.05); cue(t0 - 0.15, 'whoosh', 0.45); }
  else { master.fromTo(R, { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.18 }, t0 + 0.02); cue(t0, 'whoosh-soft', 0.35); }
  // exit (shorter than the entrance), matched to the next transition
  const next = built[k + 1];
  if (next) {
    const nk = next.s.transition || '';
    const te = t0 + s.dur;
    if (nk === 'whip' || (!nk && !(b.card && next.b.card))) master.to(R, { opacity: 0, x: -70, filter: 'blur(14px)', duration: 0.24, ease: 'power3.in' }, te - 0.24);
    else if (nk === 'zoom') master.to(R, { opacity: 0, scale: 0.9, filter: 'blur(8px)', duration: 0.3, ease: 'power3.in' }, te - 0.3);
    else master.to(R, { opacity: 0, filter: 'blur(8px)', duration: 0.18, ease: 'power2.in' }, te - 0.16);
  }
  b.build(master, t0, s.dur);
});
master.set({}, {}, TOTAL);

window.TOTAL = TOTAL;
window.CUES = CUES;
const videos = built.filter(x => x.b.video).map(x => x.b.video);
window.drawFrame = function (time) {
  master.seek(time, false);
  for (const v of videos) {
    const n = Math.min(+v.img.dataset.n - 1, Math.max(0, Math.floor((time - v.t0) * 30)));
    const src = v.img.dataset.dir + '/f' + String(n + 1).padStart(4, '0') + '.jpg';
    if (v.img.getAttribute('src') !== src) v.img.setAttribute('src', src);
  }
};
`;

const CSS = (C) => `
body{margin:0;background:#000}
#stage{position:relative;width:360px;height:640px;overflow:hidden;font-family:'Rubik',sans-serif;color:${C.text};direction:rtl}
.layer{position:absolute;inset:0}
.blob{position:absolute}
.ring{position:absolute;left:-140px;top:-330px;width:640px;height:640px;border-radius:50%;border:26px solid;filter:blur(26px)}
.cam{transform-origin:50% 45%}
.scene{position:absolute;inset:0}
.header{position:absolute;top:62px;right:22px;left:22px;display:flex;justify-content:space-between;align-items:center;z-index:5}
.badge{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:${C.muted}}
.badge i{width:7px;height:7px;border-radius:50%;background:${C.accent};box-shadow:0 0 8px ${C.accent}}
.glass,.card{position:absolute;overflow:hidden;background:linear-gradient(160deg,rgba(255,255,255,0.16),${C.glass} 45%,rgba(255,255,255,0.04));backdrop-filter:blur(16px) saturate(150%);box-shadow:inset 0 1px 0 rgba(255,255,255,0.35),inset 0 -24px 40px ${C.glow},0 0 44px ${C.glow},0 24px 50px ${C.shadow}}
.hero{--a:0deg;opacity:0}
.rim{position:absolute;inset:0;border-radius:inherit;padding:1.5px;background:conic-gradient(from var(--a),${C.rim},rgba(255,255,255,0.05) 25%,${C.soft} 50%,rgba(255,255,255,0.05) 75%,${C.rim});-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.sheen{position:absolute;top:0;bottom:0;width:45%;background:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,0.12) 50%,rgba(255,255,255,0) 70%)}
.card{border:1.5px solid ${C.rim}}
.kb{position:absolute;inset:0}.kb img{width:100%;height:100%;display:block}
.vtag{position:absolute;left:10px;top:10px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,0.5);color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center}
.title{position:absolute;right:26px;left:26px;font-weight:800;line-height:1.28}
.sub,.body{position:absolute;right:26px;left:26px;font-size:16px;line-height:1.6;color:${C.muted}}
.credit{position:absolute;right:26px;left:26px;font-size:11.5px;color:${C.muted}}
.w{display:inline-block}
.chip{position:absolute;padding:6px 12px;border-radius:999px;background:${C.glass};border:1px solid ${C.rim};backdrop-filter:blur(10px);font-size:12.5px;font-weight:700;color:${C.ink};z-index:3}
.kreti{position:absolute;filter:drop-shadow(0 16px 26px rgba(0,0,0,0.35));z-index:4}
.spark{position:absolute;filter:drop-shadow(0 0 6px ${C.accent});z-index:4}
.pill-in{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px;font-size:22px;font-weight:800}
.pill-in i{width:10px;height:10px;border-radius:50%;background:${C.accent};box-shadow:0 0 10px ${C.accent}}
.num{position:absolute;right:26px;top:26px;width:128px;height:128px;border-radius:38px;background:linear-gradient(145deg,#9BFFC2,#2EE86B 50%,#10B9A6);box-shadow:0 0 40px rgba(46,232,107,0.55);display:flex;align-items:center;justify-content:center;font-size:70px;font-weight:800;color:#0B1410}
.num-s{position:absolute;right:12px;top:12px;width:42px;height:42px;border-radius:14px;background:${C.accent};color:#0B1410;font-weight:800;font-size:22px;display:flex;align-items:center;justify-content:center}
.row{position:absolute;inset:0;display:flex;align-items:center;gap:12px;padding:0 14px;font-size:15.5px}
.rn{flex:none;width:32px;height:32px;border-radius:11px;background:${C.accent};color:#0B1410;font-weight:800;display:flex;align-items:center;justify-content:center}
.cmp{position:absolute;inset:0;padding:14px 16px}.cmp-h{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:800;margin-bottom:6px}
.dot{width:28px;height:28px;border-radius:50%;color:#0B1410;font-weight:800;display:flex;align-items:center;justify-content:center}
.cmp-b{font-size:15px;line-height:1.55;color:${C.muted}}
.handle{position:absolute;left:0;right:0;text-align:center;font-size:16px;font-weight:700;color:${C.muted}}
.hand{position:absolute;left:20px;right:20px;text-align:center;font-family:'Playpen Sans Arabic',sans-serif;font-size:16.5px;color:${C.ink}}
.big .w{transform-origin:50% 60%}
`;

// sound library: generated takes (assets/sfx2) first, then the Pixabay library (assets/sfx); roles mapped
function sfxLib() {
  const lib = [];
  const a = path.join(ROOT, 'assets/sfx2/library.json'), b = path.join(ROOT, 'assets/sfx/library.json');
  if (fs.existsSync(a)) for (const x of JSON.parse(fs.readFileSync(a, 'utf8')).tracks) lib.push({ ...x, dir: 'assets/sfx2' });
  const map = { whoosh: 'whoosh', 'soft-impact': 'impact', pop: 'pop', click: 'click', typing: 'tick', sparkle: 'shimmer', riser: 'riser', ding: 'shimmer', notification: 'pop', camera: 'camera', ui: 'pop' };
  if (fs.existsSync(b)) for (const x of JSON.parse(fs.readFileSync(b, 'utf8')).tracks) lib.push({ ...x, role: map[x.role] || x.role, dir: 'assets/sfx', fallback: true });
  return lib;
}
function sfxPlan(cues) {
  const lib = sfxLib(); const used = {};
  const pick = role => {
    const alias = { 'whoosh-soft': ['whoosh-soft', 'whoosh'], whip: ['whip', 'whoosh'], tick: ['tick', 'click', 'pop'], shimmer: ['shimmer'], impact: ['impact'], riser: ['riser'] }[role] || [role];
    for (const r of alias) {
      let c = lib.filter(x => x.role === r && !x.fallback); if (!c.length) c = lib.filter(x => x.role === r);
      if (c.length) { used[r] = (used[r] || 0) + 1; return c[used[r] % c.length]; }   // rotate takes
    }
    return null;
  };
  const out = [];
  for (const [t, role, vol] of cues.sort((a, b) => a[0] - b[0])) {
    const f = pick(role); if (!f) continue;
    const start = Math.max(0, t + 1 / FPS - (f.peak != null ? f.peak : f.onset || 0));   // the hit lands one frame after the picture
    if (out.length && start - out[out.length - 1].t < 0.12) continue;
    out.push({ t: start, file: path.join(ROOT, f.dir, f.file), vol, max: Math.min(f.duration, role === 'riser' ? 4 : 2.2) });
  }
  return out;
}

(async () => {
  const id = process.argv[2];
  if (!id) throw new Error('usage: node engine/reel3.js <post-id>');
  const dir = path.join(ROOT, 'posts', id);
  const spec = JSON.parse(fs.readFileSync(path.join(dir, 'reel.json'), 'utf8'));
  const mode = spec.mode || 'dark';
  const theme = THEME[mode];
  for (const sc of spec.scenes) if (sc.image) sc.image = await toDataUri(sc.image);
  // voice: scenes stretch to their line
  const VLEAD = 0.35;
  const vjson = path.join(dir, 'voice', 'voice.json');
  const voice = spec.voice && fs.existsSync(vjson) ? JSON.parse(fs.readFileSync(vjson, 'utf8')).clips : [];
  for (const c of voice) { const sc = spec.scenes[c.scene]; sc.dur = Math.max(sc.dur || 0, Math.round((c.dur + VLEAD + 0.55) * 100) / 100); }
  // video scenes: frames at 30 fps
  const tmp = path.join(__dirname, '_tmp'); fs.mkdirSync(tmp, { recursive: true });
  const tmpv = path.join(tmp, 'v3-' + id); fs.mkdirSync(tmpv, { recursive: true });
  for (let k = 0; k < spec.scenes.length; k++) {
    const sc = spec.scenes[k]; if (sc.type !== 'video') continue;
    const src = path.join(tmpv, 'src' + k + '.mp4');
    if (!fs.existsSync(src)) {
      if (/^https?:/.test(sc.video)) {
        const res = await fetch(sc.video, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/126', 'Referer': new URL(sc.video).origin + '/' } });
        if (!res.ok) throw new Error(`Video download failed (${res.status}): ${sc.video}`);
        fs.writeFileSync(src, Buffer.from(await res.arrayBuffer()));
      } else fs.copyFileSync(path.join(ROOT, sc.video), src);
    }
    const fdir = path.join(tmpv, 'v' + k); fs.rmSync(fdir, { recursive: true, force: true }); fs.mkdirSync(fdir);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(sc.start || 0), '-i', src, '-t', String(sc.dur + 0.6), '-an', '-vf', 'fps=30,scale=960:-2', '-q:v', '3', path.join(fdir, 'f%04d.jpg')]);
    sc.frames = fs.readdirSync(fdir).filter(f => f.endsWith('.jpg')).length;
    if (!sc.frames) throw new Error('No frames extracted from ' + sc.video);
    sc.frameDir = 'file://' + fdir;
  }
  const poses = {};
  for (const p of ['wave', 'point', 'jump', 'think']) poses[p] = kreti({ pose: p, size: 240, mode, cut: theme.cut, look: 'dream' });
  const grain = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0"/></filter><rect width="180" height="180" filter="url(#n)"/></svg>').toString('base64');
  const data = { ...spec, theme, kreti: poses, mark: mark({ size: 24 }), grain };
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">${FONT_CSS}<style>${CSS(theme)}</style></head>
<body><div id="stage"></div>${GSAP}<script>gsap.registerPlugin(MorphSVGPlugin);window.REEL=${JSON.stringify(data)};</script><script>${PAGE}</script></body></html>`;
  const f = path.join(tmp, 'reel3.html'); fs.writeFileSync(f, html);

  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3 });
  await page.goto('file://' + f, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  const total = await page.evaluate('window.TOTAL');
  const el = await page.$('#stage');
  const settle = () => page.evaluate(() => Promise.all([...document.images].map(im => im.complete ? 0 : im.decode().catch(() => 0))));
  if (process.env.FRAMES) {
    for (const s of process.env.FRAMES.split(',').map(Number)) { await page.evaluate(x => window.drawFrame(x), s); await settle(); await el.screenshot({ path: path.join(tmp, `v3-${s}.jpg`), type: 'jpeg', quality: 85 }); }
    console.log('total', total, 'cues', JSON.stringify(await page.evaluate('window.CUES')));
    await browser.close(); return;
  }
  const silent = path.join(tmp, 'v3-silent.mp4');
  const frames = Math.round(total * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    await page.evaluate(x => window.drawFrame(x), i / FPS);
    await settle();
    const buf = await el.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log('frame', i, '/', frames);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
  await page.evaluate(x => window.drawFrame(x), spec.coverAt || 0);   // frame 0 is the hook
  await settle();
  await el.screenshot({ path: path.join(dir, 'reel-cover.jpg'), type: 'jpeg', quality: 92 });
  const cuesRaw = await page.evaluate('window.CUES');
  await browser.close();

  // ---- audio: music bed (ducked under voice, ~0.14 there), voice, effects 3-6 dB over the bed ----
  const cues = sfxPlan(cuesRaw);
  const music = spec.music ? path.join(ROOT, spec.music) : null;
  const starts = []; { let a = 0; for (const sc of spec.scenes) { starts.push(a); a += sc.dur; } }
  const args = ['-y', '-loglevel', 'error', '-i', silent];
  const parts = [], fx = [], vo = [];
  let idx = 1, mus = null;
  if (music) {
    args.push('-ss', String(spec.musicStart || 0), '-i', music);
    parts.push(`[${idx}:a]atrim=0:${total},asetpts=PTS-STARTPTS,volume=${spec.musicVolume || (voice.length ? 0.32 : 0.55)},afade=t=in:d=0.4,afade=t=out:st=${(total - 1.6).toFixed(2)}:d=1.6[m]`);
    mus = '[m]'; idx++;
  }
  for (const c of voice) {
    args.push('-i', path.join(dir, 'voice', c.file));
    const ms = Math.round((starts[c.scene] + VLEAD) * 1000);
    parts.push(`[${idx}:a]adelay=${ms}|${ms}[v${idx}]`); vo.push(`[v${idx}]`); idx++;
  }
  for (const c of cues) {
    args.push('-i', c.file);
    const ms = Math.round(c.t * 1000);
    parts.push(`[${idx}:a]atrim=0:${c.max},afade=t=out:st=${Math.max(0, c.max - 0.25).toFixed(2)}:d=0.25,volume=${(voice.length ? c.vol * 0.8 : c.vol).toFixed(2)},adelay=${ms}|${ms}[s${idx}]`);
    fx.push(`[s${idx}]`); idx++;
  }
  const layers = [];
  if (vo.length) {
    parts.push(`${vo.join('')}amix=inputs=${vo.length}:normalize=0,apad,atrim=0:${total}${mus ? ',asplit=2[vo][sc]' : '[vo]'}`);
    if (mus) { parts.push(`${mus}[sc]sidechaincompress=threshold=0.025:ratio=10:attack=15:release=450[md]`); layers.push('[md]'); }
    layers.push('[vo]');
  } else if (mus) layers.push(mus);
  layers.push(...fx);
  const out = path.join(dir, 'reel.mp4');
  if (layers.length) {
    parts.push(`${layers.join('')}amix=inputs=${layers.length}:normalize=0,apad,atrim=0:${total},alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=11[a]`);
    args.push('-filter_complex', parts.join(';'), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-movflags', '+faststart', out);
  } else args.push('-c', 'copy', out);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  fs.writeFileSync(path.join(dir, 'reel-rendered.json'), JSON.stringify({ file: `posts/${id}/reel.mp4`, engine: 3, seconds: total, voice: voice.length, sfx: cues.length, renderedAt: new Date().toISOString() }, null, 2));
  console.log('reel v3 done', id, total.toFixed(2) + 's', cues.length, 'sfx');
})().catch(e => { console.error(e); process.exit(1); });
