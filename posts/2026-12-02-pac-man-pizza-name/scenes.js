// Pac-Man: a pizza, a rounded "mouth" kanji, paku-paku, and the P that could become an F. Directed beats (engine 6), Nov 27 2026.
// Safe zones: nothing above y 124 but the brand row; text right edge <= 300 below y 320; text tops <= 486.
const fade = (node, t, d) => tl.fromTo(node, { opacity: 0 }, { opacity: 1, duration: d || 0.3, ease: 'power2.out', immediateRender: true }, t);
const fadeOut = (node, t, d) => tl.to(node, { opacity: 0, duration: d || 0.3, ease: 'power2.in' }, t);
const tag = (text, x, y, t, parent, o) => { o = o || {}; const n = el('div', 'tagx', esc(text), 'left:' + x + 'px;top:' + y + 'px;' + (o.css || ''), parent || TX); if (o.ltr) n.setAttribute('dir', 'ltr'); fade(n, t, 0.25); if (o.out != null) fadeOut(n, o.out, 0.2); return n; };
const px = node => { const n = node.L || node; n.querySelectorAll('img').forEach(im => { if (!im.classList.contains('fbg')) im.style.imageRendering = 'pixelated'; }); return node; };
const ringMark = (x, y, w, h) => ({ x, y, html: '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="overflow:visible"></svg>' });
const ringIn = (f, i, rx, ry, t, o) => { const s = f.marks[i].n.querySelector('svg'), w = +s.getAttribute('width'), h = +s.getAttribute('height'); return scribble(s, w / 2, h / 2, rx, ry, t, Object.assign({ width: 3 }, o || {})); };
const RED = '#FF5A5F';
const ns = p => { p.querySelectorAll('.sweep').forEach(x => x.remove()); return p; };
const GAP = [0.665, 0.37];   // the missing slice on the pizza photo

