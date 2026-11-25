# Reels

**22 reels + 8 posts per month (owner decision, 25 Nov 2026), from 1 December 2026.** One feed item every day at 21:00.
**Post days (carousel/single): the 4th, 8th, 12th, 16th, 20th, 24th, 28th and 30th, plus the 31st in 31-day months. Every other day is a reel day** (22 reels in a 30-day month; February: 21).
**Every reel is made like the GTA cover reel (posts/2026-11-23-gta-cover-grid-story): engine 6 DIRECTED, its own `scenes.js`, storyboard + self art-direction, final problem-only review.** Engines 2/4/5 are retired for new reels; their sections below are reference only.
**Every reel has a voiceover** by the Creativia voice "Arafat Almnshid" (Iraqi) — see "Voice reels" below. Music plays under the voice.
## WHAT WORKS — data, 25 Nov 2026 (owner: "the topics must be great and exciting"). Read this before choosing ANY reel topic.
Instagram reels 1–25 Nov (reach · avg watch · view rate):
- **GTA covers / why the helicopter is always top-left (23 Nov): 16,976 reach · 45 s · 78% · 706 likes · 116 saves · 75 shares · 26 comments** — 15× every other reel.
- GTA 6 hype marketing (20 Nov): 1,090 · 17 s · 52%. Arabic vs Latin type size (13 Nov): 1,011 · 8 s · 52%.
- Classic ad case studies were weak: Heinz "Draw Ketchup" 208, Moldy Whopper 192, KFC "FCK" 107 (view rate 41–53%).
Why the GTA cover reel won, and the recipe to copy:
1. **A world people already love and argue about** (games, films, football, phones, cartoons, big brands from daily life) — not an advertising-industry case study. Fans share to fans.
2. **A hidden detail they have seen a thousand times but never noticed** → hook "لاحظت…؟ / ليش دايماً…؟". The question must make the viewer look at the screen for the answer.
3. **A real story with a twist and a villain/pressure** (9/11, a deadline, a lawsuit, a leak, a mistake) that explains the detail — the answer arrives only at the end.
4. **Timing: ride what is trending now** (GTA 6 week). A big release/event in a fandom = make reels about its hidden design stories.
5. Engine 6 directed visuals: zooms into the real detail, full-bleed pictures.
Topic scoring now adds **fandom** (1–5: how many Arabs care and argue about this world?) — a reel topic needs 4+ on fandom AND surprise. Famous-but-old Cannes case studies (Heinz, KFC, Whopper type) only if the hook is a hidden detail in something people use every day.
Idea bank in this spirit: hidden details in logos people see daily (game consoles, car brands, apps), why game/film posters look the way they do, design secrets in GTA 6 / FIFA / PlayStation / Marvel / Pixar, why a famous character or icon was redesigned, leaked or banned designs, "the mistake that became the identity".

