// GTA cover grid story — directed beats (engine 6). v3 after the full diagnosis (Nov 23 2026):
// safe zones (nothing above y 124 but the brand row; text right edge ≤ 300 below y 320; nothing important below 512),
// text on pictures sits on the dark scrim or a dark plate, every beat cleans up before the next, text in spoken order.
const HELI = { us: [0.19, 0.10], vc: [0.19, 0.06], iv: [0.22, 0.055], v: [0.23, 0.06], vi: [0.16, 0.12] };
const ringMark = (r) => ({ x: 0, y: 0, html: '<svg width="' + 2 * r + '" height="' + 2 * r + '" viewBox="0 0 ' + 2 * r + ' ' + 2 * r + '" style="overflow:visible"></svg>' });
const plate = (d) => { d.classList.add('dk'); return d; };

// ================= 0 · HOOK — the helicopter itself, then the whole cover =================
{
  const k = 0, r = 34;
  textGroup(k, 0.0);
  const f = full('vi', 0, T1(k) + 0.25, { x: HELI.vi[0], y: HELI.vi[1], z: 2.5, cx: 170, cy: 250, free: true, shade: 0.7 }, [Object.assign(ringMark(r), { x: HELI.vi[0], y: HELI.vi[1] })]);
  scribble(f.marks[0].n.querySelector('svg'), r, r, r * 0.95, r * 0.8, 0.45, { width: 2.4 });
  camTo(f, 0, { z: 2.7 }, 2.2, 'none');
  camTo(f, W(k, 6).s - 0.35, { x: 0.5, y: 0.5, z: 0.44, cx: 180, cy: 268, shade: 0.3 }, 1.3, 'expo.inOut'); cue(W(k, 6).s - 0.3, 'whoosh', 0.45);
  // frame 0 = thumbnail
  const title = el('div', 'ph right', '<span class="wd"><span class="wi">لاحظت</span></span><span class="wd hero" style="font-size:50px"><span class="wi">هالهليكوبتر؟</span></span>', 'left:24px;top:404px;width:276px;font-size:28px', txt);
  out(title, W(k, 2).s - 0.15);
  const n25 = word('25', 36, 396, 86, W(k, 3).s - 0.1, { ltr: true }); count(n25, 0, 25, W(k, 3).s - 0.05, 0.9);
  say(k, 2, 5, { x: 150, y: 420, w: 150, size: 22, out: W(k, 6).s - 0.3 }); out(n25, W(k, 6).s - 0.3);
  say(k, 6, 11, { y: 424, size: 22, hero: { 11: 32 }, out: W(k, 12).s - 0.12 });
  word('ليش؟', 36, 420, 76, W(k, 12).s - 0.05, { out: T1(k) - 0.2 });
  flash(T1(k) - 0.12);
}

