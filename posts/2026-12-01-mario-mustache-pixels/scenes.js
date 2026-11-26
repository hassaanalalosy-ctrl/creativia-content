// Mario's mustache and cap — pixel limits of Donkey Kong (1981) + the landlord who named him. Directed beats (engine 6), Nov 26 2026.
// Safe zones: nothing above y 124 but the brand row; text right edge ≤ 300 below y 320; text tops ≤ 486.
const fade = (node, t, d) => tl.fromTo(node, { opacity: 0 }, { opacity: 1, duration: d || 0.3, ease: 'power2.out', immediateRender: true }, t);
const fadeOut = (node, t, d) => tl.to(node, { opacity: 0, duration: d || 0.3, ease: 'power2.in' }, t);
const tag = (text, x, y, t, parent, o) => { o = o || {}; const n = el('div', 'tagx', esc(text), 'left:' + x + 'px;top:' + y + 'px;' + (o.css || ''), parent || TX); if (o.ltr) n.setAttribute('dir', 'ltr'); fade(n, t, 0.25); if (o.out != null) fadeOut(n, o.out, 0.2); return n; };
const px = node => { (node.L || node).querySelectorAll('img').forEach(im => { if (!im.classList.contains('fbg')) im.style.imageRendering = 'pixelated'; }); return node; };
const ringMark = (x, y, w, h) => ({ x, y, html: '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="overflow:visible"></svg>' });
const ringIn = (f, i, rx, ry, t, o) => { const s = f.marks[i].n.querySelector('svg'), w = +s.getAttribute('width'), h = +s.getAttribute('height'); return scribble(s, w / 2, h / 2, rx, ry, t, Object.assign({ width: 3 }, o || {})); };
// points of the padded sprite picture idle-bg (18 x 32 sprite pixels)
const MU = [0.333, 0.422], CAP = [0.5, 0.281], MID = [0.5, 0.5];

// ================= 0 · HOOK — the mustache, huge =================
{
  const k = 0;
  textGroup(k, 0.0);
  const f = px(full('idlebg', 0, T1(k) + 0.3, { x: MU[0], y: MU[1], z: 2.4, cx: 180, cy: 236, free: true, shade: 0.25 }, [ringMark(MU[0], MU[1], 140, 90)]));
  ringIn(f, 0, 58, 32, 0.15, { width: 3.5 });
  camTo(f, 0.6, { x: 0.47, y: 0.42, z: 1.35, cy: 236 }, T1(k) - 0.6, 'power1.inOut');
  say(k, 0, 4, { y: 388, size: 26, bg: true, hero: { 3: 40, 4: 40 }, out: W(k, 5).s - 0.32 });
  say(k, 5, 7, { y: 388, size: 28, bg: true, hero: { 7: 44 } });
  fadeOut(f.L, T1(k) - 0.05, 0.3); whip(T1(k) - 0.1);
}

// ================= 1 · 45 YEARS AGO — the Donkey Kong cabinet, Miyamoto =================
{
  const k = 1;
  textGroup(k);
  const f = full('cab', T0(k) - 0.2, T1(k) + 0.3, { x: 0.54, y: 0.42, z: 1.0, cx: 180, cy: 320, free: true, shade: 0.45 });
  fade(f.L, T0(k) - 0.2, 0.35);
  camTo(f, W(k, 7).s - 0.3, { x: 0.54, y: 0.36, z: 2.3, cy: 250 }, 1.4, 'expo.inOut'); cue(W(k, 7).s - 0.25, 'whoosh-soft', 0.35);
  say(k, 0, 3, { y: 136, size: 24, bg: true, hero: { 1: 32, 2: 32 }, out: W(k, 4).s - 0.32 });
  word('1981', 0, 404, 64, W(k, 1).s, { ltr: true, css: 'left:0;right:0;text-align:center', out: W(k, 4).s - 0.3 });
  const m = pic('miya', 110, 200, 140, TX);
  enter(m, W(k, 5).s - 0.2, { x: 60, rotationY: -25, opacity: 0 }, 0.6);
  leave(m, W(k, 7).s - 0.35, { x: -60, opacity: 0 }, 0.3);
  tag('Shigeru Miyamoto', 122, 400, W(k, 5).s, TX, { ltr: true, out: W(k, 7).s - 0.35 });
  say(k, 4, 6, { y: 136, size: 22, bg: true, hero: { 5: 28, 6: 28 }, out: W(k, 7).s - 0.32 });
  say(k, 7, 11, { y: 410, size: 24, bg: true, hero: { 10: 32, 11: 32 } });
  fadeOut(f.L, T1(k) - 0.05, 0.3); flash(T1(k) - 0.1);
}

