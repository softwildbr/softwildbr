# WORK-07 · Relatório de auditoria do site Soft Wild

**Decisão sugerida:** priorizar o menu móvel. Em paisagem, o último link ficou fora de alcance nas seis páginas. Por teclado, a Home pula os links ao abrir o menu e as cinco páginas internas perdem o foco ao fechá-lo. O backlog reúne **11 itens: sete P2 e quatro P3**. Nenhum P0 ou P1 foi observado nos cenários executados.

A auditoria de 21/11/2026 (UTC) examinou o site público, sem autenticação, e o checkout da revisão publicada. O build original do GitHub Pages foi `1388891356`, commit `4d5d27696f9bda0e8c417dad789adb28c76a1377`. Os seis HTMLs servidos corresponderam byte a byte aos do checkout. A identificação do build e o vínculo com o commit foram reconferidos na consolidação. [Site](https://softwildbr.github.io/softwildbr/) · [Build](https://api.github.com/repos/softwildbr/softwildbr/pages/builds/1388891356) · [Revisão auditada](https://github.com/softwildbr/softwildbr/commit/4d5d27696f9bda0e8c417dad789adb28c76a1377) · [Issue #16](https://github.com/softwildbr/softwildbr/issues/16)

## O que funciona e onde intervir

| Área | Evidência na revisão auditada | Decisão proposta |
| --- | --- | --- |
| Acesso e navegação | Seis rotas HTTP 200. As 199 ocorrências de links internos estáticos passaram em cada ambiente. Na matriz funcional, passaram 138 de 158 cenários tanto na publicação quanto no checkout. Os cinco scripts legados passaram localmente. | Usar esses resultados como referência de regressão. |
| Menu móvel | Em 568 × 320, o último link ficou inacessível por toque nas 12 combinações de rota e motor. Na Home, Tab pula os links e Escape mantém o menu aberto. Nas internas, Escape fecha o painel e o foco cai no corpo da página. | Tratar alcance por toque e continuidade do teclado primeiro. Mudanças na Home dependem de aprovação específica. |
| Catálogos | Busca, filtros e detalhes amostrados operaram. Ao limpar uma busca vazia, os cartões voltam, mas o próximo Tab pula o catálogo em quatro rotas. | Repor o foco em um ponto estável que permita percorrer os resultados. |
| Leitura e controles | O axe sinalizou baixo contraste nas seis rotas. Na Home e nos quatro catálogos, há controles cujo nome acessível omite o texto visível. Houve também recomendações semânticas. | Priorizar contraste e nome acessível. Verificar landmarks com leitor de tela antes de definir o ajuste semântico. |
| Layout e desempenho | Nenhuma das 120 combinações visuais públicas apresentou rolagem horizontal do documento. Na Home, duas cargas frias registraram CLS de 0,1135, com o deslocamento principal atribuído ao SVG Google Flow na faixa de marcas. | Reservar o espaço da marca mediante aprovação. Reavaliar no mesmo perfil de laboratório. |
| Busca orgânica | As seis rotas têm título, descrição e Open Graph básico. Cinco têm canonical correto. A Home não tem canonical e o caminho consultado para o sitemap respondeu 404. | Decidir a URL preferida e a política de descoberta. A cobertura real de indexação permanece desconhecida. |

O menu aprovado da Home leva diretamente a Produtos e Ideias. “Pesquisa” aponta para `#pesquisas` na própria página. Não há links diretos nesse menu para Pesquisas, Laboratório ou Sobre. A composição do menu é uma decisão editorial que requer aprovação específica. [HTML da revisão](https://github.com/softwildbr/softwildbr/blob/4d5d27696f9bda0e8c417dad789adb28c76a1377/docs/index.html#L25-L36) · [Contrato de manutenção](https://github.com/softwildbr/softwildbr/blob/4d5d27696f9bda0e8c417dad789adb28c76a1377/docs/AGENTS.md)

## Como os resultados foram reconciliados

Cada item agrupa o mesmo fluxo, sintoma e resultado esperado. As duas falhas de teclado da Home têm critérios de aceite próprios dentro de um único item. O alcance por toque em paisagem permanece separado porque falha mesmo sem teclado. As 20 reprovações funcionais por ambiente representam cinco achados de origem. Na revisão visual, quatro achados foram registrados. Na revisão de acessibilidade, SEO e desempenho, oito. A coluna de origem do backlog permite refazer o cruzamento. [Backlog priorizado e critérios de aceite](WORK-07-BACKLOG-CORRECOES.md)

A escala da issue classifica indisponibilidade ou perda crítica como P0, quebra de fluxo central como P1, impacto relevante em uso ou acessibilidade como P2 e acabamento ou recomendação como P3. A divergência foi o fechamento do menu interno: a revisão de acessibilidade atribuiu P3 porque o painel fecha e o próximo Tab alcança o breadcrumb. A revisão funcional e a visual atribuíram P2 pela perda do indicador de foco e da posição de navegação. A síntese adota **P2** pela repetição nas cinco internas em ambos os motores e pela necessidade de reorientação a cada fechamento por teclado.

## Cobertura, limites e encaminhamento

A [matriz por rota](WORK-07-MATRIZ-TESTES.md) registra o inventário de WORK-07.1, as execuções de WORK-07.2 a WORK-07.4 e os respectivos perfis e lacunas. WORK-07.5 consolidou as medições existentes e conferiu totais, rastreabilidade e escopo documental. Os resultados de execução pertencem ao build original. Não houve nova bateria de testes nem medição pós-correção.

Firefox ficou bloqueado antes de abrir uma aba. O WebKit do Playwright ampliou a cobertura visual em Linux. Safari real em macOS/iOS, simulador iOS, dispositivos físicos, leitor de tela, comando de voz e métricas de campo ficaram sem validação. As notas do Lighthouse são medições em laboratório.

Recomenda-se aprovar a documentação para revisão e avaliar separadamente os lotes de correção propostos no backlog. A revisão da Home, da marca ou de produção exige decisão específica. Para cada correção aprovada, registrar o comportamento antes/depois no cenário afetado e conferir a navegação compartilhada nas seis rotas.