// ================= 1 · SAME CORNER — match-cut chain, then a fan with every helicopter marked =================
{
  const k = 1, g = group(T0(k) - 0.15, T1(k) + 0.2), sv = svgLayer(g), L = [118, 236];
  textGroup(k);
  const order = ['us', 'vc', 'iv', 'v', 'vi'], years = ['2001', '2002', '2008', '2013', '2026'];
  const tFan = W(k, 5).s - 0.25, gap = (tFan - (T0(k) - 0.1)) / order.length;
  order.forEach((n, i) => {
    const w = 290, im = IMG[n], h = Math.round(w * im.h / im.w), p = pic(n, L[0] - HELI[n][0] * w, L[1] - HELI[n][1] * h, w, g, { flat: true, css: 'opacity:0' });
    const t = T0(k) - 0.1 + i * gap;
    tl.fromTo(p, { opacity: 0, scale: i ? 1.04 : 1.12 }, { opacity: 1, scale: 1, duration: i ? 0.25 : 0.45, ease: 'power2.out', immediateRender: false }, t - (i ? 0.12 : 0.2));
    tl.to(p, { opacity: 0, duration: 0.25, ease: 'power2.in' }, (i < order.length - 1 ? t + gap : tFan + 0.25) - 0.05);
    if (i) cue(t, 'click', 0.45);
    const yr = word(years[i], 24, 132, 22, t, { ltr: true, hero: false, from: 1.2, css: 'color:#9BFFC2' }); tl.set(yr, { opacity: 0 }, i < order.length - 1 ? t + gap : tFan);
  });
  path(sv, 'M' + (L[0] + 34) + ' ' + L[1] + ' a34 28 0 1 1 -68 0 a34 28 0 1 1 68 0', T0(k), 0.5, { width: 3, out: tFan });
  say(k, 0, 4, { x: 110, w: 226, y: 128, size: 22, hero: { 4: 30 }, out: tFan });
  // the fan: five covers stepping down, each helicopter bracketed, joined by a line
  const FW = 128, pos = [0, 1, 2, 3, 4].map(i => [24 + i * 16, 130 + i * 62]), pts = [];
  order.slice().reverse().forEach((n, j) => {
    const i = order.length - 1 - j, [x, y] = pos[i], p = pic(n, x, y, FW, g); const t = tFan + i * 0.12;
    enter(p, t, { x: 180, y: -40, rotationY: -50, opacity: 0 }, 0.7); sweep(p, t + 0.5);
    const hx = x + HELI[n][0] * FW, hy = y + HELI[n][1] * p.H; pts[i] = [hx, hy];
    bracket(sv, hx - 17, hy - 11, 34, 22, t + 0.55, { width: 2.2 });
  });
  path(sv, 'M' + pts.map(q => q.join(' ')).join(' L'), tFan + 1.3, 0.8, { width: 2, color: '#2EE86B' });
  say(k, 5, 9, { x: 206, w: 98, y: 140, size: 21, hero: { 9: 36 }, out: T1(k) - 0.2 });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.1);
}

// ================= 2 · THE EUROPEAN COVER — full screen, the camera walks over it =================
{
  const k = 2, t0 = T0(k);
  textGroup(k);
  const f = full('eu', t0 - 0.35, T1(k) + 0.05, { x: 0.5, y: 0.22, z: 1.3, shade: 0.75 });
  iris(f, t0 - 0.35, 180, 320); whip(t0 - 0.35);
  camTo(f, W(k, 9).s - 0.3, { x: 0.25, y: 0.36, z: 2.1 }, 1.6, 'power2.inOut');
  camTo(f, W(k, 14).s - 0.3, { x: 0.4, y: 0.62, z: 1.7 }, 1.6, 'power2.inOut');
  camTo(f, T1(k) - 1.0, { x: 0.5, y: 0.5, z: 1.0, shade: 0.4 }, 0.7, 'power2.inOut');
  clipOut(f, T1(k) - 0.55, [24, 124, 84, 105, 10], 0.55); tl.to(f.L, { opacity: 0, duration: 0.2 }, T1(k) - 0.15);
  say(k, 0, 5, { y: 426, size: 22, hero: { 5: 34 }, out: W(k, 6).s - 0.1 });
  say(k, 6, 8, { y: 440, size: 22, hero: { 8: 34 }, out: W(k, 9).s - 0.1 });
  say(k, 9, 13, { y: 420, size: 22, hero: { 10: 30, 11: 30 }, out: W(k, 14).s - 0.1 });
  note('رسام الغلاف', 24, 476, W(k, 10).s + 0.4, null, { out: W(k, 14).s - 0.1 });
  const six = word('6 أشهر', 0, 300, 54, W(k, 12).s - 0.05, { css: 'left:auto;right:60px' }); plate(six); out(six, W(k, 14).s - 0.1);
  say(k, 14, 18, { y: 434, size: 22, hero: { 18: 34 }, out: T1(k) - 0.55 });
  ghost('007', 20, 160, 180, W(k, 17).s, T1(k) - 0.5, TX);
}

