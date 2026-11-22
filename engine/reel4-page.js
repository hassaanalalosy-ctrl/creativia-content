// Page script + CSS for engine 4 ("camera world"): every scene is a glass panel placed in one big world;
// the CAMERA flies between panels (pan + zoom out/in + slight roll + motion blur), pushes in while a panel plays,
// and punches in on the payoff. Panels hold ALL their content (title, text, rows, charts) inside the card.
module.exports.PAGE = String.raw`
const D = window.REEL, C = D.theme;
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cred = x => esc(x).replace(/@[A-Za-z0-9._]+/g, m => '⁦' + m + '⁩');
const VW = 360, VH = 640, CW = 316, CH = 340;           // viewport and panel card size
const CUES = []; const cue = (t, role, vol) => CUES.push([Math.round(t * 1000) / 1000, role, vol]);
const el = (tag, cls, html, style) => { const e = document.createElement(tag); if (cls) e.className = cls; e.setAttribute('dir', 'rtl'); if (html != null) e.innerHTML = html; if (style) e.style.cssText = style; return e; };
const latin = w => /^[A-Za-z0-9.%$+#&:/'-]+$/.test(w);
const words = (text) => { const t = esc(text).split(' ').filter(Boolean), o = []; for (let i = 0; i < t.length; i++) { if (latin(t[i])) { let j = i; while (j + 1 < t.length && latin(t[j + 1])) j++; o.push('<span class="w" dir="ltr" style="unicode-bidi:isolate">' + t.slice(i, j + 1).join(' ') + '</span>'); i = j; } else o.push('<span class="w">' + t[i] + '</span>'); } return o.join(' '); };
const ICON = {
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
  play: 'M8 5l11 7-11 7z',
  chart: 'M4 20V10 M10 20V4 M16 20v-7 M22 20H2',
  megaphone: 'M3 11v2a1 1 0 0 0 1 1h3l7 5V5L7 10H4a1 1 0 0 0-1 1z M17 9a4 4 0 0 1 0 6',
  clock: 'M12 7v5l3 2 M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z',
  spark: 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5L18 18 M6 18l2.5-2.5 M15.5 8.5L18 6',
  star: 'M12 3l2.6 5.6 6.1.6-4.6 4.1 1.4 6-5.5-3.2-5.5 3.2 1.4-6L3.3 9.2l6.1-.6z',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0z M8 6H5a3 3 0 0 0 3 4 M16 6h3a3 3 0 0 1-3 4 M12 13v4 M8 21h8',
  quiet: 'M11 5L6 9H3v6h3l5 4z M22 9l-6 6 M16 9l6 6',
  tv: 'M3 6h18v12H3z M8 21h8 M12 18v3'
};
const icon = (name, size, color) => '<svg class="ico" width="' + size + '" height="' + size + '" viewBox="0 0 24 24"><path pathLength="100" d="' + (ICON[name] || ICON.spark) + '" fill="none" stroke="' + (color || C.ink) + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:100 120;stroke-dashoffset:110"/></svg>';

// ---------- layers: background (parallax), world (camera), HUD ----------
const stage = document.getElementById('stage');
const bgl = el('div', 'layer', '', 'background:radial-gradient(120% 90% at 70% 10%,' + C.bg1 + ',' + C.bg2 + ')'); stage.appendChild(bgl);
const par = el('div', 'par'); bgl.appendChild(par);
[[C.b1, 700, 200, 100], [C.b2, 640, -200, 700], [C.b3, 520, 600, 900], [C.b1, 600, 1300, 300], [C.b2, 640, 1900, 800], [C.b3, 560, 2500, 200], [C.b1, 620, 3100, 700]]
  .forEach(([c, s, x, y]) => par.appendChild(el('div', 'blob', '', 'width:' + s + 'px;height:' + s + 'px;left:' + (x - s / 2) + 'px;top:' + (y - s / 2) + 'px;background:radial-gradient(circle,' + c + ' 0%,rgba(0,0,0,0) 66%)')));
const world = el('div', 'world'); stage.appendChild(world);
const fsHost = el('div', 'layer fshost'); stage.appendChild(fsHost); const FOCI = [];
const grid = el('div', 'gridw', '', 'background-image:linear-gradient(' + C.grid + ' 1px,transparent 1px),linear-gradient(90deg,' + C.grid + ' 1px,transparent 1px)'); world.appendChild(grid);
stage.appendChild(el('div', 'layer grain', '', 'background-image:url(' + D.grain + ')'));
const hud = el('div', 'hud', '<span class="badge"><i></i>' + esc(D.badge || 'كريتيفيا') + '</span><span class="mk">' + D.mark + '</span>'); stage.appendChild(hud);

// ---------- panel placement along a winding path ----------
const PATH = [[0, 0, 0], [440, -60, -3], [880, 40, 2], [880, 560, -2], [440, 640, 3], [0, 560, -2], [-60, 1100, 2], [400, 1180, -3], [860, 1100, 2], [900, 1640, -2], [440, 1720, 0], [0, 1640, 2], [40, 2180, -2], [500, 2260, 0]];
const panels = [];
function panel(k, cls) {
  const [px, py, rot] = PATH[k % PATH.length]; const x = px * 2.1, y = py * 2.1;
  const p = el('div', 'panel ' + (cls || ''), '<div class="rim"></div><div class="sheen"></div><div class="inner"></div>', 'left:' + x + 'px;top:' + y + 'px;transform:translate(-50%,-50%) rotate(' + rot + 'deg)');
  world.appendChild(p);
  panels.push({ x, y, rot, el: p });
  return p.querySelector('.inner');
}
function wordsIn(tl, scope, at, stagger) {
  const ws = scope.querySelectorAll('.w'); if (!ws.length) return at;
  tl.fromTo(ws, { opacity: 0, x: 16, filter: 'blur(6px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, ease: 'expo.out', stagger: stagger || 0.08 }, at);
  return at + ws.length * (stagger || 0.08) + 0.45;
}
function drawIcons(tl, scope, at) { scope.querySelectorAll('.ico path').forEach((p, i) => tl.fromTo(p, { strokeDashoffset: 110 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, at + i * 0.1)); }
function kretiEl(host, pose, size, style) { const k = el('div', 'kreti', D.kreti[pose].replace(/width="\d+" height="\d+"/, 'width="' + size + '" height="' + size + '"'), style); host.appendChild(k); return k; }
function kretiIn(tl, k, at, dur) {
  tl.fromTo(k, { scale: 0.2, opacity: 0, y: 24, rotate: -10 }, { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 0.8, ease: 'elastic.out(1,0.55)' }, at);
  tl.to(k, { y: -4, rotate: 2, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor((dur - 1.6) / 0.8)) }, at + 0.8);
}
function counter(tl, node, value, at, dur) {
  const m = String(value).match(/^([^0-9]*)([0-9.,]+)(.*)$/); if (!m) { node.textContent = value; return; }
  const n = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, o = { v: 0 };
  node.textContent = m[1] + (0).toFixed(dec) + m[3];
  tl.to(o, { v: n, duration: dur || 1.3, ease: 'power3.out', onUpdate: () => { node.textContent = m[1] + o.v.toFixed(dec) + m[3]; } }, at);
}
const media = (src, fit, h, pos) => fit === 'poster'
  ? '<div class="ph poster"' + (h ? ' style="height:' + h + 'px"' : '') + '><img class="pbg" src="' + src + '"><div class="kb"><img src="' + src + '" style="object-fit:contain"></div></div>'
  : '<div class="ph"' + (h ? ' style="height:' + h + 'px"' : '') + '><div class="kb"><img src="' + src + '" style="object-fit:' + (fit || 'cover') + (pos ? ';object-position:' + pos : '') + '"></div></div>';

// ---------- scene builders (content lives INSIDE the panel) ----------
const B = {
  hook(s, k) {
    const c = panel(k, 'hook');
    c.innerHTML = '<div class="stack center">' + (s.icon ? '<div class="icowrap">' + icon(s.icon, 34) + '</div>' : '') + '<div class="t xl">' + words(s.title) + '</div>' + (s.sub ? '<div class="b">' + words(s.sub) + '</div>' : '') + (s.pill ? '<div class="pill"><i></i><span dir="ltr">' + esc(s.pill) + '</span></div>' : '') + '</div>';
    const kr = kretiEl(c, s.pose || 'point', 78, 'left:12px;bottom:10px');
    return { build(tl, t0, dur) {
      const ws = c.querySelectorAll('.t .w');            // frame 0 = thumbnail: title already there
      if (ws.length) tl.fromTo(ws[ws.length - 1], { color: C.text }, { color: C.accent, duration: 0.5, ease: 'power2.out' }, t0 + 0.6);
      drawIcons(tl, c, t0 + 0.2);
      if (s.sub) wordsIn(tl, c.querySelector('.b'), t0 + 0.9, 0.07);
      const pl = c.querySelector('.pill'); if (pl) { tl.fromTo(pl, { scaleX: 0.2, opacity: 0, filter: 'blur(8px)' }, { scaleX: 1, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, t0 + 1.3); cue(t0 + 1.33, 'pop', 0.55); }
      kretiIn(tl, kr, t0 + 0.5, dur);
    } };
  },
  image(s, k) {
    const c = panel(k, s.overlay ? 'ov' : '');
    c.innerHTML = media(s.image, s.fit, s.h, s.pos) + (s.chip ? '<div class="chip">' + icon(s.chipIcon || 'eye', 14) + esc(s.chip) + '</div>' : '') + (s.num ? '<div class="nbadge" dir="ltr">' + esc(s.num) + '</div>' : '') +
      (s.ring ? '<svg class="ring" viewBox="0 0 100 100" preserveAspectRatio="none" style="left:' + (s.ring[0] - s.ring[2]) * 100 + '%;top:' + (s.ring[1] - s.ring[2] * 1.2) * 100 + '%;width:' + s.ring[2] * 200 + '%;height:' + s.ring[2] * 240 + '%"><ellipse cx="50" cy="50" rx="46" ry="46" pathLength="100"/></svg>' + (s.ringLabel ? '<div class="rlab" style="left:' + (s.ring[0] + s.ring[2] * 0.6) * 100 + '%;top:' + (s.ring[1] + s.ring[2] * 1.1) * 100 + '%">' + esc(s.ringLabel) + '</div>' : '') : '') +
      '<div class="txt"><div class="t">' + words(s.title || '') + '</div>' + (s.body ? '<div class="b">' + words(s.body) + '</div>' : '') + (s.credit ? '<div class="cr">' + cred(s.credit) + '</div>' : '') + '</div>';
    const ph0 = c.querySelector('.ph'); c.querySelectorAll('.ring,.rlab').forEach(n => ph0.appendChild(n));
    return { build(tl, t0, dur) {
      tl.fromTo(c.querySelector('.kb'), { scale: 1.14, xPercent: 2 }, { scale: 1.02, xPercent: -2, duration: dur + 1, ease: 'none' }, t0 - 0.5);
      const e = wordsIn(tl, c.querySelector('.t'), t0 + 0.35, 0.08);
      if (s.body) wordsIn(tl, c.querySelector('.b'), e - 0.25, 0.05);
      const ch = c.querySelector('.chip'); if (ch) { tl.fromTo(ch, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, t0 + 0.55); drawIcons(tl, ch, t0 + 0.6); cue(t0 + 0.58, 'pop', 0.4); }
      if (s.credit) tl.fromTo(c.querySelector('.cr'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, t0 + 1.0);
      const rg = c.querySelector('.ring ellipse'); if (rg) { const at = t0 + (s.ringAt || 1.0); tl.fromTo(rg, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, at); cue(at + 0.05, 'whoosh-soft', 0.35); tl.to(c.querySelector('.ring'), { scale: 1.08, duration: 0.45, yoyo: true, repeat: 3, ease: 'sine.inOut' }, at + 0.7);
        const rl = c.querySelector('.rlab'); if (rl) { tl.fromTo(rl, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, at + 0.5); cue(at + 0.52, 'pop', 0.4); } }
      const nb = c.querySelector('.nbadge'); if (nb) { tl.fromTo(nb, { scale: 0.3, opacity: 0, rotate: -12 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.7)' }, t0 + 0.3); counter(tl, nb, s.num, t0 + 0.35, 1.2); cue(t0 + 0.34, 'pop', 0.55); }
    } };
  },
  video(s, k) {
    const c = panel(k);
    c.innerHTML = '<div class="ph"><div class="kb"><img class="vf" data-dir="' + s.frameDir + '" data-n="' + s.frames + '" style="object-fit:' + (s.fit || 'cover') + '"></div><div class="vtag">▶</div></div>' +
      '<div class="txt"><div class="t">' + words(s.title || '') + '</div>' + (s.credit ? '<div class="cr">' + cred(s.credit) + '</div>' : '') + '</div>';
    const v = { img: c.querySelector('.vf'), t0: 0 };
    return { video: v, build(tl, t0) { v.t0 = t0 - 0.4; wordsIn(tl, c.querySelector('.t'), t0 + 0.35, 0.08); if (s.credit) tl.fromTo(c.querySelector('.cr'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, t0 + 1.0); } };
  },
  // big animated number + optional bar chart that grows (e.g. 90M vs 475M)
  stat(s, k) {
    const c = panel(k);
    const bars = s.bars || [];
    const max = Math.max(1, ...bars.map(b => +b.value || 0));
    c.innerHTML = '<div class="stat' + (bars.length ? '' : ' solo') + '">' + (s.icon ? '<div class="icowrap sm">' + icon(s.icon, 26) + '</div>' : '') +
      '<div class="num" dir="ltr">' + esc(s.value) + '</div><div class="t">' + words(s.title || '') + '</div>' +
      (bars.length ? '<div class="bars">' + bars.map((b, i) => '<div class="bar' + (i === bars.length - 1 ? ' hi' : '') + '"><div class="bv" dir="ltr">' + esc(b.label2 || '') + '</div><div class="bf" style="height:' + Math.max(8, Math.round((+b.value / max) * 100)) + '%"></div><div class="bl">' + esc(b.label) + '</div></div>').join('') + '</div>' : '') +
      (s.body ? '<div class="b">' + words(s.body) + '</div>' : '') + '</div>';
    return { build(tl, t0) {
      drawIcons(tl, c, t0 + 0.15);
      counter(tl, c.querySelector('.num'), s.value, t0 + 0.25, 1.4); cue(t0 + 1.6, 'pop', 0.5);
      tl.fromTo(c.querySelector('.num'), { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' }, t0 + 0.2);
      wordsIn(tl, c.querySelector('.t'), t0 + 0.5, 0.08);
      c.querySelectorAll('.bf').forEach((b, i) => { tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: 'expo.out' }, t0 + 0.8 + i * 0.35); cue(t0 + 0.84 + i * 0.35, 'tick', 0.35); });
      c.querySelectorAll('.bv,.bl').forEach((b, i) => tl.fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.4 }, t0 + 1.2 + (i >> 1) * 0.35));
      if (s.body) wordsIn(tl, c.querySelector('.b'), t0 + 1.4, 0.05);
    } };
  },
  point(s, k) { return s.image ? B.image(s, k) : B.stat({ value: s.num, title: s.title, body: s.body, icon: s.icon }, k); },
  list(s, k) {
    const c = panel(k);
    const pts = (s.points || []).slice(0, 4);
    c.innerHTML = '<div class="stack">' + (s.tag ? '<div class="tag">' + icon(s.tagIcon || 'spark', 14) + esc(s.tag) + '</div>' : '') + '<div class="t">' + words(s.title) + '</div><div class="rows">' +
      pts.map((p, i) => '<div class="row"><span class="rn" dir="ltr">' + (i + 1) + '</span><span>' + esc(p) + '</span></div>').join('') + '</div></div>';
    return { build(tl, t0) {
      const tg = c.querySelector('.tag'); if (tg) { tl.fromTo(tg, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, t0 + 0.1); drawIcons(tl, tg, t0 + 0.15); }
      wordsIn(tl, c.querySelector('.t'), t0 + 0.2, 0.08);
      c.querySelectorAll('.row').forEach((r, i) => { const at = t0 + 0.7 + i * 0.38; tl.fromTo(r, { x: 60, opacity: 0, filter: 'blur(8px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'expo.out' }, at); tl.fromTo(r.querySelector('.rn'), { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' }, at + 0.12); cue(at + 0.05, i % 2 ? 'tick' : 'pop', 0.35); });
    } };
  },
  compare(s, k) {
    const c = panel(k);
    const box = (o, good) => '<div class="cmp ' + (good ? 'good' : 'bad') + '"><div class="ch"><span class="dot">' + (good ? '✓' : '✕') + '</span>' + esc(o.label) + '</div><div class="cb">' + esc(o.text) + '</div></div>';
    c.innerHTML = '<div class="stack"><div class="t">' + words(s.title) + '</div>' + box(s.bad, false) + box(s.good, true) + '</div>';
    return { build(tl, t0) {
      wordsIn(tl, c.querySelector('.t'), t0 + 0.15, 0.08);
      c.querySelectorAll('.cmp').forEach((b, i) => { tl.fromTo(b, { x: 60, opacity: 0, filter: 'blur(8px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, t0 + 0.6 + i * 0.8); cue(t0 + 0.64 + i * 0.8, 'pop', 0.42); });
    } };
  },
  statement(s, k) {
    const c = panel(k, 'clear');
    c.innerHTML = '<div class="stack center"><div class="t xxl">' + words(s.text) + '</div>' + (s.sub ? '<div class="b">' + words(s.sub) + '</div>' : '') + '</div>';
    return { payoff: true, build(tl, t0) {
      const ws = c.querySelectorAll('.xxl .w');
      cue(Math.max(0, t0 - 0.9), 'riser', 0.3);
      tl.fromTo(ws, { opacity: 0, scale: 1.8, filter: 'blur(14px)', x: 30 }, { opacity: 1, scale: 1, filter: 'blur(0px)', x: 0, duration: 0.7, ease: 'expo.out', stagger: 0.16 }, t0 + 0.2);
      cue(t0 + 0.22 + (ws.length - 1) * 0.16, 'impact', 0.6);
      if (s.sub) wordsIn(tl, c.querySelector('.b'), t0 + 0.6 + ws.length * 0.16, 0.07);
    } };
  },
  // two images side by side (e.g. Europe vs America), labels under each, a symbol between
  versus(s, k) {
    const c = panel(k);
    const side = (o, i) => '<div class="vi"><div class="vimg">' + '<img src="' + o.image + '" style="object-fit:' + (o.fit || 'cover') + '">' + (o.tag ? '<div class="vtagx' + (o.warn ? ' warn' : '') + '">' + esc(o.tag) + '</div>' : '') + '</div><div class="vl">' + esc(o.label || '') + '</div>' + (o.sub ? '<div class="vs2" dir="ltr">' + esc(o.sub) + '</div>' : '') + '</div>';
    c.innerHTML = '<div class="stack">' + (s.title ? '<div class="t">' + words(s.title) + '</div>' : '') + '<div class="vs">' + side(s.a, 0) + '<div class="vsym" dir="ltr">' + esc(s.symbol || '≠') + '</div>' + side(s.b, 1) + '</div>' + (s.body ? '<div class="b">' + words(s.body) + '</div>' : '') + (s.credit ? '<div class="cr">' + cred(s.credit) + '</div>' : '') + '</div>';
    return { build(tl, t0) {
      if (s.title) wordsIn(tl, c.querySelector('.t'), t0 + 0.1, 0.07);
      const vi = c.querySelectorAll('.vi');
      tl.fromTo(vi[0], { x: 70, opacity: 0, rotate: 6 }, { x: 0, opacity: 1, rotate: 0, duration: 0.7, ease: 'expo.out' }, t0 + 0.3); cue(t0 + 0.32, 'whoosh-soft', 0.35);
      tl.fromTo(vi[1], { x: -70, opacity: 0, rotate: -6 }, { x: 0, opacity: 1, rotate: 0, duration: 0.7, ease: 'expo.out' }, t0 + 0.9); cue(t0 + 0.92, 'whoosh-soft', 0.35);
      tl.fromTo(c.querySelector('.vsym'), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2.2)' }, t0 + 1.4); cue(t0 + 1.42, 'pop', 0.5);
      c.querySelectorAll('.vimg img').forEach(im => tl.fromTo(im, { scale: 1.12 }, { scale: 1.0, duration: 3.5, ease: 'none' }, t0 + 0.3));
      c.querySelectorAll('.vtagx').forEach((g, i) => { tl.fromTo(g, { opacity: 0, y: -8, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' }, t0 + 1.8 + i * 0.3); cue(t0 + 1.82 + i * 0.3, 'tick', 0.35); });
      if (s.body) wordsIn(tl, c.querySelector('.b'), t0 + 1.6, 0.05);
      if (s.credit) tl.fromTo(c.querySelector('.cr'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, t0 + 1.2);
    } };
  },
  // an image is cut into a grid: cut lines draw, tiles split apart, "drop" tiles fade out, then the result image lands
  slice(s, k) {
    const c = panel(k);
    const R = s.rows || 3, Q = s.cols || 3, W = 280, H = s.h || 300, gw = W / Q, gh = H / R, drop = s.drop || [];
    let tiles = '';
    for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) tiles += '<div class="tile' + (drop.includes(r * Q + q) ? ' drop' : '') + '" style="left:' + q * gw + 'px;top:' + r * gh + 'px;width:' + gw + 'px;height:' + gh + 'px"><img src="' + s.image + '" style="left:' + (-q * gw) + 'px;top:' + (-r * gh) + 'px;width:' + W + 'px;height:' + H + 'px"><i class="x">✕</i></div>';
    let cuts = '';
    for (let q = 1; q < Q; q++) cuts += '<line x1="' + q * gw + '" y1="0" x2="' + q * gw + '" y2="' + H + '"/>';
    for (let r = 1; r < R; r++) cuts += '<line x1="0" y1="' + r * gh + '" x2="' + W + '" y2="' + r * gh + '"/>';
    c.innerHTML = '<div class="stack">' + (s.title ? '<div class="t">' + words(s.title) + '</div>' : '') + '<div class="slc" style="width:' + W + 'px;height:' + H + 'px">' + tiles +
      '<svg class="cuts" width="' + W + '" height="' + H + '">' + cuts + '</svg>' + (s.result ? '<div class="res"><img src="' + s.result + '" style="object-fit:' + (s.resultFit || 'cover') + '"></div>' : '') +
      (s.chip ? '<div class="chip">' + icon(s.chipIcon || 'spark', 14) + esc(s.chip) + '</div>' : '') + '</div>' + (s.credit ? '<div class="cr">' + cred(s.credit) + '</div>' : '') + '</div>';
    return { build(tl, t0, dur) {
      if (s.title) wordsIn(tl, c.querySelector('.t'), t0 + 0.1, 0.07);
      const lines = c.querySelectorAll('.cuts line'), ts = [...c.querySelectorAll('.tile')], cx = W / 2, cy = H / 2;
      lines.forEach((l, i) => { const len = Math.hypot(l.x2.baseVal.value - l.x1.baseVal.value, l.y2.baseVal.value - l.y1.baseVal.value); tl.fromTo(l, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.inOut' }, t0 + 0.5 + i * 0.22); cue(t0 + 0.52 + i * 0.22, 'click', 0.45); });
      const split = t0 + 0.6 + lines.length * 0.22;
      tl.to(c.querySelector('.cuts'), { opacity: 0, duration: 0.2 }, split);
      ts.forEach((tile, i) => { const r = Math.floor(i / Q), q = i % Q, dx = (q * gw + gw / 2 - cx) * 0.09, dy = (r * gh + gh / 2 - cy) * 0.09;
        tl.to(tile, { x: dx, y: dy, rotate: (i % 2 ? 2 : -2), duration: 0.6, ease: 'back.out(2)' }, split + i * 0.03); });
      cue(split + 0.02, 'pop', 0.5);
      const dr = c.querySelectorAll('.tile.drop');
      dr.forEach((tile, i) => { tl.to(tile.querySelector('img'), { opacity: 0.18, filter: 'grayscale(1)', duration: 0.4 }, split + 0.7 + i * 0.15); tl.fromTo(tile.querySelector('.x'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.4)' }, split + 0.7 + i * 0.15); cue(split + 0.72 + i * 0.15, 'tick', 0.4); });
      const rs = c.querySelector('.res');
      if (rs) { const at = split + 1.0 + dr.length * 0.15 + (s.resultDelay || 0.6);
        tl.to(ts, { scale: 0.85, opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.02 }, at - 0.3);
        tl.fromTo(rs, { opacity: 0, scale: 1.15, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }, at); cue(at, 'shimmer', 0.4);
        tl.fromTo(rs.querySelector('img'), { scale: 1.06 }, { scale: 1.0, duration: Math.max(1, dur - (at - t0)), ease: 'none' }, at); }
      const ch = c.querySelector('.chip'); if (ch) { tl.fromTo(ch, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, t0 + (s.chipAt || 0.4)); drawIcons(tl, ch, t0 + (s.chipAt || 0.4)); }
      if (s.credit) tl.fromTo(c.querySelector('.cr'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, t0 + 1.0);
    } };
  },
  // a wall of covers with labels; an optional highlight box on the same corner of each (e.g. the helicopter)
  gallery(s, k) {
    const c = panel(k, 'wide');
    const items = (s.items || []).slice(0, 6), hl = s.highlight;
    c.innerHTML = '<div class="stack">' + (s.title ? '<div class="t">' + words(s.title) + '</div>' : '') + '<div class="gal">' +
      items.map(o => '<div class="gi"><div class="gimg"><img src="' + o.image + '">' + (hl ? '<b class="hlb" style="left:' + hl[0] * 100 + '%;top:' + hl[1] * 100 + '%;width:' + hl[2] * 100 + '%;height:' + hl[3] * 100 + '%"></b>' : '') + '<div class="gl" dir="ltr">' + esc(o.label || '') + '</div></div></div>').join('') + '</div>' +
      (s.body ? '<div class="b">' + words(s.body) + '</div>' : '') + (s.credit ? '<div class="cr">' + cred(s.credit) + '</div>' : '') + '</div>';
    return { build(tl, t0) {
      if (s.title) wordsIn(tl, c.querySelector('.t'), t0 + 0.1, 0.07);
      const gi = c.querySelectorAll('.gi');
      gi.forEach((g, i) => { tl.fromTo(g, { y: 40, opacity: 0, rotate: i % 2 ? 8 : -8, scale: 0.8 }, { y: 0, opacity: 1, rotate: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, t0 + 0.35 + i * 0.16); cue(t0 + 0.37 + i * 0.16, 'tick', 0.3); });
      const hb = c.querySelectorAll('.hlb'), at = t0 + 0.6 + gi.length * 0.16 + (s.highlightDelay || 0.4);
      hb.forEach((b, i) => { tl.fromTo(b, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, at + i * 0.18); cue(at + 0.02 + i * 0.18, 'pop', 0.38); });
      if (hb.length) tl.to(hb, { boxShadow: '0 0 0 3px ' + C.accent + ', 0 0 22px ' + C.accent, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, at + hb.length * 0.18 + 0.2);
      if (s.body) wordsIn(tl, c.querySelector('.b'), t0 + 1.2, 0.05);
      if (s.credit) tl.fromTo(c.querySelector('.cr'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, t0 + 1.0);
    } };
  },
  // a calendar page: month bar, big counting day, year, caption
  date(s, k) {
    const c = panel(k);
    c.innerHTML = '<div class="stack center dt"><div class="cal"><div class="calh">' + esc(s.month) + '</div><div class="cald" dir="ltr">' + esc(s.day) + '</div><div class="caly" dir="ltr">' + esc(s.year || '') + '</div></div>' +
      (s.title ? '<div class="t">' + words(s.title) + '</div>' : '') + (s.body ? '<div class="b">' + words(s.body) + '</div>' : '') + '</div>';
    return { build(tl, t0) {
      const cal = c.querySelector('.cal');
      tl.fromTo(cal, { rotateX: -90, opacity: 0, transformOrigin: '50% 0%' }, { rotateX: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' }, t0 + 0.2); cue(t0 + 0.25, 'impact', 0.45);
      counter(tl, c.querySelector('.cald'), s.day, t0 + 0.3, 0.9);
      tl.fromTo(c.querySelector('.caly'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, t0 + 0.9);
      if (s.title) wordsIn(tl, c.querySelector('.t'), t0 + 1.0, 0.08);
      if (s.body) wordsIn(tl, c.querySelector('.b'), t0 + 1.5, 0.05);
    } };
  },
  // horizontal time/size bars (e.g. 6 months vs a few days) with counters
  hbars(s, k) {
    const c = panel(k);
    const rows = s.rows || [], max = Math.max(1, ...rows.map(r => +r.value || 0));
    c.innerHTML = '<div class="stack">' + (s.icon ? '<div class="icowrap sm">' + icon(s.icon, 24) + '</div>' : '') + (s.title ? '<div class="t">' + words(s.title) + '</div>' : '') + '<div class="hb">' +
      rows.map((r, i) => '<div class="hr' + (r.hi ? ' hi' : '') + '"><div class="hh"><span class="hn">' + esc(r.big || '') + '</span><span class="hlab">' + esc(r.label || '') + '</span></div><div class="ht"><div class="hf" style="width:' + Math.max(2.5, (+r.value / max) * 100) + '%"></div></div></div>').join('') + '</div>' +
      (s.body ? '<div class="b">' + words(s.body) + '</div>' : '') + '</div>';
    return { build(tl, t0) {
      drawIcons(tl, c, t0 + 0.1);
      if (s.title) wordsIn(tl, c.querySelector('.t'), t0 + 0.15, 0.07);
      c.querySelectorAll('.hr').forEach((r, i) => { const at = t0 + 0.6 + i * 0.9;
        tl.fromTo(r, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, at);
        tl.fromTo(r.querySelector('.hf'), { scaleX: 0 }, { scaleX: 1, duration: rows[i].hi ? 0.5 : 1.1, ease: rows[i].hi ? 'back.out(3)' : 'power2.out' }, at + 0.2);
        cue(at + 0.22, rows[i].hi ? 'pop' : 'whoosh-soft', 0.4); });
      if (s.body) wordsIn(tl, c.querySelector('.b'), t0 + 0.8 + rows.length * 0.9, 0.05);
    } };
  },
  // FULL-SCREEN environment: the picture leaves the card and fills the screen; a virtual camera
  // pans/zooms across it (stops: [x, y, zoom, at] — x/y = point of the picture at the centre, 0..1).
  // Enters by growing out of the card shape (or an iris), leaves by shrinking back into the card world.
  focus(s, k) {
    const c = panel(k, 'ghost');
    const L = el('div', 'fs');
    const rings = (s.rings || (s.ring ? [{ at: s.ringAt || 1, xy: s.ring, label: s.ringLabel }] : []));
    L.innerHTML = '<img class="fsbg" src="' + s.image + '"><div class="fsw"><img src="' + s.image + '">' + rings.map(r => '<svg class="ring fsr" viewBox="0 0 100 100" preserveAspectRatio="none" style="left:' + (r.xy[0] - r.xy[2]) * 100 + '%;top:0;width:' + r.xy[2] * 200 + '%;height:0" data-xy="' + r.xy.join(',') + '"><ellipse cx="50" cy="50" rx="46" ry="46" pathLength="100"/></svg>' + (r.label ? '<div class="rlab fsl" data-xy="' + r.xy.join(',') + '">' + esc(r.label) + '</div>' : '')).join('') + '</div>' +
      '<div class="fsshade"></div>' + (s.title ? '<div class="fst' + (s.big ? ' big' : '') + '">' + (s.chip ? '<div class="tag fschip">' + icon(s.chipIcon || 'eye', 14) + esc(s.chip) + '</div>' : '') + '<div class="t' + (s.big ? ' xl' : '') + '">' + words(s.title) + '</div>' + (s.body ? '<div class="b">' + words(s.body) + '</div>' : '') + '</div>' : '') +
      (s.credit ? '<div class="fscr">' + cred(s.credit) + '</div>' : '');
    fsHost.appendChild(L);
    const st = (s.stops || [[0.5, 0.5, 1, 0]]).map(a => ({ x: a[0], y: a[1], z: a[2], at: a[3] || 0, cy: a[4] == null ? 320 : a[4] }));
    const fz = { x: st[0].x, y: st[0].y, z: st[0].z, cy: st[0].cy, cl: k === 0 ? 1 : 0 };
    FOCI.push({ L, fz, img: L.querySelector('img'), wrap: L.querySelector('.fsw') });
    return { focus: true, build(tl, t0, dur) {
      const first = k === 0, inMode = s.enter || (first ? 'none' : 'grow'), outMode = s.exit || 'shrink';
      const tin = first ? 0 : t0 - 0.38, tout = t0 + dur - 0.42;
      const F = FOCI.find(f => f.L === L); F.tin = tin; F.tout = tout + 0.62; F.inMode = inMode; F.outMode = outMode; F.mid = tout - 0.001;
      if (inMode === 'none') fz.cl = 1;
      else { tl.fromTo(fz, { cl: 0 }, { cl: 1, duration: 0.7, ease: 'expo.inOut', immediateRender: false }, tin); cue(tin + 0.1, 'whoosh', 0.5); }
      // camera stops on the picture
      st.slice(1).forEach((q, i) => { const prev = st[i]; tl.fromTo(fz, { x: prev.x, y: prev.y, z: prev.z, cy: prev.cy }, { x: q.x, y: q.y, z: q.z, cy: q.cy, duration: Math.max(0.3, q.at - prev.at), ease: q.ease || 'power2.inOut', immediateRender: false }, t0 + prev.at); if (Math.abs(q.z - prev.z) > 0.6) cue(t0 + prev.at + 0.1, 'whoosh-soft', 0.35); });
      if (st.length === 1) tl.fromTo(fz, { z: st[0].z }, { z: st[0].z * 1.06, duration: dur, ease: 'none', immediateRender: false }, t0);
      L.querySelectorAll('.fsr ellipse').forEach((e, i) => { const at = t0 + rings[i].at; tl.fromTo(e, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, at); cue(at + 0.05, 'pop', 0.45); });
      L.querySelectorAll('.fsl').forEach((e, i) => tl.fromTo(e, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, t0 + rings.filter(r => r.label)[i].at + 0.35));
      const tt = L.querySelector('.fst');
      if (tt) { if (first) { const ws = tt.querySelectorAll('.t .w'); if (ws.length) tl.fromTo(ws[ws.length - 1], { color: C.text }, { color: C.accent, duration: 0.5 }, 0.6); }
        else { const ta = t0 + (s.titleAt || 0.15); tl.fromTo(tt, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', immediateRender: false }, ta); wordsIn(tl, tt.querySelector('.t'), ta + 0.05, 0.07); }
        if (s.titleOut != null) tl.fromTo(tt, { opacity: 1, y: 0 }, { opacity: 0, y: 16, duration: 0.45, ease: 'power2.in', immediateRender: false }, t0 + s.titleOut);
        const ch = tt.querySelector('.fschip'); if (ch) drawIcons(tl, ch, t0 + 0.2);
        if (s.body) wordsIn(tl, tt.querySelector('.b'), t0 + 0.9, 0.05); }
      if (s.credit) tl.fromTo(L.querySelector('.fscr'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, t0 + 0.8);
      tl.fromTo(fz, { cl: 1 }, { cl: 0, duration: 0.6, ease: 'expo.inOut', immediateRender: false }, tout);
    } };
  },
  end(s, k) {
    const c = panel(k, 'endp');
    c.innerHTML = '<div class="stack center endst"><div class="kslot"></div><div class="pill big">تابع كريتيفيا</div><div class="handle" dir="ltr">@creativia.mag</div><div class="hand">' + esc(s.note || 'كل يوم شي مبدع، الساعة 9 بالليل') + '</div></div>';
    const kr = kretiEl(c.querySelector('.kslot'), 'wave', 128, 'position:relative');
    return { build(tl, t0, dur) {
      kretiIn(tl, kr, t0 + 0.15, dur);
      tl.fromTo(c.querySelector('.pill'), { scaleX: 0.2, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.6, ease: 'expo.out' }, t0 + 0.5); cue(t0 + 0.55, 'shimmer', 0.35);
      tl.fromTo(c.querySelector('.handle'), { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, t0 + 0.8);
      tl.fromTo(c.querySelector('.hand'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'power2.out' }, t0 + 1.1);
    } };
  }
};

// ---------- master timeline + camera ----------
const master = gsap.timeline({ paused: true });
const cam = { x: 0, y: 0, z: 1, r: 0, blur: 0 };
let t = 0; const built = [];
D.scenes.forEach((s, k) => { const b = (B[s.type] || B.image)(s, k); built.push({ s, b, t0: t, p: panels[k] }); t += s.dur; });
const TOTAL = t;
// camera language: varied moves on a steady beat (flights are 2, 3 or 4 half-beats of 0.25 s)
const MOVES = ['travel', 'dive', 'through', 'travel', 'swing', 'whip', 'dive', 'through', 'travel', 'swing', 'whip', 'dive'];
const FLIGHT = { travel: 0.75, dive: 1.0, through: 0.75, swing: 1.0, whip: 0.5 };
const DRIFT = ['push', 'driftL', 'pull', 'driftR', 'rise', 'push', 'tiltL', 'pull', 'driftR', 'tiltR'];
Object.assign(cam, { x: built[0].p.x, y: built[0].p.y, z: 1, r: -built[0].p.rot });
let landedAt = [0];
built.forEach(({ s, b, t0, p }, k) => {
  if (k > 0) {
    const q = built[k - 1].p, mode = s.camera || MOVES[(k - 1) % MOVES.length], F = FLIGHT[mode] || 0.75, f0 = t0 - F / 2, h = F / 2;
    const dir = Math.sign(p.x - q.x) || 1;
    if (mode === 'through') {
      // zoom INTO the current panel, cut on the fastest frame, land from wide on the next
      master.to(cam, { z: 2.6, duration: h, ease: 'power3.in' }, f0);
      master.to(cam, { blur: 5, duration: h, ease: 'power3.in' }, f0);
      master.set(cam, { x: p.x, y: p.y, z: 0.62, r: -p.rot + dir * 4 }, f0 + h);
      master.to(cam, { z: 1, r: -p.rot, blur: 0, duration: h + 0.15, ease: 'expo.out' }, f0 + h);
      cue(f0 + h * 0.7, 'whoosh', 0.55);
    } else {
      const zMid = { travel: 0.78, dive: 0.5, swing: 0.62, whip: 0.86 }[mode];
      const ease = mode === 'whip' ? 'expo.inOut' : 'power3.inOut';
      master.to(cam, { x: p.x, y: p.y, duration: F, ease }, f0);
      master.to(cam, { r: -p.rot, duration: F, ease: 'power2.inOut' }, f0);
      if (mode === 'swing') master.to(cam, { r: -p.rot - dir * 8, duration: h, ease: 'sine.in', yoyo: true, repeat: 1 }, f0);
      master.to(cam, { z: zMid, duration: h, ease: 'power2.in' }, f0);
      master.to(cam, { z: 1, duration: h, ease: mode === 'dive' ? 'back.out(1.5)' : 'power3.out' }, f0 + h);
      master.to(cam, { blur: mode === 'whip' ? 6 : 3, duration: h, ease: 'power2.in', yoyo: true, repeat: 1 }, f0);
      cue(f0 + h * 0.6, mode === 'whip' ? 'whip' : 'whoosh', mode === 'travel' ? 0.42 : 0.52);
    }
    landedAt[k] = t0 + F / 2 + (mode === 'through' ? 0.15 : 0);
  }
  // inside the scene the camera keeps moving, a different gesture each time
  const nextF = k < built.length - 1 ? (FLIGHT[built[k + 1].s.camera || MOVES[k % MOVES.length]] || 0.75) / 2 : 0;
  const start = landedAt[k], end = t0 + s.dur - nextF, len = end - start;
  if (len > 0.6) {
    const g = b.payoff ? 'payoff' : (s.drift || DRIFT[k % DRIFT.length]);
    const base = { x: p.x, y: p.y, r: -p.rot };
    const T = { push: { z: 1.04 }, pull: { z: 0.98, from: { z: 1.05 } }, driftL: { x: base.x - 14, z: 1.03 }, driftR: { x: base.x + 14, z: 1.03 }, rise: { y: base.y - 8, z: 1.04 },
      tiltL: { r: base.r - 1.6, z: 1.04 }, tiltR: { r: base.r + 1.6, z: 1.04 }, payoff: { z: 1.09 } }[g];
    if (T.from) master.fromTo(cam, T.from, Object.assign({ duration: len, ease: 'sine.inOut' }, { z: T.z }), start);
    else master.to(cam, Object.assign({ duration: len, ease: g === 'payoff' ? 'power3.out' : 'sine.inOut' }, T), start);
  }
  b.build(master, t0, s.dur);
});

// ---------- word-synced subtitles (from ElevenLabs timestamps; proportional timing as a fallback) ----------
const SUBS = D.subtitles !== false && built.some(x => x.s.vtext);
if (SUBS) {
  const box = el('div', 'subs'); stage.appendChild(box);
  const isKey = (w, s) => /[0-9A-Za-z]/.test(w) || (s.hl || []).some(h => w.replace(/[،.؟?!…:]/g, '').indexOf(h) === 0);
  built.forEach(({ s, t0 }) => {
    if (!s.vtext) return;
    let ws = s.vwords;
    if (!ws || !ws.length) { const raw = s.vtext.split(/\s+/).filter(Boolean), tot = raw.reduce((a, w) => a + w.length + 1, 0); let acc = 0; ws = raw.map(w => { const a = acc; acc += w.length + 1; return { w, s: a / tot * s.vdur, e: acc / tot * s.vdur }; }); }
    const base = t0 + (D.vlead || 0.35);
    const chunks = []; let cur = [];
    ws.forEach((w, i) => { cur.push(w); const len = cur.reduce((a, x) => a + x.w.length + 1, 0); const nextLen = ws[i + 1] ? len + ws[i + 1].w.length : 0;
      if (/[،.؟?!…:]$/.test(w.w) || cur.length >= 5 || nextLen > 27) { chunks.push(cur); cur = []; } });
    if (cur.length) chunks.push(cur);
    chunks.forEach((ch, j) => {
      const a = base + ch[0].s - 0.08, b = j < chunks.length - 1 ? base + chunks[j + 1][0].s - 0.08 : base + ch[ch.length - 1].e + 0.35;
      const d = el('div', 'sub', ch.map(x => '<span class="sw' + (isKey(x.w, s) ? ' k' : '') + '"' + (latin(x.w.replace(/[،.؟?!…]/g, '')) ? ' dir="ltr" style="unicode-bidi:isolate"' : '') + '>' + esc(x.w) + '</span>').join(' '));
      box.appendChild(d);
      master.set(d, { opacity: 0 }, 0);
      master.fromTo(d, { opacity: 0, y: 10, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.18, ease: 'power2.out' }, a);
      master.to(d, { opacity: 0, y: -6, duration: 0.12, ease: 'power1.in' }, Math.max(a + 0.2, b - 0.12));
      d.querySelectorAll('.sw').forEach((sp, i) => master.fromTo(sp, { opacity: 0.38 }, { opacity: 1, duration: 0.1 }, base + ch[i].s));
    });
  });
}
master.set({}, {}, TOTAL);

// shine on all panel rims across the whole film (constant, the world is alive)
master.to(panels.map(p => p.el.querySelector('.rim')), { '--a': TOTAL * 50 + 'deg', duration: TOTAL, ease: 'none' }, 0);
panels.forEach((p, i) => master.fromTo(p.el.querySelector('.sheen'), { xPercent: -170 }, { xPercent: 260, duration: 2.6, ease: 'power1.inOut', repeat: Math.floor(TOTAL / 2.6) }, 0.4 + i * 0.37));

// safe band: below the HUD (top ~84) and above Instagram's bottom UI (~470).
// every panel is scaled so that, even at its strongest hold zoom, it never crosses the HUD line.
const BAND_TOP = 98, BAND_BOT = (D.subtitles !== false && D.scenes.some(x => x.vtext)) ? 450 : 470, CY = (BAND_TOP + BAND_BOT) / 2, FIT = BAND_BOT - BAND_TOP - 22;
let fitted = false;
function fitPanels() {
  built.forEach(({ b, p }) => {
    const zHold = b.payoff ? 1.09 : 1.05, H = p.el.offsetHeight, W = p.el.offsetWidth;
    const sc = Math.min(1, FIT / (H * zHold), 352 / (W * zHold));
    p.el.style.transform = 'translate(-50%,-50%) rotate(' + p.rot + 'deg) scale(' + sc.toFixed(3) + ')';
  });
  fitted = true;
}
function applyCam() {
  if (!fitted) fitPanels();
  world.style.transform = 'translate(' + VW / 2 + 'px,' + CY + 'px) scale(' + cam.z + ') rotate(' + cam.r + 'deg) translate(' + (-cam.x) + 'px,' + (-cam.y) + 'px)';
  world.style.filter = cam.blur > 0.05 ? 'blur(' + cam.blur.toFixed(2) + 'px)' : 'none';
  par.style.transform = 'translate(' + (-cam.x * 0.18) + 'px,' + (-cam.y * 0.18) + 'px) scale(' + (0.9 + cam.z * 0.1) + ')';
}
window.TOTAL = TOTAL; window.CUES = CUES;
const videos = built.filter(x => x.b.video).map(x => x.b.video);
function applyFocus(time) {
  for (const f of FOCI) {
    const on = time >= f.tin && time <= f.tout; f.L.style.visibility = on ? 'visible' : 'hidden'; if (!on) continue;
    f.L.dataset.mode = time < f.mid ? f.inMode : f.outMode;
    const iw = f.img.naturalWidth || 900, ih = f.img.naturalHeight || 1200, s0 = Math.max(VW / iw, VH / ih), W = iw * s0, H = ih * s0, z = f.fz.z;
    let tx = VW / 2 - f.fz.x * W * z, ty = f.fz.cy - f.fz.y * H * z;
    if (W * z >= VW) tx = Math.min(0, Math.max(VW - W * z, tx)); else tx = (VW - W * z) / 2;
    if (H * z >= VH) ty = Math.min(0, Math.max(VH - H * z, ty));
    f.wrap.style.width = W + 'px'; f.wrap.style.height = H + 'px';
    f.wrap.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + z + ')';
    f.wrap.querySelectorAll('[data-xy]').forEach(n => { const [x, y, r] = n.dataset.xy.split(',').map(Number);
      if (n.tagName === 'svg') { n.style.left = (x - r) * W + 'px'; n.style.top = (y * H - r * W) + 'px'; n.style.width = 2 * r * W + 'px'; n.style.height = 2 * r * W + 'px'; }
      else { n.style.left = (x - r * 0.55) * W + 'px'; n.style.top = (y * H + r * W * 1.02) + 'px'; n.style.transform = 'scale(' + (1 / z) + ')'; n.style.transformOrigin = '0 0'; } });
    const c = f.fz.cl, m = f.L.dataset.mode;
    if (m === 'iris') f.L.style.clipPath = 'circle(' + (c * 76) + '% at 50% 46%)';
    else if (m === 'none' && c >= 1) f.L.style.clipPath = 'none';
    else { const a = 1 - c; f.L.style.clipPath = 'inset(' + (a * 110) + 'px ' + (a * 30) + 'px ' + (a * 200) + 'px ' + (a * 30) + 'px round ' + (a * 28) + 'px)'; }
  }
}
window.drawFrame = function (time) {
  master.seek(time, false);
  applyCam(); applyFocus(time);
  for (const v of videos) { const n = Math.min(+v.img.dataset.n - 1, Math.max(0, Math.floor((time - v.t0) * 30))); const src = v.img.dataset.dir + '/f' + String(n + 1).padStart(4, '0') + '.jpg'; if (v.img.getAttribute('src') !== src) v.img.setAttribute('src', src); }
};
`;

