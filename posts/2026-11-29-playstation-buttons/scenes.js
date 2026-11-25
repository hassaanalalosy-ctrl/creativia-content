// PlayStation buttons — why X means "no" in Japan. Directed beats (engine 6), Nov 26 2026.
// Safe zones: nothing above y 124 but the brand row; text right edge ≤ 300 below y 320; text tops ≤ 486.
const fade = (node, t, d) => tl.fromTo(node, { opacity: 0 }, { opacity: 1, duration: d || 0.3, ease: 'power2.out', immediateRender: true }, t);
const fadeOut = (node, t, d) => tl.to(node, { opacity: 0, duration: d || 0.3, ease: 'power2.in' }, t);
const tag = (text, x, y, t, parent, o) => { o = o || {}; const n = el('div', 'tagx', esc(text), 'left:' + x + 'px;top:' + y + 'px;' + (o.css || ''), parent || TX); if (o.ltr) n.setAttribute('dir', 'ltr'); fade(n, t, 0.25); if (o.out != null) fadeOut(n, o.out, 0.2); return n; };
// PlayStation shape colours = this story's accent (content, not brand)
const PS = { tri: '#3DDC97', cir: '#FF5A5F', x: '#6EA8FF', sq: '#FF7AD9' };
const SHAPE = {
  tri: (x, y, r) => 'M' + x + ' ' + (y - r) + ' L' + (x + 0.87 * r) + ' ' + (y + 0.5 * r) + ' L' + (x - 0.87 * r) + ' ' + (y + 0.5 * r) + ' Z',
  cir: (x, y, r) => 'M' + (x + r) + ' ' + y + ' a' + r + ' ' + r + ' 0 1 1 ' + (-2 * r) + ' 0 a' + r + ' ' + r + ' 0 1 1 ' + (2 * r) + ' 0',
  x: (x, y, r) => 'M' + (x - r) + ' ' + (y - r) + ' L' + (x + r) + ' ' + (y + r) + ' M' + (x + r) + ' ' + (y - r) + ' L' + (x - r) + ' ' + (y + r),
  sq: (x, y, r) => 'M' + (x - r) + ' ' + (y - r) + ' H' + (x + r) + ' V' + (y + r) + ' H' + (x - r) + ' Z'
};
const shape = (sv, s, x, y, r, t, o) => path(sv, SHAPE[s](x, y, r), t, (o && o.d) || 0.5, Object.assign({ color: PS[s], width: 6 }, o || {}));
// button positions (fractions of the photos)
const DS = { x: [0.783, 0.44], cir: [0.875, 0.41], tri: [0.85, 0.325], sq: [0.755, 0.355], mid: [0.815, 0.385] };
const P1 = { mid: [0.255, 0.535] };
const ring = r => ({ x: 0, y: 0, html: '<svg width="' + 2 * r + '" height="' + 2 * r + '" viewBox="0 0 ' + 2 * r + ' ' + 2 * r + '" style="overflow:visible"></svg>' });

// ================= 0 · HOOK — the X button, then a red X on a Tokyo station gate =================
{
  const k = 0, r = 30;
  textGroup(k, 0.0);
  const f = full('pad', 0, W(k, 4).s + 0.3, { x: DS.x[0], y: DS.x[1], z: 4.2, cx: 180, cy: 250, free: true, shade: 0.5 }, [Object.assign(ring(r), { x: DS.x[0], y: DS.x[1], keep: true })]);
  scribble(f.marks[0].n.querySelector('svg'), r, r, r * 0.95, r * 0.9, 0.5, { width: 3, color: PS.x });
  camTo(f, 0, { z: 3.6 }, W(k, 4).s, 'none');
  say(k, 0, 3, { y: 388, size: 24, hero: { 2: 44 }, out: W(k, 4).s - 0.32 });
  const g = full('gate', W(k, 4).s - 0.15, T1(k) + 0.35, { x: 0.79, y: 0.22, z: 2.6, cx: 180, cy: 240, free: true, shade: 0.55 });
  fade(g.L, W(k, 4).s - 0.15, 0.3); cue(W(k, 4).s - 0.1, 'whoosh', 0.4);
  camTo(g, W(k, 4).s, { z: 2.2 }, T1(k) - W(k, 4).s + 0.3, 'none');
  say(k, 4, 5, { y: 370, size: 24 });
  word('لا', 0, 428, 110, W(k, 6).s - 0.05, { css: 'left:auto;right:60px', from: 1.2 });
  fadeOut(g.L, T1(k) - 0.05, 0.3); flash(T1(k) - 0.1);
}

