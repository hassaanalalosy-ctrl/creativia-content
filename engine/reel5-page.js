// Engine 5 — "KINETIC SPACE" (owner references, Nov 23 2026).
// No fixed card. Every shot = a VISUAL (picture card shaped like the picture, full-bleed focus, gallery flying in from depth,
// calendar, bars, sliced picture, versus, statement…) + KINETIC TEXT that IS the voice: phrases build word by word on the
// background in sync with the voice (word timestamps), small connector words, big green keywords. Real 3D (CSS perspective):
// cards tilt and turn, things fly in from depth, blurred bokeh passes in front, glows drift behind. Shots are linked by
// varied transitions (push through, whip pan, 3D flip, rise, grow/iris for full-bleed pictures). Brand: Creativia colours,
// Rubik, logo + badge HUD, Kreti on the end card. Arabic: words never split, right to left.
module.exports.PAGE = String.raw`
const D = window.REEL, C = D.theme;
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const VW = 360, VH = 640;
const CUES = []; const cue = (t, role, vol) => { if (t >= 0) CUES.push([Math.round(t * 1000) / 1000, role, vol]); };
const el = (tag, cls, html, style) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (style) e.style.cssText = style; return e; };
const latin = w => /^[A-Za-z0-9.%$+#&:/'-]+$/.test(w);
const PUNCT = /[،.؟?!…:]+$/;
const ICON = {
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
  star: 'M12 3l2.6 5.6 6.1.6-4.6 4.1 1.4 6-5.5-3.2-5.5 3.2 1.4-6L3.3 9.2l6.1-.6z',
  spark: 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5L18 18 M6 18l2.5-2.5 M15.5 8.5L18 6',
  clock: 'M12 7v5l3 2 M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0z M8 6H5a3 3 0 0 0 3 4 M16 6h3a3 3 0 0 1-3 4 M12 13v4 M8 21h8',
  scissors: 'M6 6a3 3 0 1 0 0 .01 M6 18a3 3 0 1 0 0 .01 M8.5 7.5L20 18 M8.5 16.5L20 6',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 19V5'
};
const icon = (name, size, color) => '<svg class="ico" width="' + size + '" height="' + size + '" viewBox="0 0 24 24"><path pathLength="100" d="' + (ICON[name] || ICON.spark) + '" fill="none" stroke="' + (color || C.ink) + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:100 120;stroke-dashoffset:0"/></svg>';
const tl = gsap.timeline({ paused: true });

// ---------- layers ----------
const stage = document.getElementById('stage');
const bg = el('div', 'layer bg'); stage.appendChild(bg);
const glows = [[C.b1, 520, 60, 80], [C.b2, 600, 300, 520], [C.b3, 420, -40, 380], [C.b1, 380, 330, 120]].map(([c, s, x, y]) => { const g = el('div', 'glow', '', 'width:' + s + 'px;height:' + s + 'px;left:' + (x - s / 2) + 'px;top:' + (y - s / 2) + 'px;background:radial-gradient(circle,' + c + ' 0%,rgba(0,0,0,0) 65%)'); bg.appendChild(g); return g; });
const beam = el('div', 'beam'); bg.appendChild(beam);
const space = el('div', 'space'); stage.appendChild(space);          // 3D space; the camera is applied here
const fsHost = el('div', 'layer fshost'); stage.appendChild(fsHost);  // full-bleed pictures (above the space)
const bok = el('div', 'layer bokeh'); stage.appendChild(bok);         // blurred things passing in front
const textHost = el('div', 'layer texthost'); stage.appendChild(textHost);
stage.appendChild(el('div', 'layer grain', '', 'background-image:url(' + D.grain + ')'));
stage.appendChild(el('div', 'hud', '<span class="badge"><i></i>' + esc(D.badge || 'كريتيفيا') + '</span><span class="mk">' + D.mark + '</span>'));

// ---------- zones (Instagram safe: nothing below ~470) ----------
const Z = {
  textTop:    { text: [92, 178], vis: [186, 470] },
  textBottom: { text: [386, 472], vis: [94, 378] },
  textOver:   { text: [360, 470], vis: [0, 640] },
  textOnly:   { text: [150, 440], vis: [0, 0] }
};

// ---------- kinetic text: the voice, phrase by phrase, word by word ----------
function phrasesOf(s) {
  let ws = s.vwords;
  if (!ws || !ws.length) { if (!s.vtext) return []; const raw = s.vtext.split(/\s+/).filter(Boolean), tot = raw.reduce((a, w) => a + w.length + 1, 0); let acc = 0; ws = raw.map(w => { const a = acc; acc += w.length + 1; return { w, s: a / tot * s.vdur, e: acc / tot * s.vdur }; }); }
  const out = []; let cur = [];
  ws.forEach((w, i) => { cur.push(w); const len = cur.reduce((a, x) => a + x.w.length + 1, 0);
    if (PUNCT.test(w.w) || cur.length >= (s.phraseWords || 6) || len > (s.phraseChars || 34)) { out.push(cur); cur = []; } });
  if (cur.length) out.push(cur);
  // merge a tiny tail into the previous phrase
  if (out.length > 1 && out[out.length - 1].length === 1) { const t = out.pop(); out[out.length - 1].push(...t); }
  return out;
}
const isKey = (w, s) => { const b = w.replace(PUNCT, ''); return /[0-9]/.test(b) || (s.hl || []).some(h => b === h || b.indexOf(h) === 0 || (h.length > 3 && b.indexOf(h) >= 0)); };
function kinetic(s, t0, tEnd, zone, align, after) {
  const base = t0 + (D.vlead || 0.35);
  const ph = phrasesOf(s).filter(p => after == null || base + p[0].s >= after); if (!ph.length) return;
  ph.forEach((p, j) => {
    const d = el('div', 'kt ' + (align || 'right'), '', 'top:' + zone[0] + 'px;height:' + (zone[1] - zone[0]) + 'px');
    d.innerHTML = '<div class="ktin">' + p.map(x => { const k = isKey(x.w, s), w = x.w.replace(PUNCT, ''), pu = (x.w.match(PUNCT) || [''])[0];
      return '<span class="kw' + (k ? ' key' : '') + '"' + (latin(w) ? ' dir="ltr"' : '') + '>' + esc(w) + (pu && pu !== '،' ? '<i>' + esc(pu) + '</i>' : '') + '</span>'; }).join(' ') + '</div>';
    textHost.appendChild(d);
    const a = base + p[0].s - 0.12, b = j < ph.length - 1 ? base + ph[j + 1][0].s - 0.16 : tEnd - 0.3;
    tl.set(d, { opacity: 0 }, 0);
    tl.set(d, { opacity: 1 }, a);
    d.querySelectorAll('.kw').forEach((sp, i) => {
      const at = base + p[i].s - 0.06, key = sp.classList.contains('key');
      tl.fromTo(sp, { opacity: 0, y: key ? 18 : 12, scale: key ? 1.35 : 0.9, filter: 'blur(8px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: key ? 0.5 : 0.32, ease: key ? 'back.out(2)' : 'power3.out', immediateRender: false }, at);
    });
    tl.fromTo(d, { opacity: 1, y: 0, filter: 'blur(0px)' }, { opacity: 0, y: -22, filter: 'blur(10px)', duration: 0.2, ease: 'power2.in', immediateRender: false }, Math.max(a + 0.3, b - 0.12));
  });
}

// ---------- helpers ----------
function fitBox(iw, ih, maxW, maxH) { const r = Math.min(maxW / iw, maxH / ih); return [Math.round(iw * r), Math.round(ih * r)]; }
function sheen(t, node, at) { tl.fromTo(node, { xPercent: -160 }, { xPercent: 260, duration: 1.4, ease: 'power2.inOut', immediateRender: false }, at); }
function idle(node, t0, dur, amt) {   // slow 3D float so nothing is ever static
  tl.fromTo(node, { rotationY: -amt, rotationX: amt * 0.4 }, { rotationY: amt, rotationX: -amt * 0.4, duration: dur, ease: 'sine.inOut', immediateRender: false }, t0);
}
function _unused(r) { return '<svg class="ring" viewBox="0 0 100 100" preserveAspectRatio="none" style="left:' + (r[0] - r[2]) * 100 + '%;top:calc(' + r[1] * 100 + '% - ' + r[2] * 100 + 'cqw);width:' + r[2] * 200 + '%;aspect-ratio:1"><ellipse cx="50" cy="50" rx="46" ry="46" pathLength="100"/></svg>'; }
function drawRing(node, at) { tl.fromTo(node, { strokeDashoffset: 100, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.7, ease: 'power2.inOut', immediateRender: false }, at); cue(at + 0.05, 'whoosh-soft', 0.35); }

// ---------- visuals ----------
const V = {
  // a picture in a card shaped like the picture (no crop), tilted in 3D; optional chip, ring, credit
  image(s, shot, zone, t0, dur) {
    const zh = zone[1] - zone[0] - (s.credit ? 18 : 0), [w, h] = fitBox(s.iw || 800, s.ih || 1000, s.maxW || 300, zh);
    const R = s.ring, ringPx = R ? '<svg class="ring" viewBox="0 0 100 100" preserveAspectRatio="none" style="left:' + (R[0] - R[2]) * w + 'px;top:' + (R[1] * h - R[2] * w) + 'px;width:' + 2 * R[2] * w + 'px;height:' + 2 * R[2] * w + 'px"><ellipse cx="50" cy="50" rx="46" ry="46" pathLength="100"/></svg>' + (s.ringLabel ? '<div class="rlab" style="left:' + (R[0] - R[2] * 0.55) * w + 'px;top:' + (R[1] * h + R[2] * w * 1.02) + 'px">' + esc(s.ringLabel) + '</div>' : '') : '';
    const card = el('div', 'pcard', '<img src="' + s.image + '"><div class="psheen"></div>' + ringPx,
      'width:' + w + 'px;height:' + h + 'px;left:' + (VW - w) / 2 + 'px;top:' + (zone[0] + (zh - h) / 2) + 'px');
    shot.appendChild(card);
    if (s.chip) { const c = el('div', 'chip', icon(s.chipIcon || 'spark', 14, '#0B1410') + esc(s.chip), 'top:' + (zone[0] + (zh - h) / 2 - 12) + 'px;right:' + ((VW - w) / 2 - 10) + 'px'); shot.appendChild(c);
      tl.fromTo(c, { opacity: 0, scale: 0.4, rotation: -8 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.4)', immediateRender: true }, t0 + 0.5); cue(t0 + 0.52, 'pop', 0.4); }
    if (s.credit) shot.appendChild(el('div', 'cred', esc(s.credit), 'top:' + (zone[0] + (zh + h) / 2 + 6) + 'px'));
    tl.fromTo(card.querySelector('img'), { scale: 1.08 }, { scale: 1, duration: dur + 0.6, ease: 'none', immediateRender: false }, t0 - 0.3);
    idle(card, t0, dur, s.tilt == null ? 7 : s.tilt);
    sheen(card, card.querySelector('.psheen'), t0 + 0.6);
    const rg = card.querySelector('.ring ellipse'); if (rg) drawRing(rg, t0 + (s.ringAt || 1));
    const rl = card.querySelector('.rlab'); if (rl) { tl.fromTo(rl, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)', immediateRender: true }, t0 + (s.ringAt || 1) + 0.5); cue(t0 + (s.ringAt || 1) + 0.52, 'pop', 0.4); }
    return card;
  },
  // pictures fly in from depth and settle in a wall (rows), each keeps its ratio; optional highlight on the same spot of each
  gallery(s, shot, zone, t0, dur) {
    const items = s.items || [], rows = s.rows || [3, 2], gap = 8, zh = zone[1] - zone[0];
    const maxN = Math.max(...rows); let ch = Math.floor((zh - gap * (rows.length - 1)) / rows.length), cw = Math.round(ch * (s.ratio || 0.8)); if (cw * maxN + gap * (maxN - 1) > 344) { cw = Math.floor((344 - gap * (maxN - 1)) / maxN); ch = Math.round(cw / (s.ratio || 0.8)); }
    let k = 0; const out = [];
    rows.forEach((n, r) => { const rowW = n * cw + (n - 1) * gap;
      for (let i = 0; i < n && k < items.length; i++, k++) {
        const o = items[k], x = VW / 2 + rowW / 2 - (i + 1) * cw - i * gap, y = zone[0] + (zh - (rows.length * ch + (rows.length - 1) * gap)) / 2 + r * (ch + gap);   // right to left
        const c = el('div', 'gcard', '<img src="' + o.image + '">' + (s.highlight ? '<b class="hlb" style="left:' + s.highlight[0] * 100 + '%;top:' + s.highlight[1] * 100 + '%;width:' + s.highlight[2] * 100 + '%;height:' + s.highlight[3] * 100 + '%"></b>' : '') + '<div class="gl" dir="ltr">' + esc(o.label || '') + '</div>',
          'left:' + x + 'px;top:' + y + 'px;width:' + cw + 'px;height:' + ch + 'px');
        shot.appendChild(c); out.push(c);
        const at = t0 + 0.15 + k * 0.13;
        tl.fromTo(c, { z: -900, rotationY: (k % 2 ? 40 : -40), rotationX: 20, opacity: 0 }, { z: 0, rotationY: 0, rotationX: 0, opacity: 1, duration: 0.9, ease: 'expo.out', immediateRender: true }, at);
        cue(at + 0.1, 'tick', 0.3);
      } });
    const hb = shot.querySelectorAll('.hlb'), hat = t0 + (s.highlightAt || 1.6);
    hb.forEach((b, i) => { tl.fromTo(b, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: true }, hat + i * 0.15); cue(hat + i * 0.15, 'pop', 0.35); });
    tl.fromTo(out, { y: 0 }, { y: -6, duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1, stagger: 0.1, immediateRender: false }, t0 + 1);
  },
  // calendar page flipping in
  date(s, shot, zone, t0) {
    const zh = zone[1] - zone[0], h = Math.min(220, zh), w = Math.round(h * 0.78);
    const c = el('div', 'cal', '<div class="calh">' + esc(s.month) + '</div><div class="cald" dir="ltr">' + esc(s.day) + '</div><div class="caly" dir="ltr">' + esc(s.year || '') + '</div>',
      'width:' + w + 'px;height:' + h + 'px;left:' + (VW - w) / 2 + 'px;top:' + (zone[0] + (zh - h) / 2) + 'px');
    shot.appendChild(c);
    tl.fromTo(c, { rotationX: -100, z: -200, opacity: 0 }, { rotationX: 0, z: 0, opacity: 1, duration: 1.0, ease: 'back.out(1.3)', immediateRender: true }, t0 + 0.15); cue(t0 + 0.4, 'impact', 0.45);
    const n = c.querySelector('.cald'), o = { v: 1 }, target = +s.day;
    tl.to(o, { v: target, duration: 0.9, ease: 'power3.out', onUpdate: () => { n.textContent = Math.round(o.v); } }, t0 + 0.3);
    idle(c, t0 + 1, 3, 6);
  },
  // horizontal comparison bars with big labels
  bars(s, shot, zone, t0) {
    const rows = s.rows || [], max = Math.max(...rows.map(r => +r.value || 1)), zh = zone[1] - zone[0];
    const box = el('div', 'bars', rows.map(r => '<div class="br' + (r.hi ? ' hi' : '') + '"><div class="bh"><span class="bn">' + esc(r.big) + '</span><span class="bl">' + esc(r.label) + '</span></div><div class="bt"><div class="bf" style="width:' + Math.max(3, r.value / max * 100) + '%"></div></div></div>').join(''),
      'top:' + (zone[0] + zh / 2) + 'px');
    shot.appendChild(box);
    box.querySelectorAll('.br').forEach((r, i) => { const at = t0 + 0.4 + i * 1.0;
      tl.fromTo(r, { opacity: 0, x: 60, rotationY: -30 }, { opacity: 1, x: 0, rotationY: 0, duration: 0.6, ease: 'expo.out', immediateRender: true }, at);
      tl.fromTo(r.querySelector('.bf'), { scaleX: 0 }, { scaleX: 1, duration: rows[i].hi ? 0.45 : 1.3, ease: rows[i].hi ? 'back.out(3)' : 'power2.out', immediateRender: true }, at + 0.2);
      cue(at + 0.22, rows[i].hi ? 'pop' : 'whoosh-soft', 0.4); });
    tl.set(box, { yPercent: -50 }, 0);
  },
  // the picture is cut live into tiles that float apart in depth; some fall away; then the result lands
  slice(s, shot, zone, t0, dur) {
    const zh = zone[1] - zone[0], [W, H] = fitBox(s.iw || 800, s.ih || 1100, 280, zh), R = s.rows || 3, Q = s.cols || 3, gw = W / Q, gh = H / R, drop = s.drop || [];
    const box = el('div', 'slc', '', 'width:' + W + 'px;height:' + H + 'px;left:' + (VW - W) / 2 + 'px;top:' + (zone[0] + (zh - H) / 2) + 'px');
    let html = '';
    for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) html += '<div class="tile' + (drop.includes(r * Q + q) ? ' drop' : '') + '" style="left:' + q * gw + 'px;top:' + r * gh + 'px;width:' + gw + 'px;height:' + gh + 'px"><img src="' + s.image + '" style="left:' + (-q * gw) + 'px;top:' + (-r * gh) + 'px;width:' + W + 'px;height:' + H + 'px"></div>';
    let cuts = ''; for (let q = 1; q < Q; q++) cuts += '<line x1="' + q * gw + '" y1="-6" x2="' + q * gw + '" y2="' + (H + 6) + '"/>'; for (let r = 1; r < R; r++) cuts += '<line x1="-6" y1="' + r * gh + '" x2="' + (W + 6) + '" y2="' + r * gh + '"/>';
    const [rw, rh] = fitBox(s.riw || 800, s.rih || 1000, 280, zh);
    box.innerHTML = html + '<svg class="cuts" width="' + W + '" height="' + H + '">' + cuts + '</svg>';
    shot.appendChild(box);
    const res = el('div', 'pcard', '<img src="' + s.result + '"><div class="psheen"></div>', 'width:' + rw + 'px;height:' + rh + 'px;left:' + (VW - rw) / 2 + 'px;top:' + (zone[0] + (zh - rh) / 2) + 'px;opacity:0'); shot.appendChild(res);
    const ts = [...box.querySelectorAll('.tile')], lines = box.querySelectorAll('.cuts line');
    lines.forEach((l, i) => { const len = Math.hypot(l.x2.baseVal.value - l.x1.baseVal.value, l.y2.baseVal.value - l.y1.baseVal.value); tl.fromTo(l, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut', immediateRender: false }, t0 + 0.5 + i * 0.2); cue(t0 + 0.52 + i * 0.2, 'click', 0.45); });
    const sp = t0 + 0.6 + lines.length * 0.2;
    tl.to(box.querySelector('.cuts'), { opacity: 0, duration: 0.2 }, sp);
    ts.forEach((tile, i) => { const r = Math.floor(i / Q), q = i % Q, dx = (q - (Q - 1) / 2) * 14, dy = (r - (R - 1) / 2) * 14;
      tl.to(tile, { x: dx, y: dy, z: 30 + (i % 3) * 25, rotationY: (q - 1) * 14, rotationX: (1 - r) * 10, duration: 0.7, ease: 'back.out(1.8)' }, sp + i * 0.03); });
    cue(sp, 'whoosh-soft', 0.4);
    tl.to(box, { rotationY: -18, rotationX: 8, duration: 1.2, ease: 'sine.inOut' }, sp);
    box.querySelectorAll('.tile.drop').forEach((tile, i) => { tl.to(tile, { y: '+=220', z: -200, rotation: (i % 2 ? 25 : -25), opacity: 0, duration: 0.8, ease: 'power2.in' }, sp + 0.9 + i * 0.18); cue(sp + 0.95 + i * 0.18, 'tick', 0.35); });
    const at = sp + 1.0 + drop.length * 0.18 + 0.5;
    tl.to(ts, { z: -300, opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.02 }, at - 0.2);
    tl.fromTo(res, { opacity: 0, z: 300, rotationY: 30 }, { opacity: 1, z: 0, rotationY: 0, duration: 0.9, ease: 'expo.out', immediateRender: false }, at); cue(at, 'shimmer', 0.4);
    sheen(res, res.querySelector('.psheen'), at + 0.5);
    idle(res, at + 0.9, Math.max(1, dur - (at - t0) - 0.9), 6);
  },
  // two pictures facing each other in 3D, an arrow between
  versus(s, shot, zone, t0, dur) {
    const zh = zone[1] - zone[0] - 26, mk = (o, side) => { const [w, h] = fitBox(o.iw || 800, o.ih || 1000, 140, zh);
      const c = el('div', 'pcard vcard', '<img src="' + o.image + '"><div class="psheen"></div>' + (o.tag ? '<div class="vtag' + (o.warn ? ' warn' : '') + '">' + esc(o.tag) + '</div>' : ''), 'width:' + w + 'px;height:' + h + 'px;top:' + (zone[0] + (zh - h) / 2) + 'px;' + (side === 'r' ? 'right:22px' : 'left:22px'));
      shot.appendChild(c); const lab = el('div', 'vlab', esc(o.label || ''), 'top:' + (zone[0] + (zh + h) / 2 + 6) + 'px;' + (side === 'r' ? 'right:22px' : 'left:22px') + ';width:' + w + 'px'); shot.appendChild(lab); return [c, lab]; };
    const [a, la] = mk(s.a, 'r'), [b, lb] = mk(s.b, 'l');
    const ar = el('div', 'varrow', esc(s.symbol || '←'), 'top:' + (zone[0] + zh / 2 - 21) + 'px'); shot.appendChild(ar);
    tl.fromTo(a, { x: 120, rotationY: -70, opacity: 0 }, { x: 0, rotationY: -16, opacity: 1, duration: 0.9, ease: 'expo.out', immediateRender: true }, t0 + 0.2); cue(t0 + 0.25, 'whoosh-soft', 0.35);
    tl.fromTo(b, { x: -120, rotationY: 70, opacity: 0 }, { x: 0, rotationY: 16, opacity: 1, duration: 0.9, ease: 'expo.out', immediateRender: true }, t0 + 0.9); cue(t0 + 0.95, 'whoosh-soft', 0.35);
    tl.fromTo([la, lb], { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.6, immediateRender: true }, t0 + 0.6);
    tl.fromTo(ar, { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.4)', immediateRender: true }, t0 + 1.5); cue(t0 + 1.52, 'pop', 0.5);
    shot.querySelectorAll('.vtag').forEach((g, i) => { tl.fromTo(g, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)', immediateRender: true }, t0 + 1.9 + i * 0.35); cue(t0 + 1.92 + i * 0.35, 'tick', 0.35); });
    tl.to(a, { rotationY: -8, duration: dur - 1.2, ease: 'sine.inOut' }, t0 + 1.1); tl.to(b, { rotationY: 8, duration: dur - 1.9, ease: 'sine.inOut' }, t0 + 1.8);
    sheen(a, a.querySelector('.psheen'), t0 + 1.2); sheen(b, b.querySelector('.psheen'), t0 + 1.7);
  },
  end(s, shot, zone, t0, dur) {
    const box = el('div', 'endb', '<div class="kslot">' + D.kreti.wave.replace(/width="\d+" height="\d+"/, 'width="150" height="150"') + '</div><div class="pill">تابع كريتيفيا</div><div class="handle" dir="ltr">@creativia.mag</div><div class="hand">' + esc(s.note || 'كل يوم شي مبدع، الساعة 9 بالليل') + '</div>');
    shot.appendChild(box);
    tl.fromTo(box.querySelector('.kslot'), { scale: 0.2, opacity: 0, rotation: -12, z: -300 }, { scale: 1, opacity: 1, rotation: 0, z: 0, duration: 0.9, ease: 'elastic.out(1,0.55)', immediateRender: true }, t0 + 0.1);
    tl.fromTo(box.querySelector('.pill'), { scaleX: 0.2, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.6, ease: 'expo.out', immediateRender: true }, t0 + 0.5); cue(t0 + 0.55, 'shimmer', 0.35);
    tl.fromTo(box.querySelector('.handle'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, immediateRender: true }, t0 + 0.8);
    tl.fromTo(box.querySelector('.hand'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'power2.out', immediateRender: true }, t0 + 1.1);
  }
};

// ---------- full-bleed focus (picture fills the screen; virtual camera over it) ----------
const FOCI = [];
function focus(s, k, t0, dur) {
  const L = el('div', 'fs');
  const rings = s.rings || [];
  L.innerHTML = '<img class="fsbg" src="' + s.image + '"><div class="fsw"><img src="' + s.image + '">' + rings.map(r => '<svg class="ring fsr" viewBox="0 0 100 100" preserveAspectRatio="none" data-xy="' + r.xy.join(',') + '"><ellipse cx="50" cy="50" rx="46" ry="46" pathLength="100"/></svg>' + (r.label ? '<div class="rlab fsl" data-xy="' + r.xy.join(',') + '">' + esc(r.label) + '</div>' : '')).join('') + '</div><div class="fsshade"></div>' +
    (s.title ? '<div class="fstitle"><div class="kin">' + s.title.split(' ').map(w => '<span class="kw' + (isKey(w, s) ? ' key' : '') + '"' + (latin(w.replace(PUNCT, '')) ? ' dir="ltr"' : '') + '>' + esc(w) + '</span>').join(' ') + '</div></div>' : '') + (s.chip ? '<div class="chip fschip">' + icon(s.chipIcon || 'eye', 14, '#0B1410') + esc(s.chip) + '</div>' : '') + (s.credit ? '<div class="fscr">' + esc(s.credit) + '</div>' : '');
  fsHost.appendChild(L);
  const st = (s.stops || [[0.5, 0.5, 1, 0]]).map(a => ({ x: a[0], y: a[1], z: a[2], at: a[3] || 0, cy: a[4] == null ? 320 : a[4] }));
  const fz = { x: st[0].x, y: st[0].y, z: st[0].z, cy: st[0].cy, cl: k === 0 ? 1 : 0 };
  const inMode = k === 0 ? 'none' : (s.enter || 'grow'), tin = k === 0 ? 0 : t0 - 0.4, tout = t0 + dur - 0.45;
  FOCI.push({ L, fz, img: L.querySelector('.fsw img'), wrap: L.querySelector('.fsw'), tin, tout: tout + 0.62, inMode, mid: tout - 0.001 });
  if (inMode !== 'none') { tl.fromTo(fz, { cl: 0 }, { cl: 1, duration: 0.75, ease: 'expo.inOut', immediateRender: false }, tin); cue(tin + 0.1, 'whoosh', 0.5); }
  st.slice(1).forEach((q, i) => { const p = st[i]; tl.fromTo(fz, { x: p.x, y: p.y, z: p.z, cy: p.cy }, { x: q.x, y: q.y, z: q.z, cy: q.cy, duration: Math.max(0.3, q.at - p.at), ease: q.ease || 'power2.inOut', immediateRender: false }, t0 + p.at); if (Math.abs(q.z - p.z) > 0.6) cue(t0 + p.at + 0.15, 'whoosh-soft', 0.35); });
  L.querySelectorAll('.fsr ellipse').forEach((e, i) => drawRing(e, t0 + rings[i].at));
  L.querySelectorAll('.fsl').forEach((e, i) => tl.fromTo(e, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)', immediateRender: true }, t0 + rings.filter(r => r.label)[i].at + 0.45));
  const ft = L.querySelector('.fstitle');
  if (ft) { const ws = ft.querySelectorAll('.kw');
    if (k !== 0) ws.forEach((w, i) => tl.fromTo(w, { opacity: 0, y: 14, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out', immediateRender: true }, t0 + 0.2 + i * 0.08));
    if (s.titleOut != null) tl.fromTo(ft, { opacity: 1, y: 0, filter: 'blur(0px)' }, { opacity: 0, y: -16, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in', immediateRender: false }, t0 + s.titleOut); }
  const fc = L.querySelector('.fschip'); if (fc && s.chipOut != null) tl.fromTo(fc, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, t0 + s.chipOut);
  tl.fromTo(fz, { cl: 1 }, { cl: 0, duration: 0.6, ease: 'expo.inOut', immediateRender: false }, tout);
  cue(tout + 0.05, 'whoosh', 0.45);
}
function applyFocus(time) {
  for (const f of FOCI) {
    const on = time >= f.tin && time <= f.tout; f.L.style.visibility = on ? 'visible' : 'hidden'; if (!on) continue;
    const iw = f.img.naturalWidth || 900, ih = f.img.naturalHeight || 1200, s0 = Math.max(VW / iw, VH / ih), W = iw * s0, H = ih * s0, z = f.fz.z;
    let tx = VW / 2 - f.fz.x * W * z, ty = f.fz.cy - f.fz.y * H * z;
    if (W * z >= VW) tx = Math.min(0, Math.max(VW - W * z, tx)); else tx = (VW - W * z) / 2;
    if (H * z >= VH) ty = Math.min(0, Math.max(VH - H * z, ty));
    f.wrap.style.width = W + 'px'; f.wrap.style.height = H + 'px';
    f.wrap.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + z + ')';
    f.wrap.querySelectorAll('[data-xy]').forEach(n => { const [x, y, r] = n.dataset.xy.split(',').map(Number);
      if (n.tagName === 'svg') { n.style.left = (x - r) * W + 'px'; n.style.top = (y * H - r * W) + 'px'; n.style.width = 2 * r * W + 'px'; n.style.height = 2 * r * W + 'px'; }
      else { n.style.left = (x - r * 0.55) * W + 'px'; n.style.top = (y * H + r * W * 1.02) + 'px'; n.style.transform = 'scale(' + (1 / z) + ')'; n.style.transformOrigin = '0 0'; } });
    const c = f.fz.cl, m = time < f.mid ? f.inMode : 'shrink';
    if (m === 'iris') f.L.style.clipPath = 'circle(' + (c * 76) + '% at 50% 46%)';
    else if (m === 'none' && c >= 1) f.L.style.clipPath = 'none';
    else { const a = 1 - c; f.L.style.clipPath = 'inset(' + (a * 150) + 'px ' + (a * 60) + 'px ' + (a * 240) + 'px ' + (a * 60) + 'px round ' + (a * 30) + 'px)'; }
  }
}

// ---------- build shots ----------
const shots = []; let T = 0;
D.scenes.forEach((s, k) => { shots.push({ s, t0: T, dur: s.dur }); T += s.dur; });
const TOTAL = T;
const TRANS = ['push', 'whip', 'flip', 'rise', 'push', 'whip', 'swing'];
shots.forEach(({ s, t0, dur }, k) => {
  const L = Z[s.layout || (s.type === 'focus' ? 'textOver' : s.type === 'statement' ? 'textOnly' : s.type === 'end' ? 'textOnly' : 'textTop')];
  const tEnd = t0 + dur;
  if (s.type === 'focus') { focus(s, k, t0, dur); if (!s.title || s.titleOut != null) kinetic(s, t0, tEnd, L.text, s.align, s.title ? t0 + s.titleOut + 0.2 : null); return; }
  const shot = el('div', 'shot'); space.appendChild(shot);
  if (s.type === 'statement') {
    const d = el('div', 'stmt', s.text.split(' ').map(w => '<span class="kw' + (isKey(w, s) ? ' key' : '') + '"' + (latin(w.replace(PUNCT, '')) ? ' dir="ltr"' : '') + '>' + esc(w) + '</span>').join(' ') + (s.sub ? '<div class="ssub">' + esc(s.sub) + '</div>' : ''));
    shot.appendChild(d);
    const ws = d.querySelectorAll('.kw'); cue(t0 - 0.8, 'riser', 0.3);
    ws.forEach((w, i) => tl.fromTo(w, { opacity: 0, z: 400, filter: 'blur(14px)' }, { opacity: 1, z: 0, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', immediateRender: true }, t0 + 0.2 + i * 0.22));
    cue(t0 + 0.25 + (ws.length - 1) * 0.22, 'impact', 0.6);
    const sb = d.querySelector('.ssub'); if (sb) tl.fromTo(sb, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, immediateRender: true }, t0 + 0.6 + ws.length * 0.22);
    tl.fromTo(d, { scale: 1 }, { scale: 1.08, duration: dur, ease: 'none', immediateRender: false }, t0);
  } else if (V[s.type]) { V[s.type](s, shot, L.vis, t0, dur); }
  if (s.type !== 'statement' && s.type !== 'end') kinetic(s, t0, tEnd, L.text, s.align);
  // ---- transitions: in (from the previous shot) and out ----
  const prevFocus = k > 0 && shots[k - 1].s.type === 'focus', nextFocus = k < shots.length - 1 && shots[k + 1].s.type === 'focus';
  const tr = s.trans || TRANS[k % TRANS.length], ti = Math.max(0, t0 - 0.35), DIR = { whip: 1 };
  const IN = { push: { z: -700, opacity: 0, filter: 'blur(10px)' }, whip: { x: -380, rotationY: 25, filter: 'blur(14px)' }, flip: { rotationY: -100, opacity: 0 }, rise: { y: 260, rotationX: -40, opacity: 0, filter: 'blur(8px)' }, swing: { rotationZ: -14, x: -260, opacity: 0, filter: 'blur(10px)' }, depth: { z: -900, opacity: 0 } };
  const OUT = { push: { z: 600, opacity: 0, filter: 'blur(12px)' }, whip: { x: 380, rotationY: -25, filter: 'blur(14px)' }, flip: { rotationY: 100, opacity: 0 }, rise: { y: -260, rotationX: 40, opacity: 0, filter: 'blur(8px)' }, swing: { rotationZ: 14, x: 260, opacity: 0, filter: 'blur(10px)' }, depth: { z: 500, opacity: 0 } };
  const inMode = prevFocus ? 'depth' : tr;
  tl.set(shot, { visibility: 'hidden' }, 0);
  tl.set(shot, { visibility: 'visible' }, ti);
  if (k > 0) { tl.fromTo(shot, IN[inMode], { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75, ease: 'expo.out', immediateRender: false }, ti); if (!prevFocus) cue(ti + 0.05, inMode === 'whip' || inMode === 'swing' ? 'whip' : 'whoosh', 0.5); }
  if (k < shots.length - 1) {
    const nt = shots[k + 1].s.trans || TRANS[(k + 1) % TRANS.length], outMode = nextFocus ? 'push' : nt, to = tEnd - (nextFocus ? 0.5 : 0.4);
    tl.fromTo(shot, { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, opacity: 1, filter: 'blur(0px)' }, Object.assign({ duration: 0.45, ease: 'power3.in', immediateRender: false }, OUT[outMode]), to);
    tl.set(shot, { visibility: 'hidden' }, tEnd + 0.15);
  }
});

// ---------- background life ----------
glows.forEach((g, i) => tl.fromTo(g, { x: 0, y: 0, scale: 1 }, { x: (i % 2 ? -90 : 90), y: (i < 2 ? 120 : -100), scale: 1.25, duration: TOTAL, ease: 'sine.inOut', immediateRender: false }, 0));
tl.fromTo(beam, { xPercent: -60, opacity: 0.0 }, { xPercent: 60, opacity: 0.55, duration: TOTAL / 2, ease: 'sine.inOut', yoyo: true, repeat: 1, immediateRender: false }, 0);
// bokeh: blurred discs that cross in front now and then (depth)
for (let i = 0; i < Math.floor(TOTAL / 7); i++) {
  const b = el('div', 'bk', '', 'width:' + (60 + (i * 37) % 70) + 'px;height:' + (60 + (i * 37) % 70) + 'px;top:' + (80 + (i * 131) % 420) + 'px'); bok.appendChild(b);
  tl.fromTo(b, { x: (i % 2 ? -140 : 460), opacity: 0 }, { x: (i % 2 ? 460 : -140), opacity: 0.55, duration: 3.2, ease: 'none', immediateRender: false }, 2 + i * 7);
  tl.to(b, { opacity: 0, duration: 0.6 }, 2 + i * 7 + 2.6);
}
tl.set({}, {}, TOTAL);

window.TOTAL = TOTAL; window.CUES = CUES;
window.drawFrame = function (time) {
  tl.seek(time, false);
  // camera: gentle continuous 3D drift + per-shot push (--cz)
  const ry = Math.sin(time * 0.45) * 5, rx = Math.cos(time * 0.37) * 3;
  space.style.transform = 'translateZ(0px) rotateY(' + ry + 'deg) rotateX(' + rx + 'deg)';
  applyFocus(time);
};
`;

