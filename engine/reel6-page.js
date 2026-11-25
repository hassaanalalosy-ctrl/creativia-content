// Engine 6 toolkit ("DIRECTED"). Each reel writes its own beats in posts/<id>/scenes.js using these helpers.
// Brand constants (from the brand review, Nov 23 2026): deep green → black ground, white for reading, mint #9BFFC2 for
// secondary info and drawn marks, accent green #2EE86B ONLY for the one keyword per idea; Rubik; logo + badge fixed;
// signature devices: KASHIDA stroke (green line drawn right→left under a hero word), EDITOR'S NOTE (hand-drawn mint
// circle/underline + Playpen note), CROP MARKS around what matters. Text never in the bottom ~20% or under the right
// buttons; nothing glued to the badge (y ≥ 104). Layout, camera and transitions change every beat.
module.exports.PAGE = String.raw`
const D = window.REEL, C = D.theme, VW = 360, VH = 640, IMG = D.img || {};
const tl = gsap.timeline({ paused: true });
const CUES = []; const cue = (t, role, vol) => { if (t >= 0) CUES.push([Math.round(t * 1000) / 1000, role, vol == null ? 0.4 : vol]); };
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const latin = w => /^[A-Za-z0-9.%$+#&:/'-]+$/.test(w);
const PUNCT = /[،.؟?!…:]+$/;
const MINT = '#9BFFC2', GREEN = '#2EE86B';

// ---------- timing: scenes and spoken words (absolute seconds) ----------
let _acc = 0;
const SC = D.scenes.map(s => { const o = { s, t0: _acc, dur: s.dur, ws: (s.vwords || []).map(w => ({ w: w.w, s: _acc + (D.vlead || 0.35) + w.s, e: _acc + (D.vlead || 0.35) + w.e })) }; _acc += s.dur; return o; });
const TOTAL = _acc;
const W = (k, i) => SC[k].ws[i] || { s: SC[k].t0 + 0.3, e: SC[k].t0 + 0.6, w: '' };
const T0 = k => SC[k].t0, T1 = k => SC[k].t0 + SC[k].dur;

// ---------- layers ----------
const stage = document.getElementById('stage');
const el = (tag, cls, html, css, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (css) e.style.cssText = css; if (parent) parent.appendChild(e); return e; };
const bg = el('div', 'layer bg', '', '', stage);
const paper = el('div', 'layer paper', '', 'opacity:0', stage);           // palette break (cream + halftone)
const camEl = el('div', 'layer cam', '', '', stage);
const world = el('div', 'world', '', '', camEl);                         // everything the camera sees
const fullHost = el('div', 'layer fullhost', '', '', stage);             // full-bleed pictures (own virtual camera)
const fx = el('div', 'layer fx', '', '', stage);                          // flashes, light
const txt = el('div', 'layer txt', '', '', stage);                        // kinetic type (not moved by the camera)
const dust = el('div', 'layer dust', '', '', stage);
el('div', 'layer grain', '', 'background-image:url(' + D.grain + ')', stage);
el('div', 'topscrim', '', '', stage);
const hudEl = el('div', 'hud', '<span class="badge"><i></i>' + esc(D.badge || 'كريتيفيا') + '</span><span class="mk">' + D.mark + '</span>', '', stage); const badgeEl = hudEl.querySelector('.badge');

// camera (applied to world): position offset, scale, 3D rotation; plus a slow automatic drift
const CAM = { x: 0, y: 0, s: 1, rx: 0, ry: 0, rz: 0, ox: 180, oy: 300, blur: 0 };
const BG = { a: 0 };   // 0 = dark ground, 1 = paper

// ---------- groups: a beat's container, visible only during its window ----------
function group(tIn, tOut, parent, cls) {
  const g = el('div', 'grp ' + (cls || ''), '', '', parent || world);
  if (tIn <= 0) g.style.visibility = 'visible'; else tl.set(g, { visibility: 'visible' }, tIn);
  if (tOut != null) tl.set(g, { visibility: 'hidden' }, tOut);
  return g;
}

// ---------- pictures ----------
function pic(name, x, y, w, parent, o) {
  o = o || {}; const im = IMG[name]; const h = o.h || Math.round(w * im.h / im.w);
  const p = el('div', 'pic' + (o.flat ? ' flat' : ''), '<img src="' + im.src + '" style="object-fit:' + (o.fit || 'cover') + (o.pos ? ';object-position:' + o.pos : '') + '"><i class="sweep"></i>', 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;' + (o.css || ''), parent || world);
  p.W = w; p.H = h; p.X = x; p.Y = y; return p;
}
// point of a picture (fractions) -> stage coords
const at = (p, fx, fy) => [p.X + fx * p.W, p.Y + fy * p.H];
function sweep(p, t) { const s = p.querySelector('.sweep'); if (s) tl.fromTo(s, { xPercent: -160 }, { xPercent: 260, duration: 1.1, ease: 'power2.inOut', immediateRender: false }, t); }
function enter(node, t, from, d, ease) { tl.fromTo(node, from, Object.assign({ x: 0, y: 0, z: 0, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, opacity: 1, filter: 'blur(0px)' }, { duration: d || 0.6, ease: ease || 'expo.out', immediateRender: true }), t); }
function leave(node, t, to, d, ease) { tl.to(node, Object.assign({ duration: d || 0.35, ease: ease || 'power2.in' }, to), t); }

// full-bleed picture with its own virtual camera: P = {x, y, z, cx, cy} (x/y = point of the picture to put at (cx, cy))
const FULLS = [];
function full(name, tIn, tOut, P0, marks) {
  const im = IMG[name]; const L = el('div', 'full', '<img class="fbg" src="' + im.src + '"><div class="fw"><img src="' + im.src + '"></div><div class="fshade"></div>', '', fullHost);
  const P = Object.assign({ x: 0.5, y: 0.5, z: 1, cx: 180, cy: 320, shade: 0.6 }, P0);
  const f = { L, P, im, wrap: L.querySelector('.fw'), tIn, tOut: tOut == null ? TOTAL + 1 : tOut, marks: [] };
  (marks || []).forEach(m => { const n = el('div', 'fmark', m.html || '', '', f.wrap); f.marks.push({ n, m }); });
  FULLS.push(f); return f;
}
function camTo(f, t, P, d, ease) { tl.to(f.P, Object.assign({ duration: d || 1, ease: ease || 'power2.inOut' }, P), t); }
function applyFulls(time) {
  for (const f of FULLS) {
    const on = time >= f.tIn && time < f.tOut; f.L.style.visibility = on ? 'visible' : 'hidden'; if (!on) continue;
    const s0 = Math.max(VW / f.im.w, VH / f.im.h), Wd = f.im.w * s0, Ht = f.im.h * s0, z = f.P.z;
    let tx = f.P.cx - f.P.x * Wd * z, ty = f.P.cy - f.P.y * Ht * z;
    if (!f.P.free && Wd * z >= VW) tx = Math.min(0, Math.max(VW - Wd * z, tx));
    if (!f.P.free && Ht * z >= VH) ty = Math.min(0, Math.max(VH - Ht * z, ty));
    f.wrap.style.width = Wd + 'px'; f.wrap.style.height = Ht + 'px';
    f.wrap.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + z + ')';
    f.L.querySelector('.fshade').style.opacity = f.P.shade;
    for (const { n, m } of f.marks) { n.style.left = m.x * Wd + 'px'; n.style.top = m.y * Ht + 'px'; n.style.transform = 'translate(-50%,-50%)' + (m.keep ? ' scale(' + (1 / z) + ')' : ''); }
  }
}
// clip a full-bleed layer in/out: from / to a rectangle [x, y, w, h, radius] or full screen
const rectClip = r => r ? 'inset(' + r[1] + 'px ' + (VW - r[0] - r[2]) + 'px ' + (VH - r[1] - r[3]) + 'px ' + r[0] + 'px round ' + (r[4] || 0) + 'px)' : 'inset(0px 0px 0px 0px round 0px)';
function clipIn(f, t, rect, d) { tl.fromTo(f.L, { clipPath: rectClip(rect), opacity: 0.4 }, { clipPath: rectClip(null), opacity: 1, duration: d || 0.7, ease: 'expo.inOut', immediateRender: true }, t); }
function clipOut(f, t, rect, d) { tl.fromTo(f.L, { clipPath: rectClip(null) }, { clipPath: rectClip(rect), duration: d || 0.6, ease: 'expo.inOut', immediateRender: false }, t); }
function iris(f, t, cx, cy, d) { tl.fromTo(f.L, { clipPath: 'circle(0% at ' + cx + 'px ' + cy + 'px)' }, { clipPath: 'circle(80% at ' + cx + 'px ' + cy + 'px)', duration: d || 0.7, ease: 'expo.inOut', immediateRender: true }, t); }

// ---------- video: play(target, name, t0, {rate, from, loop, hold}) — target = a full() object or a pic() element ----------
// The clip's frames replace every <img> of the target; before t0 it shows the first frame, after the end the last (or loops).
const VID = D.vid || {}, PLAYS = [];
function play(target, name, t0, o) { o = o || {}; const node = target.L || target; PLAYS.push({ imgs: [...node.querySelectorAll('img')], v: VID[name], t0, rate: o.rate || 1, from: o.from || 0, loop: !!o.loop, cur: -1 }); return target; }
function applyPlays(time) {
  for (const p of PLAYS) {
    let i = Math.round(((time - p.t0) * p.rate + p.from) * 30); const n = p.v.n;
    i = p.loop ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i));
    if (i === p.cur) continue; p.cur = i; const src = p.v.dir + '/f' + String(i + 1).padStart(4, '0') + '.jpg';
    for (const im of p.imgs) im.src = src;
  }
}

// ---------- kinetic type ----------
let TX = txt;   // current beat's text group (set per beat with TX = textGroup(k)); everything in it hides when the beat ends
const textGroup = (k, a, b) => (TX = group(T0(k) - (a == null ? 0.45 : a), T1(k) + (b == null ? -0.02 : b), txt));
// say(k, i0, i1, {x, y, w, align, size, hero:{idx:size}, entry:'mask'|'blur'|'slide', color, dark})  — words appear on their spoken word
function say(k, i0, i1, o) {
  o = o || {}; const size = o.size || 22, ws = SC[k].ws.slice(i0, i1 + 1);
  const d = el('div', 'ph ' + (o.align || 'right') + (o.dark ? ' dark' : '') + (o.bg ? ' bgp' : ''), '', (o.bg ? 'right:' + (o.right == null ? (o.y >= 320 ? 60 : 24) : o.right) + 'px;left:auto;max-width:' + (o.y >= 320 ? 276 : 312) + 'px;' : 'left:' + (o.x == null ? 24 : o.x) + 'px;width:' + (o.w || (o.y >= 320 ? 276 : 312)) + 'px;') + 'top:' + o.y + 'px;font-size:' + size + 'px', o.parent || TX);
  ws.forEach((w, j) => {
    const i = i0 + j, hs = o.hero && o.hero[i], raw = w.w, word = (o.keepPunct ? raw : raw.replace(/[،.:]+$/, ''));
    const wrap = el('span', 'wd' + (hs ? ' hero' : '') + (o.pill && o.pill[i] ? ' pill' : ''), '', hs ? 'font-size:' + hs + 'px' : '', d);
    const inner = el('span', 'wi', esc(word), '', wrap); if (latin(word.replace(PUNCT, ''))) inner.setAttribute('dir', 'ltr');
    const t = w.s - 0.07, mode = hs ? 'hero' : (o.entry || 'blur');
    if (mode === 'mask') tl.fromTo(inner, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'expo.out', immediateRender: true }, t);
    else if (mode === 'slide') tl.fromTo(inner, { x: 26, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out', immediateRender: true }, t);
    else if (mode === 'hero') { tl.fromTo(inner, { scale: 1.7, opacity: 0, filter: 'blur(12px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'back.out(1.6)', immediateRender: true }, t); kashida(wrap, t + 0.3); cue(t + 0.02, 'pop', 0.35); }
    else tl.fromTo(inner, { scale: 1.3, opacity: 0, filter: 'blur(10px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out', immediateRender: true }, t);
    if (o.pill && o.pill[i]) { const b = el('i', 'pb', '', '', wrap); tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power3.out', immediateRender: true }, t - 0.05); }
  });
  if (o.bg && ws.length) tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, ws[0].s - 0.14);   // the backing pill appears with the first word
  if (o.out != null) out(d, o.out, o.outMode);
  return d;
}
// the KASHIDA: a green stroke drawn right→left under a hero word (brand signature)
function kashida(wrap, t) { return; /* owner: no line under words — it covers Arabic letters and dots */ const k = el('i', 'kash', '', '', wrap); tl.fromTo(k, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'expo.out', immediateRender: true }, t); }
// older text steps back (smaller, dimmer, up) instead of vanishing — or leaves upward
function recede(d, t) { tl.to(d, { scale: 0.6, y: -34, opacity: 0.35, filter: 'blur(1.5px)', transformOrigin: '100% 0%', duration: 0.5, ease: 'expo.out' }, t); }
function out(d, t, mode) { if (mode === 'recede') return recede(d, t); tl.to(d, { y: -16, opacity: 0, filter: 'blur(8px)', duration: 0.25, ease: 'power2.in' }, t); }
// a standalone word/number
function word(text, x, y, size, t, o) {
  o = o || {}; const d = el('div', 'solo' + (o.hero !== false ? ' hero' : '') + (o.dark ? ' dark' : ''), '<span class="wi"' + (o.ltr ? ' dir="ltr"' : '') + '>' + esc(text) + '</span>', 'left:' + x + 'px;top:' + y + 'px;font-size:' + size + 'px;' + (o.w ? 'width:' + o.w + 'px;' : '') + (o.css || ''), o.parent || TX);
  tl.fromTo(d, { scale: o.from || 1.6, opacity: 0, filter: 'blur(12px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'back.out(1.5)', immediateRender: true }, t);
  if (o.kash !== false && o.hero !== false) kashida(d, t + 0.3);
  if (o.out != null) out(d, o.out, o.outMode);
  return d;
}
function count(node, from, to, t, d, fmt) { const o = { v: from }, s = node.querySelector('.wi') || node; s.textContent = (fmt || (v => Math.round(v)))(from); tl.to(o, { v: to, duration: d || 1, ease: 'power3.out', onUpdate: () => { s.textContent = (fmt || (v => Math.round(v)))(o.v); } }, t); }
function ghost(text, x, y, size, t, tOut, parent) { const g = el('div', 'ghost', esc(text), 'left:' + x + 'px;top:' + y + 'px;font-size:' + size + 'px', parent || world); tl.fromTo(g, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out', immediateRender: true }, t); if (tOut != null) tl.to(g, { opacity: 0, duration: 0.4 }, tOut); return g; }
// editor's note: Playpen text, mint
function note(text, x, y, t, parent, o) { o = o || {}; const n = el('div', 'note', esc(text), 'left:' + x + 'px;top:' + y + 'px;' + (o.css || ''), parent || TX); tl.fromTo(n, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.6, ease: 'power2.out', immediateRender: true }, t); if (o.out != null) tl.to(n, { opacity: 0, duration: 0.25 }, o.out); return n; }

// ---------- drawn marks (SVG, mint) ----------
function svgLayer(parent) { return el('div', 'svgl', '<svg width="360" height="640" viewBox="0 0 360 640"></svg>', '', parent || world).querySelector('svg'); }
function path(svg, d, t, dur, o) {
  o = o || {}; const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none');
  p.setAttribute('stroke', o.color || MINT); p.setAttribute('stroke-width', o.width || 3); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
  if (o.dash) p.setAttribute('stroke-dasharray', o.dash); if (o.glow !== false) p.style.filter = 'drop-shadow(0 0 4px ' + (o.color || MINT) + ')';
  svg.appendChild(p); const len = p.getTotalLength();
  if (!o.dash) tl.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: dur || 0.6, ease: o.ease || 'power2.inOut', immediateRender: true }, t);
  else tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: dur || 0.4, immediateRender: true }, t);
  if (o.out != null) tl.to(p, { opacity: 0, duration: 0.3 }, o.out);
  return p;
}
function bracket(svg, x, y, w, h, t, o) { const L = (o && o.len) || 12, d = 'M' + x + ' ' + (y + L) + 'V' + y + 'H' + (x + L) + ' M' + (x + w - L) + ' ' + y + 'H' + (x + w) + 'V' + (y + L) + ' M' + (x + w) + ' ' + (y + h - L) + 'V' + (y + h) + 'H' + (x + w - L) + ' M' + (x + L) + ' ' + (y + h) + 'H' + x + 'V' + (y + h - L); cue(t, 'tick', 0.3); return path(svg, d, t, 0.35, o); }
// hand-drawn circle (editor's note), slightly open, around (cx, cy)
function scribble(svg, cx, cy, rx, ry, t, o) { const d = 'M' + (cx + rx) + ' ' + (cy - 4) + ' C' + (cx + rx) + ' ' + (cy - ry * 1.2) + ' ' + (cx - rx * 1.1) + ' ' + (cy - ry * 1.15) + ' ' + (cx - rx) + ' ' + cy + ' C' + (cx - rx * 0.95) + ' ' + (cy + ry * 1.2) + ' ' + (cx + rx * 1.15) + ' ' + (cy + ry * 1.1) + ' ' + (cx + rx * 0.92) + ' ' + (cy - ry * 0.35); cue(t + 0.05, 'whoosh-soft', 0.3); return path(svg, d, t, 0.6, Object.assign({ width: 3.5, ease: 'power3.out' }, o)); }

// ---------- transitions / fx ----------
function flash(t, color) { const f = el('div', 'flash', '', 'background:radial-gradient(circle at 50% 45%,' + (color || MINT) + ',rgba(0,0,0,0) 70%)', fx); tl.fromTo(f, { opacity: 0 }, { opacity: 0.85, duration: 0.14, ease: 'power2.out', immediateRender: true }, t); tl.to(f, { opacity: 0, duration: 0.3, ease: 'power2.in' }, t + 0.14); cue(t, 'whoosh', 0.45); }
function whip(t) { tl.fromTo(CAM, { blur: 0 }, { blur: 10, duration: 0.18, ease: 'power2.in', yoyo: true, repeat: 1, immediateRender: false }, t); cue(t, 'whip', 0.5); }
function setBG(t, a, d) { tl.to(BG, { a, duration: d || 0.5, ease: 'power2.inOut' }, t); }

// ---------- ambient: dust in depth ----------
for (let i = 0; i < 18; i++) { const s = 2 + (i * 7) % 5, b = el('i', 'mote', '', 'left:' + ((i * 53) % 360) + 'px;top:' + ((i * 97) % 640) + 'px;width:' + s + 'px;height:' + s + 'px;opacity:' + (0.15 + (i % 4) * 0.08), dust); tl.fromTo(b, { y: 0, x: 0 }, { y: -80 - (i % 5) * 30, x: (i % 2 ? 20 : -20), duration: TOTAL, ease: 'none', immediateRender: false }, 0); }

/*SCENES*/

tl.set({}, {}, TOTAL);
window.TOTAL = TOTAL; window.CUES = CUES;
window.drawFrame = function (time) {
  tl.seek(time, false);
  const dx = Math.sin(time * 0.31) * 6, dy = Math.cos(time * 0.27) * 5, dry = Math.sin(time * 0.4) * 2.2, drx = Math.cos(time * 0.33) * 1.4;
  world.style.transformOrigin = CAM.ox + 'px ' + CAM.oy + 'px';
  world.style.transform = 'translate(' + (CAM.x + dx) + 'px,' + (CAM.y + dy) + 'px) scale(' + CAM.s + ') rotateX(' + (CAM.rx + drx) + 'deg) rotateY(' + (CAM.ry + dry) + 'deg) rotateZ(' + CAM.rz + 'deg)';
  world.style.filter = CAM.blur > 0.1 ? 'blur(' + CAM.blur.toFixed(1) + 'px)' : 'none';
  const ax = 68 + Math.sin(time * 0.11) * 18, ay = 8 + Math.sin(time * 0.07) * 6, bx = 14 + Math.cos(time * 0.09) * 14, by = 94 - Math.sin(time * 0.1) * 8;
  bg.style.backgroundImage = 'radial-gradient(70% 45% at ' + ax + '% ' + ay + '%, ' + C.b1 + ', rgba(0,0,0,0) 100%), radial-gradient(60% 40% at ' + bx + '% ' + by + '%, ' + C.b2 + ', rgba(0,0,0,0) 100%), linear-gradient(180deg,#0C2A1E 0%,#071711 45%,#030806 100%)';
  paper.style.opacity = BG.a; badgeEl.style.color = BG.a > 0.5 ? '#0C2A1E' : '';
  let cb = SC[0]; for (const b of SC) if (time >= b.t0 - 0.35) cb = b; const pr = Math.min(1, Math.max(0, (time - cb.t0 + 0.35) / cb.dur)); world.style.scale = (1 + 0.05 * Math.sin(Math.PI * pr)).toFixed(4);
  applyFulls(time); applyPlays(time);
};
`;

