# Laboratório — Soft Wild

**Entrega:** 20/11/2026 · **Página:** `/softwildbr/laboratorio/` · **Natureza:** apresentação editorial da estrutura criativa da Soft Wild.

## Conteúdo e arquitetura

Página única, com seis blocos:
1. Hero “Aqui a ideia encontra a bancada.”
2. Processo maker em cinco momentos (perguntar, investigar, construir, testar, decidir).
3. Diretório com **20 personagens/papéis** em **8 áreas**, filtro e busca.
4. Explicação acessível de agentes, harness, RAG e fine-tuning, sem confundir pesquisa com implantação.
5. Exemplo hipotético relacionado ao Retrozim e arquivo recolhido dos **19 personagens descontinuados**.
6. Caminhos para Produtos, Pesquisas e Ideias.

A redação segue o manifesto publicado na Home, incluindo a ênfase em curiosidade, autonomia e responsabilidade técnica. Não reposiciona a empresa como agência, prestadora de serviços ou fornecedora de automações sob encomenda.

## Fontes e responsabilidade

- `docs/data/content.json` é a fonte atual do catálogo de nomes, especialidades, descrições, retratos e arquivo histórico; os 39 registros foram transpostos para **HTML estático acessível** para a primeira publicação.
- `docs/index.html` é a referência do manifesto e dos retratos já publicados. Os arquivos de imagem existentes são reutilizados diretamente, sem substituições.
- `softwildbr/pesquisas/estudos/engenharia-de-agentes-ia/` documenta a pesquisa de arquitetura de agentes, harness, RAG, ferramentas e treinamento. A pesquisa **não comprova configuração/implantação operacionais**.
- `softwildbr/empresa-maker-central` orienta o posicionamento da marca; `github-governance` orienta a execução segura.

**Distinção obrigatória:** 20 perfis editoriais não significam 20 sistemas autônomos instalados. Os 19 personagens descontinuados integram uma narrativa humorística de experimentos e mudanças de escopo, não histórico de funcionários reais demitidos.

## Estrutura

- `index.html`: cópia pública integral, 20 cards de agentes, 19 cards históricos, navegação e blocos editoriais;
- `laboratorio.css`: somente os estilos específicos da página;
- `laboratorio.js`: abertura de detalhes no arquivo histórico por âncora; demais comportamentos reutilizam `../portal.js`.
- O conteúdo essencial funciona mesmo quando JavaScript está desativado. Filtros e busca são melhorias progressivas.

## Manutenção e QA

Antes de adicionar ou alterar perfil/história, consultar a fonte `docs/data/content.json` e atualizar apenas os trechos necessários nesta página, com revisão do diff. Futuramente é possível incluir um gerador a partir da fonte, sem alterar a Home por inferência.

Rodar `python3 scripts/check_laboratorio.py` com Playwright e Chrome/Chromium. O fluxo testa os 39 retratos existentes, 8 áreas, busca, filtros, menu, arquivo, detalhes, âncoras, JavaScript desativado e larguras 320/360/390/768/1440/1920 px. Capturas ficam como artefatos da Action.

**Zona congelada:** não alterar `docs/index.html`, `docs/styles.css`, `docs/app.js`, `docs/data/content.json`, `README.md`, imagens/logotipo, slogan ou manifesto para publicar esta página.

**Publicação:** por PR revisado e CI aprovado. Nomes e links das páginas internas podem ser ajustados apenas na navegação para apontar ao Laboratório já criado; não remover seções da Home nem seus links existentes.

**Slogan literal:** Se for pra fazer mais do mesmo, agente nem faz.
