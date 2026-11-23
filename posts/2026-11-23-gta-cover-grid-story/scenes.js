// GTA cover grid story — directed beats (engine 6). Storyboard from the art-director + motion + brand reviews (Nov 23 2026).
// Helpers: see engine/reel6-page.js. Stage 360x640. Text stays y 104..506 and left of x 300 below y 330 where possible.
const HELI = { us: [0.19, 0.10], vc: [0.19, 0.06], iv: [0.22, 0.055], v: [0.23, 0.06], vi: [0.16, 0.12] };
const ringMark = (r) => ({ x: 0, y: 0, html: '<svg width="' + 2 * r + '" height="' + 2 * r + '" viewBox="0 0 ' + 2 * r + ' ' + 2 * r + '" style="overflow:visible"></svg>' });

// ================= 0 · HOOK — the helicopter itself, then the whole cover =================
{
  const k = 0, r = 70;
  textGroup(k, 0.0);
  const f = full('vi', 0, T1(k) + 0.25, { x: 0.21, y: 0.24, z: 2.6, shade: 0.75 }, [Object.assign(ringMark(r), { x: HELI.vi[0], y: HELI.vi[1] })]);
  scribble(f.marks[0].n.querySelector('svg'), r, r, r * 0.92, r * 0.78, 0.45, { width: 5 });
  camTo(f, 0, { z: 2.8 }, 2.2, 'none');
  camTo(f, W(k, 6).s - 0.35, { x: 0.5, y: 0.5, z: 0.47, cx: 128, cy: 300, shade: 0.25 }, 1.3, 'expo.inOut'); cue(W(k, 6).s - 0.3, 'whoosh', 0.45);
  // frame 0 = thumbnail: the question is already there
  const title = el('div', 'ph right', '<span class="wd"><span class="wi">ليش</span></span><span class="wd"><span class="wi">الهليكوبتر</span></span><span class="wd"><span class="wi">دايماً</span></span><span class="wd"><span class="wi">بنفس</span></span><span class="wd hero"><span class="wi">الزاوية؟</span><i class="kash"></i></span>', 'left:24px;top:372px;width:312px;font-size:34px', txt);
  out(title, W(k, 2).s - 0.15);
  const n25 = word('25', 0, 360, 92, W(k, 3).s - 0.1, { ltr: true, css: 'left:auto;right:28px' }); count(n25, 0, 25, W(k, 3).s - 0.05, 0.9);
  say(k, 5, 5, { x: 24, y: 448, w: 200, size: 24, align: 'right', out: W(k, 6).s - 0.3 }); out(n25, W(k, 6).s - 0.3);
  say(k, 6, 11, { x: 252, y: 160, w: 96, size: 22, hero: { 11: 28 }, out: T1(k) - 0.3 });
  word('ليش؟', 0, 436, 66, W(k, 12).s - 0.05, { css: 'left:auto;right:22px', out: T1(k) - 0.25 });
  flash(T1(k) - 0.12);
}

