"""Smoke test da página Laboratório da Soft Wild.
Executar: python3 scripts/check_laboratorio.py (Playwright + Chrome/Chromium).
Não escreve arquivos do site, só capturas locais não versionadas.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from threading import Thread
from urllib.parse import unquote
import json
import re

from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
docs = root / "docs"
html_path = docs / "laboratorio" / "index.html"
markup = html_path.read_text(encoding="utf-8")
source = json.loads((docs / "data" / "content.json").read_text(encoding="utf-8"))
active = [a for group in source["groups"] for a in group["agents"]]
legacy = source["legacy_agents"]
assert len(active) == 20 and len(legacy) == 19, "Fonte de perfis não tem 20/19."
assert len(source["groups"]) == 8, "Esperados 8 grupos."
assert markup.count('class="sw-card lab-agent-card"') == 20
assert markup.count('class="lab-legacy-card"') == 19
assert markup.count('class="lab-team-group sw-section"') == 8
assert markup.count("<h1") == 1
assert 'href="../laboratorio/" aria-current="page"' in markup
assert "não 20 sistemas autônomos já instalados" in markup

images = re.findall(r'src="(\.\./assets/agents/cards/[^"]+)"', markup)
assert len(images) == 39 and len(set(images)) == 39
for path in images:
    target = docs / path.removeprefix("../")
    assert target.is_file() and target.stat().st_size > 0, f"Retrato inexistente: {target}"

captures = root / "laboratorio-capturas"
captures.mkdir(exist_ok=True)
handler = partial(SimpleHTTPRequestHandler, directory=str(docs))
with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as pw:
    Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    chrome = which("google-chrome") or which("chromium")
    browser = pw.chromium.launch(executable_path=chrome) if chrome else pw.chromium.launch()

    for width in (320, 360, 390, 768, 1440, 1920):
        page = browser.new_page(viewport={"width": width, "height": 900},
                                reduced_motion="reduce", has_touch=width <= 768)
        errors = []
        missing = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("response", lambda r: missing.append(r.url) if r.status >= 400 and r.url.startswith(base) else None)
        r = page.goto(f"{base}/laboratorio/", wait_until="networkidle")
        assert r.status == 200, (width, r.status)
        page.wait_for_selector("html.sw-enhanced")
        assert page.locator("h1").count() == 1
        assert page.locator(".lab-agent-card").count() == 20
        assert page.locator(".lab-legacy-card").count() == 19
        assert page.locator(".lab-team-group").count() == 8
        assert page.locator("[data-sw-results]").inner_text() == "20 resultados"
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), (width, "overflow")
        assert not errors and not missing, (width, errors, missing)

        page.screenshot(path=captures / f"laboratorio-{width}-hero.png")
        search = page.locator("[data-sw-search]")
        search.fill("Ana Lítica")
        assert page.locator(".lab-agent-card:not([hidden])").count() == 1, (width, "search")
        search.fill("")
        page.locator('[data-sw-filter="ia"]').click()
        assert page.locator(".lab-agent-card:not([hidden])").count() == 3, (width, "filter IA")
        assert page.locator(".lab-team-group:not([hidden])").count() == 1
        page.locator('[data-sw-filter="todos"]').click()
        assert page.locator(".lab-agent-card:not([hidden])").count() == 20
        assert page.locator(".lab-team-group:not([hidden])").count() == 8
        active_card = page.locator(".lab-agent-card").first
        active_card.locator("summary").click()
        assert active_card.locator("details").evaluate("(el) => el.open")
        active_card.locator("summary").click()

        if width in (390, 1440):
            page.locator("#equipe").scroll_into_view_if_needed()
            page.screenshot(path=captures / f"laboratorio-{width}-diretorio.png")
        if width <= 768:
            toggle = page.locator("[data-sw-menu]")
            assert toggle.is_visible()
            toggle.click()
            assert toggle.get_attribute("aria-expanded") == "true"
            assert page.locator('[data-sw-nav] a[href="../laboratorio/"]').is_visible()
            toggle.click()
            assert toggle.get_attribute("aria-expanded") == "false"
        else:
            assert page.locator("[data-sw-nav]").is_visible()

        archive = page.locator("#historias-descontinuadas")
        assert not archive.evaluate("(el) => el.open")
        archive.locator(":scope > summary").click()
        assert archive.evaluate("(el) => el.open")
        assert archive.locator(".lab-legacy-card").count() == 19
        archive.locator(".lab-legacy-card").first.locator("summary").click()
        assert archive.locator(".lab-legacy-card").first.locator("details").evaluate("(el) => el.open")
        assert not errors and not missing, (width, errors, missing)
        page.close()

    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/laboratorio/#agente-ana-litica", wait_until="networkidle")
    assert page.locator("#agente-ana-litica details").evaluate("(el) => el.open")
    page.goto(f"{base}/laboratorio/#descontinuado-oraculo-pereira", wait_until="networkidle")
    assert page.locator("#historias-descontinuadas").evaluate("(el) => el.open")
    assert page.locator("#descontinuado-oraculo-pereira details").evaluate("(el) => el.open")
    page.close()

    page = browser.new_page(java_script_enabled=False, viewport={"width": 390, "height": 844})
    page.goto(f"{base}/laboratorio/", wait_until="networkidle")
    assert page.locator(".lab-agent-card").count() == 20
    assert page.locator(".lab-legacy-card").count() == 19
    assert not page.locator("[data-sw-search]").is_visible()
    page.locator(".lab-agent-card").first.locator("summary").click()
    assert page.locator(".lab-agent-card").first.locator("details").evaluate("(el) => el.open")
    archive = page.locator("#historias-descontinuadas")
    archive.locator(":scope > summary").click()
    assert archive.evaluate("(el) => el.open")
    page.close()

    browser.close()
    server.shutdown()

print("OK: Laboratório 20 perfis, 19 históricos, 39 retratos, 8 áreas, busca, filtros, detalhes, arquivo, âncoras, sem JS, 6 larguras.")
