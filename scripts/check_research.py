"""Smoke test: biblioteca de Pesquisas da Soft Wild.
Executar: python3 scripts/check_research.py
Requer: playwright e Chrome/Chromium. Não altera nenhum arquivo do site.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from threading import Thread
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
docs = root / "docs"
captures = root / "research-capturas"
captures.mkdir(exist_ok=True)
handler = partial(SimpleHTTPRequestHandler, directory=str(docs))

page_html = (docs / "pesquisas" / "index.html").read_text(encoding="utf-8")
assert '<h1 id="sw-title">Onde a curiosidade nos leva.</h1>' in page_html
assert page_html.count('<article class="sw-card') == 10
assert page_html.count('<details class="sw-details"') == 10
assert 'github.com/softwildbr/pesquisas' not in page_html
assert 'href="../produtos/"' in page_html
assert 'href="../ideias/"' in page_html

with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as pw:
    Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    chrome = which("google-chrome") or which("chromium")
    browser = pw.chromium.launch(executable_path=chrome) if chrome else pw.chromium.launch()
    for width in (320, 360, 390, 768, 1440, 1920):
        page = browser.new_page(viewport={"width": width, "height": 900},
                                reduced_motion="reduce", has_touch=width <= 768)
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        missing = []
        page.on("response", lambda r: missing.append(r.url) if r.status >= 400 and r.url.startswith(base) else None)
        response = page.goto(f"{base}/pesquisas/", wait_until="networkidle")
        assert response.status == 200, (width, response.status)
        page.wait_for_selector("html.sw-enhanced")
        assert page.locator("h1").count() == 1
        assert page.locator(".sw-card").count() == 10
        assert page.locator(".sw-card:not([hidden])").count() == 10
        assert page.locator("[data-sw-results]").inner_text() == "10 resultados"
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), (width, "horizontal overflow")
        assert not missing, (width, missing)
        assert not errors, (width, errors)
        page.screenshot(path=captures / f"pesquisas-{width}-hero.png")

        page.locator("[data-sw-search]").fill("Interação humano–máquina")
        assert page.locator(".sw-card:not([hidden])").count() == 1, (width, "search")
        page.locator("[data-sw-search]").fill("")
        page.locator('[data-sw-filter="tecnologia"]').click()
        filtered_count = page.locator(".sw-card:not([hidden])").count()
        assert 0 < filtered_count < 10, (width, "category filter")
        page.locator('[data-sw-filter="todos"]').click()
        page.locator("[data-sw-stage]").select_option("piloto")
        assert page.locator(".sw-card:not([hidden])").count() == 2, (width, "phase filter")
        page.locator("[data-sw-stage]").select_option("todos")
        assert page.locator(".sw-card:not([hidden])").count() == 10
        page.screenshot(path=captures / f"pesquisas-{width}-catalogo.png",
                        full_page=width in (390, 1440))

        if width <= 768:
            toggle = page.locator("[data-sw-menu]")
            assert toggle.is_visible()
            toggle.click()
            assert toggle.get_attribute("aria-expanded") == "true"
            assert page.locator('[data-sw-nav] a[href="../pesquisas/"]').is_visible()
            toggle.click()
            assert toggle.get_attribute("aria-expanded") == "false"
        else:
            assert page.locator("[data-sw-nav]").is_visible()
        page.close()

    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/pesquisas/#hardware-maker", wait_until="networkidle")
    page.wait_for_selector("html.sw-enhanced")
    assert page.locator("#hardware-maker details").evaluate("(el) => el.open")
    page.close()

    page = browser.new_page(java_script_enabled=False, viewport={"width": 390, "height": 844})
    page.goto(f"{base}/pesquisas/", wait_until="networkidle")
    assert page.locator(".sw-card").count() == 10
    assert not page.locator("[data-sw-search]").is_visible()
    page.locator(".sw-card").first.locator("summary").click()
    assert page.locator(".sw-card").first.locator("details").evaluate("(el) => el.open")
    page.close()

    browser.close()
    server.shutdown()

print("OK: Pesquisas 10/10, busca, 4 filtros, fases, links, menu, âncoras, sem JS, Chrome 6 larguras.")