// ================= 1 · SAME CORNER — match-cut chain, then a fan with every helicopter marked =================
{
  const k = 1, g = group(T0(k) - 0.15, T1(k) + 0.35), sv = svgLayer(g), L = [110, 196];
  textGroup(k);
  const order = ['us', 'vc', 'iv', 'v', 'vi'], years = ['2001', '2002', '2008', '2013', '2026'];
  const tFan = W(k, 5).s - 0.25, gap = (tFan - (T0(k) - 0.1)) / order.length;
  order.forEach((n, i) => {
    const w = 300, im = IMG[n], h = Math.round(w * im.h / im.w), p = pic(n, L[0] - HELI[n][0] * w, L[1] - HELI[n][1] * h, w, g, { flat: true, css: 'opacity:0' });
    const t = T0(k) - 0.1 + i * gap;
    tl.fromTo(p, { opacity: 1, scale: 1.05 }, { scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, t);
    tl.set(p, { opacity: 0 }, i < order.length - 1 ? t + gap : tFan + 0.25);
    if (i) cue(t, 'click', 0.45);
    const yr = word(years[i], L[0] + 52, L[1] - 18, 22, t, { ltr: true, hero: false, from: 1.2, css: 'color:#9BFFC2' }); tl.set(yr, { opacity: 0 }, i < order.length - 1 ? t + gap : tFan);
  });
  const shade = el('div', 'layer', '', 'background:linear-gradient(180deg,rgba(3,10,7,0.65),rgba(3,10,7,0) 30%,rgba(3,10,7,0) 60%,rgba(3,10,7,0.85))', g); tl.to(shade, { opacity: 0, duration: 0.3 }, tFan);
  path(sv, 'M' + (L[0] + 38) + ' ' + L[1] + ' a38 32 0 1 1 -76 0 a38 32 0 1 1 76 0', T0(k), 0.5, { width: 4, out: tFan });
  say(k, 0, 4, { y: 106, size: 23, hero: { 4: 34 }, out: tFan });
  // the fan: five covers on a diagonal, each helicopter bracketed, joined by a dotted line
  const pos = [[226, 108], [176, 162], [126, 216], [76, 270], [26, 324]], pts = [];
  order.slice().reverse().forEach((n, j) => {
    const i = order.length - 1 - j, [x, y] = pos[i], p = pic(n, x, y, 112, g); const t = tFan + i * 0.12;
    enter(p, t, { x: 180, y: -40, rotationY: -50, opacity: 0 }, 0.7); sweep(p, t + 0.5);
    const hx = x + HELI[n][0] * 112, hy = y + HELI[n][1] * p.H; pts[i] = [hx, hy];
    bracket(sv, hx - 18, hy - 12, 36, 24, t + 0.55, { width: 2.5 });
  });
  path(sv, 'M' + pts.map(q => q.join(' ')).join(' L'), tFan + 1.3, 0.8, { width: 2, color: '#2EE86B' });
  say(k, 5, 9, { x: 196, w: 146, y: 352, size: 21, hero: { 9: 46 }, out: T1(k) - 0.2 });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.1);
}

// ================= 2 · THE EUROPEAN COVER — full screen, the camera walks over it =================
{
  const k = 2, t0 = T0(k);
  textGroup(k);
  const f = full('eu', t0 - 0.35, T1(k) + 0.05, { x: 0.5, y: 0.3, z: 1.45, shade: 0.7 });
  iris(f, t0 - 0.35, 180, 320); whip(t0 - 0.35);
  camTo(f, W(k, 9).s - 0.3, { x: 0.28, y: 0.42, z: 2.3 }, 1.4, 'power3.inOut');
  camTo(f, W(k, 14).s - 0.3, { x: 0.45, y: 0.7, z: 1.75 }, 1.4, 'power3.inOut');
  camTo(f, T1(k) - 0.9, { x: 0.5, y: 0.5, z: 1.0, shade: 0.4 }, 0.6, 'power2.inOut');
  clipOut(f, T1(k) - 0.55, [24, 108, 84, 118, 10], 0.55);
  const a = say(k, 0, 5, { y: 388, size: 23, hero: { 5: 40 } }); recede(a, W(k, 6).s - 0.1); out(a, W(k, 9).s);
  say(k, 6, 8, { y: 452, size: 23, hero: { 8: 36 }, out: W(k, 9).s - 0.05 });
  const cr = say(k, 9, 11, { y: 108, size: 20, hero: { 10: 28, 11: 28 } }); note('رسّام الغلاف', 210, 150, W(k, 10).s + 0.4, null, { out: W(k, 14).s }); out(cr, W(k, 14).s);
  const six = word('6 أشهر', 0, 286, 58, W(k, 12).s - 0.05, { css: 'left:auto;right:24px' }); out(six, W(k, 14).s);
  ghost('007', 20, 150, 190, W(k, 17).s, T1(k) - 0.4, TX);
  say(k, 14, 18, { y: 420, size: 23, hero: { 18: 38 }, out: T1(k) - 0.5 });
}

