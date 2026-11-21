"""Check the twenty directory cards, their images and profile interactions."""
import argparse
import io
import json
import shutil
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageStat
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
        const card = img.closest('.directory-item');
        const copy = card.querySelector('.directory-copy');
        const copyBox = copy.getBoundingClientRect();
        const cardBox = card.getBoundingClientRect();
        const css = getComputedStyle(img);
        return {
          asset: new URL(img.src).pathname,
          alt: img.alt,
          name: card.querySelector('h3, strong').textContent,
          source: [img.naturalWidth, img.naturalHeight],
          size: [rect.width, rect.height],
          gap: copyBox.left - rect.right,
          inset: cardBox.right - copyBox.right,
          copyOverflow: copy.scrollWidth - copy.clientWidth,
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
    portrait_width = 74 if width <= 360 else 84 if width <= 800 else 88
    for portrait in after:
        asset = Path(portrait["asset"]).stem
        assert portrait["fit"] == "cover", asset
        assert portrait["size"] == [portrait_width, 1.5 * portrait_width], (width, asset, portrait["size"])
        assert portrait["gap"] > 0 and portrait["inset"] > 0, (width, asset, "texto à direita")
        assert portrait["copyOverflow"] <= 1, (width, asset, "texto extravasou o card")
        source_width, source_height = portrait["source"]
        assert source_width > 0 and source_height > source_width, asset
        x, y = portrait["position"].split()
        assert x == "50%", asset
        visible_height = source_width * portrait["size"][1] / portrait["size"][0]
        crop_top = (source_height - visible_height) * float(y.removesuffix("%")) / 100
        assert crop_top < HAIR_TOP[asset], (width, asset, crop_top, HAIR_TOP[asset])
    if before:
        for old, new in zip(before, after, strict=True):
            for field in ("asset", "alt", "name", "source", "fit"):
                assert old[field] == new[field], (width, new["name"], field, old[field], new[field])


def write_contact_sheet(destination, after, old=None):
    after_png, after_data = after
    before_image, before_data = (Image.open(io.BytesIO(old[0])), old[1]) if old else (None, [])
    after_image = Image.open(io.BytesIO(after_png))
    result = Image.new("RGB", (900, 5 * 174 + 35), "#ffffff")
    draw = ImageDraw.Draw(result)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 14)
    except OSError:
        font = ImageFont.load_default(size=14)
    draw.text((12, 9), "Diretório · antes à esquerda, depois à direita" if old else "Diretório · depois",
              fill="#222222", font=font)

    def paste(image, row, x, y):
        left, top = map(round, row["relative"])
        width, height = map(round, row["size"][:2])
        result.paste(image.crop((left, top, left + width, top + height)), (x, y))

    for index, row in enumerate(after_data):
        x, y = 12 + index % 4 * 225, 32 + index // 4 * 174
        draw.text((x, y), row["name"], fill="#222222", font=font)
        if before_image:
            paste(before_image, before_data[index], x, y + 18)
        paste(after_image, row, x + 82 if old else x, y + 18)
        if Path(row["asset"]).stem in SOURCE_EXCEPTIONS:
            draw.text((x, y + 151), "Corte no arquivo original", fill="#773c2a", font=font)
    result.save(destination)


def capture(directory, output):
    # Screenshots keep the browser viewport's CSS-pixel dimensions.
    return directory.screenshot(path=output, animations="disabled", scale="css")


def check_interactions(page, groups):
    directory = page.locator("#agent-directory")
    profiles = directory.locator("article")
    names = [person["name"] for group in groups for person in group["agents"]]
    expect(profiles.locator("h3")).to_have_text(names)
    expect(profiles.locator(".directory-label")).to_have_text(["Agente de IA"] * len(names))
    expect(profiles.locator("button")).to_have_count(len(names))

    select = page.locator("#agent-area")
    for index, group in enumerate(groups):
        select.select_option(str(index))
        expect(profiles.locator("h3")).to_have_text([person["name"] for person in group["agents"]])
        expect(profiles.locator(".directory-role")).to_have_text([person["role"] for person in group["agents"]])
        expect(profiles.locator(".directory-description")).to_have_text([person["description"] for person in group["agents"]])

    name = groups[-1]["agents"][0]["name"]
    action = directory.get_by_role("button", name=f"Conhecer o trabalho de {name}", exact=True)
    action.press("Enter")
    dialog = page.locator("#detail-dialog")
    expect(dialog).to_be_visible()
    expect(dialog.get_by_role("heading", name=name, exact=True)).to_be_visible()
    page.keyboard.press("Escape")
    expect(dialog).to_be_hidden()
    expect(action).to_be_focused()

    select.select_option("todos")
    expect(profiles).to_have_count(20)
    page.locator("#show-directory").press("Enter")
    expect(directory).to_be_hidden()


def check_legacy(page, base_page, output, width):
    legacy = page.locator("#legacy-grid")
    old_legacy = base_page.locator("#legacy-grid")
    expect(legacy.locator("article")).to_have_count(19)
    assert legacy.inner_html() == old_legacy.inner_html(), (width, "conteúdo dos descontinuados")
    base_page.locator("#show-directory").click()
    label = "Agente descontinuado: Dona Horária"
    old_card = old_legacy.get_by_role("article", name=label)
    new_card = legacy.get_by_role("article", name=label)
    for card in (old_card, new_card):
        card.locator("img").evaluate_all("""async images => {
          await Promise.all(images.map(img => {
            img.loading = 'eager';
            return img.decode();
          }));
        }""")
    before = capture(old_card, output / f"descontinuados-antes-{width}.png")
    after = capture(new_card, output / f"descontinuados-depois-{width}.png")
    with Image.open(io.BytesIO(before)) as old, Image.open(io.BytesIO(after)) as new:
        assert old.size == new.size
        difference = ImageChops.difference(old.convert("RGB"), new.convert("RGB"))
        # Tiny rasterization differences can occur when the card moves by a subpixel.
        assert max(ImageStat.Stat(difference).mean) < 0.75, (width, label)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", choices=("chromium", "webkit"), default="chromium")
    parser.add_argument("--baseline-docs", type=Path)
    parser.add_argument("--captures", default="retratos-capturas", type=Path)
    args = parser.parse_args()
    docs = Path(__file__).resolve().parents[1] / "docs"
    groups = json.loads((docs / "data/content.json").read_text())["groups"]
    output = args.captures / args.browser
    output.mkdir(parents=True, exist_ok=True)
    for asset in SOURCE_EXCEPTIONS:
        shutil.copyfile(docs / "assets/agents" / f"{asset}.webp", output / f"original-{asset}.webp")

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
                if width in (390, 1440):
                    check_interactions(page, groups)
                    if args.baseline_docs:
                        check_legacy(page, base_page, output, width)
            print(f"{width}px: 20 cards do diretório conferidos", flush=True)
        browser.close()


if __name__ == "__main__":
    main()
