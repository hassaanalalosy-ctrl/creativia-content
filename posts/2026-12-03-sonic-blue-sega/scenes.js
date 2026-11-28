// Why Sonic is blue: a mascot to beat Mario, a contest, Central Park, Eggman, Needlemouse, Madonna, the shoes — and the blue
// of the SEGA logo as the payoff. Directed beats (engine 6), Nov 28 2026.
// Safe zones: nothing above y 124 but the brand row; text right edge <= 300 below y 320; text tops <= 486.
const fade = (node, t, d) => tl.fromTo(node, { opacity: 0 }, { opacity: 1, duration: d || 0.3, ease: 'power2.out', immediateRender: true }, t);
const fadeOut = (node, t, d) => tl.to(node, { opacity: 0, duration: d || 0.3, ease: 'power2.in' }, t);
const tag = (text, x, y, t, parent, o) => { o = o || {}; const n = el('div', 'tagx', esc(text), 'left:' + x + 'px;top:' + y + 'px;' + (o.css || ''), parent || TX); if (o.ltr) n.setAttribute('dir', 'ltr'); fade(n, t, 0.25); if (o.out != null) fadeOut(n, o.out, 0.2); return n; };
const px = node => { const n = node.L || node; n.querySelectorAll('img').forEach(im => { if (!im.classList.contains('fbg')) im.style.imageRendering = 'pixelated'; }); return node; };
const ringMark = (x, y, w, h) => ({ x, y, html: '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="overflow:visible"></svg>' });
const ringIn = (f, i, rx, ry, t, o) => { const s = f.marks[i].n.querySelector('svg'), w = +s.getAttribute('width'), h = +s.getAttribute('height'); return scribble(s, w / 2, h / 2, rx, ry, t, Object.assign({ width: 3 }, o || {})); };
const sayN = (k, a, b, o) => { const d = say(k, a, b, o); d.style.whiteSpace = 'nowrap'; return d; };
const ns = p => { p.querySelectorAll('.sweep').forEach(x => x.remove()); return p; };
const RED = '#FF5A5F', SBLUE = '#0060A8';
// points on the Mega Drive box (fractions)
const HEAD = [0.6, 0.27], SHOE = [0.56, 0.70], LOGO = [0.865, 0.953];

// ================= 0 · HOOK — Sonic's blue … and the SEGA logo in the corner =================
{
  const k = 0;
  textGroup(k, 0.0);
  const f = full('box', 0, T1(k) + 0.25, { x: HEAD[0], y: HEAD[1], z: 1.55, cx: 180, cy: 300, shade: 0.35 }, [ringMark(LOGO[0], LOGO[1], 260, 120)]);
  camTo(f, 0, { z: 1.65 }, W(k, 3).s, 'none');
  camTo(f, W(k, 3).s - 0.2, { x: LOGO[0], y: LOGO[1], z: 1.6, cy: 300 }, 0.9, 'expo.inOut'); cue(W(k, 3).s - 0.15, 'whoosh', 0.4);
  ringIn(f, 0, 84, 40, W(k, 4).s + 0.1, { width: 3.5 });
  sayN(k, 0, 2, { y: 136, size: 30, bg: true, hero: { 2: 42 }, out: W(k, 3).s - 0.3 });
  sayN(k, 3, 5, { y: 136, size: 26, bg: true, hero: { 4: 34, 5: 34 } });
  fadeOut(f.L, T1(k) - 0.1, 0.3); whip(T1(k) - 0.1);
}