// ================= 3 · 11 SEPTEMBER — the poster parks; a calendar; New York =================
const PARK = [24, 108, 84];
const gPark = group(T1(2) - 0.05, T0(4) + 0.02);
const parked = pic('eu', PARK[0], PARK[1], PARK[2], gPark);
{
  const k = 3, g = group(T0(k) - 0.1, T1(k) + 0.3), sv = svgLayer(g);
  textGroup(k);
  const cal = el('div', 'cal', '<div class="h">سبتمبر</div><div class="d" dir="ltr">9</div><div class="y" dir="ltr">2001</div>', 'left:150px;top:146px;width:184px;height:236px', g);
  enter(cal, T0(k) + 0.1, { rotationX: -95, z: -200, opacity: 0, transformOrigin: '50% 0%' }, 1.0, 'back.out(1.3)'); cue(T0(k) + 0.35, 'impact', 0.45);
  tl.to(cal, { rotationY: -12, duration: 3, ease: 'sine.inOut' }, T0(k) + 1);
  count(cal.querySelector('.d'), 9, 11, W(k, 5).s, 0.8);
  path(sv, 'M66 228 C 66 300, 110 300, 150 270', W(k, 0).s, 0.7, { width: 2.5, dash: '4 6' });
  note('بأسابيع', 34, 300, W(k, 2).s, g);
  const a = say(k, 0, 2, { y: 404, size: 23, hero: { 2: 34 } }); recede(a, W(k, 3).s - 0.1); out(a, W(k, 5).s);
  say(k, 3, 8, { y: 448, size: 22, hero: { 8: 32 }, out: W(k, 9).s - 0.1 });
  // New York: the calendar steps back, a skyline draws, a pin pulses
  tl.to(cal, { x: 60, scale: 0.7, opacity: 0.25, filter: 'blur(3px)', duration: 0.7, ease: 'expo.inOut' }, W(k, 9).s - 0.3);
  path(sv, 'M24 388 V338 H52 V306 H78 V346 H100 V282 H128 V326 H150 V296 H176 V256 H204 V318 H226 V288 H250 V336 H276 V304 H300 V352 H336 V388', W(k, 9).s, 1.3, { width: 2.5 });
  const pin = el('div', 'pinx', '', 'position:absolute;left:184px;top:228px;width:14px;height:14px;border-radius:50%;background:#2EE86B;box-shadow:0 0 0 0 rgba(46,232,107,0.6)', g);
  enter(pin, W(k, 10).s, { scale: 0, opacity: 0 }, 0.5, 'back.out(3)'); cue(W(k, 10).s, 'pop', 0.4);
  tl.fromTo(pin, { boxShadow: '0 0 0 0px rgba(46,232,107,0.6)' }, { boxShadow: '0 0 0 22px rgba(46,232,107,0)', duration: 1, repeat: 2, ease: 'power1.out', immediateRender: false }, W(k, 10).s + 0.3);
  note('روكستار', 120, 196, W(k, 10).s + 0.2, g);
  say(k, 9, 15, { y: 420, size: 22, hero: { 11: 32 }, pill: { 13: 1 }, out: T1(k) - 0.3 });
  tl.to(g, { opacity: 0, duration: 0.35 }, T1(k) - 0.1);
}

