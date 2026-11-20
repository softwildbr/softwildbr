# Espaçamento da página pública

Decisão de 20/11/2026: divisórias sutis e cinzas; conteúdo afastado das bordas. Preservar a logo, a paleta aprovada, o destaque de agente/agentes somente em títulos e os pontos finais pretos.

## Base e aplicação

A base Web UI Lab v2 / Web UI Knowledge Base, revisada em 19/11/2026, orienta esta adaptação: escala em rem, medidas de leitura separadas da largura do contêiner e quebras por necessidade do conteúdo. Foram consultados seus tokens de espaçamento e as regras WEB-TYP-002, WEB-RWD-001 e WEB-A11Y-004. A versão recuperada pertence aos arquivos da pesquisa anterior; sua publicação como repositório não foi confirmada. Este arquivo registra apenas as decisões aplicadas à página, não importa nem substitui a pesquisa inteira.

Referências complementares: [Carbon — spacing](https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview), [GOV.UK — spacing](https://design-system.service.gov.uk/styles/spacing/) e [layout](https://design-system.service.gov.uk/styles/layout/). As medidas abaixo são decisões deste site, não exigências universais dessas fontes.

## Valores e responsabilidades

| Relação | Valor aplicado |
| --- | --- |
| Margem lateral da página | `clamp(1.5rem, 4vw, 3rem)`; mínimo 24 px com raiz padrão |
| Espaço interno de blocos | 24 px; diretório compacto 16 px; legendas de retratos 20 px |
| Itens relacionados | 8, 12 ou 16 px |
| Blocos e grades | 24 ou 32 px |
| Seções | 48–64 px de padding acima e abaixo; sem margem adicional acumulada |
| Título e descrição | 16 px |
| Cabeçalho de seção e conteúdo | 32 px |
| Largura de leitura | 68ch; manifesto até 72ch |
| Divisória decorativa | 1 px, cinza neutro `--line: #e8e8e8` |

Os tokens ficam em `docs/styles.css`. O contêiner controla a margem externa; os cartões controlam o espaço interno. Não compensar falta de margem reduzindo fonte. Evitar margens negativas que levem retratos à borda da tela. Carrosséis continuam roláveis dentro da coluna. Indicadores de progresso usam cinza, preservando sua função; foco e estados de controles continuam identificáveis.

## Verificação

- Executar `python scripts/render_catalog.py` e verificar ausência de alteração inesperada no HTML.
- Executar `python scripts/check_catalog.py`: 320, 390, 768, 1440 e 1920 CSS px; navegação, busca, controles, retratos, ausência de overflow da página e capturas.
- Conferir o bloco do trio, o cabeçalho da equipe, manifesto, pesquisas e rodapé. As capturas de retratos verificam enquadramento; não equivalem a validação de todos os estados de acessibilidade.
- Confirmar GitHub Pages após o merge. Não declarar aprovação geral de WCAG ou testes em aparelhos físicos a partir destes checks.
