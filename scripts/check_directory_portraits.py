"""Check directory portrait framing and capture the twenty rendered portraits."""
import argparse
import io
import shutil
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from PIL import Image, ImageDraw
from playwright.sync_api import expect, sync_playwright


WIDTHS = (320, 360, 390, 430, 600, 601, 768, 800, 801, 1024, 1440, 1920)
# Conservative upper hair boundaries in the 440×816 originals, in source pixels.
HAIR_TOP = {
    "ana-litica": 32, "zeca-escuta": 39, "jana-jornada": 48, "lia-layout": 62,
    "mara-movimento": 13, "beto-backend": 46, "andre-androide": 70, "zilda-firewall": 55,
    "orlando-orquestra": 49, "malu-multimodal": 47, "otto-matico": 49, "ciro-circuito": 42,
    "artur-encaixe": 50, "arlete-arte-final": 48, "nara-tiva": 49, "leo-loop": 36,
    "sonia-decibeis": 47, "priscila-prioridade": 22, "naldo-metricas": 45, "vivi-vitrine": 55,
}
SOURCE_EXCEPTIONS = ("malu-multimodal", "sonia-decibeis", "vivi-vitrine")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


@contextmanager
def local_site(docs):
    handler = partial(QuietHandler, directory=str(docs))
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        Thread(target=server.serve_forever, daemon=True).start()
        yield f"http://127.0.0.1:{server.server_port}/"
        server.shutdown()


def open_directory(page, url):
    response = page.goto(url, wait_until="domcontentloaded")
    assert response and response.ok, url
    page.locator("html.catalog-ready").wait_for()
    button = page.locator("#show-directory")
    expect(button).to_have_attribute("aria-expanded", "false")
    button.click()
    expect(button).to_have_attribute("aria-expanded", "true")
    directory = page.locator("#agent-directory")
    portraits = directory.locator(".directory-item img.directory-image")
    expect(portraits).to_have_count(20)
    # Decode all lazy images before collecting a single continuous directory capture.
    data = portraits.evaluate_all("""async images => {
      await Promise.all(images.map(img => {
        img.loading = 'eager';
        return img.decode();
      }));
      const directory = document.querySelector('#agent-directory').getBoundingClientRect();
      return images.map(img => {
        const rect = img.getBoundingClientRect();
        const card = img.closest('.directory-item').getBoundingClientRect();
        const css = getComputedStyle(img);
        return {
          asset: new URL(img.src).pathname,
          alt: img.alt,
          name: img.closest('.directory-item').querySelector('strong').textContent,
          source: [img.naturalWidth, img.naturalHeight],
          size: [rect.width, rect.height, card.width, card.height],
          fit: css.objectFit,
          position: css.objectPosition,
          relative: [rect.left - directory.left, rect.top - directory.top],
        };
      });
    }""")
    assert [Path(row["asset"]).stem for row in data] == list(HAIR_TOP)
    return directory, data


def check_framing(after, before, width):
    assert len(after) == 20
    side = 64 if width <= 600 else 74
    for portrait in after:
        asset = Path(portrait["asset"]).stem
        assert portrait["fit"] == "cover", asset
        assert portrait["size"][:2] == [side, side], (width, asset, portrait["size"])
        source_width, source_height = portrait["source"]
        assert source_width > 0 and source_height > source_width, asset
        x, y = portrait["position"].split()
        assert x == "50%", asset
        crop_top = (source_height - source_width) * float(y.removesuffix("%")) / 100
        assert crop_top < HAIR_TOP[asset], (width, asset, crop_top, HAIR_TOP[asset])
    if before:
        for old, new in zip(before, after, strict=True):
            for field in ("asset", "alt", "name", "source", "size", "fit"):
                assert old[field] == new[field], (width, new["name"], field, old[field], new[field])


def write_contact_sheet(destination, after, old=None):
    sample_size = 74
    after_png, after_data = after
    before_image, before_data = (Image.open(io.BytesIO(old[0])), old[1]) if old else (None, [])
    after_image = Image.open(io.BytesIO(after_png))
    result = Image.new("RGB", (900, 5 * 112 + 34), "#ffffff")
    draw = ImageDraw.Draw(result)
    draw.text((12, 9), "Diretório · antes à esquerda, depois à direita" if old else "Diretório · depois",
              fill="#222222")

    def paste(image, row, x, y):
        left, top = map(round, row["relative"])
        width, height = map(round, row["size"][:2])
        result.paste(image.crop((left, top, left + width, top + height)), (x, y))

    for index, row in enumerate(after_data):
        x, y = 12 + index % 4 * 225, 32 + index // 4 * 112
        draw.text((x, y), row["name"], fill="#222222")
        if before_image:
            paste(before_image, before_data[index], x, y + 18)
        paste(after_image, row, x + sample_size + 6 if old else x, y + 18)
        if Path(row["asset"]).stem in SOURCE_EXCEPTIONS:
            draw.text((x, y + 94), "Corte no arquivo original", fill="#773c2a")
    result.save(destination)


def capture(directory, output):
    # Screenshots keep the browser viewport's CSS-pixel dimensions.
    return directory.screenshot(path=output, animations="disabled", scale="css")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", choices=("chromium", "webkit"), default="chromium")
    parser.add_argument("--baseline-docs", type=Path)
    parser.add_argument("--captures", default="retratos-capturas", type=Path)
    args = parser.parse_args()
    docs = Path(__file__).resolve().parents[1] / "docs"
    output = args.captures / args.browser
    output.mkdir(parents=True, exist_ok=True)
    for asset in SOURCE_EXCEPTIONS:
        shutil.copyfile(docs / "assets/agents/cards" / f"{asset}.webp", output / f"original-{asset}.webp")

    with local_site(docs) as url, local_site(args.baseline_docs or docs) as old_url, sync_playwright() as pw:
        engine = getattr(pw, args.browser)
        executable = (shutil.which("google-chrome") or shutil.which("chromium")) if args.browser == "chromium" else None
        browser = engine.launch(executable_path=executable)
        print(f"{args.browser} {browser.version}", flush=True)
        for width in WIDTHS:
            with browser.new_context(viewport={"width": width, "height": 900},
                                     reduced_motion="reduce") as context:
                page = context.new_page()
                directory, after = open_directory(page, url)
                image = capture(directory, output / f"depois-{width}.png" if width in (390, 1440) else None)
                old = None
                if args.baseline_docs:
                    base_page = context.new_page()
                    old_directory, before = open_directory(base_page, old_url)
                    old_image = capture(old_directory, output / f"antes-{width}.png" if width in (390, 1440) else None)
                    old = (old_image, before)
                check_framing(after, old[1] if old else None, width)
                write_contact_sheet(output / f"retratos-{width}.png", (image, after), old)
            print(f"{width}px: 20 retratos conferidos", flush=True)
        browser.close()


if __name__ == "__main__":
    main()