// ================= 4 · SIX MONTHS vs TWO NIGHTS — the owner's shot =================
{
  const k = 4, g = group(T0(k) - 0.02, T1(k) + 0.3), sv = svgLayer(g);
  textGroup(k);
  const P = pic('eu', 60, 104, 240, g);           // 240 x 337
  const fromPark = { x: (PARK[0] + PARK[2] / 2) - (60 + 120), y: (PARK[1] + 59) - (104 + P.H / 2), scale: PARK[2] / 240 };
  enter(P, T0(k), Object.assign({ opacity: 1 }, fromPark), 0.8, 'expo.inOut'); cue(T0(k) + 0.1, 'whoosh-soft', 0.4); sweep(P, T0(k) + 0.8);
  say(k, 0, 4, { y: 452, size: 22, hero: { 3: 32 }, out: W(k, 5).s - 0.1 });
  // no weapons, no explosions: strike them
  const [gx, gy] = at(P, 0.25, 0.40), [ex, ey] = at(P, 0.42, 0.68);
  path(sv, 'M' + (gx - 34) + ' ' + (gy - 22) + ' L' + (gx + 34) + ' ' + (gy + 22) + ' M' + (gx + 34) + ' ' + (gy - 22) + ' L' + (gx - 34) + ' ' + (gy + 22), W(k, 6).s - 0.05, 0.35, { width: 5, out: W(k, 9).s - 0.4 }); cue(W(k, 6).s, 'tick', 0.45);
  path(sv, 'M' + (ex - 44) + ' ' + (ey - 26) + ' L' + (ex + 44) + ' ' + (ey + 26) + ' M' + (ex + 44) + ' ' + (ey - 26) + ' L' + (ex - 44) + ' ' + (ey + 26), W(k, 8).s - 0.05, 0.35, { width: 5, out: W(k, 9).s - 0.4 }); cue(W(k, 8).s, 'tick', 0.45);
  tl.to(P, { filter: 'grayscale(0.8) brightness(0.8)', duration: 0.6 }, W(k, 6).s);
  say(k, 5, 8, { y: 452, size: 23, hero: { 6: 32, 8: 32 }, out: W(k, 9).s - 0.15 });
  // the poster parks top-right; the six-month line draws across the screen with 26 week ticks
  const tp = W(k, 9).s - 0.35;
  tl.to(P, { x: (262 + 37) - (60 + 120), y: (108 + 52) - (104 + P.H / 2), scale: 74 / 240, filter: 'grayscale(0) brightness(1)', duration: 0.8, ease: 'expo.inOut' }, tp); cue(tp, 'whoosh-soft', 0.4);
  const nt = note('الأصلي', 256, 218, tp + 0.6, g); tl.to([nt, P], { opacity: 0, duration: 0.3 }, W(k, 19).s - 0.3);
  const tl6 = tp + 0.7, dl = 1.6;
  path(sv, 'M336 292 H24', tl6, dl, { width: 4, ease: 'power2.inOut' }); cue(tl6, 'riser', 0.25);
  for (let i = 0; i <= 26; i++) { const x = 336 - i * (312 / 26), big = i % 4 === 0 || i === 26, t = tl6 + dl * (i / 26);
    const tk = el('i', '', '', 'position:absolute;left:' + (x - 1) + 'px;top:' + (big ? 280 : 285) + 'px;width:2px;height:' + (big ? 24 : 14) + 'px;background:#9BFFC2;border-radius:2px', g);
    enter(tk, t, { scaleY: 0, opacity: 0 }, 0.3, 'back.out(2)'); if (i % 4 === 0) cue(t, 'tick', 0.18); }
  const six = word('6 أشهر', 24, 206, 54, tl6 + 0.5, { hero: false, css: 'color:#EFF7F1' }); note('26 أسبوع', 24, 262, tl6 + dl, g);
  say(k, 9, 13, { y: 330, size: 21, hero: { 12: 30 }, out: W(k, 14).s - 0.1 });
  // the replacement: one week… then two nights
  const bar = el('i', '', '', 'position:absolute;left:' + (336 - 12) + 'px;top:414px;width:12px;height:8px;border-radius:4px;background:#2EE86B;box-shadow:0 0 14px #2EE86B;transform-origin:100% 50%', g);
  enter(bar, W(k, 12).s, { scaleX: 0, opacity: 0 }, 0.4, 'expo.out'); cue(W(k, 12).s, 'pop', 0.5);
  const wk = word('أسبوع', 0, 394, 26, W(k, 16).s - 0.05, { hero: false, css: 'left:auto;right:58px' });
  say(k, 14, 15, { x: 24, w: 200, y: 330, size: 21, out: W(k, 17).s - 0.1 });
  say(k, 17, 18, { x: 24, w: 200, y: 330, size: 21, out: T1(k) - 0.3 });
  out(wk, W(k, 19).s - 0.1);
  tl.to(bar, { scaleX: 3.3 / 12, duration: 0.5, ease: 'expo.inOut' }, W(k, 19).s - 0.15);
  tl.to(CAM, { s: 1.9, ox: 330, oy: 418, x: -150, y: -60, duration: 1.0, ease: 'expo.inOut' }, W(k, 19).s - 0.1); cue(W(k, 19).s - 0.1, 'whoosh-soft', 0.4);
  word('ليلتين', 24, 432, 66, W(k, 19).s - 0.05, { out: T1(k) - 0.25 });
  tl.to(CAM, { s: 1, x: 0, y: 0, duration: 0.6, ease: 'expo.inOut' }, T1(k) - 0.35);
  tl.to(six, { opacity: 0, duration: 0.3 }, T1(k) - 0.4);
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.05);
  tl.set(CAM, { ox: 180, oy: 300 }, T1(k) + 0.3);
}

