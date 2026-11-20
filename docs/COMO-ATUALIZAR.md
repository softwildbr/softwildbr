# Soft Wild — manutenção da página GitHub Pages

**Espaçamento web vigente:** [ESPACAMENTO-WEB.md](ESPACAMENTO-WEB.md). Divisórias de 1 px em cinza neutro e margens laterais de pelo menos 24 px na configuração padrão. Não restaurar linhas ciano/azuis nem carrosséis encostados na borda.

## Regra permanente de cor e destaque — 20/11/2026

- Pontos finais de destaque devem ser pretos (`#000`), nunca coloridos. Use `.sentence-period` para a pontuação antes marcada como ciano; o destaque da palavra não deve se estender ao ponto.

- A cor de destaque vem da logo do perfil Soft Wild (`assets/softwild-logo.webp`) e da paleta aprovada em `DIRECAO-VISUAL-V6.md`: ciano `--cyan` (`#00bdc5`), com `--cyan-dark` (`#008a94`) para texto sobre fundo claro. Não introduzir outro azul nem alterar essa identidade sem pedido explícito do fundador.
- Destacar **agente/agentes somente em títulos** (`h1`–`h6`), usando `--cyan-dark`. Não colorir essas palavras nos parágrafos, menus, etiquetas, descrições ou rodapé.
- “A gente” significa “nós” e mantém a cor normal. O slogan intencional “Se for pra fazer mais do mesmo, agente nem faz.” continua literal; seu destaque só aparece quando for título.
- A regra vale para HTML estático, conteúdo gerado por JavaScript e regeneração pelo script de catálogo. Esta orientação prevalece sobre exemplos anteriores de destaque.

**VERSÃO VISUAL ATUAL: v7 — 19/11/2026.** Ordem: colaboradores digitais → manifesto integral (visual README do GitHub) → catálogo → pesquisas → progresso. Os três carrosséis possuem autoplay com controles e respeito a preferências de movimento. Os 44 perfis contam com arquivos vetoriais individuais em `docs/assets/agents/`; a fotografia original de Müller foi reenquadrada e publicada em `docs/assets/muller.webp` com 65.074 bytes, substituindo o arquivo antigo de 1.864 bytes. Consulte [MANIFESTO-E-AUTOPLAY-V7.md](MANIFESTO-E-AUTOPLAY-V7.md) para decisões e validação. Não produzir GIF nesta etapa.

> **VERSÃO VISUAL ATUAL: v6 — 19/11/2026.** O layout v5 descrito abaixo foi substituído pela estrutura de descoberta inspirada no Hugging Face e pelos carrosséis com cartões inspirados no Together AI. A referência operacional mais recente está em [DIRECAO-VISUAL-V6.md](DIRECAO-VISUAL-V6.md). O conteúdo anterior permanece como histórico, não como instrução vigente de composição.

**Versão visual vigente:** v5, aprovada em direção a partir do mockup de perfil branco enviado pelo fundador em 18/11/2026.
**Link público:** https://softwildbr.github.io/softwildbr/
**Repo:** https://github.com/softwildbr/softwildbr

## Arquitetura de arquivos

- `docs/index.html`: estrutura editorial do site, em português. A ordem pública segue o screenshot preferido: perfil lateral, manifesto, chips de pesquisa, direção, equipe ilustrada, produtos, progresso e sinais do futuro.
- `docs/styles.css`: estilos responsivos, fundo branco/cinza-claro, tipografia de perfil, espaçamento compacto, além de **sprite de dez retratos ilustrados incorporado em Base64**. Evite extrair ou substituir o sprite sem preservar os retratos e o mapeamento.
- `docs/app.js`: carrega catálogo JSON e gera dez agentes em destaque, seis cards de produto e diretórios expansíveis.
- `docs/data/content.json`: fonte pública dos **44 agentes**, **23 produtos/conceitos** e **10 frentes**; atualizado a partir de pesquisas verificadas.
- `docs/assets/softwild-logo.webp`: cópia web da marca SW aprovada; **não redesenhar o logotipo**.
- `docs/assets/muller.webp`: foto real do fundador, fornecida para o perfil; não substituir por fotografia sintética.
- `docs/.nojekyll`: mantém publicação estática sem Jekyll.

**Atenção:** este documento substitui a descrição anterior do layout (v1), que trazia uma composição abstrata de landing page. O novo estilo correto é o do screenshot com **barra lateral e painel central**. O histórico permanece no Git.

Depois de editar produtos, pesquisas ou marcos em `docs/data/content.json`, execute `python3 scripts/render_catalog.py` e inclua o HTML atualizado na mesma alteração.

## Edição de conteúdo

Campos disponíveis em `content.json`:

- `groups[].agents[]`: `name`, `role`, `description`, `gender`. Pessoas fictícias que representam especialidades de **agentes de IA**; não afirmar que 44 agentes autônomos estão ativos.
- `products[]`: `name`, `description`, `status`, `stage` (`prototype` ou `concept`). Diferenciar protótipo, pesquisa e lançamento.
- `fronts[]`: `name`, `status`, `progress`, `next`, `updated`. Não inventar barras percentuais ou testes concluídos.
- `updated`: data da revisão documental, não de publicação automática.

O arquivo de JS possui a lista de destaques e resumos para a home. Se nomes mudarem, atualize `featuredProjects`, `people`, `shortCopy` e `phaseLabel` para manter a correspondência com o JSON.

## Direção editorial obrigatória

- Slogan **literal**: **“Se for pra fazer mais do mesmo, agente nem faz.”**. `agente` escrito junto é intencional.
- Fundo predominantemente **branco**, cinza de apoio e acento ciano; sem grandes formas 3D, faixa verde-água de herói ou tipografia desproporcional.
- Sidebar curta: marca, `@softwildbr`, descrição e metadados.
- Painel: símbolo/wordmark + slogan com divisor, manifesto, pesquisa em chips, direção, time ilustrado e produtos.
- **Müller**: foto real. **ChatGPT**: colaboração com IA, não sócio jurídico. Agentes: personagens editoriais identificados como IA.
- O catálogo público não revela códigos privados, documentos confidenciais, credenciais ou dados de clientes.

## Publicação

GitHub Pages está configurado para `main` → `/docs`. Cada commit na branch principal aciona automaticamente o workflow `pages build and deployment`.

Verifique a publicação em:
- [Site da Soft Wild](https://softwildbr.github.io/softwildbr/)
- [Execuções de GitHub Pages](https://github.com/softwildbr/softwildbr/actions)
- [Issue interna #8](https://github.com/softwildbr/laboratorio-de-ideias/issues/8)

## QA para cada alteração

1. Conferir HTML válido, CSS e sintaxe JS, nomes dos arquivos e referências do JSON.
2. Testar navegação em mobile; menu de topo, abertura de `details`, filtros de núcleo e catálogo de produtos.
3. Testar 10 retratos exibidos sem repetição indevida e acessibilidade dos rótulos.
4. Verificar status dos produtos nos repositórios de origem, especialmente o progresso de shoppings na Etapa 1 (PR #8, Etapa 2 suspensa).
5. Validar visual em navegador desktop e mobile comparando com a imagem referência aprovada (mockup de perfil branco). **Não presumir que teste de sintaxe equivale a teste visual.**
6. Confirmar o workflow de Pages concluído com sucesso antes de declarar a versão publicada.

**Versão v5:** site atualizado no commit `83d2c046e0079ad5b2288a91f6527765ede6460d`, workflow de Pages confirmado como **success**.