// ================= 3 · 11 SEPTEMBER — the poster parks; a calendar; New York =================
const PARK = [24, 124, 84];
const gPark = group(T1(2) - 0.05, T0(4) + 0.02);
const parked = pic('eu', PARK[0], PARK[1], PARK[2], gPark);
{
  const k = 3, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const cal = el('div', 'cal', '<div class="h">سبتمبر</div><div class="d" dir="ltr">9</div><div class="y" dir="ltr">2001</div>', 'left:136px;top:170px;width:190px;height:244px', g);
  enter(cal, T0(k) + 0.1, { rotationX: -95, z: -200, opacity: 0, transformOrigin: '50% 0%' }, 1.0, 'back.out(1.3)'); cue(T0(k) + 0.35, 'impact', 0.45);
  tl.fromTo(cal, { rotationY: 0 }, { rotationY: -10, duration: 3, ease: 'sine.inOut', immediateRender: false }, T0(k) + 1);
  count(cal.querySelector('.d'), 9, 11, W(k, 5).s, 0.8);
  const dl = path(sv, 'M66 232 C 66 300, 100 310, 136 290', W(k, 0).s, 0.7, { width: 2.5, dash: '4 6', out: W(k, 9).s - 0.3 });
  note('بأسابيع', 30, 316, W(k, 2).s, g, { out: W(k, 9).s - 0.3 });
  say(k, 0, 2, { y: 446, size: 22, hero: { 2: 32 }, out: W(k, 3).s - 0.1 });
  say(k, 3, 8, { y: 440, size: 22, hero: { 8: 32 }, out: W(k, 9).s - 0.1 });
  // New York: the calendar steps back, a skyline draws, a pin pulses
  tl.to(cal, { x: 60, scale: 0.7, opacity: 0.22, filter: 'blur(3px)', duration: 0.7, ease: 'expo.inOut' }, W(k, 9).s - 0.3);
  path(sv, 'M24 404 V354 H52 V322 H78 V362 H100 V298 H128 V342 H150 V312 H176 V272 H204 V334 H226 V304 H250 V352 H276 V320 H300 V368 H336 V404', W(k, 9).s, 1.3, { width: 2.5, out: T1(k) - 0.35 });
  const pin = el('div', '', '', 'position:absolute;left:183px;top:246px;width:14px;height:14px;border-radius:50%;background:#2EE86B', g);
  enter(pin, W(k, 10).s, { scale: 0, opacity: 0 }, 0.5, 'back.out(3)'); cue(W(k, 10).s, 'pop', 0.4);
  tl.fromTo(pin, { boxShadow: '0 0 0 0px rgba(46,232,107,0.6)' }, { boxShadow: '0 0 0 22px rgba(46,232,107,0)', duration: 1, repeat: 2, ease: 'power1.out', immediateRender: false }, W(k, 10).s + 0.3);
  note('روكستار', 120, 214, W(k, 10).s + 0.2, g);
  say(k, 9, 15, { y: 432, size: 22, hero: { 11: 32 }, pill: { 13: 1 }, out: T1(k) - 0.3 });
  tl.to(g, { opacity: 0, duration: 0.35 }, T1(k) - 0.3);
}

