// Creativia reel engine v6 — DIRECTED: every reel has its own scenes.js (beats written per story) on top of a shared
// toolkit (reel6-page.js): camera, full-bleed pictures, picture cards, kinetic Arabic type synced to the voice, drawn lines,
// brackets, counters, brand devices. The brand is constant, the layout is not.
// Same spec as engine 2 (scenes: hook, point, image, video, list, compare, statement, end) with "engine": 3.
// Brand: Creativia liquid glass, Rubik + Playpen Sans Arabic, Kreti. Rules: words appear one by one (never letters),
// reveals move right -> left, titles land and stay still, transitions have a cause, Instagram safe band y 62..440 on 360x640.
// Usage: node engine/reel4.js <post-id>   (FRAMES=1,2.5 renders stills only)
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');
const puppeteer = require('puppeteer');
const { kreti, mark } = require('./kreti');

const ROOT = path.join(__dirname, '..');
const FPS = 30;
const FONT_CSS = ['rubik/400', 'rubik/500', 'rubik/700', 'rubik/800', 'playpen-sans-arabic/400', 'playpen-sans-arabic/600']
  .map(f => `<link rel="stylesheet" href="file://${path.join(ROOT, 'node_modules/@fontsource', f)}.css">`).join('');
const GSAP = ['gsap.min.js', 'MorphSVGPlugin.min.js'].map(f => `<script src="file://${path.join(ROOT, 'node_modules/gsap/dist', f)}"></script>`).join('');

const THEME = {
  dark: { text: '#EFF7F1', muted: '#A3B8AB', bg1: '#0B2219', bg2: '#030806', b1: 'rgba(46,232,107,0.42)', b2: 'rgba(16,185,166,0.30)', b3: 'rgba(155,255,194,0.16)',
    glass: 'rgba(255,255,255,0.07)', rim: 'rgba(255,255,255,0.18)', grid: 'rgba(255,255,255,0.035)', glow: 'rgba(46,232,107,0.30)', accent: '#2EE86B', soft: '#9BFFC2', cut: '#0C2219', ink: '#9BFFC2', shadow: 'rgba(0,0,0,0.38)', flood: '#2EE86B' },
  light: { text: '#0B1410', muted: '#46594D', bg1: '#E2F6E9', bg2: '#F8FCF9', b1: 'rgba(46,232,107,0.40)', b2: 'rgba(16,185,166,0.22)', b3: 'rgba(255,226,130,0.45)',
    glass: 'rgba(255,255,255,0.45)', rim: 'rgba(255,255,255,0.95)', grid: 'rgba(11,20,16,0.05)', glow: 'rgba(46,232,107,0.22)', accent: '#16A34A', soft: '#1F6B49', cut: '#E6F7EC', ink: '#1F6B49', shadow: 'rgba(20,60,40,0.18)', flood: '#9BFFC2' }
};

