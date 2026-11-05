# Reels

10 reels per month; every other day is a carousel or single post (one feed post every day).
**Reel days: the 1st, 4th, 7th, 10th, 13th, 16th, 19th, 22nd, 25th and 28th of every month.** Every other day is a normal post.
**Voice reels (3 a month): the 7th, 16th and 25th** use the young voice "Crete" (ElevenLabs voice id `dIb2W5nEfCAa3PiChX8C`, model `eleven_v4`) — VOICE PIPELINE NOT ACTIVE YET: until this line says ACTIVE, make them music-only. The other 7 are music only.

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

## Spec (posts/<id>/reel.json)
15 to 22 seconds total. 5 to 7 scenes. Short text: titles under ~35 characters, bodies under ~90 characters.
```json
{
  "id": "YYYY-MM-DD-short-slug",
  "topic": "English one-line topic",
  "category": "تصميم",
  "format": "reel",
  "mode": "light",
  "badge": "نصيحة تصميم",
  "coverAt": 2.4,
  "scenes": [
    {"type": "hook", "dur": 3.0, "pose": "point", "title": "...", "sub": "...", "note": "شوف هذا!",
     "chips": [{"icon": "type", "label": "..."}, {"icon": "spark", "label": "نصيحة"}]},
    {"type": "point", "dur": 2.8, "num": "1", "title": "...", "body": "...", "kreti": "point", "note": "..."},
    {"type": "point", "dur": 2.8, "num": "2", "image": "https://...", "credit": "العمل: ... · @handle", "title": "...", "body": "..."},
    {"type": "compare", "dur": 3.0, "title": "...", "bad": {"label": "غلط", "text": "..."}, "good": {"label": "صح", "text": "..."}, "kreti": "jump"},
    {"type": "list", "dur": 3.2, "tag": "الخلاصة", "title": "...", "points": ["...", "...", "..."], "kreti": "wave", "note": "احفظها!"},
    {"type": "image", "dur": 2.6, "image": "https://...", "title": "...", "credit": "...", "chip": {"icon": "brush", "label": "..."}},
    {"type": "end", "dur": 2.4, "note": "جربها بشغلك الجاي!"}
  ],
  "caption": "..."
}
```
- Always start with `hook` and finish with `end`.
- `point` without `image` shows a big green number tile; with `image` it frames a credited picture.
- `list` holds up to 4 points. `compare` is great for "wrong vs right".
- Special scene `room` (with a top-level `palette`) exists only for colour-proportion demos.
- Kreti poses: point, jump, think, wave. Use Kreti in 2 to 4 scenes, not all of them.
- `mode`: light by default; dark for night or dark-themed topics.
- Caption: same rules as posts (hook line ✦, the tips written out so the reel can be saved and read, a question, 5 to 9 hashtags including #كريتيفيا #نصائح_تصميم).

## Music (Instagram library through Metricool)
The video is silent; music is attached with `instagramData.audioConfiguration.audioId`.
1. Call createScheduledPost with `audioId` set to a mood search term (for example "lofi chill", "soft piano", "upbeat indie", "ambient"). It returns an error listing candidates with numeric ids.
2. Pick an instrumental track that fits the mood (calm for tips, upbeat for fast stories). Do not reuse the previous reel's track.
3. Call createScheduledPost again with the numeric `audioId`.
If no suitable candidates come back after 3 search terms, schedule the reel without music and say so in the reply.

## Own music library (prepared, NOT active yet)
`assets/music/library.json` lists approved Pixabay tracks by mood (upbeat, lofi, ambient, emotional). Owner prefers upbeat unless the topic calls for another mood.
When the voiceover system is switched on, the renderer will mix the chosen track under the voice (ducked) and the Instagram `audioId` step above will be dropped. Until this section says ACTIVE, keep using the Instagram music steps above.