// ================= 4 · SIX MONTHS vs A WEEK vs TWO NIGHTS — three rulers on one scale =================
{
  const k = 4, g = group(T0(k) - 0.02, T1(k) + 0.2), sv = svgLayer(g);
  textGroup(k);
  const P = pic('eu', 66, 128, 228, g);           // 228 x 285
  const fromPark = { x: (PARK[0] + PARK[2] / 2) - (66 + 114), y: (PARK[1] + 52) - (128 + P.H / 2), scale: PARK[2] / 228 };
  enter(P, T0(k), Object.assign({ opacity: 1 }, fromPark), 0.8, 'expo.inOut'); cue(T0(k) + 0.1, 'whoosh-soft', 0.4); sweep(P, T0(k) + 0.8);
  say(k, 0, 4, { y: 440, size: 22, hero: { 3: 32 }, out: W(k, 5).s - 0.1 });
  // no weapons, no explosions: circle and strike them
  const [gx, gy] = at(P, 0.2, 0.36), [ex, ey] = at(P, 0.3, 0.64);
  scribble(sv, gx, gy, 34, 26, W(k, 6).s - 0.08, { width: 3, out: W(k, 9).s - 0.4 }); path(sv, 'M' + (gx - 30) + ' ' + (gy + 22) + ' L' + (gx + 30) + ' ' + (gy - 22), W(k, 6).s + 0.25, 0.25, { width: 3, out: W(k, 9).s - 0.4 });
  scribble(sv, ex, ey, 46, 30, W(k, 8).s - 0.08, { width: 3, out: W(k, 9).s - 0.4 }); path(sv, 'M' + (ex - 40) + ' ' + (ey + 26) + ' L' + (ex + 40) + ' ' + (ey - 26), W(k, 8).s + 0.25, 0.25, { width: 3, out: W(k, 9).s - 0.4 });
  tl.fromTo(P, { filter: 'grayscale(0) brightness(1)' }, { filter: 'grayscale(0.8) brightness(0.8)', duration: 0.6, immediateRender: false }, W(k, 6).s);
  say(k, 5, 8, { y: 440, size: 22, hero: { 6: 32, 8: 32 }, out: W(k, 9).s - 0.15 });
  // the poster parks top-right; ruler A: six months = 26 weeks
  const tp = W(k, 9).s - 0.35;
  tl.to(P, { x: (264 + 36) - (66 + 114), y: (128 + 45) - (128 + P.H / 2), scale: 72 / 228, filter: 'grayscale(0) brightness(1)', duration: 0.8, ease: 'expo.inOut' }, tp); cue(tp, 'whoosh-soft', 0.4);
  note('الأصلي', 262, 222, tp + 0.6, g);
  const tA = tp + 0.7, dA = 1.6, X0 = 300, X1 = 40, step = (X0 - X1) / 26;
  path(sv, 'M' + X0 + ' 270 H' + X1, tA, dA, { width: 5, ease: 'power2.inOut' }); cue(tA, 'riser', 0.25);
  for (let i = 0; i <= 26; i++) { const x = X0 - i * step, big = i % 4 === 0 || i === 26, t = tA + dA * (i / 26);
    const tk = el('i', '', '', 'position:absolute;left:' + (x - 1) + 'px;top:' + (big ? 258 : 263) + 'px;width:2px;height:' + (big ? 24 : 14) + 'px;background:#9BFFC2;border-radius:2px', g);
    enter(tk, t, { scaleY: 0, opacity: 0 }, 0.3, 'back.out(2)'); if (i % 4 === 0) cue(t, 'tick', 0.18); }
  const six = word('6 أشهر', 40, 184, 52, tA + 0.5, { hero: false, css: 'color:#EFF7F1' }); note('الغلاف الأصلي · 26 أسبوع', 40, 288, tA + dA, g);
  say(k, 9, 13, { y: 470, size: 21, hero: { 12: 28 }, out: W(k, 14).s - 0.1 });
  // ruler B: Stephen says a week (one tick of the same scale)
  const tB = W(k, 16).s - 0.1;
  const barB = el('i', '', '', 'position:absolute;left:' + (X0 - step) + 'px;top:346px;width:' + step + 'px;height:9px;border-radius:4px;background:#9BFFC2;transform-origin:100% 50%', g);
  enter(barB, tB, { scaleX: 0, opacity: 0 }, 0.4, 'expo.out'); cue(tB, 'pop', 0.45);
  const lb = word('ستيفن: أسبوع', 0, 334, 24, tB, { hero: false, css: 'left:auto;right:' + (360 - X0 + step + 14) + 'px;color:#EFF7F1' });
  // ruler C: Rockstar says two nights (a sliver) — it pulses so the eye finds it
  const tC = W(k, 19).s - 0.1;
  const barC = el('i', '', '', 'position:absolute;left:' + (X0 - 2.5) + 'px;top:412px;width:3px;height:9px;border-radius:2px;background:#2EE86B;box-shadow:0 0 12px #2EE86B', g);
  enter(barC, tC, { scaleY: 0, opacity: 0 }, 0.3, 'expo.out'); cue(tC, 'click', 0.5);
  const ringC = el('i', '', '', 'position:absolute;left:' + (X0 - 19) + 'px;top:398px;width:36px;height:36px;border-radius:50%;border:2px solid #2EE86B', g);
  tl.fromTo(ringC, { scale: 0.3, opacity: 1 }, { scale: 1.4, opacity: 0, duration: 0.9, repeat: 2, ease: 'power1.out', immediateRender: true }, tC + 0.1);
  word('روكستار: ليلتين', 0, 394, 40, tC, { css: 'left:auto;right:' + (360 - X0 + 30) + 'px' });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.05);
}

