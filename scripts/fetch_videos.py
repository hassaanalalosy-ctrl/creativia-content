"""Download video clips for a post into posts/<id>/vid/ (runs in GitHub Actions, which has open internet).
Reads posts/<id>/videos.json: a list of {"name", "url", "start"?, "end"?, "h"? (max height, 1280), "crf"? (20)} (url = YouTube/Vimeo/any page yt-dlp knows, or a direct .mp4).
Each clip is trimmed to start..end (seconds, default first 60 s), audio removed, scaled to max 1280 px tall, H.264 CRF 20.
Writes posts/<id>/vid/index.json (name, file, source, width, height, seconds) and the first frame as <name>.jpg.
Usage: python3 scripts/fetch_videos.py <post-id>
"""
import json, os, subprocess, sys, glob, shutil

def run(*a):
    print('+', ' '.join(a)); return subprocess.run(a, check=True, capture_output=True, text=True).stdout

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
            if url.lower().split('?')[0].endswith('.mp4'):
                run('curl', '-sSL', '-A', 'Mozilla/5.0', '-o', os.path.join(tmp, name + '.mp4'), url)
            else:
                run('yt-dlp', '--no-playlist', '-f', 'bv*[height<=1080][ext=mp4]+ba/bv*[height<=1080]+ba/b', '--merge-output-format', 'mp4',
                    '-o', os.path.join(tmp, name + '.%(ext)s'), url)
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
