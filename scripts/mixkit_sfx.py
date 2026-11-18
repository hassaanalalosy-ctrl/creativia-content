# Downloads short free sound effects from Mixkit (Mixkit Sound Effects Free License: free for commercial use, no attribution)
# into assets/sfx2 and writes assets/sfx2/library.json with roles. Run inside GitHub Actions (needs internet).
import json, os, re, subprocess, urllib.request, html
OUT = 'assets/sfx2'
CATS = {  # role: (category slug, how many)
  'whoosh': ('whoosh', 5), 'whoosh-soft': ('swoosh', 4), 'whip': ('transition', 4), 'pop': ('pop', 5),
  'click': ('click', 4), 'tick': ('keyboard', 3), 'impact': ('impact', 4), 'riser': ('riser', 3),
  'shimmer': ('sparkle', 3), 'camera': ('camera', 2), 'glitch': ('glitch', 3), 'game': ('game', 3), 'notification': ('notification', 3)}
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36'}
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=30).read()
lib = []
os.makedirs(OUT, exist_ok=True)
for role, (cat, n) in CATS.items():
    try:
        page = get(f'https://mixkit.co/free-sound-effects/{cat}/').decode('utf8', 'ignore')
    except Exception as e:
        print('page fail', cat, e); continue
    urls = re.findall(r'https://assets\.mixkit\.co/active_storage/sfx/(\d+)/\1-preview\.mp3', page)
    titles = dict(re.findall(r'data-audio-player-preview-url-value="https://assets\.mixkit\.co/active_storage/sfx/(\d+)/[^"]+"[\s\S]{0,600}?<h2[^>]*>\s*([^<]+?)\s*</h2>', page))
    seen, got = set(), 0
    for sid in urls:
        if sid in seen or got >= n: continue
        seen.add(sid)
        f = f'{OUT}/mixkit-{role}-{sid}.mp3'
        try:
            open(f, 'wb').write(get(f'https://assets.mixkit.co/active_storage/sfx/{sid}/{sid}-preview.mp3'))
        except Exception as e:
            print('dl fail', sid, e); continue
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode().strip() or 0)
        if dur > (6 if role == 'riser' else 3.2):
            os.remove(f); continue
        # onset (end of leading silence) and peak time (loudest 10 ms window)
        e = subprocess.run(['ffmpeg', '-i', f, '-af', 'silencedetect=n=-40dB:d=0.02', '-f', 'null', '-'], capture_output=True, text=True).stderr
        m = re.search(r'silence_end: ([\d.]+)', e); s0 = re.search(r'silence_start: ([\d.]+)', e)
        onset = float(m.group(1)) if (m and s0 and float(s0.group(1)) < 0.01) else 0.0
        st = subprocess.run(['ffmpeg', '-i', f, '-af', 'asetnsamples=441,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.Peak_level', '-f', 'null', '-'], capture_output=True, text=True).stderr
        levels = [float(x) for x in re.findall(r'Peak_level=(-?[\d.]+|-inf)', st) if x != '-inf']
        peak = (levels.index(max(levels)) * 0.01) if levels else onset
        lib.append({'file': os.path.basename(f), 'role': role, 'title': html.unescape(titles.get(sid, '')), 'source': 'Mixkit', 'mixkit_id': sid, 'duration': round(dur, 2), 'onset': round(onset, 3), 'peak': round(peak, 3)})
        got += 1
        print(role, sid, round(dur, 2), titles.get(sid, ''))
json.dump({'license': 'Mixkit Sound Effects Free License (commercial use, no attribution)', 'tracks': lib}, open(f'{OUT}/library.json', 'w'), indent=2, ensure_ascii=False)
print('total', len(lib))
