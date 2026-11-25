// Prada "Drawing Prada" vs Dior "Night in Color" — directed beats (engine 6), Nov 25 2026.
// Real footage carries the story (owner: videos in motion, especially the hook, with some of their own sound).
// Safe zones: nothing above y 124 but the brand row; text right edge ≤ 300 below y 320; text tops ≤ 486.
const fade = (node, t, d) => tl.fromTo(node, { opacity: 0 }, { opacity: 1, duration: d || 0.3, ease: 'power2.out', immediateRender: true }, t);
const fadeOut = (node, t, d) => tl.to(node, { opacity: 0, duration: d || 0.3, ease: 'power2.in' }, t);
const tag = (text, x, y, t, parent, o) => { o = o || {}; const n = el('div', 'tagx', esc(text), 'left:' + x + 'px;top:' + y + 'px;' + (o.css || ''), parent || TX); if (o.ltr) n.setAttribute('dir', 'ltr'); fade(n, t, 0.25); if (o.out != null) fadeOut(n, o.out, 0.2); return n; };
const R16 = w => Math.round(w * 9 / 16);

// ================= 0 · HOOK — a real woman, a drawn fox, in motion =================
{
  const k = 0;
  textGroup(k, 0.0);
  const f = full('fxa', 0, T1(k) + 0.3, { x: 0.6, y: 0.5, z: 1.0, shade: 0.55 });
  play(f, 'fxa', 0, { until: T1(k) + 0.3, audio: 0.6 });
  camTo(f, 2.4, { z: 1.12, x: 0.56 }, SC[k].dur - 2.2, 'power1.inOut');
  tag('Prada · Drawing Prada', 24, 136, 0, null, { ltr: true, out: T1(k) - 0.4 });
  say(k, 0, 1, { y: 366, size: 22 });
  say(k, 2, 3, { y: 404, size: 22, hero: { 2: 38, 3: 38 } });
  say(k, 4, 5, { y: 470, size: 24, pill: { 4: 1, 5: 1 } });
  fadeOut(f.L, T1(k) - 0.1, 0.35); whip(T1(k) - 0.1);
}