// ================= 5 · CUT IT UP — the poster becomes tiles; the violent ones fall; the US grid forms =================
{
  const k = 5, g = group(T0(k) - 0.3, T1(k) + 0.3), sv = svgLayer(g);
  textGroup(k);
  const BX = 60, BY = 116, BW = 240, BH = 320, R = 3, Q = 3, gw = BW / Q, gh = BH / R, drop = [3, 6, 7];
  const cover = (n) => { const im = IMG[n], s = Math.max(BW / im.w, BH / im.h); return { w: im.w * s, h: im.h * s, ox: (im.w * s - BW) / 2, oy: (im.h * s - BH) / 2, src: im.src }; };
  const A = cover('eu'), B = cover('us');
  const box = el('div', '', '', 'position:absolute;left:' + BX + 'px;top:' + BY + 'px;width:' + BW + 'px;height:' + BH + 'px;transform-style:preserve-3d', g);
  const tiles = [];
  for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) {
    const t = el('div', 'tile', '<div class="b"></div>', 'left:' + q * gw + 'px;top:' + r * gh + 'px;width:' + gw + 'px;height:' + gh + 'px;background-image:url(' + A.src + ');background-size:' + A.w + 'px ' + A.h + 'px;background-position:' + (-A.ox - q * gw) + 'px ' + (-A.oy - r * gh) + 'px', box);
    const b = t.querySelector('.b'); b.style.cssText = 'background-image:url(' + B.src + ');background-size:' + B.w + 'px ' + B.h + 'px;background-position:' + (-B.ox - q * gw) + 'px ' + (-B.oy - r * gh) + 'px';
    tiles.push(t);
  }
  enter(box, T0(k) - 0.3, { x: (262 + 37) - (BX + BW / 2), y: 160 - (BY + BH / 2), scale: 74 / BW, opacity: 1 }, 0.8, 'expo.inOut');
  say(k, 0, 4, { y: 452, size: 22, out: W(k, 5).s - 0.15 });
  // cut lines
  const tc = W(k, 5).s;
  [[BX + gw, BY - 8, BX + gw, BY + BH + 8], [BX + 2 * gw, BY - 8, BX + 2 * gw, BY + BH + 8], [BX - 8, BY + gh, BX + BW + 8, BY + gh], [BX - 8, BY + 2 * gh, BX + BW + 8, BY + 2 * gh]]
    .forEach((c, i) => { path(sv, 'M' + c[2] + ' ' + c[3] + ' L' + c[0] + ' ' + c[1], tc + i * 0.14, 0.28, { width: 3, color: '#2EE86B', out: tc + 1.1 }); cue(tc + i * 0.14, 'click', 0.45); });
  word('قصّ', 24, 440, 64, tc - 0.05, { out: W(k, 8).s - 0.1 });
  say(k, 6, 7, { x: 120, w: 216, y: 460, size: 21, out: W(k, 8).s - 0.1 });
  // tiles float apart in depth
  const ts = tc + 0.75;
  tiles.forEach((t, i) => { const r = Math.floor(i / Q), q = i % Q; tl.to(t, { x: (q - 1) * 12, y: (r - 1) * 12, z: 20 + (i % 3) * 30, rotationY: (q - 1) * 10, rotationX: (1 - r) * 8, duration: 0.7, ease: 'back.out(1.6)' }, ts + i * 0.03); });
  tl.to(box, { rotationY: -14, rotationX: 6, duration: 1.4, ease: 'sine.inOut' }, ts);
  say(k, 8, 10, { y: 452, size: 22, hero: { 10: 32 }, out: W(k, 11).s - 0.15 });
  drop.forEach((i, j) => { tl.to(tiles[i], { y: '+=420', rotation: j % 2 ? 28 : -24, opacity: 0, duration: 0.8, ease: 'power2.in' }, W(k, 10).s + j * 0.12); cue(W(k, 10).s + j * 0.12, 'whoosh-soft', 0.3); });
  // rebuild as the US grid: every tile flips to its US face, the fallen ones fly back
  const tr = W(k, 11).s;
  tiles.forEach((t, i) => { const at = tr + i * 0.07; tl.to(t.querySelector('.b'), { opacity: 1, duration: 0.25 }, at);
    if (drop.includes(i)) tl.fromTo(t, { y: -380, rotation: 0, opacity: 0 }, { y: 0, x: 0, z: 0, rotationX: 0, rotationY: 0, opacity: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, at);
    else tl.to(t, { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, duration: 0.6, ease: 'expo.out' }, at);
    cue(at, 'tick', 0.25); });
  tl.to(box, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'expo.out' }, tr + 0.3);
  say(k, 11, 13, { y: 452, size: 22, hero: { 13: 32 }, out: T1(k) - 0.25 });
  tl.to(box, { y: -500, opacity: 0, duration: 0.5, ease: 'power3.in' }, T1(k) - 0.35); cue(T1(k) - 0.35, 'whoosh', 0.4);
}