module.exports.CSS = (C) => `
body{margin:0;background:#000}
#stage{position:relative;width:360px;height:640px;overflow:hidden;font-family:'Rubik',sans-serif;color:#EFF7F1;direction:rtl}
.layer{position:absolute;inset:0}
.paper{background-color:#F1EADB;background-image:radial-gradient(rgba(180,60,40,0.18) 1.2px,transparent 1.4px);background-size:7px 7px}
.cam{perspective:1000px;perspective-origin:50% 45%}
.world{position:absolute;inset:0;transform-style:preserve-3d}
.grp{position:absolute;inset:0;visibility:hidden;transform-style:preserve-3d}
.fullhost{z-index:3}.fx{z-index:6;pointer-events:none}.txt{z-index:8}.dust{z-index:5;pointer-events:none}
.grain{opacity:0.06;background-size:180px;pointer-events:none;z-index:9}
.topscrim{position:absolute;left:0;right:0;top:0;height:132px;z-index:11;pointer-events:none;background:linear-gradient(180deg,rgba(3,8,6,0.78) 0%,rgba(3,8,6,0.5) 55%,rgba(3,8,6,0) 100%)}
.hud{position:absolute;top:62px;right:22px;left:22px;display:flex;justify-content:space-between;align-items:center;z-index:12}
.badge{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:#A3B8AB;text-shadow:0 1px 8px rgba(0,0,0,0.6)}
.badge i{width:7px;height:7px;border-radius:50%;background:#2EE86B;box-shadow:0 0 8px #2EE86B}
.mote{position:absolute;border-radius:50%;background:#9BFFC2;filter:blur(0.6px)}
/* pictures */
.pic{position:absolute;border-radius:12px;overflow:hidden;box-shadow:0 24px 50px rgba(0,0,0,0.55);outline:1px solid rgba(255,255,255,0.22);outline-offset:-1px;transform-style:preserve-3d;backface-visibility:hidden}
.pic.flat{box-shadow:none;outline:none;border-radius:0}
.pic img{width:100%;height:100%;display:block}
.sweep{position:absolute;top:0;bottom:0;width:45%;background:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,0.25) 50%,rgba(255,255,255,0) 70%);transform:translateX(-160%);pointer-events:none}
/* full-bleed */
.full{position:absolute;inset:0;overflow:hidden;visibility:hidden;background:#000}
.fbg{position:absolute;inset:-40px;width:calc(100% + 80px);height:calc(100% + 80px);object-fit:cover;filter:blur(24px) brightness(0.4) saturate(1.2)}
.fw{position:absolute;left:0;top:0;transform-origin:0 0;box-shadow:0 20px 60px rgba(0,0,0,0.55)}.fw img{width:100%;height:100%;display:block;object-fit:fill}
.fshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,10,7,0.7) 0px,rgba(3,10,7,0) 110px,rgba(3,10,7,0) 340px,rgba(3,10,7,0.85) 470px,rgba(3,10,7,0.92) 640px)}
.fmark{position:absolute}
/* type */
.ph{position:absolute;line-height:1.28;font-weight:700;text-wrap:balance;transform-origin:100% 0%}
.ph.right{text-align:right}.ph.bgp{background:rgba(3,10,7,0.78);padding:6px 12px 8px;border-radius:14px;backdrop-filter:blur(6px)}.ph.left{text-align:left}.ph.center{text-align:center}
.wd{position:relative;display:inline-block;margin:0 0 0 0.26em;vertical-align:baseline;overflow:visible}
.wi{position:relative;display:inline-block;text-shadow:0 2px 14px rgba(0,0,0,0.6)}
.wd.hero .wi,.solo.hero .wi{font-weight:800;color:#2EE86B;text-shadow:0 0 24px rgba(46,232,107,0.35),0 2px 14px rgba(0,0,0,0.5)}
.ph.dark .wi,.solo.dark .wi{color:#0B1410;text-shadow:none}.ph.dark .wd.hero .wi,.solo.dark.hero .wi{color:#0F7A3A;text-shadow:none}
.kash{position:absolute;left:4%;right:-2%;bottom:-0.06em;height:0.09em;min-height:3px;border-radius:3px;background:#2EE86B;box-shadow:0 0 10px #2EE86B;transform-origin:100% 50%}
.wd.pill{padding:0 0.18em}.pb{position:absolute;inset:-0.02em -0.1em;border-radius:0.25em;background:#2EE86B;z-index:-1;transform-origin:100% 50%}.wd.pill .wi{color:#06140C;text-shadow:none;font-weight:800}
.solo{position:absolute;line-height:1.05;font-weight:800;white-space:nowrap}
.ghost{position:absolute;font-weight:800;line-height:1;color:rgba(155,255,194,0.07);white-space:nowrap;pointer-events:none}
.note{position:absolute;font-family:'Playpen Sans Arabic',sans-serif;font-size:16px;line-height:1.4;color:#9BFFC2;white-space:nowrap;text-shadow:0 2px 10px rgba(0,0,0,0.6)}
.svgl{position:absolute;left:0;top:0;width:360px;height:640px;pointer-events:none;overflow:visible}.svgl svg{overflow:visible}
.flash{position:absolute;inset:0;opacity:0;mix-blend-mode:screen}
/* calendar */
.cal{position:absolute;border-radius:22px;overflow:hidden;background:#F4FBF6;box-shadow:0 30px 60px rgba(0,0,0,0.5);text-align:center;display:flex;flex-direction:column;color:#0B1410}
.cal .h{background:#2EE86B;font-weight:800;font-size:19px;padding:9px 0}.cal .d{flex:1;display:flex;align-items:center;justify-content:center;font-size:92px;font-weight:800;line-height:1}.cal .y{font-size:16px;font-weight:700;color:#46594D;padding-bottom:12px}
/* tiles */
.tile{position:absolute;overflow:hidden;background-repeat:no-repeat;border-radius:3px;box-shadow:0 10px 22px rgba(0,0,0,0.45);backface-visibility:hidden}
.tile .b{position:absolute;inset:0;background-repeat:no-repeat;opacity:0}
/* end */
.endb{position:absolute;left:0;right:0;top:170px;display:flex;flex-direction:column;align-items:center;gap:12px}
.endb .p{padding:11px 28px;font-size:22px !important;border-radius:999px;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.25);font-size:21px;font-weight:800}
.endb .h2{font-size:18px;font-weight:700;color:#A3B8AB}.endb .n{font-family:'Playpen Sans Arabic',sans-serif;font-size:15.5px;color:#9BFFC2}
.dk{background:rgba(3,10,7,0.78);padding:4px 12px 8px;border-radius:14px}
.tagx{position:absolute;padding:3px 9px;border-radius:999px;background:rgba(3,10,7,0.8);color:#EFF7F1;font-size:12px;font-weight:700;white-space:nowrap}
`;
