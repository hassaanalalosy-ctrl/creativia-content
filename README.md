# creativia-content

Content system for @creativia.mag.

- `guide/` — content guide the daily task follows
- `engine/` — slide templates and renderer (1080 × 1350)
- `posts/<id>/spec.json` — a post; pushing it triggers the "Render slides" workflow, which writes `slides/*.png` and `rendered.json`
- `log/posted.md` — every published topic, so topics never repeat
