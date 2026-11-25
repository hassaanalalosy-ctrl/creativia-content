"""Creativia video inbox: a Telegram bot. Send a YouTube (or any) link, or a video file, to the bot (or a group it is in);
this script (run by .github/workflows/telegram-inbox.yml every ~10 minutes) downloads it into assets/inbox/ and replies.
Text after the link becomes the clip's tag (e.g. "https://youtu.be/xxx برادا").
Secrets: TELEGRAM_BOT_TOKEN (required), YT_COOKIES (Netscape cookies.txt of a YouTube account; YouTube blocks GitHub without it),
TELEGRAM_CHATS (optional, comma-separated chat ids allowed; empty = any chat).
Bot API file downloads are limited to 20 MB, so forwarded files must be small (720p, about 1-2 minutes)."""
import json, os, re, subprocess, sys, time, urllib.parse, urllib.request

TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '').strip()
API = 'https://api.telegram.org/bot' + TOKEN
ROOT = os.path.join(os.path.dirname(__file__), '..')
INBOX = os.path.join(ROOT, 'assets', 'inbox')
STATE = os.path.join(INBOX, 'state.json')
INDEX = os.path.join(INBOX, 'index.json')
ALLOWED = {c.strip() for c in os.environ.get('TELEGRAM_CHATS', '').split(',') if c.strip()}
URL = re.compile(r'https?://\S+')


def call(method, **params):
    data = urllib.parse.urlencode(params).encode()
    with urllib.request.urlopen(API + '/' + method, data, timeout=60) as r:
        return json.loads(r.read())


def reply(chat, msg_id, text):
    try: call('sendMessage', chat_id=chat, text=text, reply_to_message_id=msg_id)
    except Exception as ex: print('reply failed', ex)


def slug(s):
    s = re.sub(r'[^\w؀-ۿ-]+', '-', s or '').strip('-')
    return s[:40] or 'clip'


def finish(src, base):
    """Re-encode to 720p H.264 without audio (we use our own voice/music) and keep it under ~45 MB."""
    dst = os.path.join(INBOX, base + '.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-t', '600', '-an', '-vf', "scale='if(gt(ih,720),-2,iw)':'if(gt(ih,720),720,ih)'",
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst], check=True)
    pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=width,height', '-select_streams', 'v:0', '-of', 'json', dst],
                                   check=True, capture_output=True, text=True).stdout)
    os.remove(src)
    return base + '.mp4', round(float(pr['format']['duration']), 1), pr['streams'][0]['width'], pr['streams'][0]['height']


def ytdlp(url, base):
    out = os.path.join('/tmp', base + '.%(ext)s')
    args = ['yt-dlp', '--no-playlist', '-f', 'bv*[height<=1080]+ba/b[height<=1080]/b', '--merge-output-format', 'mp4', '-o', out, '--print', 'after_move:filepath', '--print', 'title']
    if os.path.exists('/tmp/cookies.txt'): args += ['--cookies', '/tmp/cookies.txt']
    r = subprocess.run(args + [url], capture_output=True, text=True)
    if r.returncode != 0: raise RuntimeError((r.stderr or '').strip().splitlines()[-1][:300] if r.stderr else 'yt-dlp failed')
    lines = [l for l in r.stdout.strip().splitlines() if l.strip()]
    return lines[-1], (lines[0] if len(lines) > 1 else '')


def main():
    if not TOKEN: print('TELEGRAM_BOT_TOKEN not set'); return
    os.makedirs(INBOX, exist_ok=True)
    state = json.load(open(STATE)) if os.path.exists(STATE) else {'offset': 0, 'chats': {}}
    index = json.load(open(INDEX, encoding='utf-8')) if os.path.exists(INDEX) else []
    ups = call('getUpdates', offset=state['offset'], timeout=0, allowed_updates=json.dumps(['message', 'channel_post'])).get('result', [])
    for u in ups:
        state['offset'] = u['update_id'] + 1
        m = u.get('message') or u.get('channel_post') or {}
        chat = str(m.get('chat', {}).get('id', '')); mid = m.get('message_id')
        state['chats'][chat] = m.get('chat', {}).get('title') or m.get('chat', {}).get('username') or ''
        if ALLOWED and chat not in ALLOWED: continue
        text = m.get('text') or m.get('caption') or ''
        stamp = time.strftime('%Y%m%d-%H%M%S', time.gmtime(m.get('date', time.time())))
        try:
            vid = m.get('video') or m.get('animation') or (m.get('document') if (m.get('document') or {}).get('mime_type', '').startswith('video') else None)
            if vid:
                if vid.get('file_size', 0) > 20 * 1024 * 1024:
                    reply(chat, mid, 'الملف أكبر من 20 ميغا، تيليغرام ما يسمح للبوت يسحبه. دز رابط اليوتيوب بداله، لو نسخة 720 أقصر.'); continue
                fp = call('getFile', file_id=vid['file_id'])['result']['file_path']
                tag = slug(text); base = stamp + '-' + tag; tmp = '/tmp/' + base + os.path.splitext(fp)[1]
                urllib.request.urlretrieve('https://api.telegram.org/file/bot' + TOKEN + '/' + fp, tmp)
                f, sec, w, h = finish(tmp, base)
                index.append({'file': f, 'tag': text.strip(), 'source': 'telegram', 'seconds': sec, 'width': w, 'height': h, 'date': stamp})
                reply(chat, mid, '✅ وصل: ' + f + ' (' + str(sec) + ' ثانية)')
                continue
            urls = URL.findall(text)
            if not urls: continue
            tag = URL.sub('', text).strip()
            for url in urls:
                base = stamp + '-' + slug(tag or url.split('/')[-1])
                path, title = ytdlp(url, base)
                f, sec, w, h = finish(path, base)
                index.append({'file': f, 'tag': tag, 'title': title, 'source': url, 'seconds': sec, 'width': w, 'height': h, 'date': stamp})
                reply(chat, mid, '✅ نزل: ' + (title or url) + '\n' + f + ' (' + str(sec) + ' ثانية)')
        except Exception as ex:
            msg = str(ex)
            hint = '\n(يوتيوب يطلب تسجيل دخول: لازم سر YT_COOKIES بـ GitHub)' if 'Sign in' in msg or 'bot' in msg else ''
            reply(chat, mid, '❌ ما نزل: ' + msg[:250] + hint)
    # keep the inbox light: drop clips older than 45 days
    cutoff = time.strftime('%Y%m%d', time.gmtime(time.time() - 45 * 86400))
    keep = []
    for e in index:
        if e['date'][:8] < cutoff:
            try: os.remove(os.path.join(INBOX, e['file']))
            except OSError: pass
        else: keep.append(e)
    json.dump(keep, open(INDEX, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    json.dump(state, open(STATE, 'w'), ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()