// ================= 1 · THE OTHER AD — accused of AI over one finger =================
{
  const k = 1, g = group(T0(k) - 0.2, T1(k) + 0.15), sv = svgLayer(g);
  textGroup(k);
  const c = pic('dr1', 30, 138, 300, g, { css: 'filter:grayscale(0.85) brightness(0.85)' });
  play(c, 'dr1', T0(k) - 0.2, { until: T1(k) + 0.1, audio: 0.3 });
  enter(c, T0(k) - 0.2, { z: -500, rotationY: 35, opacity: 0 }, 0.8);
  tl.fromTo(c, { rotationY: 0 }, { rotationY: -7, duration: SC[k].dur, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.6);
  tag('Dior · Night in Color', 30, 138 + c.H + 26, T0(k) + 0.3, g, { ltr: true });
  say(k, 0, 3, { y: 376, size: 22, out: W(k, 4).s - 0.32 });
  say(k, 4, 6, { y: 376, size: 22, hero: { 5: 34, 6: 34 } });
  say(k, 7, 9, { y: 478, size: 24, pill: { 8: 1 } });
  bracket(sv, 22, 130, 316, c.H + 16, W(k, 8).s - 0.05, { width: 2.4, len: 16 });
  tl.to(c, { filter: 'grayscale(0) brightness(1)', duration: 0.4 }, W(k, 8).s);
  tl.to(g, { z: 400, opacity: 0, duration: 0.3, ease: 'power2.in' }, T1(k) - 0.15);
  flash(T1(k) - 0.1);
}

// ================= 2 · PRADA — a Disney veteran, a pencil =================
{
  const k = 2;
  textGroup(k);
  const f = full('mkA', T0(k) - 0.1, T1(k) + 0.45, { x: 0.5, y: 0.42, z: 1.3, cy: 300, shade: 0.35 });
  play(f, 'mkA', T0(k) - 0.1, { until: T1(k) + 0.45, audio: 0 });
  fade(f.L, T0(k) - 0.1, 0.3);
  camTo(f, T0(k), { z: 1.42 }, SC[k].dur, 'none');
  say(k, 0, 1, { y: 136, size: 22, bg: true, out: W(k, 2).s - 0.32 });
  say(k, 2, 4, { y: 136, size: 22, bg: true, hero: { 3: 34, 4: 34 }, out: W(k, 5).s - 0.32 });
  say(k, 5, 8, { y: 136, size: 22, bg: true, hero: { 8: 32 } });
  const yr = word('2026', 0, 388, 74, W(k, 9).s - 0.1, { ltr: true, css: 'left:auto;right:60px', parent: TX });
  yr.classList.add('dk');
  count(yr, 2026, 1973, W(k, 9).s, 1.1);
  note('أول يوم بديزني', 0, 500, W(k, 11).s, null, { css: 'left:auto;right:66px' });
  // match-cut: the full frame shrinks into the next beat's card
  clipOut(f, T1(k) - 0.35, [24, 138, 312, R16(312), 12], 0.55);
}

// ================= 3 · POCAHONTAS, FANTASIA 2000 — and the old band back together =================
{
  const k = 3, g = group(T0(k) + 0.15, T1(k) + 0.2), sv = svgLayer(g);
  textGroup(k);
  const c = pic('mkB', 24, 138, 312, g);
  play(c, 'mkB', T0(k) + 0.15, { until: T1(k) + 0.2, audio: 0.25 });
  tl.fromTo(c, { rotationY: 0, rotationX: 0 }, { rotationY: 6, rotationX: -3, duration: SC[k].dur, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.2);
  say(k, 0, 3, { y: 348, size: 22, hero: { 1: 30, 2: 30 }, out: W(k, 4).s - 0.32 });
  say(k, 4, 9, { y: 348, size: 22, hero: { 9: 34 } });
  bracket(sv, 16, 130, 328, R16(312) + 16, W(k, 6).s, { width: 2.2, len: 16 });
  // push-through into the film
  tl.to(c, { scale: 2.2, opacity: 0, duration: 0.45, ease: 'power2.in' }, T1(k) - 0.3);
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.2);
}

// ================= 4 · THE FILM — mice steal Sadie Sink's shoe =================
{
  const k = 4, on = T0(k) - 0.25;
  textGroup(k);
  const f = full('prA', on, T1(k) + 0.6, { x: 0.5, y: 0.5, z: 1.0, shade: 0.55 });
  play(f, 'prA', on, { until: T1(k) + 0.6, audio: 0.5 });   // mice on the words, Sadie's close-up on her name
  fade(f.L, on, 0.35);
  camTo(f, on, { z: 1.1 }, SC[k].dur, 'none');
  say(k, 0, 3, { y: 404, size: 22, hero: { 1: 32, 3: 32 }, out: W(k, 4).s - 0.32 });
  say(k, 4, 5, { y: 404, size: 22, hero: { 4: 42, 5: 42 } });
  say(k, 6, 8, { y: 466, size: 19 });
  // match-cut: the film shrinks into the lower card of the split
  clipOut(f, T1(k) - 0.3, [120, 262, 200, R16(200), 12], 0.55);
}

// ================= 5 · SET vs FILM — light and angle matched to the drawings =================
{
  const k = 5, g = group(T0(k) + 0.2, T1(k) + 0.25), sv = svgLayer(g), w = 200, h = R16(200);
  textGroup(k);
  const top = pic('mkC', 120, 128, w, g), bot = pic('fxB', 120, 262, w, g);
  play(top, 'mkC', T0(k) - 0.1, { until: T1(k) + 0.2, audio: 0.15 });
  play(bot, 'fxB', T0(k) + 0.2, { until: T1(k) + 0.2, audio: 0 });
  enter(top, T0(k) - 0.1, { y: -60, rotationX: 40, opacity: 0 }, 0.7);
  tag('بالستوديو', 24, 128 + h / 2 - 11, T0(k) + 0.3, g);
  tag('بالإعلان', 24, 262 + h / 2 - 11, T0(k) + 0.5, g);
  path(sv, 'M332 ' + (128 + h - 16) + ' C350 ' + (128 + h + 4) + ' 350 ' + (262 - 4) + ' 332 ' + (262 + 16), W(k, 4).s - 0.1, 0.6, { width: 2.4 });
  path(sv, 'M326 ' + (262 + 8) + ' l7 9 l9 -6', W(k, 4).s + 0.45, 0.2, { width: 2.4 });
  say(k, 0, 5, { y: 404, size: 20, hero: { 5: 26 }, out: W(k, 6).s - 0.32 });
  say(k, 6, 9, { y: 404, size: 22, hero: { 7: 28, 9: 28 } });
  tl.to(top, { x: 260, opacity: 0, duration: 0.4, ease: 'power2.in' }, T1(k) - 0.25);
  tl.to(bot, { x: -260, opacity: 0, duration: 0.4, ease: 'power2.in' }, T1(k) - 0.25);
  tl.to(g, { opacity: 0, duration: 0.2 }, T1(k) - 0.05);
}

// ================= 6 · PENCIL TESTS — drawing after drawing =================
{
  const k = 6;
  textGroup(k);
  const f = full('mkD', T0(k) - 0.3, T1(k) + 0.25, { x: 0.5, y: 0.35, z: 1.3, cy: 260, shade: 0.25 });
  play(f, 'mkD', T0(k) - 0.3, { until: T1(k) + 0.25, audio: 0.18 });
  iris(f, T0(k) - 0.3, 180, 300, 0.7);
  camTo(f, T0(k), { z: 1.4 }, SC[k].dur, 'none');
  const cnt = word('رسمة 1', 0, 140, 18, T0(k) + 0.2, { hero: false, css: 'left:auto;right:24px;color:#9BFFC2' }); cnt.classList.add('dk');
  count(cnt, 1, 48, T0(k) + 0.3, SC[k].dur - 0.4, v => 'رسمة ' + Math.round(v));
  say(k, 0, 3, { y: 404, size: 22, bg: true, hero: { 3: 32 }, out: W(k, 4).s - 0.32 });
  say(k, 4, 6, { y: 404, size: 26, bg: true, hero: { 4: 34, 6: 34 } });
  fadeOut(f.L, T1(k) - 0.05, 0.3);
  flash(T1(k) - 0.1); whip(T1(k) - 0.1);
}

// ================= 7 · A WEEK LATER — Dior =================
{
  const k = 7;
  textGroup(k);
  const f = full('dr2', T0(k) - 0.2, T1(k) + 0.45, { x: 0.5, y: 0.45, z: 1.0, shade: 0.55 });
  play(f, 'dr2', T0(k) - 0.2, { until: T1(k) + 0.45, audio: 0.45 });
  fade(f.L, T0(k) - 0.2, 0.3);
  camTo(f, T0(k), { z: 1.18, y: 0.4 }, SC[k].dur, 'none');
  tag('Dior · Night in Color', 24, 136, T0(k) + 0.2, null, { ltr: true });
  say(k, 0, 1, { y: 176, size: 22, out: W(k, 2).s - 0.1 });
  say(k, 2, 3, { y: 384, size: 24, hero: { 3: 58 } });
  say(k, 4, 7, { y: 478, size: 20 });
  clipOut(f, T1(k) - 0.3, [30, 138, 300, R16(300), 12], 0.55);
}

// ================= 8 · ONE EXTRA FINGER — "AI!" =================
{
  const k = 8, g = group(T0(k) + 0.2, T1(k) + 0.15);
  textGroup(k);
  const c = pic('dr3', 30, 138, 300, g);
  play(c, 'dr3', T0(k) - 0.1, { until: T1(k) + 0.1, audio: 0.3 });
  tl.fromTo(c, { rotationY: 0 }, { rotationY: 8, duration: SC[k].dur, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.2);
  say(k, 0, 4, { x: 130, w: 170, y: 340, size: 21, out: W(k, 7).s - 0.32 });
  const n = word('5', 40, 340, 96, W(k, 5).s - 0.1, { ltr: true }); count(n, 5, 6, W(k, 5).s + 0.25, 0.25);
  note('أصابع؟', 34, 456, W(k, 6).s, null, { out: W(k, 7).s - 0.32 });
  fadeOut(n, W(k, 7).s - 0.12, 0.2);
  tl.fromTo(c, { x: 0 }, { x: 6, duration: 0.05, yoyo: true, repeat: 7, ease: 'none', immediateRender: false }, W(k, 7).s);
  tl.to(c, { filter: 'saturate(0.3) contrast(1.3)', duration: 0.2 }, W(k, 7).s);
  cue(W(k, 7).s, 'impact', 0.4);
  say(k, 7, 9, { y: 360, size: 24, hero: { 8: 46, 9: 46 } });
  tl.to(g, { opacity: 0, duration: 0.25 }, T1(k) - 0.15);
  flash(T1(k) - 0.1);
}

// ================= 9 · THE DENIAL — 20 artists, 7 months =================
{
  const k = 9;
  textGroup(k);
  const f = full('dr4', T0(k) - 0.15, T1(k) + 0.3, { x: 0.45, y: 0.5, z: 1.05, shade: 0.8 });
  play(f, 'dr4', T0(k) - 0.15, { until: T1(k) + 0.3, audio: 0.3 });
  fade(f.L, T0(k) - 0.15, 0.3);
  camTo(f, T0(k), { z: 1.2, x: 0.5 }, SC[k].dur, 'none');
  say(k, 0, 3, { y: 136, size: 21, bg: true, hero: { 1: 28, 2: 28 }, out: W(k, 4).s - 0.32 });
  say(k, 4, 5, { y: 136, size: 21, bg: true });
  const a = word('0', 40, 290, 110, W(k, 6).s - 0.1, { ltr: true }); count(a, 0, 20, W(k, 6).s, 0.7);
  note('فنان', 50, 424, W(k, 7).s);
  const b = word('0', 214, 290, 110, W(k, 8).s - 0.1, { ltr: true }); count(b, 0, 7, W(k, 8).s, 0.5);
  note('أشهر شغل', 200, 424, W(k, 9).s);
  fadeOut(f.L, T1(k) - 0.05, 0.3); whip(T1(k) - 0.1);
}

// ================= 10 · THE ANIMATOR'S TRICK — fast hands get extra fingers =================
{
  const k = 10;
  textGroup(k);
  const f = full('mkS', T0(k) - 0.25, T1(k) + 0.35, { x: 0.5, y: 0.35, z: 1.3, cy: 260, shade: 0.25 });
  play(f, 'mkS', T0(k) - 0.25, { until: T1(k) + 0.35, audio: 0 });
  fade(f.L, T0(k) - 0.25, 0.35);
  camTo(f, T0(k), { z: 1.4 }, SC[k].dur, 'none');
  say(k, 0, 4, { y: 404, size: 21, bg: true, hero: { 3: 28 }, out: W(k, 5).s - 0.32 });
  say(k, 5, 10, { y: 404, size: 21, bg: true, hero: { 6: 28, 7: 28 } });
  fadeOut(f.L, T1(k) + 0.05, 0.35);
}

// ================= 11 · THE LESSON — show your hand =================
{
  const k = 11;
  textGroup(k);
  const f = full('mk0', T0(k) - 0.2, T1(k) + 0.4, { x: 0.52, y: 0.5, z: 1.1, cy: 220, shade: 0.4 });
  play(f, 'mk0', T0(k) - 0.2, { until: T1(k) + 0.4, audio: 0 });
  fade(f.L, T0(k) - 0.2, 0.4);
  camTo(f, T0(k), { z: 1.35, x: 0.56 }, SC[k].dur + 0.4, 'power1.inOut');
  say(k, 0, 5, { y: 400, size: 22, bg: true, out: W(k, 6).s - 0.32 });
  say(k, 6, 8, { y: 392, size: 28, bg: true, hero: { 7: 44, 8: 44 } });
  clipOut(f, T1(k) - 0.3, [186, 196, 150, R16(150), 10], 0.5);
}

// ================= 12 · YOUR CALL =================
{
  const k = 12, g = group(T0(k) + 0.15, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const P = pic('prS', 196, 196, 140, g), Dc = pic('dr3', 30, 196, 140, g);
  enter(Dc, T0(k), { x: -80, rotationY: 40, opacity: 0 }, 0.6);
  tag('برادا', 196, 196 + P.H + 24, T0(k) + 0.2, g); tag('ديور', 30, 196 + Dc.H + 24, T0(k) + 0.3, g);
  say(k, 0, 2, { y: 340, size: 26, hero: { 2: 42 } });
  const yes = word('أي', 0, 424, 40, W(k, 3).s - 0.05, { css: 'left:auto;right:96px' }), no = word('لا', 70, 424, 40, W(k, 4).s - 0.05, {});
  bracket(sv, 22, 188, 156, Dc.H + 16, W(k, 2).s, { width: 2.2 });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.2); fadeOut([yes, no], T1(k) - 0.2, 0.25);
}

// ================= 13 · END CARD =================
{
  const k = 13, g = group(T0(k) - 0.05, null);
  const b = el('div', 'endb', '<div class="ks">' + D.kreti.wave.replace(/width="\d+" height="\d+"/, 'width="170" height="170"') + '</div><div class="p">تابع كريتيفيا</div><div class="h2" dir="ltr">@creativia.mag</div><div class="n">كل يوم شي مبدع، الساعة 9 بالليل</div>', '', g);
  enter(b.querySelector('.ks'), T0(k), { scale: 0.2, opacity: 0, rotation: -12 }, 0.9, 'elastic.out(1,0.55)');
  tl.fromTo(b.querySelector('.ks'), { y: 0 }, { y: -5, duration: 0.6, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.9);
  enter(b.querySelector('.p'), T0(k) + 0.4, { scaleX: 0.2, opacity: 0 }, 0.6); cue(T0(k) + 0.45, 'shimmer', 0.4);
  enter(b.querySelector('.h2'), T0(k) + 0.7, { y: 10, opacity: 0 }, 0.5);
  enter(b.querySelector('.n'), T0(k) + 1.0, { y: 10, opacity: 0 }, 0.5);
}