function dims(file) {
  try { const o = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file]).toString().trim().split(','); return [+o[0], +o[1]]; } catch (e) { return [800, 1000]; }
}
async function loadImg(src) {   // -> [dataUri, width, height]
  const local = path.join(ROOT, src);
  if (!/^https?:/.test(src) && fs.existsSync(local)) { const [w, h] = dims(local); return [await toDataUri(src), w, h]; }
  const res = await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/126', 'Referer': new URL(src).origin + '/' } });
  if (!res.ok) throw new Error(`Image download failed (${res.status}): ${src}`);
  const buf = Buffer.from(await res.arrayBuffer()), tmpf = path.join(require('os').tmpdir(), 'img-' + Date.now() + Math.random()); fs.writeFileSync(tmpf, buf);
  const [w, h] = dims(tmpf);
  return [`data:${(res.headers.get('content-type') || 'image/jpeg').split(';')[0]};base64,${buf.toString('base64')}`, w, h];
}
async function toDataUri(src) {
  const local = path.join(ROOT, src);
  if (!/^https?:/.test(src) && fs.existsSync(local)) {
    const ext = path.extname(local).slice(1).toLowerCase();
    return `data:image/${ext === 'jpg' ? 'jpeg' : ext === 'svg' ? 'svg+xml' : ext};base64,${fs.readFileSync(local).toString('base64')}`;
  }
  const res = await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/126', 'Referer': new URL(src).origin + '/' } });
  if (!res.ok) throw new Error(`Image download failed (${res.status}): ${src}`);
  return `data:${(res.headers.get('content-type') || 'image/jpeg').split(';')[0]};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
}

const { PAGE, CSS } = require('./reel6-page');

// sound library: generated takes (assets/sfx2) first, then the Pixabay library (assets/sfx); roles mapped
function sfxLib() {
  const lib = [];
  const a = path.join(ROOT, 'assets/sfx2/library.json'), b = path.join(ROOT, 'assets/sfx/library.json');
  if (fs.existsSync(a)) for (const x of JSON.parse(fs.readFileSync(a, 'utf8')).tracks) lib.push({ ...x, dir: 'assets/sfx2' });
  const map = { whoosh: 'whoosh', 'soft-impact': 'impact', pop: 'pop', click: 'click', typing: 'tick', sparkle: 'shimmer', riser: 'riser', ding: 'shimmer', notification: 'pop', camera: 'camera', ui: 'pop' };
  if (fs.existsSync(b)) for (const x of JSON.parse(fs.readFileSync(b, 'utf8')).tracks) lib.push({ ...x, role: map[x.role] || x.role, dir: 'assets/sfx', fallback: true });
  return lib;
}
function sfxPlan(cues) {
  const lib = sfxLib(); const used = {};
  const pick = role => {
    const alias = { 'whoosh-soft': ['whoosh-soft', 'whoosh'], whip: ['whip', 'whoosh'], tick: ['tick', 'click', 'pop'], shimmer: ['shimmer'], impact: ['impact'], riser: ['riser'] }[role] || [role];
    for (const r of alias) {
      let c = lib.filter(x => x.role === r && !x.fallback); if (!c.length) c = lib.filter(x => x.role === r);
      if (c.length) { used[r] = (used[r] || 0) + 1; return c[used[r] % c.length]; }   // rotate takes
    }
    return null;
  };
  const out = [];
  for (const [t, role, vol] of cues.sort((a, b) => a[0] - b[0])) {
    const f = pick(role); if (!f) continue;
    const start = Math.max(0, t + 1 / FPS - (f.peak != null ? f.peak : f.onset || 0));   // the hit lands one frame after the picture
    if (out.length && start - out[out.length - 1].t < 0.12) continue;
    out.push({ t: start, file: path.join(ROOT, f.dir, f.file), vol, max: Math.min(f.duration, role === 'riser' ? 4 : 2.2) });
  }
  return out;
}

(async () => {
  const id = process.argv[2];
  if (!id) throw new Error('usage: node engine/reel4.js <post-id>');
  const dir = path.join(ROOT, 'posts', id);
  const spec = JSON.parse(fs.readFileSync(path.join(dir, 'reel.json'), 'utf8'));
  const mode = spec.mode || 'dark';
  const theme = THEME[mode];
  spec.img = {};
  for (const [k, v] of Object.entries(spec.images || {})) { const [src, w, h] = await loadImg(v); spec.img[k] = { src, w, h }; }
  delete spec.images;
  // video clips (owner, 25 Nov 2026: real footage in motion, especially as the hook): "videos": {name: {src, start, dur}}
  // frames are extracted at 30 fps into _tmp and swapped per frame by play() in the page; spec.img[name] = first frame
  spec.vid = {}; const vsrc = {};
  { const tmpd = path.join(__dirname, '_tmp', 'vid-' + id); fs.mkdirSync(tmpd, { recursive: true });
    for (const [k, v0] of Object.entries(spec.videos || {})) {
      const v = typeof v0 === 'string' ? { src: v0 } : v0, fdir = path.join(tmpd, k);
      fs.rmSync(fdir, { recursive: true, force: true }); fs.mkdirSync(fdir);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(v.start || 0), '-i', path.join(ROOT, v.src), '-t', String(v.dur || 10), '-an', '-vf', 'fps=30,scale=-2:' + (v.h || 1280), '-q:v', '3', path.join(fdir, 'f%04d.jpg')]);
      const n = fs.readdirSync(fdir).filter(f => f.endsWith('.jpg')).length; if (!n) throw new Error('No frames from video ' + k);
      const [w, h] = dims(path.join(fdir, 'f0001.jpg'));
      spec.img[k] = { src: 'file://' + path.join(fdir, 'f0001.jpg'), w, h };
      spec.vid[k] = { dir: 'file://' + fdir, n }; vsrc[k] = { file: path.join(ROOT, v.src), start: v.start || 0 };
    } }
  delete spec.videos;
  spec.scenesCode = fs.readFileSync(path.join(dir, spec.scenesFile || 'scenes.js'), 'utf8');
  for (const sc of spec.scenes) {
    if (sc.image) [sc.image, sc.iw, sc.ih] = await loadImg(sc.image);
    if (sc.result) [sc.result, sc.riw, sc.rih] = await loadImg(sc.result);
    for (const o of [sc.a, sc.b, ...(sc.items || [])]) if (o && o.image) [o.image, o.iw, o.ih] = await loadImg(o.image);
  }
  // voice: scenes stretch to their line
  const VLEAD = 0.35;
  const vjson = path.join(dir, 'voice', 'voice.json');
  const voice = spec.voice && fs.existsSync(vjson) ? JSON.parse(fs.readFileSync(vjson, 'utf8')).clips : [];
  for (const c of voice) { const sc = spec.scenes[c.scene]; sc.dur = Math.max(sc.dur || 0, Math.round((c.dur + VLEAD + 0.55) * 100) / 100); sc.vtext = c.text; sc.vdur = c.dur; sc.vwords = c.words || null; }
  // video scenes: frames at 30 fps
  const tmp = path.join(__dirname, '_tmp'); fs.mkdirSync(tmp, { recursive: true });
  const tmpv = path.join(tmp, 'v4-' + id); fs.mkdirSync(tmpv, { recursive: true });
  for (let k = 0; k < spec.scenes.length; k++) {
    const sc = spec.scenes[k]; if (sc.type !== 'video') continue;
    const src = path.join(tmpv, 'src' + k + '.mp4');
    if (!fs.existsSync(src)) {
      if (/^https?:/.test(sc.video)) {
        const res = await fetch(sc.video, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/126', 'Referer': new URL(sc.video).origin + '/' } });
        if (!res.ok) throw new Error(`Video download failed (${res.status}): ${sc.video}`);
        fs.writeFileSync(src, Buffer.from(await res.arrayBuffer()));
      } else fs.copyFileSync(path.join(ROOT, sc.video), src);
    }
    const fdir = path.join(tmpv, 'v' + k); fs.rmSync(fdir, { recursive: true, force: true }); fs.mkdirSync(fdir);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(sc.start || 0), '-i', src, '-t', String(sc.dur + 0.6), '-an', '-vf', 'fps=30,scale=960:-2', '-q:v', '3', path.join(fdir, 'f%04d.jpg')]);
    sc.frames = fs.readdirSync(fdir).filter(f => f.endsWith('.jpg')).length;
    if (!sc.frames) throw new Error('No frames extracted from ' + sc.video);
    sc.frameDir = 'file://' + fdir;
  }
  const poses = {};
  for (const p of ['wave', 'point', 'jump', 'think']) poses[p] = kreti({ pose: p, size: 240, mode, cut: theme.cut, look: 'dream' });
  const grain = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0"/></filter><rect width="180" height="180" filter="url(#n)"/></svg>').toString('base64');
  const data = { ...spec, vlead: VLEAD, theme, kreti: poses, mark: mark({ size: 24 }), grain };
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">${FONT_CSS}<style>${CSS(theme)}</style></head>
<body><div id="stage"></div>${GSAP}<script>gsap.registerPlugin(MorphSVGPlugin);window.REEL=${JSON.stringify(data)};</script><script>${PAGE.replace('/*SCENES*/', () => spec.scenesCode)}</script></body></html>`;
  const f = path.join(tmp, 'reel6.html'); fs.writeFileSync(f, html);

  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3 });
  await page.goto('file://' + f, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  const total = await page.evaluate('window.TOTAL');
  const el = await page.$('#stage');
  const settle = () => page.evaluate(() => Promise.all([...document.images].map(im => im.complete ? 0 : im.decode().catch(() => 0))));
  if (process.env.FRAMES) {
    for (const s of process.env.FRAMES.split(',').map(Number)) { await page.evaluate(x => window.drawFrame(x), s); await settle(); await el.screenshot({ path: path.join(tmp, `v4-${s}.jpg`), type: 'jpeg', quality: 85 }); }
    console.log('total', total, 'cues', JSON.stringify(await page.evaluate('window.CUES')));
    await browser.close(); return;
  }
  const silent = path.join(tmp, 'v4-silent.mp4');
  const frames = Math.round(total * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    await page.evaluate(x => window.drawFrame(x), i / FPS);
    await settle();
    const buf = await el.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log('frame', i, '/', frames);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
  await page.evaluate(x => window.drawFrame(x), spec.coverAt || 0);   // frame 0 is the hook
  await settle();
  await el.screenshot({ path: path.join(dir, 'reel-cover.jpg'), type: 'jpeg', quality: 92 });
  const cuesRaw = await page.evaluate('window.CUES'); const vaud = await page.evaluate('window.VAUD || []');
  await browser.close();

  // ---- audio: music bed (ducked under voice, ~0.14 there), voice, effects 3-6 dB over the bed ----
  const cues = sfxPlan(cuesRaw);
  const music = spec.music ? path.join(ROOT, spec.music) : null;
  const starts = []; { let a = 0; for (const sc of spec.scenes) { starts.push(a); a += sc.dur; } }
  const args = ['-y', '-loglevel', 'error', '-i', silent];
  const parts = [], fx = [], vo = [];
  let idx = 1, mus = null;
  // original clip sound: plays in the bed (ducked under the voice); our music dips to 35% while a clip speaks
  const clipParts = [];
  for (const a of vaud) {
    const v = vsrc[a.name]; if (!v) continue;
    const has = (() => { try { return execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', v.file]).toString().trim().length > 0; } catch (e) { return false; } })();
    if (!has) continue;
    const dur = Math.max(0.2, Math.min(a.until, total) - a.t0); if (dur < 0.3) continue;
    args.push('-ss', String(v.start + a.from), '-t', String(dur), '-i', v.file);
    const ms = Math.round(a.t0 * 1000);
    parts.push(`[${idx}:a]aresample=44100,volume=${a.vol},afade=t=in:d=0.25,afade=t=out:st=${Math.max(0, dur - 0.35).toFixed(2)}:d=0.35,adelay=${ms}|${ms}[c${idx}]`);
    clipParts.push({ tag: `[c${idx}]`, a: a.t0, b: a.t0 + dur }); idx++;
  }
  if (music) {
    args.push('-ss', String(spec.musicStart || 0), '-i', music);
    const dip = clipParts.length ? ',volume=\'' + clipParts.map(c => `if(between(t,${c.a.toFixed(2)},${c.b.toFixed(2)}),0.35,1)`).reduce((x, y) => `min(${x},${y})`) + '\':eval=frame' : '';
    parts.push(`[${idx}:a]atrim=0:${total},asetpts=PTS-STARTPTS,volume=${spec.musicVolume || (voice.length ? 0.32 : 0.55)}${dip},afade=t=in:d=0.4,afade=t=out:st=${(total - 1.6).toFixed(2)}:d=1.6[m0]`);
    idx++;
    if (clipParts.length) { parts.push(`[m0]${clipParts.map(c => c.tag).join('')}amix=inputs=${clipParts.length + 1}:normalize=0,apad,atrim=0:${total}[m]`); }
    else parts.push('[m0]anull[m]');
    mus = '[m]';
  } else if (clipParts.length) { parts.push(`${clipParts.map(c => c.tag).join('')}amix=inputs=${clipParts.length}:normalize=0,apad,atrim=0:${total}[m]`); mus = '[m]'; }
  for (const c of voice) {
    args.push('-i', path.join(dir, 'voice', c.file));
    const ms = Math.round((starts[c.scene] + VLEAD) * 1000);
    parts.push(`[${idx}:a]adelay=${ms}|${ms}[v${idx}]`); vo.push(`[v${idx}]`); idx++;
  }
  for (const c of cues) {
    args.push('-i', c.file);
    const ms = Math.round(c.t * 1000);
    parts.push(`[${idx}:a]atrim=0:${c.max},afade=t=out:st=${Math.max(0, c.max - 0.25).toFixed(2)}:d=0.25,volume=${(voice.length ? c.vol * 0.8 : c.vol).toFixed(2)},adelay=${ms}|${ms}[s${idx}]`);
    fx.push(`[s${idx}]`); idx++;
  }
  const layers = [];
  if (vo.length) {
    parts.push(`${vo.join('')}amix=inputs=${vo.length}:normalize=0,apad,atrim=0:${total}${mus ? ',asplit=2[vo][sc]' : '[vo]'}`);
    if (mus) { parts.push(`${mus}[sc]sidechaincompress=threshold=0.025:ratio=10:attack=15:release=450[md]`); layers.push('[md]'); }
    layers.push('[vo]');
  } else if (mus) layers.push(mus);
  layers.push(...fx);
  const out = path.join(dir, 'reel.mp4');
  if (layers.length) {
    parts.push(`${layers.join('')}amix=inputs=${layers.length}:normalize=0,apad,atrim=0:${total},alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=11[a]`);
    args.push('-filter_complex', parts.join(';'), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-movflags', '+faststart', out);
  } else args.push('-c', 'copy', out);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  fs.writeFileSync(path.join(dir, 'reel-rendered.json'), JSON.stringify({ file: `posts/${id}/reel.mp4`, engine: 6, seconds: total, voice: voice.length, sfx: cues.length, renderedAt: new Date().toISOString() }, null, 2));
  console.log('reel v6 done', id, total.toFixed(2) + 's', cues.length, 'sfx');
})().catch(e => { console.error(e); process.exit(1); });
