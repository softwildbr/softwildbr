"""Exercise the public catalogue in desktop and mobile Chrome viewports."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from threading import Thread

from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
out = root / "capturas"
out.mkdir(exist_ok=True)
handler = partial(SimpleHTTPRequestHandler, directory=str(root / "docs"))
with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as pw:
    Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_port}/"
    browser = pw.chromium.launch(executable_path=which("google-chrome") or which("chromium"))
    for width in (320, 390, 768, 1440):
        mobile = width < 800
        page = browser.new_page(viewport={"width": width, "height": 900}, has_touch=mobile,
                                reduced_motion="reduce")
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("console", lambda msg: errors.append(msg.text)
                if msg.type == "error" and "Soft Wild" in msg.text else None)
        page.route("https://upload.wikimedia.org/**", lambda route: route.abort())
        page.goto(url)
        for name in ("Google Flow", "Epidemic Sound"):
            fallback = page.locator(".wordmark-name").filter(has_text=name).first
            assert fallback.is_visible(), name
        page.wait_for_selector("html.catalog-ready")
        for selector, count in [("#track-prototypes article", 15), ("#track-futures article", 8),
                                ("#research-grid article", 10), ("#track-agents article", 20)]:
            assert page.locator(selector).count() == count, selector
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), width
        page.screenshot(path=out / f"abertura-{width}.png")
        if mobile:
            menu = page.locator("#menu-toggle")
            menu.tap()
            assert menu.get_attribute("aria-expanded") == "true"
            page.locator('#main-nav a[href="#explorar"]').tap()
        page.locator("#catalog-view").click()
        assert page.locator("#explorar").evaluate("e => e.classList.contains('catalog-list')")
        page.screenshot(path=out / f"catalogo-{width}.png")
        for query, target, detail in [("Arquivos", "track-prototypes", "Ver informações de Arquivos"),
                                      ("Lia Layout", "track-agents", "Ver a descrição completa de Lia Layout")]:
            search = page.locator("#site-search")
            search.fill(query)
            search.press("Enter")
            assert page.evaluate("document.activeElement.id") == target
            button = page.get_by_role("button", name=detail, exact=True)
            button.press("Enter")
            assert page.locator("dialog[open] h2").inner_text() == query
            page.screenshot(path=out / f"detalhe-{width}-{target}.png")
            page.keyboard.press("Escape")
            assert button.evaluate("e => e === document.activeElement")
        page.locator("#site-search").fill("zzzzzz")
        page.set_viewport_size({"width": width + 1, "height": 900})
        assert page.locator("#track-agents article").count() == 0
        page.locator("#site-search").fill("")
        page.add_style_tag(content="html { font-size: 200% !important }")
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
        assert page.locator("#powered-toggle").get_attribute("aria-pressed") == "true"
        assert not errors, errors
        page.close()
    for mode in ("sem-js", "falha-json"):
        page = browser.new_page(java_script_enabled=mode != "sem-js", viewport={"width":390,"height":844})
        if mode == "falha-json":
            page.route("**/data/content.json", lambda route: route.abort())
        page.goto(url)
        assert page.locator("#track-prototypes article").count() == 15
        assert page.locator("#research-grid article").count() == 10
        page.close()
    browser.close()
    server.shutdown()