module.exports.CSS = (C) => `
body{margin:0;background:#000}
#stage{position:relative;width:360px;height:640px;overflow:hidden;font-family:'Rubik',sans-serif;color:${C.text};direction:rtl}
.layer{position:absolute;inset:0}
.par{position:absolute;left:0;top:0;width:1px;height:1px;transform-origin:0 0}
.blob{position:absolute}
.grain{opacity:0.07;background-size:180px;pointer-events:none}
.world{position:absolute;left:0;top:0;width:1px;height:1px;transform-origin:0 0}
.gridw{position:absolute;left:-2000px;top:-2000px;width:6000px;height:9000px;background-size:44px 44px;opacity:0.5}
.hud{position:absolute;top:62px;right:22px;left:22px;display:flex;justify-content:space-between;align-items:center;z-index:10}
.badge{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:${C.muted}}
.badge i{width:7px;height:7px;border-radius:50%;background:${C.accent};box-shadow:0 0 8px ${C.accent}}
.panel{--a:0deg;position:absolute;width:304px;border-radius:30px;overflow:hidden;background:linear-gradient(160deg,rgba(255,255,255,0.17),${C.glass} 45%,rgba(255,255,255,0.04));backdrop-filter:blur(18px) saturate(150%);box-shadow:inset 0 1px 0 rgba(255,255,255,0.35),inset 0 -24px 44px ${C.glow},0 0 50px ${C.glow},0 28px 60px ${C.shadow}}
.panel.clear{background:transparent;box-shadow:none;backdrop-filter:none}.panel.clear .rim,.panel.clear .sheen{display:none}
.rim{position:absolute;inset:0;border-radius:inherit;padding:1.5px;background:conic-gradient(from var(--a),${C.rim},rgba(255,255,255,0.05) 25%,${C.soft} 50%,rgba(255,255,255,0.05) 75%,${C.rim});-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;z-index:2;pointer-events:none}
.sheen{position:absolute;top:0;bottom:0;width:45%;background:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,0.11) 50%,rgba(255,255,255,0) 70%);z-index:2;pointer-events:none}
.inner{position:relative;padding:12px;box-sizing:border-box;display:flex;flex-direction:column;gap:4px}
.w{display:inline-block}
.t{font-weight:800;font-size:23px;line-height:1.3}
.t.xl{font-size:33px;line-height:1.25}
.t.xxl{font-size:38px;line-height:1.3;text-align:center;text-shadow:0 0 30px ${C.glow}}
.b{font-size:15px;line-height:1.6;color:${C.muted}}
.cr{font-size:11px;color:${C.muted}}
.stack{display:flex;flex-direction:column;gap:12px;padding:12px 10px}
.stack.center{align-items:stretch;text-align:right}
.hook .stack{min-height:270px;justify-content:center;padding-bottom:84px;box-sizing:border-box}
.icowrap{width:52px;height:52px;border-radius:16px;background:${C.glass};border:1px solid ${C.rim};display:flex;align-items:center;justify-content:center}
.icowrap.sm{width:42px;height:42px;border-radius:13px}
.pill{align-self:flex-start;display:flex;align-items:center;gap:9px;padding:10px 20px;border-radius:999px;background:${C.glass};border:1.5px solid ${C.rim};font-size:21px;font-weight:800;box-shadow:0 0 24px ${C.glow}}
.pill i{width:9px;height:9px;border-radius:50%;background:${C.accent};box-shadow:0 0 10px ${C.accent}}
.pill.big{align-self:center;font-size:21px;padding:11px 26px}
.ph{position:relative;flex:none;height:236px;border-radius:20px;overflow:hidden;border:1px solid ${C.rim}}
.kb{position:absolute;inset:0}.kb img{width:100%;height:100%;display:block}
.vtag{position:absolute;left:10px;top:10px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,0.5);color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center}
.chip{position:absolute;top:22px;right:22px;display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:rgba(0,0,0,0.42);backdrop-filter:blur(10px);color:#fff;font-size:12px;font-weight:700;z-index:3}
.txt{display:flex;flex-direction:column;gap:8px;padding:12px 10px 10px}
.stat{display:flex;flex-direction:column;gap:10px;padding:14px 12px}
.stat.solo{align-items:center;text-align:center;gap:14px;min-height:280px;justify-content:center;box-sizing:border-box}.stat.solo .icowrap{width:64px;height:64px;border-radius:20px}.stat.solo .num{font-size:88px;text-align:center}.stat.solo .t{text-align:center;font-size:24px}.stat.solo .b{text-align:center}
.num{font-size:62px;font-weight:800;line-height:1;color:${C.accent};text-shadow:0 0 30px ${C.glow};text-align:right}
.bars{display:flex;align-items:flex-end;gap:18px;height:120px;padding:0 4px;direction:ltr}
.bar{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px}
.bf{width:100%;border-radius:10px 10px 4px 4px;background:linear-gradient(180deg,${C.soft},rgba(46,232,107,0.25));transform-origin:50% 100%}
.bar.hi .bf{background:linear-gradient(180deg,#9BFFC2,${C.accent});box-shadow:0 0 18px ${C.glow}}
.bv{font-size:12px;font-weight:800;color:${C.text}}.bl{font-size:11px;color:${C.muted};direction:rtl}
.nbadge{position:absolute;top:22px;left:22px;padding:8px 14px;border-radius:16px;background:${C.accent};color:#0B1410;font-size:26px;font-weight:800;box-shadow:0 0 24px ${C.glow};z-index:3}
.tag{align-self:flex-start;display:flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;background:${C.glass};border:1px solid ${C.rim};font-size:12px;font-weight:700;color:${C.ink}}
.rows{display:flex;flex-direction:column;gap:9px}
.row{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:16px;background:rgba(255,255,255,0.07);border:1px solid ${C.rim};font-size:15px}
.rn{flex:none;width:30px;height:30px;border-radius:10px;background:${C.accent};color:#0B1410;font-weight:800;display:flex;align-items:center;justify-content:center}
.cmp{padding:12px 14px;border-radius:18px;background:rgba(255,255,255,0.06);border:1.5px solid ${C.rim}}
.cmp.bad{border-color:rgba(255,107,107,0.55)}.cmp.good{border-color:rgba(46,232,107,0.7)}
.ch{display:flex;align-items:center;gap:9px;font-size:17px;font-weight:800;margin-bottom:4px}
.dot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;color:#0B1410}
.bad .dot{background:#FF6B6B}.good .dot{background:#2EE86B}
.cb{font-size:14.5px;line-height:1.5;color:${C.muted}}
.kreti{position:absolute;filter:drop-shadow(0 14px 22px rgba(0,0,0,0.35));z-index:3}
.endst{align-items:center!important;text-align:center!important;gap:10px}
.kslot{height:128px;width:128px;position:relative}
.handle{font-size:15px;font-weight:700;color:${C.muted}}
.hand{font-family:'Playpen Sans Arabic',sans-serif;font-size:15.5px;color:${C.ink}}
.vs{position:relative;display:flex;gap:30px;align-items:flex-start}
.vi{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px}
.vimg{position:relative;width:100%;height:178px;border-radius:14px;overflow:hidden;border:1px solid ${C.rim};box-shadow:0 10px 24px rgba(0,0,0,0.35)}.vimg img{width:100%;height:100%;display:block}
.vl{font-size:15px;font-weight:800}.vs2{font-size:11px;color:${C.muted}}
.vsym{position:absolute;left:50%;top:89px;width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;background:${C.accent};color:#0B1410;font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px ${C.glow};z-index:3}
.vtagx{position:absolute;bottom:8px;right:8px;left:8px;text-align:center;padding:4px 6px;border-radius:9px;background:rgba(0,0,0,0.62);color:#fff;font-size:11px;font-weight:700}.vtagx.warn{background:#FFD23F;color:#0B1410}
.slc{position:relative;align-self:center;border-radius:16px}
.tile{position:absolute;overflow:hidden;border-radius:6px}.tile img{position:absolute;max-width:none;object-fit:cover}
.tile .x{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:30px;font-weight:800;color:#FF6B6B;opacity:0}
.cuts{position:absolute;left:0;top:0;z-index:2}.cuts line{stroke:${C.accent};stroke-width:2.5;stroke-linecap:round;filter:drop-shadow(0 0 4px ${C.accent})}
.res{position:absolute;inset:0;border-radius:14px;overflow:hidden;opacity:0;border:1px solid ${C.rim};box-shadow:0 0 30px ${C.glow}}.res img{width:100%;height:100%;display:block}
.slc .chip{top:-12px;right:10px}
.gal{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 9px}
.gi{display:flex;flex-direction:column;align-items:center;gap:4px}
.gimg{position:relative;width:100%;aspect-ratio:0.72;border-radius:10px;overflow:hidden;border:1px solid ${C.rim}}.gimg img{width:100%;height:100%;object-fit:cover;display:block}
.hlb{position:absolute;border:2.5px solid ${C.accent};border-radius:8px;background:rgba(46,232,107,0.12);opacity:0}
.gl{font-size:11px;font-weight:700;color:${C.muted}}
.dt{align-items:center!important;text-align:center!important;gap:14px}.dt .t,.dt .b{text-align:center}
.cal{width:150px;border-radius:22px;overflow:hidden;background:#F4FBF6;box-shadow:0 18px 40px rgba(0,0,0,0.4);text-align:center}
.calh{background:${C.accent};color:#0B1410;font-weight:800;font-size:17px;padding:8px 0}
.cald{font-size:78px;font-weight:800;line-height:1.05;color:#0B1410;padding-top:4px}.caly{font-size:15px;font-weight:700;color:#46594D;padding-bottom:10px}
.hb{display:flex;flex-direction:column;gap:16px}
.hh{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}.hn{font-size:30px;font-weight:800;color:${C.text}}.hr.hi .hn{color:${C.accent};text-shadow:0 0 20px ${C.glow}}.hlab{font-size:13px;color:${C.muted}}
.ht{height:14px;border-radius:99px;background:rgba(255,255,255,0.08);overflow:hidden}.hf{height:100%;border-radius:99px;background:linear-gradient(270deg,${C.soft},rgba(46,232,107,0.35));transform-origin:100% 50%}.hr.hi .hf{background:${C.accent};box-shadow:0 0 14px ${C.accent}}
.ring{position:absolute;z-index:3;overflow:visible}.ring ellipse{fill:none;stroke:#FFD23F;stroke-width:4;stroke-dasharray:100 110;stroke-dashoffset:100;vector-effect:non-scaling-stroke;filter:drop-shadow(0 0 6px rgba(255,210,63,0.8))}
.rlab{position:absolute;z-index:3;padding:4px 10px;border-radius:999px;background:#FFD23F;color:#0B1410;font-size:12px;font-weight:800;white-space:nowrap}
.subs{position:absolute;left:14px;right:14px;top:458px;height:40px;z-index:11;pointer-events:none}
.sub{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-wrap:nowrap;gap:0 6px;font-size:17px;font-weight:800;white-space:nowrap;text-shadow:0 2px 10px rgba(0,0,0,0.7)}
.sub .sw{opacity:0.38;color:${C.text}}.sub .sw.k{color:${C.accent}}
.pbg{position:absolute;inset:-20px;width:calc(100% + 40px);height:calc(100% + 40px);object-fit:cover;filter:blur(18px) brightness(0.55)}.poster .kb img{filter:drop-shadow(0 8px 18px rgba(0,0,0,0.5))}
.fshost{z-index:5;pointer-events:none}
.fs{position:absolute;inset:0;overflow:hidden;background:#000;visibility:hidden}
.fsw{position:absolute;left:0;top:0;transform-origin:0 0}.fsw img{width:100%;height:100%;display:block;object-fit:fill}
.fsr{position:absolute;overflow:visible}.fsr ellipse{stroke-width:5}
.fsl{position:absolute;font-size:14px;padding:5px 12px}
.fsshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,15,10,0.55) 0%,rgba(5,15,10,0) 22%,rgba(5,15,10,0) 42%,rgba(5,15,10,0.7) 62%,rgba(5,15,10,0.92) 100%)}
.fst{position:absolute;left:22px;right:22px;bottom:192px;display:flex;flex-direction:column;gap:8px;text-shadow:0 2px 14px rgba(0,0,0,0.6)}
.fst .t{font-size:25px}.fst.big .t{font-size:34px}
.fschip{background:rgba(0,0,0,0.45);color:#fff}
.fscr{position:absolute;right:22px;top:92px;font-size:10px;color:rgba(255,255,255,0.7)}
.panel.ghost{visibility:hidden}
.fsbg{position:absolute;inset:-40px;width:calc(100% + 80px);height:calc(100% + 80px);object-fit:cover;filter:blur(26px) brightness(0.45) saturate(1.2)}
.fsw{box-shadow:0 20px 60px rgba(0,0,0,0.55)}
.panel.wide{width:336px}
.wide .stack{padding:8px 4px;gap:8px}.wide .gal{gap:6px 6px}.gimg .gl{position:absolute;left:0;right:0;bottom:0;padding:14px 4px 4px;text-align:center;font-size:10px;font-weight:800;color:#fff;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.85))}
.ov .ph{height:330px}
.ov .txt{position:absolute;left:12px;right:12px;bottom:12px;z-index:3;padding:56px 14px 12px;border-radius:0 0 20px 20px;background:linear-gradient(180deg,rgba(4,12,8,0) 0%,rgba(4,12,8,0.72) 45%,rgba(4,12,8,0.92) 100%);gap:6px}
.ov .txt .t{font-size:21px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,0.6)}.ov .txt .b{color:rgba(255,255,255,0.8);font-size:13.5px;line-height:1.5}.ov .txt .cr{color:rgba(255,255,255,0.6)}
`;
