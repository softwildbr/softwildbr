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
    for width in (320, 390, 768, 1440, 1920):
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
        for selector, count in [("#track-prototypes article", 15), ("#track-futures article", 9),
                                ("#research-grid article", 10), ("#track-agents article", 20)]:
            assert page.locator(selector).count() == count, selector
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), width
        assert page.locator('.main').evaluate("el => parseFloat(getComputedStyle(el).paddingLeft) >= 24 || innerWidth > 800"), width
        page.locator('#como-trabalhamos').screenshot(path=out / f'trio-{width}.png')
        assert page.locator("#agent-dots").count() == 0
        assert page.locator("#legacy-grid .agent-card").count() == 19
        for list_id, expected in [("future-signals", [5, 10, 15, 16]), ("research-grid", [3, 6, 9, 10])]:
            button = page.locator(f'button[aria-controls="{list_id}"]')
            for index, count in enumerate(expected):
                if index:
                    button.click()
                assert page.locator(f"#{list_id} article:visible").count() == count
            assert button.is_hidden()
        if width == 390:
            for index, portrait in enumerate(page.locator("#legacy-grid article").all()):
                portrait.evaluate("""el => {
                    const track=el.parentElement;
                    track.scrollTo({left:track.scrollLeft+el.getBoundingClientRect().left-track.getBoundingClientRect().left-16,behavior:'instant'});
                }""")
                portrait.scroll_into_view_if_needed()
                assert portrait.evaluate("el => el.getBoundingClientRect().left >= -1 && el.getBoundingClientRect().right <= innerWidth + 1")
                portrait.locator(".agent-portrait").evaluate("img => img.decode()")
                portrait.screenshot(path=out / f"retrato-{index:02}.png")
            page.locator("#legacy-grid").evaluate("e => e.scrollTo({left:0,behavior:'instant'})")
        for name, selector in [("fundador", ".founder-photo img"), ("ativos", "#track-agents"), ("arquivo", "#legacy-grid")]:
            element = page.locator(selector)
            element.scroll_into_view_if_needed()
            if name == "fundador":
                element.evaluate("img => img.decode()")
                assert element.evaluate("img => Math.abs(img.clientHeight - img.clientWidth * img.naturalHeight / img.naturalWidth) < 2")
            else:
                element.locator("img").first.evaluate("img => img.decode()")
            element.screenshot(path=out / f"{name}-{width}.png")
        assert page.locator("#legacy-grid article").first.bounding_box()["height"] == page.locator("#track-agents article").first.bounding_box()["height"]
        page.locator("#legacy-grid button").first.click()
        assert "Por que saiu" in page.locator("dialog[open]").inner_text()
        page.keyboard.press("Escape")
        page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
        page.screenshot(path=out / f"abertura-{width}.png")
        if mobile:
            menu = page.locator("#menu-toggle")
            menu.tap()
            assert menu.get_attribute("aria-expanded") == "true"
            page.locator('#main-nav a[href="#explorar"]').tap()
        page.locator("#catalog-view").click()
        assert page.locator("#explorar").evaluate("e => e.classList.contains('catalog-list')")
        page.screenshot(path=out / f"catalogo-{width}.png")
        trigger = page.get_by_role("button", name="Pesquisar no site")
        assert trigger.bounding_box()["x"] > width / 2
        trigger.click()
        page.locator("#site-search").fill("Lia Layout")
        page.locator("#search-results").get_by_role("button", name="Lia Layout", exact=True).click()
        assert page.evaluate("document.activeElement.querySelector('h4').textContent") == "Lia Layout"
        assert "agente nem faz." in page.locator("#hero-title").inner_text().lower()
        assert page.locator(".insights-grid article p").count() == 16
        for query, target, detail in [("Arquivos", "track-prototypes", "Ver informações de Arquivos"),
                                      ("Lia Layout", "track-agents", "Ver a descrição completa de Lia Layout")]:
            button = page.get_by_role("button", name=detail, exact=True)
            button.press("Enter")
            assert page.locator("dialog[open] h2").inner_text() == query
            page.screenshot(path=out / f"detalhe-{width}-{target}.png")
            page.keyboard.press("Escape")
            assert button.evaluate("e => e === document.activeElement")
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