// ================= 5 · CUT IT UP — the poster becomes tiles; the violent ones fly out; the US grid forms =================
{
  const k = 5, g = group(T0(k) - 0.3, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const BX = 70, BY = 126, BW = 220, BH = 290, R = 3, Q = 3, gw = BW / Q, gh = BH / R, drop = [3, 6, 7];
  const cover = (n) => { const im = IMG[n], s = Math.max(BW / im.w, BH / im.h); return { w: im.w * s, h: im.h * s, ox: (im.w * s - BW) / 2, oy: (im.h * s - BH) / 2, src: im.src }; };
  const A = cover('eu'), B = cover('us');
  const box = el('div', '', '', 'position:absolute;left:' + BX + 'px;top:' + BY + 'px;width:' + BW + 'px;height:' + BH + 'px;transform-style:preserve-3d', g);
  const tiles = [];
  for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) {
    const t = el('div', 'tile', '<div class="b"></div>', 'left:' + q * gw + 'px;top:' + r * gh + 'px;width:' + gw + 'px;height:' + gh + 'px;background-image:url(' + A.src + ');background-size:' + A.w + 'px ' + A.h + 'px;background-position:' + (-A.ox - q * gw) + 'px ' + (-A.oy - r * gh) + 'px', box);
    const b = t.querySelector('.b'); b.style.cssText = 'background-image:url(' + B.src + ');background-size:' + B.w + 'px ' + B.h + 'px;background-position:' + (-B.ox - q * gw) + 'px ' + (-B.oy - r * gh) + 'px';
    tiles.push(t);
  }
  enter(box, T0(k) - 0.3, { x: (264 + 36) - (BX + BW / 2), y: 173 - (BY + BH / 2), scale: 72 / BW, opacity: 1 }, 0.8, 'expo.inOut');
  say(k, 0, 4, { y: 446, size: 22, out: W(k, 5).s - 0.15 });
  const tc = W(k, 5).s;
  [[BX + gw, BY - 8, BX + gw, BY + BH + 8], [BX + 2 * gw, BY - 8, BX + 2 * gw, BY + BH + 8], [BX - 8, BY + gh, BX + BW + 8, BY + gh], [BX - 8, BY + 2 * gh, BX + BW + 8, BY + 2 * gh]]
    .forEach((c, i) => { path(sv, 'M' + c[2] + ' ' + c[3] + ' L' + c[0] + ' ' + c[1], tc + i * 0.14, 0.28, { width: 3, color: '#2EE86B', out: tc + 1.1 }); cue(tc + i * 0.14, 'click', 0.45); });
  word('قصّ', 36, 430, 64, tc - 0.05, { out: W(k, 8).s - 0.1 });
  say(k, 6, 7, { x: 150, w: 150, y: 448, size: 22, out: W(k, 8).s - 0.1 });
  const ts = tc + 0.75;
  tiles.forEach((t, i) => { const r = Math.floor(i / Q), q = i % Q; tl.to(t, { x: (q - 1) * 10, y: (r - 1) * 10, z: 20 + (i % 3) * 30, rotationY: (q - 1) * 10, rotationX: (1 - r) * 8, duration: 0.7, ease: 'back.out(1.6)' }, ts + i * 0.03); });
  tl.to(box, { rotationY: -12, rotationX: 6, duration: 1.4, ease: 'sine.inOut' }, ts);
  say(k, 8, 10, { y: 446, size: 22, hero: { 10: 32 }, out: W(k, 11).s - 0.15 });
  drop.forEach((i, j) => { tl.to(tiles[i], { z: 420, scale: 1.4, x: (j - 1) * 160, y: '+=120', rotation: j % 2 ? 20 : -16, opacity: 0, filter: 'blur(8px)', duration: 0.7, ease: 'power2.in' }, W(k, 10).s + j * 0.12); cue(W(k, 10).s + j * 0.12, 'whoosh-soft', 0.3); });
  const tr = W(k, 11).s;
  tiles.forEach((t, i) => { const a = tr + i * 0.07; tl.to(t.querySelector('.b'), { opacity: 1, duration: 0.25 }, a);
    if (drop.includes(i)) tl.fromTo(t, { y: -380, x: 0, z: 0, scale: 1, rotation: 0, opacity: 0, filter: 'blur(0px)' }, { y: 0, x: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0, opacity: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, a);
    else tl.to(t, { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, duration: 0.6, ease: 'expo.out' }, a);
    cue(a, 'tick', 0.25); });
  tl.to(box, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'expo.out' }, tr + 0.3);
  say(k, 11, 13, { y: 446, size: 22, hero: { 13: 32 }, out: T1(k) - 0.4 });
  tl.to(box, { y: -500, opacity: 0, duration: 0.5, ease: 'power3.in' }, T1(k) - 0.35); cue(T1(k) - 0.35, 'whoosh', 0.4);
}

