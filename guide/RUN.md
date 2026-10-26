# Run procedure (scheduled task, every 8 hours)

Goal: keep the next 7 days filled, publishing at **21:00 Asia/Baghdad**, with **at most 20 posts per calendar month** (Metricool free plan).
Each run creates **at most one** post. Do not create, edit or delete anything else in Metricool.

## 1. Setup
- Attach `hassaanalalosy-ctrl/creativia-content` with push access (add_repo) and `git clone --depth 1` it to `/home/claude/creativia-content`.
- Read `guide/CONTENT_GUIDE.md`, `log/posted.md` and `log/schedule.json`.
- Load the Metricool tools with ToolSearch (query "metricool"). Brand/blog id: **7656023**, timezone Asia/Baghdad.

## 2. Pick the slot (or stop)
- Slot days: every date whose day-of-month is NOT divisible by 3 (1, 2, 4, 5, 7, 8, ...).
- Starting from tomorrow (Baghdad date), walk forward up to 7 days and take the first slot day that is not already a key in `log/schedule.json` and whose month has fewer than 20 entries in `log/schedule.json`.
- If there is no such slot, stop: reply "No slot to fill" and end the run without changes.

## 3. Make the post
- Research and choose a topic exactly as the content guide says (web search + page fetches; verify facts in 2 sources).
- Write `posts/<id>/spec.json` (id = `<slot date>-<short-slug>`), following the guide's structure, voice and credit rules. Default 6 to 7 slides.
- Commit "Post spec: <slug>" and push to main. The GitHub Action "Render slides" renders it.
- Poll every 15 seconds (`git fetch origin main`) for up to 8 minutes until `posts/<id>/rendered.json` or `posts/<id>/render-error.json` exists on origin/main, then `git reset --hard origin/main`.
- If render-error.json appears (usually a bad image URL): replace the failing image URL in the spec with another credited image of the same work, delete render-error.json, push again and wait again. Give up after 2 attempts: delete the post folder, push, and reply with the error.
- Open every rendered slide image with the Read tool and check it: text not cut off, no overlapping elements, images loaded, numbers in English digits, credits present. If something is wrong, fix the spec and re-render (delete rendered.json, push).

## 4. Put it in Metricool
Call createScheduledPost with blogId 7656023, date `<slot>T21:00:00+03:00`, and info:
- `media`: the raw URLs `https://raw.githubusercontent.com/hassaanalalosy-ctrl/creativia-content/main/posts/<id>/slides/NN.png` in order
- `providers`: `[{"network":"instagram"}]` — Instagram only. On the free plan every network counts as a separate post, so adding Facebook would halve the 20 posts.
- `instagramData`: `{"type":"POST"}`
- `text`: the caption; `publicationDate`: `{"dateTime":"<slot>T21:00:00","timezone":"Asia/Baghdad"}`
- **Trial period (until the owner says otherwise): `"draft": true, "autoPublish": true`** — the owner reviews each draft in the Metricool app and schedules it; once scheduled it publishes automatically.

### Replacing images of an existing post
GitHub's raw links on `main` are cached for a few minutes, so after a re-render never reuse the `main` URL. Use the commit that holds the new image: `git log -1 --format=%H -- posts/<id>/slides/NN.png`, then `https://raw.githubusercontent.com/hassaanalalosy-ctrl/creativia-content/<that sha>/posts/<id>/slides/NN.png`. Download it once and compare it with the local file before sending it to Metricool.

## 5. Record and clean up
- Add `"<slot>": "<id>"` to `log/schedule.json` and a line to `log/posted.md`: `- <slot> · <category> · <Arabic one-line topic> · <id>`.
- Delete `posts/*/slides` folders of posts whose slot date is more than 30 days ago (Metricool keeps its own copy).
- Commit "Schedule <id>" and push.

## 6. Reply (this is what the owner sees in the notification)
Two or three lines in Arabic: the slot date, the topic, number of slides, and the Metricool planner link from the createScheduledPost response.
