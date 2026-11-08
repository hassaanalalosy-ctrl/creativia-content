# Reels

10 reels per month; every other day is a carousel or single post (one feed post every day).
**Reel days: the 1st, 4th, 7th, 10th, 13th, 16th, 19th, 22nd, 25th and 28th of every month.** Every other day is a normal post.
**All 10 reels have a voiceover** by the Creativia voice "Arafat Almnshid" (Iraqi) — see "Voice reels" below. Music plays under the voice.

## Topics (owner, Nov 2026) — NO design tips
Reels are **stories**, not tips. Every reel tells one gripping story, told by the voice, with real images (and short video clips when available):
- **Legendary marketing campaigns** and why they worked (a famous stunt, a launch that broke the internet, a guerrilla idea, a brand comeback).
- **Strange and bold creative ideas** from anywhere in the world: weird ads, crazy brand stunts, ideas that made people stop and talk.
- **Logo and brand stories**: the story and history of a famous logo (e.g. Nike's Swoosh: who designed it, for how much, how it changed), rebrands that succeeded or failed, hidden ideas inside logos.
- Old stories are welcome if they are remarkable; say the year clearly. Recent campaigns (last weeks) are great when they are strong.
Structure: a hook that creates curiosity in the first 2 seconds (a question or a surprising fact) → the story in order (who, what, how, the result with real numbers from sources) → the lesson in one line → end.
Facts, numbers, dates and names verified in 2 sources; no invented results. Use the real campaign/logo images with credits (brand, agency, photographer). Do not repeat a topic already in `log/posted.md`.
Good scene types for stories: `hook`, `image` (most scenes), `video`, `point` with `image`, `statement` for the key moment or the lesson, `list` for "3 reasons it worked", `end`.

## Spec (posts/<id>/reel.json) — engine 2 (liquid glass), the ONLY engine for new reels
Always set `"engine": 2`. 30 to 75 seconds (stories can be long), 6 to 14 scenes. Titles under ~35 characters, bodies under ~90.
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
    {"type": "video", "dur": 4.0, "video": "https://direct-link-to-file.mp4", "start": 12.5, "title": "...", "credit": "الحملة: Brand · الوكالة: Agency", "fit": "cover"},
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
- Caption: same rules as posts (hook line ✦, the story in 2 to 3 short paragraphs with the key numbers, the lesson, a question, credits, 5 to 9 hashtags including #كريتيفيا #ماركتنغ when relevant).

## Video clips (`video` scene)
- Only **direct video file links** (.mp4) from the brand's or agency's press page, the award site (Cannes Lions, D&AD, The One Show), news sites that host the file, or Wikimedia Commons. Never download from YouTube, TikTok or Instagram.
- Keep each clip short: 2 to 5 seconds (`start` = second to begin from), at most 3 clips per reel, always credited. The clip plays silently under our voice and music.
- If the render fails to download a clip, replace that scene with an `image` scene of the same campaign and re-render.

## Music (own library — ACTIVE)
Music is mixed INTO the video from `assets/music/library.json`. Pick by mood: upbeat for tips, facts, marketing and events (owner's favourite); lofi for calm how-to; ambient for architecture and art; emotional for serious news. Never the same track as the previous reel (check the last reel.json in `log/schedule.json`). Do NOT send Instagram `audioConfiguration` for engine 2 reels.

## Voice reels (ACTIVE) — every reel
Set `"voice": true` on every reel and give every scene a `"say"` line. The voice is **Arafat Almnshid** (ElevenLabs voice `7N1xLmvR6jQolMXWRhvT`, model `eleven_v4`; it is the default, no `voiceId` needed). Rules:
- **Light, clear Iraqi dialect** (owner's choice, Nov 2026), easy for every Arab to follow: e.g. "اكو"، "شلون"، "هواية"، "خلّي"، "تعال نشوف". No heavy slang, no English words in the voice line.
- The on-screen text of voice reels uses the same light Iraqi tone so text and voice match.
- Short sentences, 1 sentence per scene, 3 to 14 words. Numbers written as words (ثلاث، ستين بالمية).
- Whole script under 900 characters (about 45 to 75 seconds). Say it naturally; do not read the on-screen text word for word.
- Scene durations stretch automatically to fit each line; the music ducks under the voice.
- The generator caches clips; changing a "say" line regenerates only that clip.

## Motion rules (owner, Nov 2026)
- Arabic text appears **word by word**, never letter by letter (letters are joined; splitting breaks their shapes).
- **Every reveal moves right to left**: words, cards, transitions, camera pans.
- Vertical 9:16 only; keep everything in the safe area (y 70 to 500 on the 360×640 stage). Only use motion that reads well on a tall phone screen.
- Style direction: liquid glass cards with a glowing rim, morphing between shapes (pill → card → card), soft blur-in reveals, slow camera push and slight 3D tilt, a softly drifting gradient background, small sparkles. Creativia colours, Playpen Sans Arabic, Kreti.
- Sound effects live in `assets/sfx/library.json` (by role: whoosh, pop, click, typing, sparkle, riser, soft-impact, ding, notification, ui, camera, tick, tension, applause). Keep them subtle under the music; never more than one effect at the same moment.
- Light / dark: dark for tips, tech, night and dramatic topics; light for art, fashion, calm and cheerful topics. Never two reels in a row in the same mode.
