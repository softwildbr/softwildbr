# WORK-07 · Backlog de correções

**Ordem proposta para avaliação:** começar pela navegação móvel e pelo uso do catálogo por teclado. As propostas abaixo descrevem trabalho futuro. O estado observado corresponde ao SHA `4d5d27696f9bda0e8c417dad789adb28c76a1377`, build `1388891356`, em 21/11/2026 UTC. A matriz contém as URLs públicas exatas e os perfis de navegador, viewport e DPR de cada WORK. [Matriz de testes](WORK-07-MATRIZ-TESTES.md) · [Relatório](WORK-07-RELATORIO-AUDITORIA.md) · [Issue #16](https://github.com/softwildbr/softwildbr/issues/16)

## Prioridade e rastreabilidade

| Ordem | Item | Gravidade | Origem | Alcance | Esforço estimado |
| ---: | --- | --- | --- | --- | --- |
| 1 | B01 · Último link fora de alcance em paisagem | P2 | M01 | Seis rotas | Médio |
| 2 | B02 · Ordem de Tab e Escape no menu da Home | P2 | 07.2-01, 07.2-02, M02, SW074-03 | Home | Médio |
| 3 | B03 · Escape perde o foco ao fechar o menu | P2 | 07.2-03, M03, SW074-06 | Cinco internas | Pequeno |
| 4 | B04 · Limpar filtros pula os resultados | P2 | 07.2-04, SW074-04 | Quatro catálogos | Pequeno |
| 5 | B05 · Contraste insuficiente | P2 | SW074-01 | Seis rotas | Médio |
| 6 | B06 · Nome acessível omite o rótulo visível | P2 | SW074-02 | Home e quatro catálogos | Pequeno |
| 7 | B07 · Deslocamento na faixa de marcas | P2 | SW074-05 | Home | Médio |
| 8 | B08 · Menu inoperante sem JavaScript | P3 | 07.2-05 | Cinco internas | Médio |
| 9 | B09 · Landmarks e rótulos a revisar | P3 | SW074-07 | Seis rotas | Médio |
| 10 | B10 · Canonical e descoberta | P3 | SW074-08 | Home e publicação | Pequeno |
| 11 | B11 · Seta ausente no primeiro botão de ação | P3 | M04 | Cinco internas, Chromium em Debian | Pequeno |

“Internas” abrange Produtos, Ideias, Pesquisas, Laboratório e Sobre. “Quatro catálogos” abrange as quatro primeiras. O esforço considera a extensão do ajuste e da regressão. Os IDs de origem conservam a granularidade de cada execução. B02 exige verificar separadamente entrada no menu e fechamento. Em B03, a origem SW074-06 atribuiu P3 pelo fechamento funcional. A síntese adotou o P2 de 07.2-03 e M03 porque usuários de teclado perdem posição e indicação de foco nas cinco internas, nos dois motores.

## Reprodução e aceite

### B01 · Alcançar o fim do menu em paisagem

**Reproduzir.** Em 568 × 320, DPR 3, abrir o menu e rolar para tocar no último link. Em Chromium e WebKit a página rola atrás do painel. Na Home, Produtos começa em y≈331 e Ideias em y≈381. Nas internas aparecem cerca de 3 px de Sobre e Manifesto começa em y≈364. O acionamento do último item falhou nas 12 combinações.

**Hipótese e proposta.** O painel aberto excede a altura disponível e o gesto de rolagem atinge o documento. Limitar o painel à área visível e permitir rolagem interna. **Aceite:** em cada rota e motor, o último link pode ser visto e acionado por toque em paisagem. Conferir também retrato, foco visível e retorno à rolagem normal depois de fechar.

### B02 · Percorrer e fechar o menu da Home pelo teclado

**Reproduzir.** A 390 × 844, focar “Abrir menu”, pressionar Enter e Tab. O foco vai a “Pesquisar no site”. A partir do botão aberto, Shift+Tab alcança “Ideias”. Com esse link focado, Escape mantém o painel aberto e `aria-expanded=true`. A revisão visual reproduziu o comportamento nos dois motores nas seis larguras compactas.

**Hipótese e proposta.** No HTML auditado, os links precedem o botão na ordem do documento. O controlador alterna o estado ao clicar. Ajustar a passagem do botão aos links e tratar Escape. **Aceite:** ao abrir e prosseguir com Tab, o usuário alcança o primeiro link, “Agentes”, e percorre os demais em ordem. Escape a partir de um link fecha o painel, muda o estado para `false` e devolve o foco visível ao botão. Conferir também Shift+Tab e o menu desktop. [HTML da Home](https://github.com/softwildbr/softwildbr/blob/4d5d27696f9bda0e8c417dad789adb28c76a1377/docs/index.html#L25-L36) · [Controlador](https://github.com/softwildbr/softwildbr/blob/4d5d27696f9bda0e8c417dad789adb28c76a1377/docs/app.js#L310-L320)

### B03 · Devolver o foco ao botão das internas

**Reproduzir.** A 390 × 844, abrir o menu com Enter, avançar com Tab até “Início” e pressionar Escape. O painel fecha. Após 450 ms, o foco está no `body`, sem contorno visível. O próximo Tab vai para o breadcrumb. Confirmado nas cinco páginas em Chromium e WebKit.

**Hipótese e proposta.** O controlador compartilhado oculta os links ao fechar, sem devolver foco ao botão. Diferenciar fechamento por Escape de navegação por link. **Aceite:** com um item do menu focado, Escape fecha o painel e o botão recupera o foco visível. Com o painel já fechado, Escape em outro controle preserva o foco desse controle. [Controlador das internas](https://github.com/softwildbr/softwildbr/blob/4d5d27696f9bda0e8c417dad789adb28c76a1377/docs/portal.js#L6-L25)

### B04 · Continuar no catálogo após limpar filtros

**Reproduzir.** Em um dos quatro catálogos, nos perfis desktop e móvel do WORK-07.2, buscar `zzsemresultadowork072`. Usar Tab até “Limpar filtros” e Enter. Os cartões reaparecem, o foco cai no `body` e o próximo Tab chega a uma chamada após o catálogo.

**Hipótese e proposta.** A atualização oculta o estado vazio junto com o botão focado. Mover o foco para um ponto estável na busca ou no início dos resultados restaurados. **Aceite:** nas quatro páginas, os filtros são limpos, a contagem volta ao valor inicial e a navegação por teclado permite chegar aos cartões sem retroceder a partir do fim do catálogo.

### B05 · Tornar legíveis os textos de menor contraste

**Reproduzir.** No Chromium, nos perfis do WORK-07.4, inspecionar com axe o texto “POWERED BY” da Home e “Início” no breadcrumb das internas. As relações medidas foram 3,57:1 e 3,65:1, respectivamente. Para esses textos, o mínimo é 4,5:1. As ocorrências por rota e perfil estão na matriz.

**Hipótese e proposta.** As combinações de cor de texto e fundo usadas nesses estados têm contraste insuficiente. Inventariar combinações repetidas e propor ajustes compatíveis com a identidade aprovada. **Aceite:** medir pelo menos 4,5:1 nos dois exemplos e verificar os demais nós sinalizados contra o limiar aplicável ao tamanho e peso de cada texto. Submeter as amostras visuais à aprovação. [WCAG 2.2, contraste mínimo](https://www.w3.org/TR/WCAG22/#contrast-minimum)

### B06 · Permitir usar o texto do botão como comando de voz

**Reproduzir.** Na Home, comparar o botão “Ver detalhes” do Retrozim com seu nome na árvore de acessibilidade, “Ver informações de Retrozim Launcher”. Examinar controles equivalentes nos quatro catálogos. O nome omite a expressão exibida. O efeito sobre comandos de voz é provável e aguarda teste direto.

**Hipótese e proposta.** A nomeação explícita substitui o texto visível. Usar o rótulo exibido no nome acessível e conservar o contexto do cartão quando necessário. **Aceite:** a árvore contém a expressão visível completa em cada controle corrigido, permite identificar o cartão e a ativação continua abrindo os detalhes. [WCAG 2.2, rótulo no nome](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)

### B07 · Estabilizar a faixa de marcas na primeira carga

**Reproduzir.** Carregar a Home a frio duas vezes no perfil móvel Lighthouse do WORK-07.4. Ambos os relatórios registraram CLS 0,1135 e atribuíram o principal deslocamento à substituição do texto pelo SVG Google Flow.

**Hipótese e proposta.** A reserva de espaço difere entre o texto inicial e o SVG. Dimensionar esse espaço, preservando a legibilidade do fallback. **Aceite proposto:** repetir duas cargas frias no mesmo perfil, registrar o CLS de cada uma, atingir ≤ 0,1 e verificar que a troca da marca deixou de deslocar o conteúdo. As métricas reais de usuários seguem pendentes. [Referência de CLS](https://web.dev/articles/cls)

### B08 · Oferecer navegação móvel sem JavaScript

**Reproduzir.** Em Chromium a 390 × 844, DPR 1, desativar JavaScript, recarregar cada interna e tocar no hambúrguer. O botão permanece com `aria-expanded=false` e a navegação fica oculta. “Início” no rodapé funcionou nas cinco rotas, o que reduz o impacto.

**Hipótese e proposta.** O layout compacto oculta a navegação antes de haver um controlador ativo. Exibir os links por padrão e aplicar o recolhimento quando a interação estiver disponível. **Aceite:** sem JavaScript, alcançar e acionar a navegação principal por toque e teclado nas cinco páginas. Com JavaScript, conferir o painel em retrato e paisagem.

### B09 · Verificar a navegação por landmarks

**Reproduzir.** No axe e na árvore de acessibilidade dos perfis do WORK-07.4, revisar os landmarks complementares aninhados e os rótulos ARIA aplicados a contêineres genéricos. O impacto prático ficou sem verificação por leitor de tela.

**Hipótese e proposta.** A estrutura pode anunciar regiões redundantes ou deixar rótulos sem função reconhecida. Inspecionar cada ocorrência antes de ajustar marcação ou nome. **Aceite:** documentar a decisão por padrão, conferir novamente a árvore e validar a lista e a ordem de regiões com leitor de tela.

### B10 · Definir a URL preferida da Home e a descoberta das páginas

**Reproduzir.** Inspecionar o HTML da Home e das internas. As cinco internas têm canonical correto e a Home não declara canonical. No domínio publicado, `/softwildbr/sitemap.xml`, `/softwildbr/robots.txt` e `/robots.txt` responderam 404.

**Proposta.** Confirmar a URL preferida da Home, avaliar um sitemap para as seis rotas e definir se há alguma diretiva de rastreamento necessária no domínio. Os 404 documentam os caminhos consultados. A indexação efetiva segue desconhecida. **Aceite:** registrar a política escolhida. Se aprovados, verificar que o canonical aponta para a URL preferida e que o sitemap responde 200 com as URLs públicas corretas. [Canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) · [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)

### B11 · Exibir o glifo de seta no primeiro botão de ação

**Reproduzir.** Comparar o primeiro botão das cinco internas a 390 × 844, DPR 3, no mesmo Debian. Por exemplo, em “Explorar o catálogo”, o Chromium exibe um quadrado onde o WebKit exibe ↗. O texto da ação permanece legível.

**Hipótese e proposta.** Investigar cobertura do glifo e fonte de fallback no ambiente medido. Se confirmado, usar um recurso gráfico compatível e decorativo. **Aceite:** a seta aparece nas cinco rotas em ambos os motores no mesmo ambiente, e os botões preservam texto, nome acessível e alinhamento.

## Lotes para PRs futuros

| Lote proposto | Itens | Risco a conferir na revisão |
| --- | --- | --- |
| Navegação das internas | B01 (internas), B03, B08 | Foco por Escape, navegação por link, rolagem do painel e comportamento sem JS |
| Menu da Home, sob aprovação específica | B01 (Home), B02 | Ordem dos links, atalhos aprovados, busca e desktop |
| Catálogos e controles | B04, B06 | Estado vazio, detalhes e nomes dos controles. Separar a parte da Home para aprovação específica. |
| Contraste | B05 | Legibilidade nos estados afetados e fidelidade à identidade. Submeter propostas visuais antes da implementação. |
| Estabilidade da Home | B07 | Fallback da marca, movimento reduzido e cargas frias |
| Semântica, descoberta e glifo | B09, B10, B11 | Avaliar cada item em PR próprio conforme confirmação do impacto, política de SEO ou reprodução no ambiente-alvo |

Recomenda-se comparar cada correção com o cenário de origem e registrar a revisão e o ambiente do reteste. As alterações propostas na Home e na identidade exigem aprovação específica. Este backlog registra apenas a avaliação e os critérios para essa decisão.