## Topics (owner, Nov 2026) — NO design tips
Reels are **stories**, not tips. Every reel tells one gripping story, told by the voice, with real images (and short video clips when available):
- **Legendary marketing campaigns** and why they worked (a famous stunt, a launch that broke the internet, a guerrilla idea, a brand comeback).
- **Strange and bold creative ideas** from anywhere in the world: weird ads, crazy brand stunts, ideas that made people stop and talk.
- **Logo and brand stories**: the story and history of a famous logo (e.g. Nike's Swoosh: who designed it, for how much, how it changed), rebrands that succeeded or failed, hidden ideas inside logos.
- Old stories are welcome if they are remarkable; say the year clearly. Recent campaigns (last weeks) are great when they are strong.
**Topic quality bar (owner: the topic must be really good).** Before writing, list 3 candidate stories and score each 1 to 5 on: surprise (would people say "wow, really?"), story (a clear beginning, twist and result), visuals (real images/clips available), relevance for Arab creatives and marketers, and shareability (would someone send it to a friend). Pick only a story that scores 4 or 5 on surprise AND story; if none does, search more. Write the 3 candidates and scores in the commit message.
Structure: a hook that creates curiosity in the first 2 seconds (a question or a surprising fact) → the story in order (who, what, how, the result with real numbers from sources) → the lesson in one line → end.
Facts, numbers, dates and names verified in 2 sources; no invented results. Use the real campaign/logo images with credits (brand, agency, photographer). Do not repeat a topic already in `log/posted.md`.
Good scene types for stories: `hook`, `image` (most scenes), `video`, `point` with `image`, `statement` for the key moment or the lesson, `list` for "3 reasons it worked", `end`.

## Spec (posts/<id>/reel.json) — engine 4 (LEGACY reference; new reels use engine 6, see "Engine 6 — DIRECTED")
Old engine-4 format (same scene format as engine 2; reference: posts/2026-11-20-gta6-hype-reel/reel.json). 30 to 75 seconds (stories can be long), 6 to 14 scenes. Titles under ~35 characters, bodies under ~90.
```json
{
  "id": "YYYY-MM-DD-short-slug",
  "topic": "English one-line topic",
  "category": "تصميم",
  "format": "reel",
  "engine": 4,
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
    {"type": "stat", "dur": 3.0, "icon": "chart", "value": "475M", "title": "...", "bars": [{"label": "...", "label2": "90M", "value": 90}, {"label": "...", "label2": "475M", "value": 475}], "body": "..."},
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

## Engine 6 — DIRECTED (current, Nov 23 2026). Use `"engine": 6` for EVERY new reel.
Each reel has its own `posts/<id>/scenes.js` (beats written for that story) on the toolkit `engine/reel6-page.js`; `reel.json` keeps `scenes` (say + dur, for the voice) and an `images` map. Example: posts/2026-11-23-gta-cover-grid-story/scenes.js.
Process (owner): script → storyboard per beat → build → render stills (`FRAMES=…` locally or the `preview` workflow) → review as art director + motion designer (use separate reviewer agents for big reels) → fix → full render → frame-jump check (no single-frame spikes except intentional match-cuts) → schedule.
Brand system (from the brand review):
- Constant: dark green→black ground; white text; mint #9BFFC2 for secondary info and drawn marks (rings, brackets, lines, notes); green #2EE86B ONLY for the one keyword per idea (≤10% of frame); Rubik; Playpen only for editor's notes; logo + badge fixed; Kreti end card. NO underlines under Arabic.
- Variable per beat: layout, text anchor, camera, transitions, background (full-bleed photo / dark / paper palette break), one topic accent inside the content.
- Rules: no two consecutive beats with the same composition; no static hold > 3 s (camera drift, drawing, counters); text appears with its spoken word and older text leaves; hero word ≥ 2.5× connector size; nothing under the badge (y ≥ 104); no text under the right buttons (x > 300 when y 330–600) or below y ≈ 506 — pictures may go there; dark scrim/pill behind text on busy art; transitions come from the content (match-cut, park-in-corner, iris, whip, flash, push-through), never a fade to an empty frame.

## Engine 5 — KINETIC SPACE (LEGACY reference — do not use for new reels)
No fixed card. Each scene = a visual + kinetic text that IS the voice (phrases build word by word in sync with the voice; small connector words, big green keywords from `hl`). Real 3D (perspective): pictures are cards shaped like the picture (never cropped), tilted and floating; galleries fly in from depth; blurred bokeh crosses in front; glows and a light beam drift behind.
- Scene types: `focus` (full-bleed picture + virtual camera stops, rings, `title`/`titleOut` for the hook), `image` (picture card, `chip`, `ring`, `ringLabel`, `credit`), `gallery` (`items`, `rows` e.g. [3,2], `ratio`, `highlight`), `date`, `bars` (`rows` with `big`,`label`,`value`,`hi`), `slice` (`image` cut into tiles, `drop`, `result`), `versus` (`a`,`b`, `symbol`), `statement` (`text`,`sub`), `end`.
- `layout`: `textTop` | `textBottom` (focus uses text over the picture, statement/end are text-only). Alternate them so the eye moves.
- `trans` (how a scene enters): push, whip, flip, rise, swing (default rotates). After a full-bleed picture the next scene comes from depth automatically. `focus` enters with `grow` (default) or `iris`.
- `hl`: the keywords of the line (big + green). 2-4 per line.
- Preview while building: `FRAMES=0,3,8.4 node engine/reel5.js <id>` writes stills to engine/_tmp (CHROME_PATH may be needed locally).

## Owner rule (Nov 23 2026): FINAL PROBLEM-ONLY REVIEW. After all the work is done and before scheduling, review the finished reel once more looking ONLY for problems: stutter/jumps (frame-diff check: no isolated jumps and no frozen frames — hard cuts feel like stutter to the owner, use quick cross-dissolves/whips instead), cut or cropped pictures, text collisions, leftovers between beats, safe zones, text order vs the voice. Fix everything found, re-render, check again.

## Owner rule (Nov 23 2026): never draw a line/underline under Arabic words — it covers letters and dots. Emphasis = size, weight, colour, or a pill behind the word.

## How a reel is made (owner, Nov 23 2026) — Claude is the art director
1. Script first, then a STORYBOARD: for every line decide what we SEE (zoom into a detail, full-screen picture, cards, animated diagram, big type alone…). Templates serve the storyboard, never the reverse; build a new scene when the idea needs one.
2. Render the storyboard key frames locally (FRAMES=…), then review them yourself as an art director: is each beat clear, big, alive? Empty space? Cropped pictures? Weak transitions? Write the notes, fix, re-check. Only then render the full video. The owner does not approve storyboards.
3. Cards are NOT squares: a card takes the shape of its content. A picture keeps its own ratio (no cropping of posters/covers), no big empty areas inside a card.
4. Fixed = brand only (colours, font, logo + badge HUD, Kreti, end card, Instagram safe zones, no overlaps). Everything else may change from reel to reel. Old rules in this file are defaults, not laws.

## Storytelling kit (owner, Nov 22 2026: "clearer, more creative, same theme, examples and pictures")
Reference: a story reel where every line has a picture or a diagram that SHOWS what the voice says. Do the same:
- **Subtitles:** on by default. `voice.js` asks ElevenLabs for word timestamps, the engine shows the line under the card in short chunks and lights each word as it is spoken (numbers/Latin and words in a scene's `hl` list in green). `"subtitles": false` turns them off.
- **Every claim gets a visual:** a real picture, a comparison, a number bar, a date. Avoid two text-only cards in a row.
- **Freedom (owner, Nov 22 2026):** the brand stays, but the method is NOT fixed. When the voice says "look at this", SHOW it big: leave the card world for a full-screen picture, zoom right into the detail (even filling the screen), then come back to the cards with a smart transition. Mix card scenes and full-screen scenes; vary it per story.
  - `focus`: full-screen picture with a virtual camera. `{"type":"focus","image","stops":[[x,y,zoom,at],...],"rings":[{"at":s,"xy":[x,y,r],"label"}],"chip","title","body","big":true,"enter":"grow"|"iris","exit":"shrink","credit"}`. x/y = point of the picture to centre (0..1), zoom 1 = fills the screen. Enters by growing out of the card shape (or an iris), leaves by shrinking back into the card world. As the FIRST scene it is the hook/thumbnail (start zoomed on the detail, title with `big`).
- New scene types (all inside the card):
  - `versus`: two pictures side by side. `{"type":"versus","title":"...","symbol":"≠" or "→","a":{"image","label","sub","tag","warn":true},"b":{...},"credit"}`
  - `slice`: cut a picture into a grid live, drop some tiles, then land the result picture. `{"type":"slice","image","result","rows":3,"cols":3,"drop":[3,6,7],"h":300,"chip","title","credit"}`
  - `gallery`: up to 6 pictures in a 3x2 wall with labels, plus an optional highlight box on the same spot of each (`"highlight":[x,y,w,h]` as fractions). Great for "same thing across years".
  - `date`: a calendar page. `{"type":"date","month":"سبتمبر","day":"11","year":"2001","title","body"}`
  - `hbars`: horizontal bars with big labels (time or size compared). `{"type":"hbars","title","rows":[{"big":"6 أشهر","label":"...","value":180},{"big":"أيام","label":"...","value":7,"hi":true}],"body"}`
  - Posters and covers are PORTRAIT (owner): use `image` with `"overlay": true` (tall photo, text on a dark gradient inside it), never a squat crop. In `focus`, end on the WHOLE poster: a last stop with zoom < 1 (about 0.55) and screen-y 268 (5th value), with `titleOut` so the title clears; `titleAt` delays the title.
  - `image` extras: `"h"` (photo height, default 236), `"ring":[cx,cy,r]` draws a yellow circle on the photo (fractions of the photo) with optional `"ringLabel"` and `"ringAt"`.
- Pictures for a reel can be fetched into the post folder with the `fetch-images` workflow (`posts/<id>/images.json`: wiki page, fandom/wiki file search, or direct URL), then used as `posts/<id>/img/<file>`. Check every fetched picture with Read before using it.

## Motion rules (owner, Nov 2026)
- Arabic text appears **word by word**, never letter by letter (letters are joined; splitting breaks their shapes).
- **Every reveal moves right to left**: words, cards, transitions, camera pans.
- Vertical 9:16 only; keep everything in the safe area (y 70 to 500 on the 360×640 stage). Only use motion that reads well on a tall phone screen.
- Style direction: liquid glass cards with a glowing rim, morphing between shapes (pill → card → card), soft blur-in reveals, slow camera push and slight 3D tilt, a softly drifting gradient background, small sparkles. Creativia colours, Playpen Sans Arabic, Kreti.
- Sound effects live in `assets/sfx/library.json` (by role: whoosh, pop, click, typing, sparkle, riser, soft-impact, ding, notification, ui, camera, tick, tension, applause). Keep them subtle under the music; never more than one effect at the same moment.
- Light / dark: dark for tips, tech, night and dramatic topics; light for art, fashion, calm and cheerful topics. Never two reels in a row in the same mode.

## Engine 4 rules (owner, Nov 2026)
- The CAMERA carries the film: every scene is a panel in one world; the camera pulls back, travels, rolls slightly and lands on the next panel (moves rotate on a steady beat of 0.25 s steps: travel right/left/down, dive (pull far back), through (zoom into the panel and land from wide on the next), swing (roll), whip (fast); force one with `"camera"`; inside a scene the camera does a different gesture each time: push, pull, drift left/right, rise, tilt; force with `"drift"`). Inside a scene the camera keeps pushing in slowly. Never make it feel like boxes appearing and disappearing.
- ALL content of a scene lives inside its panel (title, text, rows, charts). Space is balanced inside the panel: no crowding at the top with empty space below.
- Numbers are visual: use `stat` (animated counter, optional growing bar chart with `bars`) or `num` on image scenes (counting badge). Icons (eye, play, chart, megaphone, clock, spark, star, trophy, quiet, tv) draw themselves line by line; use `icon` on hook/stat, `chipIcon` on image chips, `tagIcon` on lists.
- Kreti sits inside the hook and end panels only, never next to the logo.

## Motion craft (from the HyperFrames motion guide)
- Instagram safe band on the 360x640 stage: text and key visuals only between y 62 and 440; nothing important under the right action rail low on the screen. The engine's layouts already respect this; keep titles short so they do not wrap to a third line.
- Frame 0 is the thumbnail: the hook title is already on screen at frame 0 (the engine does this for `hook`). Ask a question or state a surprising number.
- Titles land and stay still; motion moves to the next element, the camera or the background. No floating titles.
- Transitions have a cause: the glass card morphs into the next card, whips, zooms through, colour floods or blur-swaps; the engine rotates them. Use `"transition"` on a scene only to force one.
- One payoff per film: the `statement` scene gets the riser into impact and a small camera punch-in. Use it once, near the end.
- Sound: few and exact. The engine places a whoosh on cuts, a pop when a number/badge/chip lands, ticks on list rows, a riser+impact on the payoff, a shimmer on the end card, and rotates takes. Music sits low under the voice.
- Video clips: `video` scenes (2 to 6 s each). Reels may run up to 90 s when they walk through several clips.

## Video clips (owner, 25 Nov 2026): real footage in motion, especially as the HOOK
- Engine 6: `"videos": {"name": {"src": "posts/<id>/vid/x.mp4", "start": 3.2, "dur": 6}}` in reel.json; in scenes.js `play(full(name,…), name, t0, {rate, from, loop})` or `play(pic(name,…), …)`. The clip's first frame is also `IMG[name]`.
- Getting clips: `posts/<id>/videos.json` + the `fetch-videos` workflow (yt-dlp; YouTube needs the `YT_COOKIES` secret), or the owner's Telegram video inbox: links/videos sent to the Creativia bot land in `assets/inbox/` (see `assets/inbox/index.json`, tag = the text sent with the link); use them as `{"name": "x", "url": "inbox:<file>", "start", "end"}` in videos.json. Check the inbox before every reel.
- Keep some ORIGINAL SOUND (owner, 25 Nov 2026): `play(..., {until: <end time>, audio: 0.2-0.6})` mixes the clip's own audio under the voice (our music dips while it plays). Use ~0.5 for films/music, ~0.2 for interviews (speech fights the voice), 0 for silent use.
- Owner's video route today: he downloads YouTube clips with a Telegram downloader bot and sends them in the chat; store them trimmed in `posts/<id>/vid/` (720p-1080p, keep audio). Dailymotion links work directly in the `fetch-videos` workflow.
- Credit the footage owner on screen and in the caption.