module.exports.CSS = (C) => `
body{margin:0;background:#000}
#stage{position:relative;width:360px;height:640px;overflow:hidden;font-family:'Rubik',sans-serif;color:${C.text};direction:rtl;perspective:900px;perspective-origin:50% 45%}
.layer{position:absolute;inset:0}
.bg{background:radial-gradient(130% 90% at 70% 0%,${C.bg1},${C.bg2});overflow:hidden}
.glow{position:absolute;filter:blur(10px)}
.beam{position:absolute;left:-50%;top:-20%;width:200%;height:140%;background:linear-gradient(115deg,rgba(0,0,0,0) 38%,rgba(155,255,194,0.10) 46%,rgba(46,232,107,0.16) 50%,rgba(0,0,0,0) 58%)}
.space{position:absolute;inset:0;transform-style:preserve-3d}
.shot{visibility:hidden;position:absolute;inset:0;transform-style:preserve-3d;transform-origin:50% 45%}
.grain{opacity:0.06;background-size:180px;pointer-events:none;z-index:9}
.hud{position:absolute;top:62px;right:22px;left:22px;display:flex;justify-content:space-between;align-items:center;z-index:12}
.badge{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:${C.muted}}
.badge i{width:7px;height:7px;border-radius:50%;background:${C.accent};box-shadow:0 0 8px ${C.accent}}
.fshost{z-index:5}.bokeh{z-index:8;pointer-events:none}.texthost{z-index:10;pointer-events:none}
.bk{opacity:0;position:absolute;left:0;border-radius:50%;background:radial-gradient(circle,rgba(155,255,194,0.55),rgba(46,232,107,0.15) 60%,rgba(0,0,0,0) 70%);filter:blur(14px)}
/* kinetic text */
.kt{opacity:0;position:absolute;left:24px;right:24px;display:flex;align-items:center}
.kt.right{justify-content:flex-start}.kt.center{justify-content:center;text-align:center}
.ktin{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 7px;max-width:100%}
.kt.center .ktin{justify-content:center}
.kw{display:inline-block;font-size:21px;font-weight:700;line-height:1.35;color:${C.text};text-shadow:0 2px 16px rgba(0,0,0,0.55)}
.kw.key{font-size:31px;font-weight:800;color:${C.accent};text-shadow:0 0 22px ${C.glow},0 2px 14px rgba(0,0,0,0.5)}
.kw i{font-style:normal}
/* picture cards */
.pcard{position:absolute;border-radius:18px;overflow:hidden;transform-style:preserve-3d;box-shadow:0 30px 60px rgba(0,0,0,0.55),0 0 40px ${C.glow};outline:1.5px solid rgba(255,255,255,0.28);outline-offset:-1.5px}
.pcard img{width:100%;height:100%;object-fit:cover;display:block}
.psheen{position:absolute;top:0;bottom:0;width:45%;background:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,0.22) 50%,rgba(255,255,255,0) 70%);pointer-events:none}
.chip{position:absolute;z-index:4;display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:${C.accent};color:#0B1410;font-size:12.5px;font-weight:800;box-shadow:0 8px 20px rgba(0,0,0,0.35)}
.cred{position:absolute;left:0;right:0;text-align:center;font-size:10px;color:${C.muted}}
.ring{position:absolute;overflow:visible}.ring ellipse{opacity:0;fill:none;stroke:#FFD23F;stroke-width:4;stroke-dasharray:100 110;stroke-dashoffset:100;vector-effect:non-scaling-stroke;filter:drop-shadow(0 0 6px rgba(255,210,63,0.8))}
.rlab{position:absolute;z-index:3;padding:4px 10px;border-radius:999px;background:#FFD23F;color:#0B1410;font-size:12px;font-weight:800;white-space:nowrap}
/* gallery */
.gcard{position:absolute;border-radius:10px;overflow:hidden;box-shadow:0 16px 30px rgba(0,0,0,0.5);outline:1px solid rgba(255,255,255,0.25);outline-offset:-1px}
.gcard img{width:100%;height:100%;object-fit:cover;display:block}
.gl{position:absolute;left:0;right:0;bottom:0;padding:14px 4px 4px;text-align:center;font-size:10px;font-weight:800;color:#fff;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.85))}
.hlb{position:absolute;border:2.5px solid ${C.accent};border-radius:7px;background:rgba(46,232,107,0.14);box-shadow:0 0 14px ${C.accent};opacity:0}
/* calendar */
.cal{position:absolute;border-radius:24px;overflow:hidden;background:#F4FBF6;box-shadow:0 30px 60px rgba(0,0,0,0.5);text-align:center;display:flex;flex-direction:column;transform-style:preserve-3d}
.calh{background:${C.accent};color:#0B1410;font-weight:800;font-size:20px;padding:10px 0}
.cald{flex:1;display:flex;align-items:center;justify-content:center;font-size:96px;font-weight:800;color:#0B1410;line-height:1}.caly{font-size:17px;font-weight:700;color:#46594D;padding-bottom:14px}
/* bars */
.bars{position:absolute;left:26px;right:26px;display:flex;flex-direction:column;gap:26px;transform-style:preserve-3d}
.bh{display:flex;align-items:baseline;gap:10px;margin-bottom:8px}.bn{font-size:40px;font-weight:800}.br.hi .bn{color:${C.accent};text-shadow:0 0 22px ${C.glow}}.bl{font-size:14px;color:${C.muted}}
.bt{height:16px;border-radius:99px;background:rgba(255,255,255,0.08);overflow:hidden}.bf{height:100%;border-radius:99px;background:linear-gradient(270deg,${C.soft},rgba(46,232,107,0.35));transform-origin:100% 50%}.br.hi .bf{background:${C.accent};box-shadow:0 0 16px ${C.accent}}
/* slice */
.slc{position:absolute;transform-style:preserve-3d}
.tile{position:absolute;overflow:hidden;border-radius:4px;box-shadow:0 10px 20px rgba(0,0,0,0.45)}.tile img{position:absolute;max-width:none;object-fit:cover}
.cuts{position:absolute;left:0;top:0;overflow:visible;z-index:2}.cuts line{stroke:${C.accent};stroke-width:3;stroke-linecap:round;filter:drop-shadow(0 0 5px ${C.accent})}
/* versus */
.vlab{position:absolute;text-align:center;font-size:15px;font-weight:800}
.varrow{position:absolute;left:50%;margin-left:-21px;width:42px;height:42px;border-radius:50%;background:${C.accent};color:#0B1410;font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px ${C.glow};z-index:3}
.vtag{position:absolute;left:8px;right:8px;bottom:8px;text-align:center;padding:4px 6px;border-radius:9px;background:rgba(0,0,0,0.68);color:#fff;font-size:11px;font-weight:700}.vtag.warn{background:#FFD23F;color:#0B1410}
/* statement + end */
.stmt{position:absolute;left:26px;right:26px;top:50%;transform:translateY(-55%);text-align:center;display:flex;flex-wrap:wrap;justify-content:center;gap:4px 10px;transform-style:preserve-3d}
.stmt .kw{font-size:40px;font-weight:800}.stmt .kw.key{font-size:46px}
.ssub{flex-basis:100%;margin-top:14px;font-size:16px;color:${C.muted}}
.endb{position:absolute;left:0;right:0;top:150px;display:flex;flex-direction:column;align-items:center;gap:12px;transform-style:preserve-3d}
.endb .pill{padding:11px 26px;border-radius:999px;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.25);font-size:21px;font-weight:800;box-shadow:0 0 24px ${C.glow}}
.handle{font-size:15px;font-weight:700;color:${C.muted}}.hand{font-family:'Playpen Sans Arabic',sans-serif;font-size:15.5px;color:${C.ink}}
/* full-bleed focus */
.fs{position:absolute;inset:0;overflow:hidden;background:#000;visibility:hidden}
.fsbg{position:absolute;inset:-40px;width:calc(100% + 80px);height:calc(100% + 80px);object-fit:cover;filter:blur(26px) brightness(0.45) saturate(1.2)}
.fsw{position:absolute;left:0;top:0;transform-origin:0 0;box-shadow:0 20px 60px rgba(0,0,0,0.55)}.fsw img{width:100%;height:100%;display:block;object-fit:fill}
.fsr{position:absolute}.fsr ellipse{stroke-width:5}
.fsl{position:absolute;font-size:14px;padding:5px 12px}
.fsshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,15,10,0.55) 0%,rgba(5,15,10,0) 22%,rgba(5,15,10,0) 46%,rgba(5,15,10,0.72) 64%,rgba(5,15,10,0.94) 100%)}
.fstitle{position:absolute;left:24px;right:24px;bottom:190px}.fstitle .kin{display:flex;flex-wrap:wrap;gap:2px 9px}.fstitle .kw{font-size:33px;font-weight:800}.fstitle .kw.key{font-size:36px}
.fschip{right:24px;bottom:300px}
.fscr{position:absolute;right:22px;top:92px;font-size:10px;color:rgba(255,255,255,0.7)}
`;
