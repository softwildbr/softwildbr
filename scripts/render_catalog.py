"""Atualizar o HTML estático após editar docs/data/content.json."""
from html import escape
from pathlib import Path
import json

docs = Path(__file__).resolve().parents[1] / "docs"
page = docs / "index.html"
data = json.loads((docs / "data/content.json").read_text())
html = page.read_text()


def product(p):
    return (
        '<article class="experiment-card"><div class="card-bottom">'
        f'<h4>{escape(p["name"])}</h4><p>{escape(p["description"])}</p>'
        f'<small>{escape(p["status"])}</small></div></article>'
    )


def research(f):
    return (
        f'<article class="research-card"><h3>{escape(f["name"])}</h3>'
        f'<span class="research-status">{escape(f["status"])}</span>'
        f'<p>{escape(f["progress"])}</p><details><summary>Próximo marco</summary>'
        f'<p>{escape(f["next"])}</p></details></article>'
    )


other_fronts = [f for f in data["fronts"] if "shopping" not in f["name"].lower()]
blocks = {
    "track-prototypes": [product(p) for p in data["products"] if p["stage"] == "prototype"],
    "track-futures": [product(p) for p in data["products"] if p["stage"] == "concept"],
    "research-grid": [research(f) for f in data["fronts"]],
    "progress-fronts": [
        f'<article class="progress-row"><b>{escape(f["name"])}</b><span>{escape(f["status"])}</span></article>'
        for f in other_fronts[:4]
    ],
}
for key, rows in blocks.items():
    marker = f"<!-- catálogo:{key} -->"
    start = html.index(marker) + len(marker)
    end = html.index(f"<!-- fim:{key} -->", start)
    html = html[:start] + "\n" + "\n".join(rows) + "\n" + html[end:]
page.write_text(html)
