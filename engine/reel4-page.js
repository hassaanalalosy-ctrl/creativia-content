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
const grid = el('div', 'gridw', '', 'background-image:linear-gradient(' + C.grid + ' 1px,transparent 1px),linear-gradient(90deg,' + C.grid + ' 1px,transparent 1px)'); world.appendChild(grid);
stage.appendChild(el('div', 'layer grain', '', 'background-image:url(' + D.grain + ')'));
const hud = el('div', 'hud', '<span class="badge"><i></i>' + esc(D.badge || 'كريتيفيا') + '</span><span class="mk">' + D.mark + '</span>'); stage.appendChild(hud);

// ---------- panel placement along a winding path ----------
const PATH = [[0, 0, 0], [430, -120, -3], [820, 160, 2], [1260, 0, -2], [1640, 260, 3], [2080, 80, -2], [2480, -160, 2], [2900, 120, -3], [3320, 0, 2], [3740, 220, -2], [4160, 0, 0], [4560, -200, 2], [4980, 60, -2], [5400, 0, 0]];
const panels = [];
function panel(k, cls) {
  const [x, y, rot] = PATH[k % PATH.length];
  const p = el('div', 'panel ' + (cls || ''), '<div class="rim"></div><div class="sheen"></div><div class="inner"></div>', 'left:' + (x - CW / 2) + 'px;top:' + (y - CH / 2) + 'px;transform:rotate(' + rot + 'deg)');
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
const media = (src, fit) => '<div class="ph"><div class="kb"><img src="' + src + '" style="object-fit:' + (fit || 'cover') + '"></div></div>';

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
    const c = panel(k);
    c.innerHTML = media(s.image, s.fit) + (s.chip ? '<div class="chip">' + icon(s.chipIcon || 'eye', 14) + esc(s.chip) + '</div>' : '') + (s.num ? '<div class="nbadge" dir="ltr">' + esc(s.num) + '</div>' : '') +
      '<div class="txt"><div class="t">' + words(s.title || '') + '</div>' + (s.body ? '<div class="b">' + words(s.body) + '</div>' : '') + (s.credit ? '<div class="cr">' + cred(s.credit) + '</div>' : '') + '</div>';
    return { build(tl, t0, dur) {
      tl.fromTo(c.querySelector('.kb'), { scale: 1.14, xPercent: 2 }, { scale: 1.02, xPercent: -2, duration: dur + 1, ease: 'none' }, t0 - 0.5);
      const e = wordsIn(tl, c.querySelector('.t'), t0 + 0.35, 0.08);
      if (s.body) wordsIn(tl, c.querySelector('.b'), e - 0.25, 0.05);
      const ch = c.querySelector('.chip'); if (ch) { tl.fromTo(ch, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, t0 + 0.55); drawIcons(tl, ch, t0 + 0.6); cue(t0 + 0.58, 'pop', 0.4); }
      if (s.credit) tl.fromTo(c.querySelector('.cr'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, t0 + 1.0);
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
    c.innerHTML = '<div class="stat">' + (s.icon ? '<div class="icowrap sm">' + icon(s.icon, 26) + '</div>' : '') +
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
const FLY = 0.9;                       // camera flight between panels (seconds)
// start on panel 0
Object.assign(cam, { x: built[0].p.x, y: built[0].p.y, z: 1, r: -built[0].p.rot });
built.forEach(({ s, b, t0, p }, k) => {
  if (k > 0) {
    const q = built[k - 1].p, mode = s.camera || ['arc', 'dive', 'swing', 'arc', 'push'][k % 5];
    const f0 = t0 - FLY / 2;
    // fly: pull back while travelling, then land (overshoot a touch on 'dive')
    master.to(cam, { x: p.x, y: p.y, duration: FLY, ease: 'power3.inOut' }, f0);
    master.to(cam, { r: -p.rot + (mode === 'swing' ? 0 : 0), duration: FLY, ease: 'power2.inOut' }, f0);
    if (mode === 'swing') master.to(cam, { r: -p.rot + (k % 2 ? 6 : -6), duration: FLY * 0.5, ease: 'power2.in', yoyo: true, repeat: 1 }, f0);
    master.to(cam, { z: mode === 'dive' ? 0.42 : mode === 'push' ? 0.8 : 0.58, duration: FLY * 0.5, ease: 'power2.in' }, f0);
    master.to(cam, { z: 1, duration: FLY * 0.5, ease: mode === 'dive' ? 'back.out(1.4)' : 'power3.out' }, f0 + FLY * 0.5);
    master.fromTo(cam, { blur: 0 }, { blur: 3.5, duration: FLY * 0.5, ease: 'power2.in', yoyo: true, repeat: 1, immediateRender: false }, f0);
    cue(f0 + FLY * 0.25, k % 3 === 0 ? 'whip' : 'whoosh', 0.5);
  }
  // inside the scene: slow push in (the camera keeps moving while the panel plays)
  const landed = k === 0 ? 0 : t0 + FLY / 2;
  const holdEnd = t0 + s.dur - (k < built.length - 1 ? FLY / 2 : 0);
  if (holdEnd - landed > 0.6) master.to(cam, { z: b.payoff ? 1.08 : 1.045, duration: holdEnd - landed, ease: b.payoff ? 'power2.out' : 'sine.inOut' }, landed);
  b.build(master, t0, s.dur);
});
master.set({}, {}, TOTAL);

// shine on all panel rims across the whole film (constant, the world is alive)
master.to(panels.map(p => p.el.querySelector('.rim')), { '--a': TOTAL * 50 + 'deg', duration: TOTAL, ease: 'none' }, 0);
panels.forEach((p, i) => master.fromTo(p.el.querySelector('.sheen'), { xPercent: -170 }, { xPercent: 260, duration: 2.6, ease: 'power1.inOut', repeat: Math.floor(TOTAL / 2.6) }, 0.4 + i * 0.37));

function applyCam() {
  world.style.transform = 'translate(' + VW / 2 + 'px,' + 266 + 'px) scale(' + cam.z + ') rotate(' + cam.r + 'deg) translate(' + (-cam.x) + 'px,' + (-cam.y) + 'px)';
  world.style.filter = cam.blur > 0.05 ? 'blur(' + cam.blur.toFixed(2) + 'px)' : 'none';
  par.style.transform = 'translate(' + (-cam.x * 0.18) + 'px,' + (-cam.y * 0.18) + 'px) scale(' + (0.9 + cam.z * 0.1) + ')';
}
window.TOTAL = TOTAL; window.CUES = CUES;
const videos = built.filter(x => x.b.video).map(x => x.b.video);
window.drawFrame = function (time) {
  master.seek(time, false);
  applyCam();
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
.gridw{position:absolute;left:-1200px;top:-1500px;width:8000px;height:3200px;background-size:44px 44px;opacity:0.5}
.hud{position:absolute;top:62px;right:22px;left:22px;display:flex;justify-content:space-between;align-items:center;z-index:10}
.badge{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:${C.muted}}
.badge i{width:7px;height:7px;border-radius:50%;background:${C.accent};box-shadow:0 0 8px ${C.accent}}
.panel{--a:0deg;position:absolute;width:316px;height:340px;border-radius:30px;overflow:hidden;background:linear-gradient(160deg,rgba(255,255,255,0.17),${C.glass} 45%,rgba(255,255,255,0.04));backdrop-filter:blur(18px) saturate(150%);box-shadow:inset 0 1px 0 rgba(255,255,255,0.35),inset 0 -24px 44px ${C.glow},0 0 50px ${C.glow},0 28px 60px ${C.shadow}}
.panel.clear{background:transparent;box-shadow:none;backdrop-filter:none}.panel.clear .rim,.panel.clear .sheen{display:none}
.rim{position:absolute;inset:0;border-radius:inherit;padding:1.5px;background:conic-gradient(from var(--a),${C.rim},rgba(255,255,255,0.05) 25%,${C.soft} 50%,rgba(255,255,255,0.05) 75%,${C.rim});-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;z-index:2;pointer-events:none}
.sheen{position:absolute;top:0;bottom:0;width:45%;background:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,0.11) 50%,rgba(255,255,255,0) 70%);z-index:2;pointer-events:none}
.inner{position:absolute;inset:0;padding:12px;box-sizing:border-box;display:flex;flex-direction:column}
.w{display:inline-block}
.t{font-weight:800;font-size:23px;line-height:1.3}
.t.xl{font-size:33px;line-height:1.25}
.t.xxl{font-size:38px;line-height:1.3;text-align:center;text-shadow:0 0 30px ${C.glow}}
.b{font-size:15px;line-height:1.6;color:${C.muted}}
.cr{font-size:11px;color:${C.muted}}
.stack{flex:1;display:flex;flex-direction:column;gap:12px;padding:10px 10px;justify-content:center}
.stack.center{align-items:stretch;text-align:right}
.hook .stack{justify-content:center;padding-bottom:70px}
.icowrap{width:52px;height:52px;border-radius:16px;background:${C.glass};border:1px solid ${C.rim};display:flex;align-items:center;justify-content:center}
.icowrap.sm{width:42px;height:42px;border-radius:13px}
.pill{align-self:flex-start;display:flex;align-items:center;gap:9px;padding:10px 20px;border-radius:999px;background:${C.glass};border:1.5px solid ${C.rim};font-size:21px;font-weight:800;box-shadow:0 0 24px ${C.glow}}
.pill i{width:9px;height:9px;border-radius:50%;background:${C.accent};box-shadow:0 0 10px ${C.accent}}
.pill.big{align-self:center;font-size:21px;padding:11px 26px}
.ph{position:relative;flex:none;height:190px;border-radius:20px;overflow:hidden;border:1px solid ${C.rim}}
.kb{position:absolute;inset:0}.kb img{width:100%;height:100%;display:block}
.vtag{position:absolute;left:10px;top:10px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,0.5);color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center}
.chip{position:absolute;top:22px;right:22px;display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:rgba(0,0,0,0.42);backdrop-filter:blur(10px);color:#fff;font-size:12px;font-weight:700;z-index:3}
.txt{flex:1;display:flex;flex-direction:column;justify-content:center;gap:8px;padding:8px 10px 4px}
.stat{flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px;padding:8px 12px}
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
`;