// ================= 1 · MARIO WAS KING — SEGA wants a rival =================
{
  const k = 1, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  say(k, 0, 5, { y: 128, size: 22, hero: { 2: 30, 4: 30 } });
  const m = ns(pic('mario', 120, 256, 120, g, { flat: true }));
  enter(m, T0(k) + 0.05, { x: 90, opacity: 0, rotation: 8 }, 0.6, 'back.out(1.4)');
  path(sv, 'M156 250 L162 232 L172 244 L180 226 L188 244 L198 232 L204 250 Z', W(k, 4).s - 0.05, 0.5, { width: 2.6, out: W(k, 6).s - 0.35 });
  tl.to(m, { x: -70, scale: 0.85, duration: 0.6, ease: 'expo.inOut' }, W(k, 6).s - 0.3);
  const lg = ns(pic('logo', 200, 316, 120, g, { flat: true }));
  enter(lg, W(k, 6).s - 0.05, { x: 80, opacity: 0, filter: 'blur(8px)' }, 0.55); cue(W(k, 6).s, 'pop', 0.35);
  path(sv, 'M190 312 L180 334 H192 L182 356', W(k, 8).s - 0.1, 0.35, { width: 3 });
  say(k, 6, 9, { y: 424, size: 24, hero: { 8: 32 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15); flash(T1(k) - 0.1);
}

// ================= 2-4 · THE CONTEST → CENTRAL PARK → THE HEDGEHOG WINS (one stage) =================
const CARDS = [];
{
  const g = group(T0(2) - 0.1, T1(4) + 0.1), sv = svgLayer(g);
  const spots = [[190, 236], [30, 236], [190, 322], [30, 322]];   // right→left, top→bottom
  const labels = ['أرنب', 'كلب', 'أرماديلو', 'رجال بالبيجامة'], wi = [4, 5, 6, 7];
  labels.forEach((lb, j) => {
    const c = el('div', 'card tw holder', '', 'left:' + spots[j][0] + 'px;top:' + spots[j][1] + 'px;width:140px;height:70px', g);
    const w = word(lb, 0, 0, j === 3 ? 18 : 24, W(2, wi[j]).s - 0.1, { hero: false, parent: c, css: 'left:0;right:0;text-align:center;top:' + (j === 3 ? 25 : 20) + 'px' });
    enter(c, W(2, wi[j]).s - 0.15, { x: 50, opacity: 0, scale: 0.8 }, 0.45, 'back.out(1.5)'); cue(W(2, wi[j]).s - 0.1, 'pop', 0.3);
    CARDS.push(c);
  });
  // 3: the cards fly up into a row of small "ballots"; a pin drops on New York
  CARDS.forEach((c, j) => tl.to(c, { y: -70, scale: 0.4, opacity: 0, duration: 0.45, ease: 'power2.in' }, T0(3) - 0.2 + j * 0.04));
  const pin = path(sv, 'M180 300 C160 272 158 252 180 240 C202 252 200 272 180 300 Z M180 252 a7 7 0 1 0 0.1 0', W(3, 4).s - 0.1, 0.6, { width: 3, out: T1(3) - 0.2 });
  tag('New York · Central Park', 0, 312, W(3, 9).s - 0.1, g, { ltr: true, css: 'left:50%;transform:translateX(-50%)', out: T1(3) - 0.2 });
  // ballots: tally marks under the pin
  [0, 1, 2, 3, 4].forEach(i => path(sv, i < 4 ? 'M' + (148 + i * 14) + ' 352 V378' : 'M140 372 L210 356', W(3, 7).s + i * 0.12, 0.18, { width: 3, out: T1(3) - 0.2 }));
  // 4: the hedgehog wins, the pajama man second
  const hog = pic('hog', 130, 206, 200, g, { h: 134 });
  enter(hog, T0(4) - 0.05, { x: 80, rotationY: -20, opacity: 0 }, 0.6); sweep(hog, T0(4) + 0.5);
  const b1 = word('1', 0, 0, 40, T0(4) + 0.25, { ltr: true, css: 'left:92px;top:250px;color:#2EE86B' });
  const c2 = el('div', 'card tw holder', '', 'left:110px;top:354px;width:150px;height:50px', g);
  word('رجال بالبيجامة', 0, 0, 17, W(4, 3).s, { hero: false, parent: c2, css: 'left:0;right:0;text-align:center;top:15px' });
  enter(c2, W(4, 3).s - 0.1, { x: -40, opacity: 0 }, 0.45);
  const b2 = word('2', 0, 0, 30, W(4, 3).s + 0.1, { ltr: true, hero: false, css: 'left:80px;top:358px;color:#9BFFC2' });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(4) - 0.15);
}
{ const k = 2; textGroup(k); say(k, 0, 3, { y: 128, size: 24, hero: { 1: 32 } }); }
{ const k = 3; textGroup(k); say(k, 0, 5, { y: 128, size: 22, hero: { 1: 28, 2: 28 } }); say(k, 6, 9, { y: 400, size: 24, hero: { 8: 30, 9: 30 } }); }
{ const k = 4; textGroup(k); say(k, 0, 1, { y: 128, size: 30, hero: { 1: 40 } }); say(k, 2, 6, { y: 426, size: 22, hero: { 5: 28, 6: 28 } }); whip(T1(k) - 0.1); }

// ================= 5 · THE PAJAMA MAN BECAME EGGMAN =================
{
  const k = 5, g = group(T0(k) - 0.1, T1(k) + 0.1);
  textGroup(k);
  ghost('EGGMAN', -20, 470, 92, T0(k), T1(k) - 0.3, g);
  const e = pic('egg', 130, 140, 150, g);
  enter(e, T0(k) + 0.05, { y: 40, scale: 0.85, opacity: 0 }, 0.7, 'back.out(1.3)'); sweep(e, T0(k) + 0.7);
  tl.to(e, { scale: 1.06, duration: SC[k].dur, ease: 'none' }, T0(k) + 0.7);
  say(k, 0, 3, { y: 386, size: 22, out: W(k, 4).s - 0.3 });
  say(k, 4, 6, { y: 386, size: 26, hero: { 5: 34, 6: 34 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15); flash(T1(k) - 0.1);
}

// ================= 6 · WHY A HEDGEHOG — it rolls into a ball and attacks =================
{
  const k = 6, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  say(k, 0, 1, { y: 128, size: 30, hero: { 1: 40 } });
  const s = ns(px(pic('spin', 40, 208, 280, g)));
  enter(s, T0(k) + 0.1, { x: 120, opacity: 0, rotation: -6 }, 0.6);
  tl.to(s, { scale: 1.08, duration: SC[k].dur, ease: 'none' }, T0(k) + 0.7);
  bracket(sv, 32, 200, 296, 212, W(k, 3).s - 0.1, { len: 16, width: 2.4 });
  say(k, 2, 6, { y: 428, size: 24, hero: { 4: 32, 6: 32 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15); whip(T1(k) - 0.1);
}

// ================= 7 · MR. NEEDLEMOUSE =================
{
  const k = 7, g = group(T0(k) - 0.1, T1(k) + 0.1);
  textGroup(k);
  ghost('?', 120, 150, 260, T0(k), T1(k) - 0.3, g);
  say(k, 0, 3, { y: 136, size: 28, hero: { 1: 36 } });
  sayN(k, 4, 6, { y: 250, size: 32, align: 'center', hero: { 5: 40, 6: 40 } });
  tag('Mr. Needlemouse', 0, 340, W(k, 6).s + 0.15, TX, { ltr: true, css: 'left:50%;transform:translateX(-50%);font-size:16px' });
  note('اسم مؤقت!', 120, 400, W(k, 6).s + 0.5, TX);
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15); flash(T1(k) - 0.1);
}

// ================= 8-9 · FANGS, A ROCK BAND, MADONNA — then SEGA of America cuts it all =================
{
  const f = full('mad', T0(8) - 0.2, T1(9) + 0.3, { x: 0.86, y: 0.14, z: 2.2, cx: 190, cy: 260, free: true, shade: 0.3 }, [ringMark(0.86, 0.13, 200, 200)]);
  fade(f.L, T0(8) - 0.2, 0.35);
  ringIn(f, 0, 44, 44, W(8, 5).s - 0.1, { width: 2, out: W(8, 6).s - 0.45 });
  camTo(f, W(8, 6).s - 0.35, { x: 0.68, y: 0.45, z: 0.95, cx: 180, cy: 300, free: false }, 1.0, 'expo.inOut'); cue(W(8, 6).s - 0.3, 'whoosh-soft', 0.35);
  camTo(f, W(8, 6).s + 0.7, { z: 1.0 }, T1(8) - W(8, 6).s, 'none');
  // 9: the art shrinks into a card and gets crossed out
  clipOut(f, T0(9) + 0.05, [60, 220, 240, 150, 14], 0.6);
  const sv = svgLayer(group(T0(9), T1(9) + 0.1, fx));
  path(sv, 'M70 230 L290 360', W(9, 3).s - 0.1, 0.3, { color: RED, width: 6 }); cue(W(9, 3).s - 0.05, 'impact', 0.35);
  path(sv, 'M290 230 L70 360', W(9, 3).s + 0.15, 0.3, { color: RED, width: 6 });
  fadeOut(f.L, T1(9) - 0.1, 0.3);
}
{ const k = 8; textGroup(k); sayN(k, 0, 2, { y: 420, size: 24, bg: true, out: W(k, 3).s - 0.3 }); sayN(k, 3, 5, { y: 420, size: 26, bg: true, hero: { 5: 34 }, out: W(k, 6).s - 0.3 }); sayN(k, 6, 7, { y: 136, size: 24, bg: true, hero: { 7: 30 }, out: W(k, 8).s - 0.3 }); sayN(k, 8, 10, { y: 136, size: 24, bg: true, hero: { 10: 30 }, out: T1(k) - 0.3 }); }
{
  const k = 9; textGroup(k);
  say(k, 0, 4, { y: 128, size: 24, hero: { 1: 30, 3: 30 } });
  tag('Sega of America', 0, 382, W(k, 2).s, TX, { ltr: true, css: 'left:50%;transform:translateX(-50%)', out: W(k, 5).s - 0.3 });
  say(k, 5, 8, { y: 412, size: 24, hero: { 8: 32 } });
  whip(T1(k) - 0.1);
}

// ================= 10-11 · THE SHOES … AND THE BLUE (payoff): one camera on the box =================
{
  const f = full('box', T0(10) - 0.2, T1(11) + 0.3, { x: SHOE[0], y: SHOE[1], z: 2.0, cx: 180, cy: 290, shade: 0.35 }, [ringMark(SHOE[0], SHOE[1], 300, 160), ringMark(LOGO[0], LOGO[1], 260, 120), ringMark(HEAD[0], 0.3, 300, 300)]);
  fade(f.L, T0(10) - 0.2, 0.35);
  ringIn(f, 0, 62, 28, W(10, 1).s, { width: 3.5, out: T1(10) - 0.3 });
  camTo(f, T0(10), { z: 2.15 }, SC[10].dur, 'none');
  // 11: pull back to the whole box, ring Sonic, then travel to the logo
  camTo(f, T0(11) - 0.1, { x: 0.5, y: 0.5, z: 1.0, cy: 320 }, 0.9, 'expo.inOut'); cue(T0(11), 'whoosh', 0.4);
  ringIn(f, 2, 78, 90, W(11, 1).s - 0.1, { width: 3, out: W(11, 3).s + 0.2 });
  camTo(f, W(11, 4).s - 0.3, { x: LOGO[0], y: LOGO[1], z: 1.7, cy: 300 }, 0.9, 'expo.inOut');
  ringIn(f, 1, 84, 40, W(11, 5).s, { width: 3.5 });
  fadeOut(f.L, T1(11) - 0.1, 0.3); flash(T1(11) - 0.1, '#3F8FE0');
}
{
  const k = 10; textGroup(k);
  sayN(k, 0, 1, { y: 136, size: 28, bg: true, hero: { 1: 36 }, out: W(k, 2).s - 0.3 });
  sayN(k, 2, 5, { y: 136, size: 22, bg: true, hero: { 4: 28, 5: 28 }, out: W(k, 6).s - 0.3 });
  sayN(k, 6, 7, { y: 136, size: 26, bg: true, hero: { 7: 32 } });
  tag('Michael Jackson · Bad (1987)', 0, 196, W(k, 6).s, TX, { ltr: true, css: 'left:50%;transform:translateX(-50%)' });
  sayN(k, 8, 10, { y: 420, size: 24, bg: true, hero: { 10: 32 } });
}
{
  const k = 11; textGroup(k);
  sayN(k, 0, 1, { y: 136, size: 30, bg: true, hero: { 1: 40 }, out: W(k, 2).s - 0.3 });
  sayN(k, 2, 6, { y: 136, size: 22, bg: true, hero: { 4: 30, 6: 30 } });
  // two swatches: Sonic and the logo, the same blue
  const sw = el('div', '', '', 'position:absolute;left:0;right:0;top:416px;display:flex;justify-content:center;gap:18px;padding-right:60px;padding-left:0', TX);
  ['سونيك', 'SEGA'].forEach((lb, j) => {
    const d = el('div', 'dk', '<span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:' + SBLUE + ';vertical-align:middle;margin-left:8px;box-shadow:0 0 0 2px #fff"></span><span style="font-weight:800;font-size:17px;vertical-align:middle">' + lb + '</span>', 'position:relative', sw);
    tl.fromTo(d, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.6)', immediateRender: true }, W(k, 3).s + j * 0.25);
  });
  cue(W(k, 6).s, 'shimmer', 0.4);
}

// ================= 12 · 1991 — SEGA passes Nintendo in America =================
{
  const k = 12, g = group(T0(k) - 0.1, T1(k) + 0.1);
  textGroup(k);
  const t = ns(px(pic('title', 30, 192, 300, g)));
  enter(t, T0(k) + 0.05, { x: 100, opacity: 0, rotationY: -15 }, 0.6); sweep(t, T0(k) + 0.6);
  const yr = word('1991', 0, 384, 50, W(k, 3).s - 0.05, { ltr: true, css: 'left:0;right:0;text-align:center' });
  say(k, 0, 1, { y: 128, size: 26, hero: { 1: 32 } });
  tl.to(yr, { opacity: 0, y: -10, duration: 0.25 }, W(k, 5).s - 0.35);
  say(k, 5, 8, { y: 400, size: 24, hero: { 6: 32 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15); whip(T1(k) - 0.1);
}

// ================= 13 · THE LESSON — every detail has a reason =================
{
  const k = 13, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  sayN(k, 0, 4, { y: 128, size: 22, hero: { 3: 28 } });
  const bx = pic('boxus', 196, 196, 118, g);
  enter(bx, T0(k) + 0.05, { x: 50, opacity: 0, rotationY: -20 }, 0.6); sweep(bx, T0(k) + 0.6);
  path(sv, 'M184 278 H160 M168 270 L160 278 L168 286', W(k, 4).s, 0.35, { width: 2.8 });
  const lg = ns(pic('logo', 30, 258, 120, g, { flat: true }));
  enter(lg, W(k, 4).s + 0.2, { x: -40, opacity: 0, scale: 0.8 }, 0.5, 'back.out(1.5)');
  say(k, 5, 7, { y: 390, size: 26, hero: { 5: 34, 7: 38 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 14 · YOUR CALL =================
{
  const k = 14;
  textGroup(k);
  const f = full('box', T0(k) - 0.2, T1(k) + 0.3, { x: HEAD[0], y: 0.32, z: 1.0, cx: 180, cy: 300, shade: 0.5 });
  fade(f.L, T0(k) - 0.2, 0.35);
  camTo(f, T0(k), { z: 1.2 }, SC[k].dur, 'none');
  sayN(k, 0, 3, { y: 136, size: 26, bg: true, hero: { 3: 36 } });
  const yes = word('إي', 0, 404, 40, W(k, 4).s - 0.05, { css: 'left:auto;right:70px' }); yes.classList.add('dk');
  word('لو', 150, 412, 26, W(k, 5).s - 0.05, { hero: false });
  const no = word('لا', 60, 404, 40, W(k, 6).s - 0.05, { hero: false, css: 'color:' + RED }); no.classList.add('dk');
  tl.to(TX, { opacity: 0, filter: 'blur(6px)', duration: 0.35, ease: 'power2.in' }, T1(k) - 0.4);
  fadeOut(f.L, T1(k) - 0.35, 0.45);
}

// ================= 15 · END CARD =================
{
  const k = 15, g = group(T0(k) - 0.05, null);
  const b = el('div', 'endb', '<div class="ks">' + D.kreti.wave.replace(/width="\d+" height="\d+"/, 'width="170" height="170"') + '</div><div class="p">تابع كريتيفيا</div><div class="h2" dir="ltr">@creativia.mag</div><div class="n">كل يوم شي مبدع، الساعة 9 بالليل</div>', '', g);
  enter(b.querySelector('.ks'), T0(k), { scale: 0.2, opacity: 0, rotation: -12 }, 0.9, 'elastic.out(1,0.55)');
  tl.fromTo(b.querySelector('.ks'), { y: 0 }, { y: -5, duration: 0.6, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, T0(k) + 0.9);
  enter(b.querySelector('.p'), T0(k) + 0.4, { scaleX: 0.2, opacity: 0 }, 0.6); cue(T0(k) + 0.45, 'shimmer', 0.4);
  enter(b.querySelector('.h2'), T0(k) + 0.7, { y: 10, opacity: 0 }, 0.5);
  enter(b.querySelector('.n'), T0(k) + 1.0, { y: 10, opacity: 0 }, 0.5);
}