// ================= 6 · THE RESULT — the two covers side by side =================
{
  const k = 6, g = group(T0(k) - 0.3, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const a = pic('eu', 188, 136, 148, g), b = pic('us', 24, 136, 148, g);      // Europe on the right (read first), America on the left
  enter(a, T0(k) - 0.3, { x: 120, rotationY: -60, opacity: 0 }, 0.8); enter(b, T0(k) + 0.1, { x: -120, rotationY: 60, opacity: 0 }, 0.8); cue(T0(k) - 0.25, 'whoosh', 0.45);
  sweep(a, T0(k) + 0.6); sweep(b, T0(k) + 1.0);
  tl.fromTo(a, { rotationY: -10 }, { rotationY: -4, duration: SC[k].dur, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.5);
  tl.fromTo(b, { rotationY: 10 }, { rotationY: 4, duration: SC[k].dur, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.9);
  note('أوروبا', 240, 136 + a.H + 6, T0(k) + 0.6, g); note('أمريكا', 74, 136 + b.H + 6, T0(k) + 1.0, g);
  const arrow = word('←', 166, 210, 30, T0(k) + 1.1, { hero: false, ltr: true, css: 'color:#2EE86B' });
  say(k, 0, 0, { y: 376, size: 30, out: W(k, 1).s - 0.1 });
  say(k, 1, 4, { y: 420, size: 22, hero: { 4: 32 }, pill: { 4: 1 }, out: W(k, 5).s - 0.1 });
  bracket(sv, 18, 130, 160, b.H + 12, W(k, 8).s - 0.1, { width: 2.5, len: 16 });
  say(k, 5, 10, { y: 420, size: 22, hero: { 10: 32 }, out: T1(k) - 0.3 });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.2);
}

// ================= 7 · WHERE THE BOXES CAME FROM — palette break: comic paper =================
{
  const k = 7, g = group(T0(k) - 0.3, T1(k) + 0.05);
  textGroup(k);
  setBG(T0(k) - 0.35, 1, 0.45); flash(T0(k) - 0.35, '#FFF3D6');
  const c = pic('comic', 24, 150, 142, g, { css: 'box-shadow:0 22px 40px rgba(60,30,10,0.35)' });
  tl.fromTo(c, { x: -220, rotation: -14, opacity: 0 }, { x: 0, rotation: -4, opacity: 1, duration: 0.8, ease: 'back.out(1.2)', immediateRender: true }, T0(k) - 0.1);
  tl.fromTo(c, { scale: 1 }, { scale: 1.05, duration: SC[k].dur, ease: 'none', immediateRender: false }, T0(k) + 0.7);
  sweep(c, T0(k) + 0.9);
  note('Amazing Fantasy #15 · 1962', 24, 150 + c.H + 14, T0(k) + 1, g, { css: 'color:#5B4A2E;font-size:12px;font-family:Rubik' });
  say(k, 0, 3, { x: 178, w: 128, y: 150, size: 21, dark: true, out: W(k, 4).s - 0.1 });
  say(k, 4, 7, { x: 178, w: 128, y: 150, size: 22, dark: true, hero: { 4: 28 } });
  say(k, 8, 10, { x: 178, w: 128, y: 236, size: 30, dark: true, hero: { 8: 40 } });
  say(k, 11, 13, { x: 178, w: 128, y: 330, size: 20, dark: true });
  setBG(T1(k) - 0.3, 0, 0.4);
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.3);
}

// ================= 8 · FROM HERE — into the US cover, onto the helicopter; then the same corner in every game =================
{
  const k = 8, r = 30, t0 = T0(k);
  textGroup(k);
  const f = full('us', t0 - 0.35, W(k, 12).s + 0.25, { x: 0.5, y: 0.5, z: 0.5, cx: 180, cy: 290, free: true, shade: 0.3 }, [Object.assign(ringMark(r), { x: HELI.us[0], y: HELI.us[1] })]);
  iris(f, t0 - 0.35, 180, 290, 0.75);
  camTo(f, W(k, 1).s - 0.1, { x: HELI.us[0], y: HELI.us[1], z: 2.4, cx: 180, cy: 240, shade: 0.75 }, 1.4, 'expo.inOut'); cue(W(k, 1).s, 'whoosh-soft', 0.4);
  scribble(f.marks[0].n.querySelector('svg'), r, r, r * 0.95, r * 0.78, W(k, 3).s - 0.1, { width: 1.8 });
  tl.fromTo(f.marks[0].n.querySelector('svg'), { rotation: 0 }, { rotation: 200, duration: 6, ease: 'none', immediateRender: false }, W(k, 3).s);
  say(k, 0, 2, { y: 444, size: 22, out: W(k, 3).s - 0.1 });
  say(k, 3, 5, { y: 430, size: 24, hero: { 5: 46 }, out: W(k, 6).s - 0.1 });
  say(k, 6, 10, { y: 444, size: 22, hero: { 10: 32 }, out: W(k, 11).s - 0.1 });
  ['vc', 'iv', 'v'].forEach((n, i) => { const t = W(k, 12).s - 0.05 + i * 0.5; const ff = full(n, t, i < 2 ? t + 0.75 : T1(k) + 0.3, { x: HELI[n][0], y: HELI[n][1], z: 2.4, cx: 180, cy: 240, free: true, shade: 0.75 }); tl.fromTo(ff.L, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out', immediateRender: true }, t); cue(t, 'whoosh-soft', 0.35); });
  say(k, 11, 14, { y: 444, size: 22, hero: { 12: 34 }, out: T1(k) - 0.3 });
  tl.to(fullHost, { opacity: 0, duration: 0.35, ease: 'power2.in' }, T1(k) - 0.1); tl.set(fullHost, { opacity: 1 }, T1(k) + 0.32);
  flash(T1(k) - 0.1);
}

// ================= 9 · HIS GRID LIVES ON — his GTA III; he didn't draw V or VI; the grid links them all =================
{
  const k = 9, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const III = pic('us', 186, 132, 150, g); enter(III, T0(k), { z: -400, rotationY: -50, opacity: 0 }, 0.9); sweep(III, T0(k) + 0.9);
  tl.fromTo(III, { rotationY: -8 }, { rotationY: 6, duration: SC[k].dur, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.9);
  const nm = word('ستيفن بلِس', 0, 132, 26, T0(k) + 0.1, { hero: false, css: 'left:auto;right:188px;color:#EFF7F1' }); note('رسام هذا الغلاف', 0, 170, T0(k) + 0.5, null, { css: 'left:auto;right:188px' });
  say(k, 0, 5, { y: 400, size: 22, out: W(k, 6).s - 0.1 });
  // V and VI: not his
  const V = pic('v', 30, 220, 74, g, { css: 'opacity:0' }), VI = pic('vi', 104, 236, 74, g, { css: 'opacity:0' });
  tl.fromTo([V, VI], { x: -60, opacity: 0 }, { x: 0, opacity: 0.45, duration: 0.6, ease: 'expo.out', stagger: 0.15, immediateRender: false }, W(k, 7).s);
  const t1 = el('div', 'tagx', 'مو هو', 'left:44px;top:' + (220 + V.H + 6) + 'px;opacity:0', g), t2 = el('div', 'tagx', 'مو هو', 'left:118px;top:' + (236 + VI.H + 6) + 'px;opacity:0', g);
  tl.to([t1, t2], { opacity: 1, duration: 0.3, stagger: 0.15 }, W(k, 9).s);
  say(k, 6, 11, { y: 400, size: 22, hero: { 9: 30, 11: 30 }, out: W(k, 12).s - 0.1 });
  // "but the grid he made…": all light up, his helicopter links to theirs
  const tg = W(k, 13).s - 0.1;
  tl.to([V, VI], { opacity: 1, duration: 0.4 }, tg); tl.to([t1, t2], { opacity: 0, duration: 0.2 }, tg);
  const h3 = [186 + HELI.us[0] * 150, 132 + HELI.us[1] * III.H];
  [[V, 30, 220, 'v'], [VI, 104, 236, 'vi']].forEach(([p, x, y, n], i) => path(sv, 'M' + h3[0] + ' ' + h3[1] + ' L' + (x + HELI[n][0] * 74) + ' ' + (y + HELI[n][1] * p.H), tg + 0.2 + i * 0.2, 0.5, { width: 1.8, dash: '3 5' }));
  bracket(sv, h3[0] - 16, h3[1] - 10, 32, 20, tg, { width: 2.2 }); cue(tg, 'shimmer', 0.35);
  say(k, 12, 16, { y: 400, size: 22, hero: { 13: 40 }, out: W(k, 17).s - 0.1 });
  say(k, 17, 20, { y: 400, size: 22, hero: { 20: 32 }, out: T1(k) - 0.3 });
  tl.to(g, { opacity: 0, z: 300, duration: 0.35, ease: 'power2.in' }, T1(k) - 0.3);
}

// ================= 10 · THE LINE TO REMEMBER =================
{
  const k = 10, g = group(T0(k) - 0.2, T1(k) + 0.1);
  textGroup(k);
  const gh = ghost('25', 40, 170, 240, T0(k), T1(k) - 0.3, g); tl.fromTo(gh, { scale: 1 }, { scale: 1.08, duration: SC[k].dur, ease: 'none', immediateRender: false }, T0(k) + 1.2);
  say(k, 0, 1, { y: 140, size: 26 });
  say(k, 2, 2, { y: 184, size: 22 });
  const hw = word('هوية', 0, 214, 100, W(k, 3).s - 0.05, { css: 'left:auto;right:24px' }); tl.fromTo(hw, { scale: 1 }, { scale: 1.06, duration: 3, ease: 'none', immediateRender: false }, W(k, 3).s + 0.5);
  word('25 سنة', 0, 334, 46, W(k, 4).s - 0.05, { hero: false, css: 'left:auto;right:28px;color:#EFF7F1' });
  say(k, 7, 11, { x: 40, w: 260, y: 410, size: 26, hero: { 11: 30 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.2);
  flash(T1(k) - 0.1);
}

// ================= 11 · END CARD =================
{
  const k = 11, g = group(T0(k) - 0.05, null);
  const b = el('div', 'endb', '<div class="ks">' + D.kreti.wave.replace(/width="\d+" height="\d+"/, 'width="170" height="170"') + '</div><div class="p">تابع كريتيفيا</div><div class="h2" dir="ltr">@creativia.mag</div><div class="n">كل يوم شي مبدع، الساعة 9 بالليل</div>', '', g);
  enter(b.querySelector('.ks'), T0(k), { scale: 0.2, opacity: 0, rotation: -12 }, 0.9, 'elastic.out(1,0.55)');
  tl.fromTo(b.querySelector('.ks'), { y: 0 }, { y: -5, duration: 0.6, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.9);
  enter(b.querySelector('.p'), T0(k) + 0.4, { scaleX: 0.2, opacity: 0 }, 0.6); cue(T0(k) + 0.45, 'shimmer', 0.4);
  enter(b.querySelector('.h2'), T0(k) + 0.7, { y: 10, opacity: 0 }, 0.5);
  enter(b.querySelector('.n'), T0(k) + 1.0, { y: 10, opacity: 0 }, 0.5);
}
