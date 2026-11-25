"""Download video clips for a post into posts/<id>/vid/ (runs in GitHub Actions, which has open internet).
Reads posts/<id>/videos.json: a list of {"name", "url", "start"?, "end"?, "h"? (max height, 1280), "crf"? (20)} (url = YouTube/Vimeo/any page yt-dlp knows, or a direct .mp4).
Each clip is trimmed to start..end (seconds, default first 60 s), audio removed, scaled to max 1280 px tall, H.264 CRF 20.
Writes posts/<id>/vid/index.json (name, file, source, width, height, seconds) and the first frame as <name>.jpg.
Usage: python3 scripts/fetch_videos.py <post-id>
"""
import json, os, subprocess, sys, glob, shutil

def run(*a):
    print('+', ' '.join(a)); return subprocess.run(a, check=True, capture_output=True, text=True).stdout


def cobalt(url, dst):
    """Fallback when YouTube blocks GitHub: ask public cobalt instances (open-source downloader servers) for the file."""
    import urllib.request, re as _re
    cands = []
    for lst in ('https://instances.cobalt.best/api/instances.json', 'https://instances.cobalt.best/instances.json'):
        try:
            data = json.loads(urllib.request.urlopen(urllib.request.Request(lst, headers={'User-Agent': 'creativia/1.0'}), timeout=30).read())
            for it in (data if isinstance(data, list) else data.get('instances', [])):
                api = it.get('api') or it.get('url') or ''
                svc = it.get('services') or {}
                if api and (not svc or svc.get('youtube') in (True, None)) and it.get('online', True) is not False:
                    cands.append(('https://' + api) if not api.startswith('http') else api)
            if cands: break
        except Exception as ex: print('instance list', lst, ex)
    print('cobalt candidates', len(cands), cands[:12])
    for api in cands[:25]:
        try:
            req = urllib.request.Request(api.rstrip('/') + '/', data=json.dumps({'url': url, 'videoQuality': '1080', 'youtubeVideoCodec': 'h264', 'downloadMode': 'auto'}).encode(),
                                         headers={'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'creativia/1.0'})
            r = json.loads(urllib.request.urlopen(req, timeout=40).read())
            if r.get('status') in ('tunnel', 'redirect', 'stream') and r.get('url'):
                urllib.request.urlretrieve(r['url'], dst)
                if os.path.getsize(dst) > 200000: print('cobalt ok via', api); return True
            else: print('cobalt', api, r.get('status'), str(r.get('error'))[:80])
        except Exception as ex: print('cobalt', api, str(ex)[:80])
    return False

def main():
    pid = sys.argv[1]
    root = os.path.join(os.path.dirname(__file__), '..', 'posts', pid)
    entries = json.load(open(os.path.join(root, 'videos.json'), encoding='utf-8'))
    out = os.path.join(root, 'vid'); os.makedirs(out, exist_ok=True)
    tmp = '/tmp/vidsrc'; os.makedirs(tmp, exist_ok=True)
    index = []
    for e in entries:
        name, url = e['name'], e['url']
        try:
            for f in glob.glob(os.path.join(tmp, name + '.*')): os.remove(f)
            if url.startswith('inbox:'):
                shutil.copy(os.path.join(os.path.dirname(__file__), '..', 'assets', 'inbox', url[6:]), os.path.join(tmp, name + '.mp4'))
            elif url.lower().split('?')[0].endswith('.mp4'):
                run('curl', '-sSL', '-A', 'Mozilla/5.0', '-o', os.path.join(tmp, name + '.mp4'), url)
            else:
                last = None
                for client in (None, 'tv_simply', 'tv', 'mweb', 'web_safari', 'android_vr'):
                    try:
                        extra = ['--extractor-args', 'youtube:player_client=' + client] if client else []
                        if os.path.exists('/tmp/cookies.txt'): extra += ['--cookies', '/tmp/cookies.txt']
                        run('yt-dlp', '--no-playlist', *extra, '-f', 'bv*[height<=1080][ext=mp4]+ba/bv*[height<=1080]+ba/b', '--merge-output-format', 'mp4',
                            '-o', os.path.join(tmp, name + '.%(ext)s'), url)
                        last = None; break
                    except subprocess.CalledProcessError as ex:
                        last = ex; print('client', client, 'failed:', (ex.stderr or '')[-200:])
                if last and not cobalt(url, os.path.join(tmp, name + '.mp4')): raise last
            src = sorted(glob.glob(os.path.join(tmp, name + '.*')))[0]
            s, en = float(e.get('start', 0)), e.get('end')
            dst = os.path.join(out, name + '.mp4')
            args = ['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(s), '-i', src]
            if en is not None: args += ['-t', str(float(en) - s)]
            else: args += ['-t', '60']
            H = int(e.get('h', 1280))
            args += ['-an', '-vf', "scale='if(gt(ih,%d),-2,iw)':'if(gt(ih,%d),%d,ih)'" % (H, H, H), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', str(e.get('crf', 20)), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst]
            run(*args)
            run('ffmpeg', '-y', '-loglevel', 'error', '-ss', '0.5', '-i', dst, '-frames:v', '1', '-q:v', '2', os.path.join(out, name + '.jpg'))
            pr = json.loads(run('ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', dst))
            st = pr['streams'][0]
            index.append({'name': name, 'file': name + '.mp4', 'source': url, 'start': s, 'width': st['width'], 'height': st['height'], 'seconds': round(float(pr['format']['duration']), 2)})
            print('saved', name, st['width'], st['height'])
        except Exception as ex:
            msg = getattr(ex, 'stderr', '') or str(ex)
            print('failed', name, msg[-600:])
            index.append({'name': name, 'source': url, 'error': msg[-300:]})
    json.dump(index, open(os.path.join(out, 'index.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == '__main__':
    main()