// ================= 1 · 30 YEARS AGO — Teiyu Goto draws four shapes =================
{
  const k = 1;
  textGroup(k);
  const f = full('ps1', T0(k) - 0.2, T1(k) + 0.3, { x: 0.3, y: 0.5, z: 1.0, cx: 180, cy: 320, free: true, shade: 0.3 });
  fade(f.L, T0(k) - 0.2, 0.35);
  camTo(f, W(k, 6).s - 0.3, { x: P1.mid[0], y: P1.mid[1], z: 2.4, cy: 250 }, 1.4, 'expo.inOut'); cue(W(k, 6).s - 0.25, 'whoosh-soft', 0.35);
  say(k, 0, 2, { y: 136, size: 22, bg: true, out: W(k, 3).s - 0.32 });
  say(k, 3, 5, { y: 136, size: 22, bg: true, hero: { 4: 34, 5: 34 }, out: W(k, 6).s - 0.32 });
  say(k, 6, 10, { y: 404, size: 22, bg: true, hero: { 7: 30 } });
  const sv = svgLayer(TX); bracket(sv, 92, 160, 176, 180, W(k, 8).s, { width: 2.6, len: 18 });
  clipOut(f, T1(k) - 0.3, [40, 150, 280, 280, 140], 0.5);
  fadeOut(f.L, T1(k) - 0.05, 0.3);
}

