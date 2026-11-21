"""Regressão de teclado, menu em paisagem e navegação sem JavaScript nas seis rotas."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from threading import Thread

from playwright.sync_api import expect, sync_playwright


ROUTES = ("", "produtos/", "ideias/", "pesquisas/", "laboratorio/", "sobre/")


def check_menu(page, url, *, enhanced):
    page.goto(url, wait_until="domcontentloaded")
    menu = page.locator("#menu-toggle, [data-sw-menu]")
    links = page.locator("#main-nav a, [data-sw-nav] a")
    if enhanced:
        menu.press("Enter")
        expect(menu).to_have_attribute("aria-expanded", "true")
    else:
        expect(menu).to_be_hidden()
        links.first.focus()

    for index, link in enumerate(links.all()):
        if enhanced or index:
            page.keyboard.press("Tab")
        expect(link).to_be_focused()
        expect(link).to_be_in_viewport()

    if enhanced:
        page.keyboard.press("Escape")
        expect(menu).to_be_focused()
        expect(menu).to_have_attribute("aria-expanded", "false")
        menu.tap()

    destination = links.last.evaluate("link => link.href")
    links.last.tap()
    expect(page).to_have_url(destination)


def check_filter_reset(page, url):
    page.goto(url, wait_until="domcontentloaded")
    search = page.locator("[data-sw-search]")
    cards = page.locator(".sw-card[data-category]:visible")
    count = cards.count()
    search.fill("zzsemresultadowork07")
    expect(cards).to_have_count(0)
    page.locator("[data-sw-clear]").press("Enter")
    expect(search).to_be_focused()
    expect(cards).to_have_count(count)


if __name__ == "__main__":
    docs = Path(__file__).resolve().parents[1] / "docs"
    handler = partial(SimpleHTTPRequestHandler, directory=str(docs))
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as pw:
        Thread(target=server.serve_forever, daemon=True).start()
        browser = pw.chromium.launch(executable_path=which("google-chrome") or which("chromium"))
        base = f"http://127.0.0.1:{server.server_port}/"
        for enhanced in (True, False):
            context = browser.new_context(
                viewport={"width": 568, "height": 320}, has_touch=True,
                device_scale_factor=3, java_script_enabled=enhanced, reduced_motion="reduce",
            )
            for route in ROUTES:
                page = context.new_page()
                check_menu(page, base + route, enhanced=enhanced)
                if enhanced and route in ("produtos/", "ideias/", "pesquisas/", "laboratorio/"):
                    check_filter_reset(page, base + route)
                page.close()
            context.close()
        browser.close()
        server.shutdown()