// ================= 6 · THE RESULT — split screen: Europe above, America below =================
{
  const k = 6, g = group(T0(k) - 0.35, T1(k) + 0.3), sv = svgLayer(g);
  textGroup(k);
  const top = pic('eu', 0, 104, 360, g, { h: 226, flat: true, pos: '50% 58%' }), bot = pic('us', 0, 334, 360, g, { h: 250, flat: true, pos: '50% 88%' });
  enter(top, T0(k) - 0.35, { x: 360 }, 0.7, 'expo.out'); enter(bot, T0(k) - 0.2, { x: -360 }, 0.7, 'expo.out'); cue(T0(k) - 0.3, 'whoosh', 0.45);
  el('div', '', '', 'position:absolute;left:0;right:0;top:104px;height:226px;background:linear-gradient(180deg,rgba(3,10,7,0.65),rgba(3,10,7,0) 45%)', g);
  el('div', '', '', 'position:absolute;left:0;right:0;top:420px;height:164px;background:linear-gradient(180deg,rgba(3,10,7,0),rgba(3,10,7,0.9) 55%)', g);
  path(sv, 'M360 332 H0', T0(k) + 0.2, 0.6, { width: 3, color: '#2EE86B' });
  note('أوروبا', 270, 112, T0(k) + 0.5, g); note('أمريكا', 270, 342, T0(k) + 0.7, g);
  say(k, 0, 0, { y: 140, size: 30, out: W(k, 1).s - 0.1 });
  say(k, 1, 4, { x: 24, y: 300, w: 312, size: 21, hero: { 4: 30 }, pill: { 4: 1 } });
  bracket(sv, 12, 344, 336, 230, W(k, 5).s - 0.1, { width: 2.5, len: 18 });
  say(k, 5, 10, { y: 452, size: 22, hero: { 10: 32 }, out: T1(k) - 0.3 });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 7 · WHERE THE BOXES CAME FROM — palette break: comic paper =================
{
  const k = 7, g = group(T0(k) - 0.3, T1(k) + 0.2);
  textGroup(k);
  setBG(T0(k) - 0.35, 1, 0.45); flash(T0(k) - 0.35, '#FFF3D6');
  const c = pic('comic', 22, 150, 196, g, { css: 'box-shadow:0 22px 40px rgba(60,30,10,0.35)' });
  enter(c, T0(k) - 0.1, { x: -220, rotation: -18, opacity: 0 }, 0.8, 'back.out(1.2)'); tl.to(c, { rotation: -6, duration: 0.01 }, T0(k) + 0.71); tl.fromTo(c, { rotation: -6, scale: 1 }, { rotation: -3, scale: 1.05, duration: SC[k].dur, ease: 'none', immediateRender: false }, T0(k) + 0.72);
  sweep(c, T0(k) + 0.9);
  say(k, 0, 3, { y: 106, size: 21, dark: true, out: W(k, 4).s - 0.1 });
  say(k, 4, 7, { x: 228, w: 112, y: 168, size: 21, dark: true, hero: { 4: 28 } });
  word('مارفل', 0, 318, 54, W(k, 8).s - 0.05, { dark: true, css: 'left:auto;right:20px' });
  word('ودي سي', 0, 382, 40, W(k, 9).s - 0.05, { dark: true, hero: false, kash: false, css: 'left:auto;right:20px;color:#0B1410' });
  say(k, 11, 13, { x: 226, w: 114, y: 440, size: 18, dark: true });
  note('Amazing Fantasy #15 · 1962', 22, 452, T0(k) + 1, g, { css: 'color:#5B4A2E;font-size:12px;font-family:Rubik' });
  setBG(T1(k) - 0.3, 0, 0.4);
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.3);
}