// ================= 0 · HOOK — PAC-MAN flips to PUCKMAN; ring on the P =================
{
  const k = 0, g = group(0, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k, 0.0);
  const a = ns(pic('lpac', 30, 234, 300, g, { flat: true }));
  const b = ns(pic('lpuck', 30, 236, 300, g, { flat: true }));
  tl.fromTo([a, b], { scale: 1.1 }, { scale: 1, duration: T1(k), ease: 'none', immediateRender: true }, 0);
  tl.set(b, { opacity: 0 }, 0);
  tl.to(a, { rotationX: 90, opacity: 0, duration: 0.22, ease: 'power2.in' }, W(k, 4).s - 0.25);
  tl.fromTo(b, { rotationX: -90, opacity: 0 }, { rotationX: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.6)', immediateRender: false }, W(k, 4).s - 0.03); cue(W(k, 4).s, 'whoosh', 0.4);
  scribble(sv, 63, 268, 36, 48, W(k, 8).s - 0.1, { width: 3.5 });
  say(k, 0, 5, { y: 136, size: 26, hero: { 0: 36, 1: 36, 5: 32 } });
  say(k, 6, 9, { y: 360, size: 26, hero: { 8: 40, 9: 40 } });
  tl.to(g, { opacity: 0, duration: 0.25 }, T1(k) - 0.15); whip(T1(k) - 0.1);
}

// ================= 1 · 1980 — Toru Iwatani, Namco =================
{
  const k = 1;
  textGroup(k);
  const f = full('iwa', T0(k) - 0.2, T1(k) + 0.3, { x: 0.5, y: 0.36, z: 1.0, cx: 180, cy: 300, free: true, shade: 0.5 });
  fade(f.L, T0(k) - 0.2, 0.35);
  camTo(f, T0(k), { y: 0.22, z: 1.4, cy: 330 }, SC[k].dur, 'power1.inOut');
  say(k, 0, 3, { y: 136, size: 22, bg: true, out: W(k, 4).s - 0.32 });
  word('1980', 0, 400, 66, W(k, 1).s, { ltr: true, css: 'left:0;right:0;text-align:center', out: W(k, 4).s - 0.3 });
  say(k, 4, 6, { y: 136, size: 22, bg: true, hero: { 5: 26, 6: 26 } });
  say(k, 7, 10, { y: 410, size: 24, bg: true, hero: { 10: 32 } });
  fadeOut(f.L, T1(k) - 0.05, 0.3); flash(T1(k) - 0.1);
}

// ================= 2 · ARCADES = WAR AND ALIENS =================
{
  const k = 2, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  const r1 = ns(px(pic('inv', 30, 236, 300, g, { flat: true }))), r2 = ns(px(pic('inv', 30, 290, 300, g, { flat: true })));
  enter(r1, T0(k), { x: 120, opacity: 0 }, 0.6); enter(r2, T0(k) + 0.15, { x: 120, opacity: 0 }, 0.6);
  tl.to(r1, { x: -14, duration: 0.5, ease: 'steps(4)', yoyo: true, repeat: 7 }, T0(k) + 0.7);
  tl.to(r2, { x: 14, duration: 0.5, ease: 'steps(4)', yoyo: true, repeat: 7 }, T0(k) + 0.7);
  bracket(sv, 18, 222, 324, 122, W(k, 4).s - 0.1, { len: 16, width: 2.4 });
  say(k, 0, 5, { y: 128, size: 22, hero: { 4: 30, 5: 30 } });
  say(k, 6, 8, { y: 372, size: 28, hero: { 8: 40 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 3 · A CUTE GAME ABOUT EATING =================
{
  const k = 3, g = group(T0(k) - 0.1, T1(k) + 0.1);
  textGroup(k);
  const p = ns(pic('pacart', 96, 150, 168, g, { flat: true }));
  enter(p, T0(k) - 0.05, { x: 90, rotation: 12, opacity: 0 }, 0.7, 'back.out(1.4)'); cue(T0(k), 'whoosh-soft', 0.3);
  tl.to(p, { y: -10, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 5 }, T0(k) + 0.7);
  say(k, 0, 7, { y: 334, size: 22, hero: { 3: 30 } });
  say(k, 8, 8, { y: 416, size: 46, hero: { 8: 52 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15); whip(T1(k) - 0.1);
}

// ================= 4-5 · THE PIZZA — one slice goes, the shape appears =================
{
  const P0 = { x: 0.5, y: 0.47, z: 0.4, cx: 180, cy: 330, free: true, shade: 0.3 };
  const fa = full('pza', T0(4) - 0.2, W(4, 4).s + 0.6, P0);
  const fb = full('pzb', W(4, 4).s - 0.25, T1(5) + 0.3, P0, [ringMark(0.5, 0.468, 640, 640), ringMark(GAP[0], GAP[1], 200, 200)]);
  fade(fa.L, T0(4) - 0.2, 0.35);
  camTo(fa, T0(4), { z: 0.45 }, W(4, 4).s - T0(4) + 0.6, 'none');
  tl.set(fb.P, { z: 0.45 }, W(4, 4).s - 0.25);
  fade(fb.L, W(4, 4).s - 0.25, 0.45); cue(W(4, 4).s - 0.2, 'pop', 0.4);
  camTo(fb, W(4, 4).s + 0.3, { z: 0.42 }, T0(5) - W(4, 4).s, 'none');
  ringIn(fb, 0, 272, 282, W(5, 0).s - 0.1, { width: 7, out: W(5, 4).s - 0.2 });
  camTo(fb, W(5, 4).s - 0.25, { x: GAP[0], y: GAP[1], z: 0.95, cy: 300 }, 1.0, 'expo.inOut'); cue(W(5, 4).s - 0.2, 'whoosh-soft', 0.35);
  ringIn(fb, 1, 82, 80, W(5, 5).s, { width: 4 });
  camTo(fb, W(5, 4).s + 0.8, { z: 1.08, cy: 306 }, T1(5) - W(5, 4).s - 0.7, 'none');
  fadeOut(fb.L, T1(5) - 0.05, 0.3);
}
{
  const k = 4;
  textGroup(k);
  say(k, 0, 2, { y: 136, size: 22, bg: true, hero: { 2: 30 }, out: W(k, 3).s - 0.32 });
  say(k, 3, 5, { y: 440, size: 22, bg: true, hero: { 5: 28 }, out: W(k, 6).s - 0.32 });
  say(k, 6, 7, { y: 440, size: 22, bg: true, hero: { 7: 28 } });
}
{
  const k = 5;
  textGroup(k);
  say(k, 0, 3, { y: 136, size: 22, bg: true, hero: { 0: 28 } });
  say(k, 4, 6, { y: 440, size: 22, bg: true, hero: { 5: 28, 6: 28 } });
  flash(T1(k) - 0.1);
}

// ================= 6 · HALF TRUE — the mouth kanji is a square; he rounded it =================
{
  const k = 6, g = group(T0(k) - 0.1, T1(k) + 0.1);
  textGroup(k);
  say(k, 0, 6, { y: 128, size: 22, hero: { 4: 30, 5: 30, 6: 30 } });
  const sk = pic('sketch', 100, 232, 160, g);
  enter(sk, T0(k) + 0.05, { x: 60, rotationY: -20, opacity: 0 }, 0.6); sweep(sk, T0(k) + 0.7);
  tag('Toru Iwatani · sketches', 0, 412, W(k, 2).s, g, { ltr: true, css: 'left:50%;transform:translateX(-50%)', out: W(k, 7).s - 0.5 });
  leave(sk, W(k, 7).s - 0.45, { x: -70, opacity: 0, rotationY: 20 }, 0.35);
  const sq = el('div', '', '', 'position:absolute;left:120px;top:206px;width:120px;height:120px;box-sizing:border-box;border:9px solid #9BFFC2;border-radius:6px;box-shadow:0 0 14px rgba(155,255,194,0.55),inset 0 0 14px rgba(155,255,194,0.35)', g);
  tl.fromTo(sq, { scale: 0.2, opacity: 0, rotation: -20 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.6)', immediateRender: true }, W(k, 7).s - 0.1); cue(W(k, 7).s, 'pop', 0.35);
  tag('kuchi · فم', 0, 342, W(k, 8).s, g, { ltr: true, css: 'left:50%;transform:translateX(-50%)' });
  say(k, 7, 10, { y: 384, size: 24, hero: { 10: 34 }, out: W(k, 11).s - 0.32 });
  tl.to(sq, { borderRadius: '60px', duration: 0.8, ease: 'expo.inOut' }, W(k, 12).s - 0.15); cue(W(k, 12).s, 'shimmer', 0.35);
  tl.to(sq, { rotation: 360, duration: 1.4, ease: 'power2.inOut' }, W(k, 12).s - 0.15);
  say(k, 11, 12, { y: 384, size: 30, hero: { 12: 46 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15); whip(T1(k) - 0.1);
}

// ================= 7 · PAKU PAKU — the sound of eating =================
{
  const k = 7, g = group(T0(k) - 0.1, T1(k) + 0.1);
  textGroup(k);
  ghost('paku', 10, 470, 120, T0(k), T1(k) - 0.3, g);
  say(k, 0, 5, { y: 136, size: 22, hero: { 3: 30 } });
  const pk = say(k, 6, 7, { y: 250, size: 56, align: 'center', hero: { 6: 62, 7: 62 } });
  [6, 7].forEach((i, j) => { const w = pk.querySelectorAll('.wi')[j]; tl.to(w, { scaleY: 0.72, duration: 0.14, ease: 'power2.in', yoyo: true, repeat: 5 }, W(k, i).s + 0.5); });
  tag('paku paku', 0, 350, W(k, 7).s + 0.1, TX, { ltr: true, css: 'left:50%;transform:translateX(-50%)' });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15); flash(T1(k) - 0.1);
}

// ================= 8-11 · PUCKMAN → the P that could become an F → PAC-MAN (one stage) =================
const LOGO = (() => {
  const g = group(T0(8) - 0.1, T1(11) + 0.1), sv = svgLayer(g);
  const art = ns(pic('puckart', 115, 200, 130, g, { flat: true }));
  enter(art, T0(8), { y: 30, scale: 0.6, opacity: 0 }, 0.6, 'back.out(1.6)');
  leave(art, T0(9) - 0.1, { y: -40, opacity: 0 }, 0.35);
  const lp = ns(pic('lpuck', 20, 318, 320, g, { flat: true }));
  enter(lp, W(8, 4).s - 0.15, { x: 140, opacity: 0, filter: 'blur(8px)' }, 0.6); cue(W(8, 4).s - 0.1, 'whoosh', 0.4);
  // 9: the logo rises; a warning pulse
  tl.to(lp, { y: -112, duration: 0.8, ease: 'expo.inOut' }, T0(9) - 0.05);
  tl.fromTo(lp, { scale: 1 }, { scale: 1.06, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1, immediateRender: false }, W(9, 5).s); cue(W(9, 5).s, 'impact', 0.35);
  // 10: ring on the P, the logo steps aside, a big P flips into an F
  scribble(sv, 52, 241, 40, 50, W(10, 1).s - 0.1, { width: 3.5, out: W(10, 3).s - 0.3 });
  tl.to(lp, { opacity: 0, scale: 0.92, duration: 0.3, ease: 'power2.inOut' }, W(10, 3).s - 0.3);
  const bigP = el('div', 'solo', '<span class="wi" dir="ltr">P</span>', 'left:0;right:0;text-align:center;top:150px;font-size:130px;color:#9BFFC2', g);
  tl.fromTo(bigP, { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', immediateRender: true }, W(10, 3).s + 0.05);
  const bigF = el('div', 'solo', '<span class="wi" dir="ltr">F</span>', 'left:0;right:0;text-align:center;top:150px;font-size:130px;color:' + RED, g);
  tl.set(bigF, { opacity: 0 }, 0);
  tl.to(bigP, { rotationY: 90, opacity: 0, duration: 0.18, ease: 'power2.in' }, W(10, 5).s - 0.2);
  tl.fromTo(bigF, { rotationY: -90, opacity: 0 }, { rotationY: 0, opacity: 1, duration: 0.25, ease: 'back.out(1.8)', immediateRender: false }, W(10, 5).s - 0.02); cue(W(10, 5).s, 'pop', 0.45);
  tl.to(bigF, { x: 6, duration: 0.05, yoyo: true, repeat: 7, ease: 'none' }, W(10, 8).s - 0.05); cue(W(10, 8).s, 'impact', 0.4);
  tl.to(bigF, { opacity: 0, scale: 0.6, duration: 0.3, ease: 'power2.in' }, T1(10) - 0.2);
  // 11: the logo comes back and flips to PAC-MAN
  const la = ns(pic('lpac', 20, 206, 320, g, { flat: true }));
  tl.set(la, { opacity: 0 }, 0);
  tl.to(lp, { opacity: 1, scale: 1, duration: 0.3 }, T0(11) - 0.1);
  tl.to(lp, { rotationX: 90, opacity: 0, duration: 0.22, ease: 'power2.in' }, W(11, 2).s - 0.25);
  tl.fromTo(la, { rotationX: -90, opacity: 0, scale: 1 }, { rotationX: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.6)', immediateRender: false }, W(11, 2).s - 0.03); cue(W(11, 2).s, 'shimmer', 0.4);
  tl.to(la, { scale: 1.08, duration: T1(11) - W(11, 2).s, ease: 'none' }, W(11, 2).s + 0.3);
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(11) - 0.15);
  return g;
})();
{
  const k = 8;
  textGroup(k);
  say(k, 0, 3, { y: 128, size: 24, hero: { 2: 30 } });
  say(k, 4, 5, { y: 412, size: 40, hero: { 4: 48, 5: 48 } });
}
{
  const k = 9;
  textGroup(k);
  say(k, 0, 3, { y: 128, size: 24, hero: { 3: 32 } });
  tag('USA · Bally Midway', 24, 290, W(k, 3).s, TX, { ltr: true });
  say(k, 4, 7, { y: 340, size: 26, hero: { 7: 38 } });
}
{
  const k = 10;
  textGroup(k);
  say(k, 0, 5, { y: 340, size: 22, hero: { 3: 30, 5: 30 }, out: W(k, 6).s - 0.32 });
  say(k, 6, 8, { y: 340, size: 28, hero: { 8: 42 } });
}
{
  const k = 11;
  textGroup(k);
  say(k, 0, 3, { y: 340, size: 28, hero: { 2: 40, 3: 40 } });
  whip(T1(k) - 0.1);
}

// ================= 12 · 350,000 MACHINES IN A YEAR AND A HALF =================
{
  const k = 12, g = group(T0(k) - 0.1, T1(k) + 0.1);
  textGroup(k);
  say(k, 0, 2, { y: 128, size: 26, hero: { 1: 32, 2: 32 } });
  const n = word('0', 0, 214, 70, T0(k) + 0.3, { ltr: true, css: 'left:0;right:0;text-align:center' });
  count(n, 0, 350000, W(k, 3).s, W(k, 7).s - W(k, 3).s + 0.2, v => Math.round(v).toLocaleString('en-US'));
  say(k, 3, 7, { y: 330, size: 24, hero: { 7: 34 } });
  const gh = ns(px(pic('ghosts', 140, 430, 80, g, { flat: true })));
  enter(gh, W(k, 7).s - 0.1, { y: 30, opacity: 0 }, 0.5, 'back.out(1.6)');
  tl.to(gh, { y: -6, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, W(k, 7).s + 0.5);
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15); flash(T1(k) - 0.1);
}

// ================= 13 · THE LESSON — pizza → icon =================
{
  const k = 13, g = group(T0(k) - 0.1, T1(k) + 0.1), sv = svgLayer(g);
  textGroup(k);
  say(k, 0, 3, { y: 128, size: 24, hero: { 1: 32 } });
  const pz = pic('pzb', 186, 196, 150, g, { h: 120, pos: '66% 45%' });
  enter(pz, T0(k) + 0.05, { x: 50, opacity: 0, rotationY: -20 }, 0.6); sweep(pz, T0(k) + 0.6);
  path(sv, 'M176 256 H156 M164 248 L156 256 L164 264', W(k, 2).s, 0.35, { width: 2.8 });
  const pa = ns(pic('pacart', 30, 196, 126, g, { flat: true }));
  enter(pa, W(k, 2).s + 0.2, { x: -40, scale: 0.8, opacity: 0 }, 0.6, 'back.out(1.5)');
  say(k, 4, 8, { y: 352, size: 24, hero: { 6: 32 } });
  tl.to(g, { opacity: 0, duration: 0.3 }, T1(k) - 0.15);
}

// ================= 14 · YOUR CALL =================
{
  const k = 14;
  textGroup(k);
  const f = full('pzb', T0(k) - 0.2, T1(k) + 0.3, { x: GAP[0], y: GAP[1], z: 0.6, cx: 180, cy: 280, free: true, shade: 0.45 });
  fade(f.L, T0(k) - 0.2, 0.35);
  camTo(f, T0(k), { z: 0.8 }, SC[k].dur, 'none');
  say(k, 0, 1, { y: 136, size: 28, bg: true, hero: { 1: 38 } });
  const yes = word('إي', 0, 404, 40, W(k, 2).s - 0.05, { css: 'left:auto;right:70px' }); yes.classList.add('dk');
  word('لو', 150, 412, 26, W(k, 3).s - 0.05, { hero: false });
  const no = word('لا', 60, 404, 40, W(k, 4).s - 0.05, { hero: false, css: 'color:' + RED }); no.classList.add('dk');
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
