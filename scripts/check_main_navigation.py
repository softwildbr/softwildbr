"""Test the main menu at the GitHub Pages project prefix in Chromium or WebKit."""
import argparse
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from tempfile import TemporaryDirectory
from threading import Thread
from urllib.parse import urljoin, urlsplit

from playwright.sync_api import expect, sync_playwright


DESTINATIONS = (
    ("Início", ""), ("Produtos", "produtos/"), ("Ideias", "ideias/"),
    ("Pesquisas", "pesquisas/"), ("Laboratório", "laboratorio/"), ("Sobre", "sobre/"),
)
VIEWPORTS = (
    (320, 720), (360, 780), (390, 844), (430, 932), (568, 240),
    (768, 1024), (780, 1024), (800, 1024), (801, 1024), (1024, 768), (1440, 900),
)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


@contextmanager
def local_site():
    docs = Path(__file__).resolve().parents[1] / "docs"
    with TemporaryDirectory() as root:
        (Path(root) / "softwildbr").symlink_to(docs, target_is_directory=True)
        handler = partial(QuietHandler, directory=root)
        with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
            Thread(target=server.serve_forever, daemon=True).start()
            yield f"http://127.0.0.1:{server.server_port}/softwildbr/"
            server.shutdown()


def check_route(page, base, route, width, height, captures):
    source = urljoin(base, route)
    response = page.goto(source, wait_until="domcontentloaded")
    assert response and response.ok, source
    page.locator("html:is(.nav-ready,.sw-enhanced)").wait_for()
    nav = page.locator("#main-nav, [data-sw-nav]")
    button = page.locator("#menu-toggle, [data-sw-menu]")
    links = nav.locator("a")
    expected_urls = [urljoin(base, path) for _, path in DESTINATIONS]
    mobile = width <= (780 if route else 800)

    expect(button).to_have_attribute("aria-controls", nav.get_attribute("id"))
    expect(links).to_have_text([label for label, _ in DESTINATIONS])
    assert links.evaluate_all("links => links.map(link => link.href)") == expected_urls
    current = nav.locator("[aria-current]")
    expect(current).to_have_count(1)
    expect(current).to_have_attribute("aria-current", "page")
    assert current.evaluate("link => link.href") == source

    if mobile:
        expect(nav).to_be_hidden()
        expect(button).to_have_attribute("aria-expanded", "false")
        button.tap()
        expect(button).to_have_attribute("aria-label", "Fechar menu")
        expect(nav).to_be_visible()
        button.tap()
        expect(nav).to_be_hidden()
        expect(button).to_have_attribute("aria-label", "Abrir menu")
        button.press("Enter")
        expect(button).to_have_attribute("aria-expanded", "true")
    else:
        expect(button).to_be_hidden()
        expect(nav).to_be_visible()
        links.first.focus()

    assert current.evaluate("(link, other) => getComputedStyle(link).color !== getComputedStyle(other).color",
                            nav.locator("a:not([aria-current])").first.element_handle())
    for index, link in enumerate(links.all()):
        if mobile or index:
            page.keyboard.press("Tab")
        expect(link).to_be_focused()
        expect(link).to_be_in_viewport()
    if (width, height) == (568, 240):
        assert nav.evaluate("e => e.scrollHeight > e.clientHeight && e.scrollTop > 0")
        expect(links.last).to_be_in_viewport(ratio=1)

    if (width, height) in ((390, 844), (568, 240), (1440, 900)):
        name = route.strip("/") or "home"
        if height != 240:
            page.evaluate("window.scrollTo(0,0)")
        page.screenshot(path=captures / f"{name}-{width}x{height}.png")

    if mobile:
        page.keyboard.press("Escape")
        expect(button).to_be_focused()
        expect(button).to_have_attribute("aria-expanded", "false")
        expect(nav).to_be_hidden()

    for index, destination in enumerate(expected_urls):
        if page.url != source:
            page.goto(source, wait_until="domcontentloaded")
            page.locator("html:is(.nav-ready,.sw-enhanced)").wait_for()
        if mobile:
            button.tap()
            expect(button).to_have_attribute("aria-expanded", "true")
            links.nth(index).tap()
        else:
            links.nth(index).click()
        expect(page).to_have_url(destination)
        expect(page.locator("nav[aria-label='Navegação principal'] [aria-current='page']")).to_have_attribute(
            "href", links_for_page(destination, base)
        )
        if mobile:
            expect(button).to_have_attribute("aria-expanded", "false")


def links_for_page(url, base):
    route = urlsplit(url).path.removeprefix(urlsplit(base).path)
    return f"../{route}" if route else "./"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", choices=("chromium", "webkit"), default="chromium")
    parser.add_argument("--base-url", help="Test a deployed site instead of the local files.")
    parser.add_argument("--captures", default="menu-capturas", type=Path)
    args = parser.parse_args()
    captures = args.captures / args.browser
    captures.mkdir(parents=True, exist_ok=True)

    with local_site() as local_base, sync_playwright() as pw:
        engine = getattr(pw, args.browser)
        executable = (which("google-chrome") or which("chromium")) if args.browser == "chromium" else None
        browser = engine.launch(executable_path=executable)
        base = (args.base_url.rstrip("/") + "/") if args.base_url else local_base
        print(f"{args.browser} {browser.version} · {base}", flush=True)
        for width, height in VIEWPORTS:
            with browser.new_context(viewport={"width": width, "height": height},
                                     has_touch=width <= 800, reduced_motion="reduce") as context:
                page = context.new_page()
                for _, route in DESTINATIONS:
                    check_route(page, base, route, width, height, captures)
            print(f"{width}×{height}: seis origens, seis destinos por origem", flush=True)
        browser.close()


if __name__ == "__main__":
    main()