// ================= 8 · FROM HERE — into the US cover, onto the helicopter; then the same corner in every game =================
{
  const k = 8, r = 64, t0 = T0(k);
  textGroup(k);
  const f = full('us', t0 - 0.35, W(k, 12).s - 0.05, { x: 0.5, y: 0.5, z: 0.5, cx: 180, cy: 290, shade: 0.3 }, [Object.assign(ringMark(r), { x: HELI.us[0], y: HELI.us[1] })]);
  iris(f, t0 - 0.35, 180, 290, 0.75);
  camTo(f, W(k, 1).s - 0.1, { x: HELI.us[0], y: HELI.us[1], z: 2.3, cx: 180, cy: 110, shade: 0.75 }, 1.4, 'expo.inOut'); cue(W(k, 1).s, 'whoosh-soft', 0.4);
  scribble(f.marks[0].n.querySelector('svg'), r, r, r * 0.95, r * 0.72, W(k, 3).s - 0.1, { width: 2.2 });
  say(k, 0, 2, { y: 440, size: 22, out: W(k, 3).s - 0.1 });
  say(k, 3, 5, { y: 420, size: 24, hero: { 5: 50 }, out: W(k, 6).s - 0.1 });
  say(k, 6, 10, { y: 448, size: 22, hero: { 10: 32 }, out: W(k, 11).s - 0.1 });
  ['vc', 'iv', 'v'].forEach((n, i) => { const t = W(k, 12).s - 0.05 + i * 0.5; const g2 = full(n, t, i < 2 ? t + 0.5 : T1(k) + 0.05, { x: HELI[n][0], y: HELI[n][1], z: 2.3, cx: 180, cy: 110, shade: 0.75 }); cue(t, 'click', 0.5); });
  say(k, 11, 14, { y: 440, size: 22, hero: { 12: 34 }, out: T1(k) - 0.3 });
  flash(T1(k) - 0.1);
}

