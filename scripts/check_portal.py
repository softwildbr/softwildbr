"""Verificação visual e interativa das páginas internas Soft Wild.
Sem alterações na Home, sem publicação e sem dados externos.
Executar: python3 scripts/check_portal.py (requer Playwright e Chrome/Chromium).
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from threading import Thread
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
docs = root / "docs"
capture = root / "portal-capturas"
capture.mkdir(exist_ok=True)
handler = partial(SimpleHTTPRequestHandler, directory=str(docs))

expectations = {
    "produtos": {"count": 15, "heading": "Coisas que estamos construindo.", "query": "Retrozim", "item": "retrozim-launcher", "filter": "midia"},
    "ideias": {"count": 9, "heading": "E se a gente fizesse isso?", "query": "universos", "item": "sites-universos-ficcionais", "filter": "comunidades"},
}

with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as pw:
    Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    chrome = which("google-chrome") or which("chromium")
    browser = pw.chromium.launch(executable_path=chrome) if chrome else pw.chromium.launch()

    for key, expected in expectations.items():
        for width in (320, 390, 768, 1440, 1920):
            page = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="reduce", has_touch=width <= 768)
            errors = []
            page.on("pageerror", lambda err: errors.append(str(err)))
            response = page.goto(f"{base}/{key}/", wait_until="networkidle")
            assert response.status == 200, (key, width, response.status)
            page.wait_for_selector("html.sw-enhanced")
            assert page.locator("h1").count() == 1
            assert page.locator("h1").inner_text() == expected["heading"]
            assert page.locator(".sw-card").count() == expected["count"]
            assert page.locator(".sw-details").count() == expected["count"]
            assert page.locator("[data-sw-results]").inner_text() == f'{expected["count"]} resultados'
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), (key, width, "horizontal overflow")
            assert not errors, (key, width, errors)

            page.screenshot(path=capture / f"{key}-{width}-hero.png")
            page.locator("[data-sw-search]").fill(expected["query"])
            assert page.locator(".sw-card:not([hidden])").count() == 1, (key, width, "search")
            page.locator("[data-sw-search]").fill("")
            page.locator(f'[data-sw-filter="{expected["filter"]}"]').click()
            current = page.locator(".sw-card:not([hidden])").count()
            assert 0 < current < expected["count"], (key, width, current)
            page.locator('[data-sw-filter="todos"]').click()
            assert page.locator(".sw-card:not([hidden])").count() == expected["count"]
            page.screenshot(path=capture / f"{key}-{width}-catalog.png")

            if width <= 768:
                toggle = page.locator("[data-sw-menu]")
                assert toggle.is_visible()
                toggle.click()
                assert toggle.get_attribute("aria-expanded") == "true"
                assert page.locator("[data-sw-nav]").is_visible()
                toggle.click()
                assert toggle.get_attribute("aria-expanded") == "false"
            else:
                assert page.locator("[data-sw-nav]").is_visible()
            page.close()

        page = browser.new_page(viewport={"width": 390, "height": 844})
        page.goto(f"{base}/{key}/#{expected['item']}", wait_until="networkidle")
        page.wait_for_selector("html.sw-enhanced")
        assert page.locator(f"#{expected['item']} details").evaluate("(el) => el.open")
        page.close()

        page = browser.new_page(java_script_enabled=False, viewport={"width": 390, "height": 844})
        page.goto(f"{base}/{key}/", wait_until="networkidle")
        assert page.locator(".sw-card").count() == expected["count"]
        assert not page.locator("[data-sw-search]").is_visible()
        card = page.locator(".sw-card").first
        card.locator("summary").click()
        assert card.locator("details").evaluate("(el) => el.open")
        page.close()

    browser.close()
    server.shutdown()
print("OK: Produtos (15), Ideias (9), busca, categorias, detalhes, âncoras, menu, no-JS e 5 larguras.")
