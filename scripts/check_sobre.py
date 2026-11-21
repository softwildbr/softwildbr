"""Checks de navegação, identidade e responsividade — página Sobre da Soft Wild.
Executar: python3 scripts/check_sobre.py (Playwright com Google Chrome/Chromium).
Somente leitura: escreve capturas em sobre-capturas/ para inspeção do PR.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from threading import Thread
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
docs = root / "docs"
page_file = docs / "sobre" / "index.html"
css_file = docs / "sobre" / "sobre.css"
html = page_file.read_text(encoding="utf-8")
css = css_file.read_text(encoding="utf-8")
assert html.count("<h1") == 1
assert html.count('class="sobre-territory"') == 4
assert html.count('class="sobre-value"') == 4
assert html.count("Se for pra fazer mais do mesmo, agente nem faz.") == 1
assert 'href="../#manifesto"' in html
assert 'href="../produtos/"' in html
assert 'href="../ideias/"' in html
assert 'href="../laboratorio/"' in html
assert 'href="../sobre/" aria-current="page"' in html
assert "não significam que todos os agentes de IA estejam implantados" in html
assert "Não esperamos um briefing para ter uma ideia." in html
assert "solicite orçamento" not in html.lower()
assert "@media(max-width:520px)" in css

for relative in ("produtos", "ideias", "pesquisas", "laboratorio"):
    source = (docs / relative / "index.html").read_text(encoding="utf-8")
    assert source.count('<a href="../sobre/">Sobre</a>') == 2, relative
    assert '<a href="../#manifesto">Manifesto</a>' in source, relative

captures = root / "sobre-capturas"
captures.mkdir(exist_ok=True)
handler = partial(SimpleHTTPRequestHandler, directory=str(docs))
with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as pw:
    Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    executable = which("google-chrome") or which("chromium")
    browser = pw.chromium.launch(executable_path=executable) if executable else pw.chromium.launch()
    for width in (320, 360, 390, 768, 800, 1024, 1100, 1440, 1920):
        page = browser.new_page(viewport={"width": width, "height": 900},
                                reduced_motion="reduce", has_touch=width <= 768)
        errors, failures = [], []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("response", lambda response: failures.append((response.status, response.url)) if response.status >= 400 and response.url.startswith(base) else None)
        response = page.goto(f"{base}/sobre/", wait_until="networkidle")
        assert response.status == 200, (width, response.status)
        page.wait_for_selector("html.sw-enhanced")
        assert page.locator("h1").inner_text() == "A gente prefere fazer."
        assert page.locator(".sobre-territory").count() == 4
        assert page.locator(".sobre-value").count() == 4
        assert page.locator('[aria-current="page"]').count() == 2
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), (width, "horizontal scroll")
        assert not failures and not errors, (width, failures, errors)

        page.screenshot(path=captures / f"sobre-{width}-hero.png")
        if width in (390, 1440):
            page.locator("#o-que-inventamos").scroll_into_view_if_needed()
            page.screenshot(path=captures / f"sobre-{width}-territorios.png")
            page.locator("#acreditamos").scroll_into_view_if_needed()
            page.screenshot(path=captures / f"sobre-{width}-principios.png")

        if width <= 768:
            menu = page.locator("[data-sw-menu]")
            assert menu.is_visible(), width
            menu.click()
            assert menu.get_attribute("aria-expanded") == "true"
            assert page.locator('[data-sw-nav] a[href="../sobre/"]').is_visible()
            assert page.locator('[data-sw-nav] a[href="../produtos/"]').is_visible()
            menu.click()
            assert menu.get_attribute("aria-expanded") == "false"
        else:
            assert page.locator("[data-sw-nav]").is_visible()

        # As âncoras direcionam às seções com conteúdo.
        for anchor in ("quem-somos", "o-que-inventamos", "acreditamos", "gente-maquinas", "manifesto"):
            assert page.locator(f"#{anchor}").count() == 1, (width, anchor)
        page.close()

    # O texto estático e todos os CTAs continuam utilizáveis sem scripts.
    page = browser.new_page(java_script_enabled=False, viewport={"width": 390, "height": 844})
    response = page.goto(f"{base}/sobre/", wait_until="networkidle")
    assert response.status == 200
    assert page.locator("h1").inner_text() == "A gente prefere fazer."
    assert page.locator(".sobre-value").count() == 4
    assert page.locator('footer a[href="../#manifesto"]').count() == 1
    page.close()

    # Todos os destinos internos publicados são realmente servidos pelo site.
    page = browser.new_page()
    for route in ("", "produtos/", "ideias/", "pesquisas/", "laboratorio/", "sobre/"):
        response = page.goto(f"{base}/{route}", wait_until="domcontentloaded")
        assert response.status == 200, (route, response.status)
    page.close()
    browser.close()
    server.shutdown()

print("OK: Sobre / 9 tamanhos / 4 territórios / 4 princípios / menu mobile / no-JS / 6 URLs internas.")
