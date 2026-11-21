# Página Pesquisas — Soft Wild

**Data:** 20/11/2026 · **Escopo:** sínteses públicas de pesquisa, não publicação do repositório privado.

## O que o visitante encontra

- Uma única página em `/softwildbr/pesquisas/` com **dez frentes** do catálogo existente da Soft Wild;
- H1: **“Onde a curiosidade nos leva.”** (já utilizado na Home, consistente com o manifesto);
- Abertura, três frentes em destaque, outras sete no catálogo, método de investigação, transparência e links para Produtos/Ideias;
- Busca em português, quatro filtros de assunto, filtros de estágio, detalhes expansíveis, âncoras compartilháveis e navegação adaptativa;
- HTML estático útil mesmo com JavaScript desativado.

## Fontes e limites da redação

A referência de nomes e estados é `docs/data/content.json`, conferida em 20/11/2026. Para as descrições editoriais foram consultados o README do acervo privado `softwildbr/pesquisas` e estudos existentes sobre IA/agentes, IHC, Android, cultura maker, conteúdo IA, branding e comunidades.

**Não foi publicado nenhum conteúdo bruto dos repositórios privados.** Todo o conteúdo da página é uma síntese editorial de alto nível: perguntas, linhas de investigação, limites, próximos passos e referências aos nossos próprios produtos e conceitos já públicos.

Evitar números e métricas de pesquisas de terceiros sem fonte clara e autorização; não afirmar validação experimental, implantação, venda, cliente, mercado comprovado ou homologação de produto sem evidência.

A frente de shopping centers fica em nível conceitual/documental; nada de informação de clientes, contratos, operações ou dados privados. A frente de produção criativa preserva métodos genéricos sem expor materiais de agência. A frente musical não afirma escuta de faixas ou resultados acústicos não executados.

## Arquitetura técnica

- `index.html`: conteúdo integral estático e navegável, indexável, com dez cards e dez `details`;
- `research.css`: somente complementos de grade e leitura, sem modificar tokens ou estilos da Home;
- CSS e JS comuns `../portal.css` e `../portal.js` já existem e **não precisam ser alterados**;
- O menu de Produtos/Ideias foi ajustado somente no destino da palavra “Pesquisas” para a página nova;
- A Home (`docs/index.html`, `docs/styles.css`, `docs/app.js`, `docs/data/content.json`) é preservada integralmente.

## Teste, revisão e manutenção

Executar `python3 scripts/check_research.py` em um ambiente com Playwright/Chrome. O workflow `research-preview` executa busca, filtros, menu, âncoras, 10 cards, versão sem JavaScript e seis tamanhos (320, 360, 390, 768, 1440, 1920 px). Capturas visuais ficam como artefatos da Action.

Ao atualizar uma frente, consultar primeiro o estado no repositório-fonte e diferenciar claramente **observação, hipótese, estudo documental, teste e lançamento**. Não criar links públicos que dependam de acesso ao conteúdo privado. Abrir PR com diff restrito e QA concluído.

**Slogan oficial preservado:** “Se for pra fazer mais do mesmo, agente nem faz.”