// ================= 2 · A TINY SCREEN — the hero is a few coloured squares =================
{
  const k = 2, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const s = px(pic('idle', 84, 186, 192, g, { flat: true }));
  s.style.transformOrigin = '50% 50%';
  tl.fromTo(s, { scale: 0.14, opacity: 0 }, { scale: 0.14, opacity: 1, duration: 0.3, immediateRender: true }, T0(k));
  const scr = bracket(sv, 112, 262, 136, 104, T0(k) + 0.15, { len: 16, width: 2.4, out: W(k, 4).s - 0.2 });
  tl.to(s, { scale: 1, duration: 0.9, ease: 'expo.inOut' }, W(k, 4).s - 0.15); cue(W(k, 4).s - 0.1, 'whoosh', 0.4);
  say(k, 0, 3, { y: 128, size: 24, hero: { 3: 32 }, out: W(k, 4).s - 0.32 });
  // the pixel grid (12 x 16 squares) drawn over the sprite
  let d = ''; for (let i = 0; i <= 12; i++) d += 'M' + (84 + i * 16) + ' 186 V442 '; for (let j = 0; j <= 16; j++) d += 'M84 ' + (186 + j * 16) + ' H276 ';
  path(sv, d, W(k, 7).s - 0.1, 0.7, { width: 1, color: 'rgba(155,255,194,0.55)', glow: false });
  say(k, 4, 8, { y: 458, size: 22, hero: { 7: 30 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 3-4 · NO MOUTH → MUSTACHE · HAIR → CAP (one picture, the camera travels) =================
{
  const f = px(full('idlebg', T0(3) - 0.2, T1(4) + 0.3, { x: MID[0], y: MID[1], z: 1.0, cx: 180, cy: 280, free: true, shade: 0.25 }, [ringMark(MU[0], MU[1], 140, 90), ringMark(CAP[0], CAP[1], 220, 100)]));
  fade(f.L, T0(3) - 0.2, 0.35);
  camTo(f, T0(3) + 0.1, { x: MU[0], y: MU[1], z: 2.2, cy: 236 }, 1.1, 'expo.inOut'); cue(T0(3) + 0.15, 'whoosh-soft', 0.35);
  ringIn(f, 0, 54, 30, W(3, 7).s - 0.1, { out: T0(4) + 0.3 });
  camTo(f, T0(4), { x: CAP[0], y: CAP[1] + 0.02, z: 1.9, cy: 236 }, 1.0, 'expo.inOut'); cue(T0(4) + 0.05, 'whoosh-soft', 0.35);
  ringIn(f, 1, 96, 36, W(4, 4).s - 0.1);
  fadeOut(f.L, T1(4) - 0.05, 0.3);
}
{
  const k = 3;
  textGroup(k);
  say(k, 0, 5, { y: 404, size: 22, bg: true, out: W(k, 6).s - 0.32 });
  say(k, 6, 7, { y: 404, size: 28, bg: true, hero: { 7: 44 } });
}
{
  const k = 4;
  textGroup(k);
  say(k, 0, 2, { y: 404, size: 24, bg: true, out: W(k, 3).s - 0.32 });
  say(k, 3, 4, { y: 404, size: 28, bg: true, hero: { 4: 48 } });
  whip(T1(k) - 0.1);
}

// ================= 5 · THE OVERALLS — so the arms show when he runs and jumps =================
{
  const k = 5, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const j = px(pic('jump', 60, 150, 240, g, { flat: true }));
  enter(j, T0(k) - 0.1, { x: 90, opacity: 0 }, 0.6);
  scribble(sv, 75, 255, 24, 22, W(k, 3).s - 0.1, { width: 3 });
  scribble(sv, 277, 255, 24, 22, W(k, 3).s + 0.05, { width: 3 });
  tl.to(j, { y: -26, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 }, W(k, 6).s - 0.05); cue(W(k, 6).s, 'pop', 0.35);
  say(k, 0, 0, { y: 404, size: 36, hero: { 0: 40 }, out: W(k, 1).s - 0.32 });
  say(k, 1, 6, { y: 404, size: 22, hero: { 3: 30 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 6 · HIS NAME WAS JUMPMAN — the arcade marquee =================
{
  const k = 6;
  textGroup(k);
  const f = full('marquee', T0(k) - 0.2, T1(k) + 0.3, { x: 0.45, y: 0.5, z: 1.0, cx: 180, cy: 320, shade: 0.45 });
  fade(f.L, T0(k) - 0.2, 0.35);
  camTo(f, T0(k) + 0.1, { x: 0.89, y: 0.55, z: 1.4, cy: 250 }, W(k, 4).s - T0(k), 'power2.inOut'); cue(T0(k) + 0.15, 'whoosh-soft', 0.35);
  say(k, 0, 3, { y: 136, size: 24, bg: true, hero: { 2: 34, 3: 34 }, out: W(k, 4).s - 0.32 });
  tag('Donkey Kong · 1981', 24, 140, W(k, 4).s, TX, { ltr: true });
  say(k, 4, 7, { y: 420, size: 24, bg: true, hero: { 5: 34 } });
  fadeOut(f.L, T1(k) - 0.05, 0.3); flash(T1(k) - 0.1);
}

// ================= 7 · THE LANDLORD WALKS IN — late rent =================
{
  const k = 7, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const p = pic('seg', 36, 150, 150, g);
  enter(p, W(k, 1).s - 0.2, { x: -50, rotationY: 25, opacity: 0 }, 0.6);
  bracket(sv, 32, 146, 158, 161, W(k, 2).s, { len: 16, width: 2.4 });
  say(k, 0, 5, { x: 204, w: 128, y: 150, size: 20 });
  tl.fromTo(p, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)', immediateRender: false }, W(k, 6).s); cue(W(k, 6).s, 'impact', 0.4);
  say(k, 6, 9, { y: 360, size: 26, hero: { 9: 40 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 8 · HIS NAME: MARIO SEGALE → Jumpman becomes Mario =================
{
  const k = 8, g = group(T0(k) - 0.1, T1(k) + 0.1);
  textGroup(k);
  const p = pic('seg', 105, 140, 150, g);
  enter(p, T0(k) - 0.1, { scale: 0.85, opacity: 0 }, 0.5);
  tag('Mario Segale', 130, 306, W(k, 1).s, g, { ltr: true });
  say(k, 0, 2, { y: 344, size: 26, hero: { 1: 36, 2: 36 }, out: W(k, 3).s - 0.32 });
  say(k, 3, 8, { y: 344, size: 22, hero: { 8: 32 } });
  const jm = word('Jumpman', 0, 410, 40, W(k, 3).s, { hero: false, ltr: true, css: 'left:0;right:0;text-align:center;color:#9BFFC2' });
  tl.to(jm, { rotationX: 90, opacity: 0, duration: 0.2, ease: 'power2.in' }, W(k, 8).s - 0.3);
  word('Mario', 0, 410, 44, W(k, 8).s - 0.05, { ltr: true, css: 'left:0;right:0;text-align:center', from: 1.15 }); cue(W(k, 8).s, 'shimmer', 0.35);
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 9 · TWO YEARS LATER — Mario Bros. (1983), a plumber =================
{
  const k = 9, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  ghost('1983', 40, 470, 120, T0(k), T1(k) - 0.3, g);
  say(k, 0, 4, { y: 136, size: 24, hero: { 3: 30, 4: 30 } });
  tag('Mario Bros. · 1983', 186, 250, W(k, 3).s, g, { ltr: true });
  const s = px(pic('idle', 90, 226, 60, g, { flat: true }));
  enter(s, T0(k) + 0.1, { y: -30, opacity: 0 }, 0.5);
  path(sv, 'M60 334 H180 V364 H168 V470 H72 V364 H60 Z', T0(k) + 0.3, 0.7, { width: 4 });
  tl.to(s, { y: 120, opacity: 0, duration: 0.5, ease: 'power2.in' }, W(k, 5).s); cue(W(k, 5).s + 0.1, 'whoosh-soft', 0.35);
  say(k, 5, 6, { x: 190, w: 110, y: 372, size: 26, hero: { 6: 44 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 10 · THE LESSON — the limits made the look (1981 → today) =================
{
  const k = 10, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  say(k, 0, 4, { y: 128, size: 22, hero: { 1: 28 } });
  const a = px(pic('idle', 214, 200, 96, g, { flat: true }));
  enter(a, T0(k) + 0.1, { x: 40, opacity: 0 }, 0.5);
  tag('1981', 246, 342, T0(k) + 0.3, g, { ltr: true });
  const b = pic('ody', 40, 184, 140, g);
  enter(b, W(k, 5).s - 0.2, { x: -40, scale: 0.9, opacity: 0 }, 0.6); sweep(b, W(k, 5).s + 0.3);
  path(sv, 'M204 262 H190 M197 255 L190 262 L197 269', W(k, 5).s - 0.3, 0.3, { width: 2.6 });
  tag('2017', 92, 382, W(k, 5).s, g, { ltr: true });
  say(k, 5, 8, { y: 424, size: 24, hero: { 7: 32, 8: 32 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 11 · YOUR CALL — Mario without a mustache? =================
{
  const k = 11;
  textGroup(k);
  const f = px(full('idlebg', T0(k) - 0.2, T1(k) + 0.3, { x: MU[0], y: MU[1], z: 1.6, cx: 180, cy: 250, free: true, shade: 0.3 }, [ringMark(MU[0], MU[1], 140, 90)]));
  fade(f.L, T0(k) - 0.2, 0.35);
  camTo(f, T0(k), { z: 2.0 }, SC[k].dur, 'none');
  ringIn(f, 0, 54, 30, W(k, 2).s - 0.1, { dash: '6 6' });
  say(k, 0, 2, { y: 136, size: 26, bg: true, hero: { 2: 38 } });
  const yes = word('يمشي', 0, 404, 38, W(k, 3).s - 0.05, { css: 'left:auto;right:64px' }); yes.classList.add('dk');
  word('لو', 150, 412, 26, W(k, 4).s - 0.05, { hero: false });
  const no = word('لا', 60, 404, 38, W(k, 5).s - 0.05, { hero: false, css: 'color:#FF5A5F' }); no.classList.add('dk');
  fadeOut(f.L, T1(k) - 0.05, 0.3);
}

// ================= 12 · END CARD =================
{
  const k = 12, g = group(T0(k) - 0.05, null);
  const b = el('div', 'endb', '<div class="ks">' + D.kreti.wave.replace(/width="\d+" height="\d+"/, 'width="170" height="170"') + '</div><div class="p">تابع كريتيفيا</div><div class="h2" dir="ltr">@creativia.mag</div><div class="n">كل يوم شي مبدع، الساعة 9 بالليل</div>', '', g);
  enter(b.querySelector('.ks'), T0(k), { scale: 0.2, opacity: 0, rotation: -12 }, 0.9, 'elastic.out(1,0.55)');
  tl.fromTo(b.querySelector('.ks'), { y: 0 }, { y: -5, duration: 0.6, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.9);
  enter(b.querySelector('.p'), T0(k) + 0.4, { scaleX: 0.2, opacity: 0 }, 0.6); cue(T0(k) + 0.45, 'shimmer', 0.4);
  enter(b.querySelector('.h2'), T0(k) + 0.7, { y: 10, opacity: 0 }, 0.5);
  enter(b.querySelector('.n'), T0(k) + 1.0, { y: 10, opacity: 0 }, 0.5);
}
