"""Download images for a post into posts/<id>/img/ (runs in GitHub Actions, which has open internet).
Reads posts/<id>/images.json: a list of entries, each with "name" and one of
  {"wiki": "Page_title"}                      -> the page's main image on English Wikipedia
  {"file": "File:Name.jpg", "site": "en.wikipedia.org"} -> one file page (any MediaWiki site)
  {"search": "query", "site": "gta.fandom.com", "n": 4}   -> top n File: search hits, saved as name-1..n
  {"url": "https://..."}                     -> direct download
Writes posts/<id>/img/index.json with what was saved and where it came from.
Usage: python3 scripts/fetch_images.py <post-id>
"""
import json, os, sys, urllib.parse, urllib.request

UA = {"User-Agent": "CreativiaBot/1.0 (https://instagram.com/creativia.mag)"}


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(), r.headers.get("content-type", "")


def api(site, **params):
    params.update(format="json", formatversion="2")
    path = "/w/api.php" if "wikipedia" in site or "wikimedia" in site else "/api.php"
    data, _ = get("https://" + site + path + "?" + urllib.parse.urlencode(params))
    return json.loads(data)


def file_url(site, title):
    q = api(site, action="query", titles=title, prop="imageinfo", iiprop="url|size")
    pages = q.get("query", {}).get("pages", [])
    if pages and pages[0].get("imageinfo"):
        return pages[0]["imageinfo"][0]["url"]
    return None


def save(out, name, url, index, src):
    data, ctype = get(url)
    ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower() or ".jpg"
    if ext not in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"):
        ext = ".png" if "png" in ctype else ".jpg"
    fn = name + ext
    with open(os.path.join(out, fn), "wb") as f:
        f.write(data)
    index.append({"name": name, "file": fn, "url": url, "source": src, "bytes": len(data)})
    print("saved", fn, len(data), url)


def main():
    pid = sys.argv[1]
    root = os.path.join(os.path.dirname(__file__), "..", "posts", pid)
    entries = json.load(open(os.path.join(root, "images.json"), encoding="utf-8"))
    out = os.path.join(root, "img")
    os.makedirs(out, exist_ok=True)
    index = []
    for e in entries:
        name = e["name"]
        try:
            if "url" in e:
                save(out, name, e["url"], index, e["url"])
            elif "wiki" in e:
                site = e.get("site", "en.wikipedia.org")
                q = api(site, action="query", titles=e["wiki"], prop="pageimages", piprop="original", redirects=1)
                pg = q["query"]["pages"][0]
                url = pg.get("original", {}).get("source")
                if url:
                    save(out, name, url, index, "https://%s/wiki/%s" % (site, e["wiki"]))
                else:
                    print("no page image for", e["wiki"])
            elif "file" in e:
                site = e.get("site", "en.wikipedia.org")
                url = file_url(site, e["file"])
                if url:
                    save(out, name, url, index, "https://%s/wiki/%s" % (site, e["file"]))
                else:
                    print("file not found", e["file"])
            elif "search" in e:
                site = e.get("site", "en.wikipedia.org")
                q = api(site, action="query", list="search", srsearch=e["search"], srnamespace=6, srlimit=e.get("n", 4))
                for i, hit in enumerate(q.get("query", {}).get("search", []), 1):
                    url = file_url(site, hit["title"])
                    if url:
                        save(out, "%s-%d" % (name, i), url, index, "https://%s/wiki/%s" % (site, hit["title"]))
        except Exception as ex:  # keep going; the index shows what is missing
            print("failed", name, ex)
    json.dump(index, open(os.path.join(out, "index.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
