# Creativia content guide

Account: Instagram **@creativia.mag** + its Facebook Page. Name: كريتيفيا | Creativia.
Bio: "عين على كل شي مبدع ✦ — فن، تصميم، عمارة، إعلان وأكثر — منشور جديد كل يوم الساعة 9 بالليل".
Owner: Hassaan Al-Alusi (Iraqi art director). Audience: Arab creatives, designers, students and curious people across the Arab world.

## What we post
Anything creative, chosen for being **strong and trending right now**:
contemporary art · Arab art · architecture · industrial and product design · advertising campaigns and the people behind them · illustration and painting · photography · typography and type design · brand identities.
Rotate categories: never the same category three posts in a row (check `log/posted.md`).

## Major creative events
Important events are part of the schedule. Cover a major event in the days right after it happens (results, winners, best work), or a short preview the week before:
- Global: Cannes Lions, The One Show, D&AD Awards, Clio Awards, ADC Awards, Portfolio Night (The One Club), Milan Design Week (Salone del Mobile), London Design Festival, Dutch Design Week, Venice Biennale (art and architecture), Art Basel, Frieze, Pritzker Prize, RIBA prizes, Wildlife Photographer of the Year, World Press Photo, Type Directors Club.
- Arab and regional: Art Dubai, Dubai Design Week, Abu Dhabi Art, Sharjah Biennial, Diriyah Biennale, Islamic Arts Biennale, Saudi Design Week, Beirut Design Week, Dubai Lynx, and creative events in Iraq (Baghdad, Erbil, Basra).
An event post may take a date outside the normal slot pattern when timing matters, as long as the month stays at 20 posts or fewer.

## Sources (discovery)
Design and architecture: Dezeen, Designboom, ArchDaily, Core77, Yanko Design, Archinect, The Architect's Newspaper, Wallpaper*.
Art: Colossal, Artsy, Artnet News, Hyperallergic, The Art Newspaper.
Advertising and creativity: Creative Review, It's Nice That, The Drum, Adweek, Ad Age, D&AD, Cannes Lions, Campaign, Ads of the World.
Identities and type: Brand New (Under Consideration), Fonts In Use, Behance.
Arab and Gulf art and design: Barjeel Art Foundation, Sharjah Art Foundation, Art Dubai, Dubai Design Week, Mathaf, Abu Dhabi Art, Saudi Design Week, Diriyah Biennale.
Pinterest and social media: discovery only. Never use an image whose original creator you cannot identify.
Some sites refuse automated fetching (CNN, Colossal and others). If a page will not fetch, use another outlet covering the same story.

## Choosing a topic
A topic qualifies only if ALL are true:
1. Recent: ideally published in the last 14 days, or a timeless classic with a fresh angle.
2. Verifiable: facts confirmed in at least 2 independent sources. Never invent numbers, quotes, names or dates.
3. Visual: there are at least 2 good images of the actual work (direct image file URLs, ideally 1000 px wide or more) with a known creator and, where given, a photographer.
4. Not already posted: check `log/posted.md`.
5. Interesting to an Arab audience: a surprising angle, a lesson, or a big name. Prefer Arab and regional work when a strong one exists.
Avoid: politics, religion debates, war imagery, nudity, gossip, and AI-generated art presented as human-made.

## Voice
- Simple Modern Arabic that every Arab reader understands. A light colloquial touch is fine (شنو، هالـ، يكدر), never heavy dialect.
- Short sentences. One idea per slide. No filler, no exaggeration, no clickbait lies.
- **All numbers are written with English digits** (2026, 5000, 1 / 7).
- Names of creators, studios and photographers: write them in Arabic in slide text when natural, and in their original Latin spelling in the caption credits.