// ================= 2 · TRIANGLE = your head, SQUARE = a sheet of paper =================
{
  const k = 2, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const tT = T0(k) - 0.05, tS = W(k, 5).s - 0.1;
  shape(sv, 'tri', 250, 236, 62, tT, { width: 9, d: 0.6 }); cue(tT, 'whoosh-soft', 0.3);
  // viewpoint: an eye-line from the triangle's top
  path(sv, 'M250 170 C262 150 290 146 316 156', W(k, 3).s, 0.4, { width: 2.4, dash: '4 6' });
  path(sv, 'M310 150 l8 7 l-10 4', W(k, 3).s + 0.3, 0.2, { width: 2.4 });
  say(k, 0, 4, { x: 24, w: 150, y: 168, size: 22, hero: { 0: 34, 2: 30 } });
  shape(sv, 'sq', 108, 392, 50, tS, { width: 9, d: 0.6 }); cue(tS, 'whoosh-soft', 0.3);
  [0, 1, 2].forEach(i => path(sv, 'M' + 80 + ' ' + (376 + i * 16) + ' H' + (136 - i * 10), W(k, 6).s + i * 0.1, 0.25, { width: 3, color: '#EFF7F1', glow: false }));
  say(k, 5, 8, { x: 176, w: 130, y: 352, size: 22, hero: { 5: 30, 8: 28 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 3 · CIRCLE and X = yes and no — like everywhere in Japan =================
{
  const k = 3, r = 26;
  textGroup(k);
  const f = full('gate', T0(k) - 0.2, T1(k) + 0.3, { x: 0.23, y: 0.22, z: 1.5, cx: 180, cy: 230, free: true, shade: 0.5 });
  fade(f.L, T0(k) - 0.2, 0.35);
  camTo(f, W(k, 3).s - 0.35, { x: 0.79 }, 0.8, 'expo.inOut'); cue(W(k, 3).s - 0.3, 'whoosh-soft', 0.35);
  camTo(f, W(k, 4).s, { z: 1.1, x: 0.5 }, SC[k].dur - (W(k, 4).s - T0(k)), 'power1.inOut');
  say(k, 0, 1, { y: 400, size: 24, out: W(k, 2).s - 0.32 });
  const yes = word('نعم', 0, 318, 44, W(k, 2).s - 0.05, { css: 'left:auto;right:56px', out: W(k, 4).s - 0.32 }); yes.classList.add('dk');
  const no = word('لا', 56, 318, 44, W(k, 3).s - 0.05, { hero: false, css: 'color:#FF5A5F', out: W(k, 4).s - 0.32 }); no.classList.add('dk');
  say(k, 4, 9, { y: 404, size: 22, hero: { 7: 30 } });
  tl.to(f.P, { x: DS.mid[0] }, T1(k));   // (hidden by then)
  fadeOut(f.L, T1(k) - 0.05, 0.3);
}

// ================= 4 · EVEN THE COLOURS — red circle, blue X; "a mistake!" — he insisted =================
{
  const k = 4;
  textGroup(k);
  const f = full('pad', T0(k) - 0.2, T1(k) + 0.3, { x: DS.mid[0], y: DS.mid[1], z: 3.2, cx: 180, cy: 250, free: true, shade: 0.5 });
  fade(f.L, T0(k) - 0.2, 0.35);
  camTo(f, W(k, 2).s - 0.2, { x: DS.cir[0], y: DS.cir[1], z: 4.4 }, 0.9, 'expo.inOut');
  camTo(f, W(k, 4).s - 0.2, { x: DS.x[0], y: DS.x[1], z: 4.4 }, 0.9, 'expo.inOut');
  camTo(f, W(k, 6).s - 0.2, { x: DS.mid[0], y: DS.mid[1], z: 2.6 }, 1.0, 'expo.inOut');
  say(k, 0, 1, { y: 136, size: 24, bg: true, out: W(k, 2).s - 0.32 });
  say(k, 2, 3, { y: 396, size: 26, hero: { 3: 40 }, out: W(k, 4).s - 0.32 });
  say(k, 4, 5, { y: 396, size: 26, hero: { 5: 40 }, out: W(k, 6).s - 0.32 });
  say(k, 6, 8, { y: 396, size: 24, hero: { 8: 34 }, out: W(k, 9).s - 0.32 });
  say(k, 9, 10, { y: 396, size: 30, hero: { 10: 52 } });
  fadeOut(f.L, T1(k) - 0.05, 0.3); whip(T1(k) - 0.1);
}

// ================= 5 · THE WEST FLIPS IT — X becomes "OK" =================
{
  const k = 5, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  say(k, 0, 5, { y: 136, size: 22, hero: { 4: 28, 5: 28 } });
  const big = shape(sv, 'x', 180, 322, 62, T0(k) + 0.1, { width: 14, d: 0.5 }); cue(T0(k) + 0.1, 'impact', 0.4);
  const lab = word('لا', 0, 410, 48, T0(k) + 0.4, { hero: false, css: 'left:0;right:0;text-align:center;color:#FF5A5F' });
  tl.to(lab, { rotationX: 90, opacity: 0, duration: 0.2, ease: 'power2.in' }, W(k, 9).s - 0.25);
  const ok = word('موافق', 0, 410, 48, W(k, 9).s - 0.05, { css: 'left:0;right:0;text-align:center', from: 1.12 }); cue(W(k, 9).s, 'shimmer', 0.35);
  say(k, 6, 8, { y: 478, size: 20 });
  tl.fromTo(big, { rotation: 0, transformOrigin: '180px 322px' }, { rotation: 90, duration: 0.5, ease: 'back.out(1.6)', immediateRender: false }, W(k, 9).s - 0.1);
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 6 · 26 YEARS, TWO WORLDS =================
{
  const k = 6, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const yr = ghost('26', 70, 150, 200, T0(k), T1(k) - 0.3, g);
  say(k, 0, 2, { y: 136, size: 26, hero: { 0: 36, 1: 36 }, out: W(k, 3).s - 0.32 });
  // right half: Japan presses O; left half: the world presses X
  path(sv, 'M180 300 V470', T0(k) + 0.3, 0.5, { width: 1.5, color: 'rgba(155,255,194,0.4)', glow: false });
  shape(sv, 'cir', 262, 330, 34, W(k, 5).s - 0.1, { width: 9 });
  tag('اليابان', 236, 382, W(k, 3).s, g);
  shape(sv, 'x', 98, 330, 30, W(k, 10).s - 0.1, { width: 9 });
  tag('العالم', 74, 382, W(k, 8).s, g);
  say(k, 3, 7, { x: 186, w: 118, y: 424, size: 18 });
  say(k, 8, 10, { x: 24, w: 140, y: 424, size: 18 });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 7 · PS5 (2020): X = OK everywhere =================
{
  const k = 7, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const c = pic('ds5', 40, 140, 280, g, { css: 'background:#fff' });
  play(c, 'ds5', T0(k) - 0.1, { until: T1(k), audio: 0 });
  enter(c, T0(k) - 0.1, { z: -500, rotationX: 30, opacity: 0 }, 0.8);
  tag('2020 · PS5', 40, 140 + c.H + 16, T0(k) + 0.3, g, { ltr: true });
  say(k, 0, 3, { y: 352, size: 22, hero: { 0: 30, 1: 30 }, out: W(k, 4).s - 0.32 });
  say(k, 4, 8, { y: 352, size: 22, hero: { 6: 32 } });
  shape(sv, 'x', 290, 460, 18, W(k, 4).s, { width: 6 });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
  flash(T1(k) - 0.1);
}

// ================= 8 · "IT FEELS LIKE WE LOST A WAR" =================
{
  const k = 8, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  say(k, 0, 1, { y: 136, size: 24, hero: { 1: 34 } });
  // a post card (Twitter-style layout, no invented handle): who, where/when, the words, the source — everything inside the card
  const q = el('div', 'card holder tw', '<div class="twh"><i class="av"></i><div><b>لاعب ياباني</b><span>تويتر · أكتوبر 2020</span></div></div><div class="twf">المصدر: SoraNews24</div>', 'left:30px;top:214px;width:300px;height:196px', g);
  enter(q, W(k, 2).s - 0.25, { y: 30, scale: 0.92, opacity: 0 }, 0.5);
  say(k, 4, 6, { x: 18, w: 264, y: 80, size: 28, hero: { 5: 34, 6: 34 }, parent: q });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 9 · THE LESSON — same shape, different meaning =================
{
  const k = 9, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const c = shape(sv, 'cir', 230, 292, 46, T0(k), { width: 10 });
  const x = shape(sv, 'x', 120, 292, 42, T0(k) + 0.15, { width: 10 });
  // they swap places
  const sw = W(k, 4).s - 0.1;
  tl.to(c, { x: -110, duration: 0.6, ease: 'expo.inOut' }, sw); tl.to(x, { x: 110, duration: 0.6, ease: 'expo.inOut' }, sw); cue(sw, 'whoosh', 0.35);
  say(k, 0, 7, { y: 136, size: 22, hero: { 1: 28, 3: 28 }, out: W(k, 8).s - 0.32 });
  say(k, 8, 12, { y: 380, size: 24, hero: { 8: 40, 9: 34 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 10 · YOUR CALL =================
{
  const k = 10, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  say(k, 0, 1, { y: 150, size: 26 });
  shape(sv, 'x', 260, 300, 40, W(k, 2).s - 0.1, { width: 10 });
  tag('الإكس', 232, 356, W(k, 2).s, g);
  word('لو', 162, 282, 34, W(k, 3).s - 0.05, { hero: false });
  shape(sv, 'cir', 100, 300, 40, W(k, 4).s - 0.1, { width: 10 });
  tag('الدائرة', 70, 356, W(k, 4).s, g);
  say(k, 5, 6, { y: 420, size: 26, hero: { 6: 36 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.2);
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
