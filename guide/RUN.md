# Run procedure (scheduled task, every 8 hours)

Goal: keep the next 7 days filled, publishing at **21:00 Asia/Baghdad**, with **at most 20 posts per calendar month** (Metricool free plan).
Each run creates **at most one** post. Do not create, edit or delete anything else in Metricool.

## 1. Setup
- Attach `hassaanalalosy-ctrl/creativia-content` with push access (add_repo) and `git clone --depth 1` it to `/home/claude/creativia-content`.
- Read `guide/CONTENT_GUIDE.md`, `guide/REELS.md`, `log/posted.md` and `log/schedule.json`.
- Load the Metricool tools with ToolSearch (query "metricool"). Brand/blog id: **7656023**, timezone Asia/Baghdad.

## 2. Pick the slot (or stop)
- Slot days: every date whose day-of-month is NOT divisible by 3 (1, 2, 4, 5, 7, 8, ...).
- Starting from tomorrow (Baghdad date), walk forward up to 7 days and take the first slot day that is not already a key in `log/schedule.json` and whose month has fewer than 20 entries in `log/schedule.json`.
- If there is no such slot, stop: reply "No slot to fill" and end the run without changes.
- If the slot's day-of-month is 4, 10, 16, 22 or 28 it is a **reel day**: follow section 3R instead of 3, and in section 4 use the reel settings.

## 3. Make the post
- Research and choose a topic exactly as the content guide says (web search + page fetches; verify facts in 2 sources).
- Write `posts/<id>/spec.json` (id = `<slot date>-<short-slug>`), following the guide's structure, voice and credit rules. Default 6 to 7 slides.
- Commit "Post spec: <slug>" and push to main. The GitHub Action "Render slides" renders it.
- Poll every 15 seconds (`git fetch origin main`) for up to 8 minutes until `posts/<id>/rendered.json` or `posts/<id>/render-error.json` exists on origin/main, then `git reset --hard origin/main`.
- If render-error.json appears (usually a bad image URL): replace the failing image URL in the spec with another credited image of the same work, delete render-error.json, push again and wait again. Give up after 2 attempts: delete the post folder, push, and reply with the error.
- Open every rendered slide image with the Read tool and check it: text not cut off, no overlapping elements, images loaded, numbers in English digits, credits present. If something is wrong, fix the spec and re-render (delete rendered.json, push).

## 3R. Make a reel (reel days only)
- Choose a topic as `guide/REELS.md` says, and write `posts/<id>/reel.json`.
- Commit "Reel spec: <slug>" and push. The same GitHub Action renders `reel.mp4` and `reel-cover.jpg` (takes about 2 to 4 minutes).
- Poll every 15 seconds for up to 12 minutes until `posts/<id>/reel-rendered.json` or `posts/<id>/render-error.json` exists on origin/main, then `git reset --hard origin/main`.
- Check it: extract 6 frames spread across the video with ffmpeg (`ffmpeg -ss <sec> -i reel.mp4 -frames:v 1 -vf scale=270:480 f.png`) and open them with the Read tool. Text must not overlap, be cut off, or sit in the bottom fifth of the frame. Fix the spec and re-render if needed (delete reel-rendered.json, push).

## 4. Put it in Metricool
Call createScheduledPost with blogId 7656023, date `<slot>T21:00:00+03:00`, and info:
- `media`: raw URLs pinned to the commit that holds the rendered files (`sha=$(git log -1 --format=%H -- posts/<id>)`): `https://raw.githubusercontent.com/hassaanalalosy-ctrl/creativia-content/<sha>/posts/<id>/slides/NN.png` in order. Never use `main` in these URLs (it is cached and can serve an old version).
- `providers`: `[{"network":"instagram"}]` — Instagram only. On the free plan every network counts as a separate post, so adding Facebook would halve the 20 posts.
- `instagramData`: `{"type":"POST"}`
- `text`: the caption; `publicationDate`: `{"dateTime":"<slot>T21:00:00","timezone":"Asia/Baghdad"}`
- **Reels:** `media` = the pinned URL of `posts/<id>/reel.mp4`, `videoThumbnailUrl` = the pinned URL of `posts/<id>/reel-cover.jpg`, `instagramData` = `{"type":"REEL","showReelOnFeed":true,"audioConfiguration":{"audioId":"<numeric id>"}}` (music steps in `guide/REELS.md`).
- **Trial period (until the owner says otherwise): `"draft": true, "autoPublish": true`** — the owner reviews each draft in the Metricool app and schedules it; once scheduled it publishes automatically.

### Replacing images of an existing post
GitHub's raw links on `main` are cached for a few minutes, so after a re-render never reuse the `main` URL. Use the commit that holds the new image: `git log -1 --format=%H -- posts/<id>/slides/NN.png`, then `https://raw.githubusercontent.com/hassaanalalosy-ctrl/creativia-content/<that sha>/posts/<id>/slides/NN.png`. Download it once and compare it with the local file before sending it to Metricool.

## 5. Record and clean up
- Add `"<slot>": "<id>"` to `log/schedule.json` and a line to `log/posted.md`: `- <slot> · <category> · <Arabic one-line topic> · <id>`.
- Delete `posts/*/slides` folders of posts whose slot date is more than 30 days ago (Metricool keeps its own copy).
- Commit "Schedule <id>" and push.

## 6. Reply (this is what the owner sees in the notification)
Two or three lines in Arabic: the slot date, the topic, number of slides (or "ريل" and its length and music), and the Metricool planner link from the createScheduledPost response.