## Format rotation (keeps the feed varied)
Pick the format from the number of entries already in `log/schedule.json` (call it N), then N mod 5:
- **0 · Story carousel** — `cover` (Kreti) → `inner` slides → one `text` slide with the key idea → `end`. For news, projects, prizes.
- **1 · Gallery carousel** — `coverImage` (full-bleed portrait work, or `"fit":"contain"` for landscape) → 3 to 5 `image`/`inner` slides, one work per slide, each credited → `end`. No `text` slide needed. For artists, photographers, series, exhibitions.
- **2 · Single post** — one `single` slide of one striking work. Short caption.
- **3 · Lessons carousel** — `cover` (Kreti `think` or `point`) → 2 `text` slides of practical takeaways (tips, rules, "5 things we learn from…") with 1 or 2 `inner` image slides between them → `end`. For campaigns, branding, typography, design thinking.
- **4 · Profile carousel** — `coverImage` of the creator's best-known work → `inner` slides walking through their path and key works → one `text` slide ("why they matter") → `end`. For important names in advertising, design, art.
If the chosen topic truly cannot fit that format, use the next format in the list (never the same format as the previous post).
Use `"mode": "dark"` when N mod 4 is 3, or when the artwork itself is dark.
Kreti cover poses rotate too: `point`, `jump`, `think` — not the same pose twice in a row.

## Carousel structure (default format)
5 to 8 slides, rendered at 1080 × 1350:
1. `cover` or `coverImage` — a hook headline (max ~45 characters, 2 lines), 2 chips (category + angle), a short handwritten note, Kreti pose `point` (discovery) or `jump` (amazing work).
2. Story slides: `inner` (framed image, best for landscape photos) or `image` (full-bleed, only for portrait images).
3. At least one `text` slide: the key idea or the lesson, with 3 short numbered points.
4. Last slide always `end`.
Single posts use one `single` slide (a framed image of one work).
Kreti appears on the cover, the end slide, and at most once inside (on an `inner` slide with `pose: think`). Every other `inner` slide uses `"kreti": false`.
Handwritten notes (`note`): 2 to 3 words max (شوف هذا! · ليش مهم؟ · احفظها! · تحفة!).

## Slide spec (posts/<id>/spec.json)
```json
{
  "id": "YYYY-MM-DD-short-slug",
  "topic": "English one-line topic",
  "category": "عمارة",
  "mode": "light",
  "sources": ["https://..."],
  "slides": [
    {"type": "cover", "badge": "جديد اليوم", "title": "...", "note": "شوف هذا!", "pose": "point",
     "chips": [{"icon": "building", "label": "عمارة"}, {"icon": "trend", "label": "ترند"}]},
    {"type": "inner", "image": "https://direct-image-url.jpg", "title": "...", "body": "max ~120 characters",
     "credit": "تصميم: ... · تصوير: Name", "chip": {"icon": "star", "label": "..."}, "kreti": false},
    {"type": "image", "image": "https://portrait-image.jpg", "title": "...", "credit": "...", "chip": {...}},
    {"type": "text", "tag": "الفكرة", "tagIcon": "spark", "title": "...", "points": ["...", "...", "..."], "note": "احفظها!"},
    {"type": "coverImage", "image": "...", "fit": "contain", "title": "...", "credit": "...", "chips": [{...}, {...}], "kreti": false},
    {"type": "single", "image": "...", "title": "...", "credit": "...", "chip": {...}, "kreti": true, "note": "تحفة!"},
    {"type": "end"}
  ],
  "caption": "..."
}
```
Icons: building, trend, star, clock, brush, box, pen, megaphone, type, camera, spark.
Optional: `"fit": "contain"` on `inner`/`single` to show a whole image without cropping; `"titleSize"` to shrink a long title (cover default 22, text default 25).
`mode` is `light` by default; use `dark` for night-themed or dark artwork, at most 1 in 4 posts.

## Caption
1. Hook line (can repeat the cover idea) + ✦
2. 2 to 3 short paragraphs: what it is, who made it, why it matters.
3. A question inviting comments.
4. Credits in original spelling: "تصميم: Studio Name" / "تصوير: Photographer".
5. 5 to 9 hashtags: always #كريتيفيا, plus Arabic category tags (#عمارة #تصميم #فن ...) and 2 to 4 English ones.

## Images and credit
- Credit the creator on every slide that shows their work, and the photographer when the source names one.
- Use images from the articles or official press material about the work. Copy the direct image file URL; for Dezeen use the full-size file (remove size suffixes like `-300x214`), for Archinect the gumlet upload URLs.
- If any work's creator is unknown, drop that image.
