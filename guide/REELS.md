# Reels

10 reels per month; every other day is a carousel or single post (one feed post every day).
**Reel days: the 1st, 4th, 7th, 10th, 13th, 16th, 19th, 22nd, 25th and 28th of every month.** Every other day is a normal post.
**Voice reels (3 a month): the 7th, 16th and 25th** use the young voice "Crete" — ACTIVE, see "Voice reels" below. The other 7 are music only.

## Topics
Main series: **practical tips for designers** (the owner's favourite). Music-only reels also cover **marketing** (one smart idea per reel: a famous stunt, a launch trick, a branding lesson) and fast visual stories of strange ad campaigns. Examples of tips:
- Colour: 60-30-10 rule, how to build a palette, colour contrast, colours and emotion.
- Typography: pairing two fonts, hierarchy in 3 sizes, line length and spacing, Arabic + Latin pairing.
- Layout: white space, grids, alignment, one hero element, the rule of thirds.
- Branding and logos: what makes a logo scale, a brand in 3 elements, common logo mistakes.
- Workflow: briefs, giving and taking feedback, preparing files for print, presenting work to clients.
- Social media design: safe zones, readable text on mobile, carousel hooks.
Every 3rd reel may be a fast visual story instead (a famous work or campaign in 3 facts), using credited images exactly like posts.
Tips must be accurate, widely accepted design practice. No invented statistics. Do not repeat a topic already in `log/posted.md`.

## Spec (posts/<id>/reel.json) — engine 2 (liquid glass), the ONLY engine for new reels
Always set `"engine": 2`. 18 to 40 seconds, 5 to 8 scenes. Titles under ~35 characters, bodies under ~90.
```json
{
  "id": "YYYY-MM-DD-short-slug",
  "topic": "English one-line topic",
  "category": "تصميم",
  "format": "reel",
  "engine": 2,
  "mode": "dark",
  "badge": "نصيحة تصميم",
  "coverAt": 2.4,
  "music": "assets/music/<file from assets/music/library.json>",
  "musicStart": 0,
  "voice": false,
  "scenes": [
    {"type": "hook", "dur": 3.4, "pose": "point", "title": "...", "pill": "optional short pill text, e.g. 60 · 30 · 10", "sub": "..."},
    {"type": "point", "dur": 3.0, "num": "1", "title": "...", "body": "...", "kreti": "point"},
    {"type": "point", "dur": 3.0, "num": "2", "image": "https://...", "credit": "العمل: ... · @handle", "title": "...", "body": "..."},
    {"type": "image", "dur": 3.0, "image": "https://...", "title": "...", "credit": "...", "chip": "optional label", "tall": false, "fit": "cover"},
    {"type": "compare", "dur": 3.2, "title": "...", "bad": {"label": "غلط", "text": "..."}, "good": {"label": "صح", "text": "..."}, "kreti": "jump"},
    {"type": "list", "dur": 3.4, "tag": "الخلاصة", "title": "...", "points": ["...", "...", "..."], "kreti": "wave"},
    {"type": "statement", "dur": 2.8, "text": "one strong sentence", "sub": "..."},
    {"type": "end", "dur": 2.8, "note": "optional line under the handle"}
  ],
  "caption": "..."
}
```
- Always start with `hook` and finish with `end`. Use 3 to 5 different scene types per reel.
- `room` + `stack` (with a top-level `palette` of 3 colours) exist only for colour-proportion demos.
- Kreti poses: point, jump, think, wave. Use Kreti in 2 to 3 scenes.
- Sound effects are added automatically per scene type; set `"sfx": [[sec, "role", volume], ...]` on a scene only to override.
- Caption: same rules as posts (hook line ✦, the tips written out, a question, 5 to 9 hashtags including #كريتيفيا).

## Music (own library — ACTIVE)
Music is mixed INTO the video from `assets/music/library.json`. Pick by mood: upbeat for tips, facts, marketing and events (owner's favourite); lofi for calm how-to; ambient for architecture and art; emotional for serious news. Never the same track as the previous reel (check the last reel.json in `log/schedule.json`). Do NOT send Instagram `audioConfiguration` for engine 2 reels.

## Voice reels (ACTIVE) — the 7th, 16th and 25th
Set `"voice": true` and give every scene a `"say"` line: what the young voice "Crete" says in that scene (ElevenLabs voice `dIb2W5nEfCAa3PiChX8C`, model `eleven_v4`). Rules:
- **All Arabic, Modern Standard Arabic only (فصحى مبسطة), no dialect at all** — no Iraqi or other colloquial words (not: ماكو، كلشي، خلّي، شلون، هواية، بس). The on-screen text of a voice reel is also written in simple Modern Standard Arabic so it matches the voice. Short sentences, 1 sentence per scene, 3 to 12 words. Numbers written as words (ثلاثة، ستون بالمئة). No English words in the voice line.
- The whole script under 450 characters (credit budget; about 40 seconds). Do not repeat the on-screen text word for word; say it naturally.
- Scene durations stretch automatically to fit each line; the music ducks under the voice.
- The generator caches clips; changing a "say" line regenerates only that clip.

## Motion rules (owner, Nov 2026)
- Arabic text appears **word by word**, never letter by letter (letters are joined; splitting breaks their shapes).
- **Every reveal moves right to left**: words, cards, transitions, camera pans.
- Vertical 9:16 only; keep everything in the safe area (y 70 to 500 on the 360×640 stage). Only use motion that reads well on a tall phone screen.
- Style direction: liquid glass cards with a glowing rim, morphing between shapes (pill → card → card), soft blur-in reveals, slow camera push and slight 3D tilt, a softly drifting gradient background, small sparkles. Creativia colours, Playpen Sans Arabic, Kreti.
- Sound effects live in `assets/sfx/library.json` (by role: whoosh, pop, click, typing, sparkle, riser, soft-impact, ding, notification, ui, camera, tick, tension, applause). Keep them subtle under the music; never more than one effect at the same moment.
- Light / dark: dark for tips, tech, night and dramatic topics; light for art, fashion, calm and cheerful topics. Never two reels in a row in the same mode.