// ================= 9 · THE GRID LIVES ON — GTA VI in 3D, the grid draws over it =================
{
  const k = 9, g = group(T0(k) - 0.1, T1(k) + 0.3), sv = svgLayer(g);
  textGroup(k);
  const c = pic('vi', 132, 116, 208, g); enter(c, T0(k), { z: -500, rotationY: -60, opacity: 0 }, 1.0); sweep(c, T0(k) + 1);
  tl.fromTo(c, { rotationY: -16 }, { rotationY: 14, duration: SC[k].dur - 1, ease: 'sine.inOut', immediateRender: false }, T0(k) + 1);
  const st = word('ستيفن بلِس', 24, 112, 26, T0(k) + 0.05, { hero: false, css: 'color:#EFF7F1' });
  tl.to(st, { x: -260, opacity: 0, duration: 0.6, ease: 'power3.in' }, W(k, 1).s); cue(W(k, 1).s, 'whoosh-soft', 0.35);
  say(k, 0, 5, { y: 410, size: 22, out: W(k, 6).s - 0.1 });
  say(k, 6, 11, { y: 410, size: 22, hero: { 9: 30, 11: 30 }, out: W(k, 12).s - 0.1 });
  const tg = W(k, 13).s - 0.1;
  [[202, 104, 202, 392], [270, 104, 270, 392], [24, 204, 336, 204], [24, 296, 336, 296]].forEach((q, i) => path(sv, 'M' + q[2] + ' ' + q[3] + ' L' + q[0] + ' ' + q[1], tg + i * 0.15, 0.6, { width: 1.6, color: '#2EE86B', out: T1(k) - 0.8 }));
  cue(tg, 'shimmer', 0.35);
  say(k, 12, 16, { y: 420, size: 22, hero: { 13: 46 }, out: W(k, 17).s - 0.1 });
  ['us', 'vc', 'iv', 'v'].forEach((n, i) => { const p = pic(n, 30, 112 + i * 70, 50, g); enter(p, W(k, 17).s + i * 0.12, { x: -80, opacity: 0 }, 0.5); });
  say(k, 17, 20, { y: 440, size: 22, out: T1(k) - 0.3 });
  tl.to(g, { opacity: 0, z: 300, duration: 0.35, ease: 'power2.in' }, T1(k) - 0.3);
}

// ================= 10 · THE LINE TO REMEMBER =================
{
  const k = 10, g = group(T0(k) - 0.2, T1(k) + 0.3);
  textGroup(k);
  ghost('25', 10, 150, 300, T0(k), T1(k) - 0.3, g);
  ['us', 'vc', 'iv', 'v', 'vi', 'eu'].forEach((n, i) => { const a = i / 6 * Math.PI * 2, p = pic(n, 180 + Math.cos(a) * 150 - 26, 290 + Math.sin(a) * 200 - 32, 52, g, { css: 'opacity:0.22;filter:blur(1.5px)' });
    tl.fromTo(p, { rotation: 0 }, { rotation: 8, duration: SC[k].dur, ease: 'none', immediateRender: false }, T0(k)); });
  say(k, 0, 1, { y: 132, size: 26 });
  say(k, 2, 2, { y: 176, size: 22 });
  word('هوية', 0, 206, 100, W(k, 3).s - 0.05, { css: 'left:auto;right:24px' });
  const yr = word('25 سنة', 0, 330, 46, W(k, 4).s - 0.05, { hero: false, css: 'left:auto;right:28px;color:#EFF7F1' });
  say(k, 7, 11, { y: 452, size: 20, pill: { 11: 1 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.2);
  tl.to(txt, { opacity: 0, duration: 0.3 }, T1(k) - 0.2);
  flash(T1(k) - 0.1);
}

// ================= 11 · END CARD =================
{
  const k = 11, g = group(T0(k) - 0.05, null);
  textGroup(k);
  const b = el('div', 'endb', '<div class="ks">' + D.kreti.wave.replace(/width="\d+" height="\d+"/, 'width="170" height="170"') + '</div><div class="p">تابع كريتيفيا</div><div class="h2" dir="ltr">@creativia.mag</div><div class="n">كل يوم شي مبدع، الساعة 9 بالليل</div>', '', g);
  enter(b.querySelector('.ks'), T0(k), { scale: 0.2, opacity: 0, rotation: -12 }, 0.9, 'elastic.out(1,0.55)');
  enter(b.querySelector('.p'), T0(k) + 0.4, { scaleX: 0.2, opacity: 0 }, 0.6); cue(T0(k) + 0.45, 'shimmer', 0.4);
  enter(b.querySelector('.h2'), T0(k) + 0.7, { y: 10, opacity: 0 }, 0.5);
  enter(b.querySelector('.n'), T0(k) + 1.0, { y: 10, opacity: 0 }, 0.5);
}
