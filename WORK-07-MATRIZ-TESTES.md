# WORK-07 · Matriz de testes

**Referência de todas as tabelas:** 21/11/2026 UTC, sessão pública, build `1388891356`, SHA `4d5d27696f9bda0e8c417dad789adb28c76a1377`. As frações contam cenários, combinações, links ou execuções conforme a coluna. Não há denominador comum às três matrizes. [Build](https://api.github.com/repos/softwildbr/softwildbr/pages/builds/1388891356) · [Relatório](WORK-07-RELATORIO-AUDITORIA.md) · [Backlog e reprodução](WORK-07-BACKLOG-CORRECOES.md)

## WORK-07.1 · Publicação e regressão

As seis URLs da tabela funcional responderam HTTP 200. As comparações da revisão funcional cobriram seis HTMLs e nove recursos de código, estilos e dados antes e depois da execução. A visual comparou os seis HTMLs e oito arquivos CSS/JS. A revisão de acessibilidade confirmou os seis HTMLs. Em cada conjunto comparado, o conteúdo servido coincidiu byte a byte com a cópia local.

Os cinco checks locais passaram em WORK-07.2. Os links de CI abaixo apontam para execuções históricas bem-sucedidas no SHA auditado. Para o catálogo, a evidência de execução aqui é a do check local. [Scripts na revisão](https://github.com/softwildbr/softwildbr/tree/4d5d27696f9bda0e8c417dad789adb28c76a1377/scripts) · [Workflows na revisão](https://github.com/softwildbr/softwildbr/tree/4d5d27696f9bda0e8c417dad789adb28c76a1377/.github/workflows)

| Escopo | Check local | Workflow | Execução no SHA |
| --- | --- | --- | --- |
| Home | `check_catalog.py` | `catalog-qa.yml` | Passou localmente |
| Produtos e Ideias | `check_portal.py` | `portal-preview.yml` | [CI](https://github.com/softwildbr/softwildbr/actions/runs/44861042601) |
| Pesquisas | `check_research.py` | `research-preview.yml` | [CI](https://github.com/softwildbr/softwildbr/actions/runs/44861042531) |
| Laboratório | `check_laboratorio.py` | `laboratorio-preview.yml` | [CI](https://github.com/softwildbr/softwildbr/actions/runs/44861042526) |
| Sobre | `check_sobre.py` | `sobre-preview.yml` | [CI](https://github.com/softwildbr/softwildbr/actions/runs/44861042518) |

## WORK-07.2 · Navegação e fluxos funcionais

Debian 13, Playwright 1.62.0, Chromium 156.0.8078.79 headless. Desktop 1440 × 900 e móvel 390 × 844, ambos DPR 1, toque simulado no móvel. O Chromium ignorou o erro de certificado do proxy ao acessar a publicação. A conferência HTTP independente manteve a validação TLS.

Cada célula registra **passou/executado** em um ambiente. Publicação e checkout produziram as mesmas frações. As ocorrências de links incluem repetições de destino e são contabilizadas separadamente dos cenários.

| URL pública | Links internos | Desktop | Móvel | Fluxo específico exercitado |
| --- | ---: | ---: | ---: | --- |
| [Home](https://softwildbr.github.io/softwildbr/) | 21/21 | 11/11 | 13/15 | Busca, diálogo de detalhes, filtros, lista/carrossel e “Ver mais” |
| [Produtos](https://softwildbr.github.io/softwildbr/produtos/) | 34/34 | 11/12 | 13/16 | Busca, categoria, fase, reset e detalhe do Retrozim |
| [Ideias](https://softwildbr.github.io/softwildbr/ideias/) | 28/28 | 11/12 | 13/16 | Busca, categoria, reset e detalhe de Universos Ficcionais |
| [Pesquisas](https://softwildbr.github.io/softwildbr/pesquisas/) | 39/39 | 11/12 | 13/16 | Busca, assunto, estágio, reset e detalhe de Hardware Maker |
| [Laboratório](https://softwildbr.github.io/softwildbr/laboratorio/) | 46/46 | 12/13 | 14/17 | Busca, especialidade, reset, perfil e arquivo de descontinuados |
| [Sobre](https://softwildbr.github.io/softwildbr/sobre/) | 31/31 | 7/7 | 9/11 | Âncoras de seção, manifesto e chamadas internas |
| **Por ambiente** | **199/199** | **63/67** | **75/91** | **138/158 passaram, 20/158 falharam** |

A execução incluiu menus, teclado, toque, âncoras e histórico de voltar/avançar. As 40 ocorrências de falha nos dois ambientes repetiram os mesmos cinco achados de origem, rastreados no backlog por `07.2-01` a `07.2-05`. Os detalhes foram amostrados em cartões selecionados.

## WORK-07.3 · Layout, motores e toque

Debian 13 x86_64, Playwright 1.62.0, Chromium 156.0.8078.79 e WebKit 26.5. A grade pública usou DPR 1 e dez larguras em pixels CSS: 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 e 1920. Houve ainda 24 verificações locais complementares a 390 e 1440 px e verificações com toque simulado a DPR 3, incluindo 390 × 844 e 568 × 320.

| Rota | Combinações públicas Chromium / WebKit | Com overflow horizontal do documento | Falhas ou diferenças observadas |
| --- | ---: | ---: | --- |
| Home | 10 / 10 | 0/20 | M01 alcance em paisagem, M02 teclado |
| Produtos | 10 / 10 | 0/20 | M01 alcance, M03 retorno do foco, M04 glifo |
| Ideias | 10 / 10 | 0/20 | M01, M03, M04 |
| Pesquisas | 10 / 10 | 0/20 | M01, M03, M04 |
| Laboratório | 10 / 10 | 0/20 | M01, M03, M04 |
| Sobre | 10 / 10 | 0/20 | M01, M03, M04 |

**Passou:** o título principal coube nas 120 combinações públicas e Tab exibiu contorno de foco de 2 px no primeiro controle ou link após a marca. As cinco internas indicaram a rota ativa. Em Produtos, a 390 px, o título de 43,29 px ocupou três linhas em Chromium e duas em WebKit, sem corte.

**Falhou:** com o menu aberto em 568 × 320, o último link ficou fora de alcance nas 12/12 combinações de rota e motor. A ausência de overflow horizontal mede outra propriedade. A inspeção visual amostrou início, meio e rodapé. Os logos externos da Home ficaram fora desta coleta visual.

## WORK-07.4 · Acessibilidade, SEO e desempenho

Chromium 156.0.8078.79 headless, Debian 13, Playwright 1.62.0 e axe-core 4.10.3. Inspeção desktop a 1440 × 900, DPR 1, e móvel a 390 × 844, DPR 3. Lighthouse 13.6.0 no perfil móvel padrão de 412 × 823, DPR 1,75, com rede e CPU simuladas. Foram sete relatórios, dois deles cargas frias da Home.

| Rota | Nós de contraste sinalizados pelo axe (desktop / móvel) | Canonical | Lighthouse desempenho | Lighthouse acessibilidade |
| --- | ---: | --- | ---: | ---: |
| Home | 87 / 60 | Ausente | 92 e 96 | 96 |
| Produtos | 28 / 27 | Correto | 100 | 96 |
| Ideias | 27 / 26 | Correto | 100 | 96 |
| Pesquisas | 29 / 28 | Correto | 99 | 96 |
| Laboratório | 63 / 62 | Correto | 100 | 96 |
| Sobre | 22 / 21 | Correto | 100 | 95 |

As contagens do axe são ocorrências de nós em cada perfil. O backlog agrupa o problema de contraste nas seis rotas. As notas de SEO e boas práticas foram 100 em todas as rotas.

| Verificação | Resultado | Evidência e alcance |
| --- | --- | --- |
| Estrutura e imagens | Passou no estado inspecionado | Um `h1` visível e um `main` por rota, hierarquia de títulos sem saltos ascendentes, link para pular ao conteúdo e atributo `alt` em todas as imagens inventariadas. Adequação dos textos alternativos revisada por amostragem. |
| Movimento reduzido | Passou nos casos exercitados | Rolagem suave desativada nas seis rotas. Na Home, faixa de marcas sem animação e carrossel parado por 5,1 s, com avanço manual disponível. |
| Recursos e console | Passou nos fluxos normais | Recursos solicitados retornaram 200, incluindo dois SVGs públicos embutidos na Home. Nenhum erro de console ou exceção JavaScript nesses fluxos. |
| Contraste e nome acessível | Falhou | Textos a 3,57:1 e 3,65:1. Nome acessível divergente nos controles de detalhes da Home e dos quatro catálogos. |
| Estabilidade visual | Falhou na Home no perfil de laboratório | CLS de 0,1135 em cada uma das duas cargas. Principal deslocamento atribuído à faixa de marcas. |
| Descoberta | Parcial | Metadados básicos presentes. Canonical ausente na Home. Resposta 404 para os caminhos de sitemap e robots consultados. |

## Cobertura pendente

| Verificação | Estado | Lacuna |
| --- | --- | --- |
| Firefox 153.0 | Bloqueado | O processo de conteúdo caiu antes de abrir uma aba. Nenhum resultado de página nesse navegador. |
| Safari real em Mac e iPhone | Não executado | WebKit 26.5 foi exercitado pelo Playwright em Linux no WORK-07.3. Safari em macOS/iOS segue pendente. |
| Dispositivos físicos e simulador iOS | Não executado | Viewports, DPR e entrada de toque foram emulados. |
| Leitor de tela e comando de voz | Não executado | Validar navegação por landmarks e ativação pelo texto visível. |
| Métricas de campo e indexação efetiva | Não executado | Lighthouse mede cargas simuladas. Os metadados e códigos HTTP não demonstram cobertura no índice. |
| Destinos externos | Não executado na matriz de links | O denominador 199 cobre somente ocorrências internas estáticas. |
