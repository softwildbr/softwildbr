# Soft Wild — instruções obrigatórias para agentes que alteram este repositório

**Escopo:** perfil GitHub `softwildbr/softwildbr` e site GitHub Pages `docs/`.  
**Princípio:** **preservar tudo que não foi explicitamente solicitado**. Não aproveitar uma tarefa pontual para fazer redesign, revisão geral de redação, troca de logo, ajustes de espaçamento ou reorganização editorial.

## Antes de tocar em arquivos

1. Ler o `README.md`, este `AGENTS.md`, `docs/home-locks.json`, o arquivo-alvo e os padrões de [governança transversal](https://github.com/softwildbr/github-governance/blob/main/docs/AGENT_RULES.md).
2. Conferir branch/PR atuais e separar **conteúdo de produto** de **identidade da empresa**.
3. Enumerar no PR exatamente: frase/elemento a mudar, antes/depois, arquivos necessários, itens congelados e testes.
4. Criar branch e PR; não publicar, mesclar ou alterar `main` por iniciativa própria.
5. Se o pedido for ambíguo quanto a mudar ou não uma área protegida, manter intacta e propor em vez de executar.

## Identidade e posicionamento (não reformular por inferência)

- **Slogan literal aprovado:** “Se for pra fazer mais do mesmo, agente nem faz.”
- **Soft Wild:** laboratório independente de invenções, **produtos e experiências próprios** (físicos, digitais e híbridos); não é agência, consultoria nem estúdio de trabalho sob encomenda.
- Produtos são protagonistas; agentes, pesquisa e ferramentas explicam **o modo de criação**, não compõem catálogo de serviços para clientes.
- B2B só como compradores/licenciados de soluções autorais replicáveis, não demanda criativa terceirizada.
- Respeitar as decisões da [central de marca](https://github.com/softwildbr/empresa-maker-central). Separar propostas de texto, decisões aprovadas e publicações.
- **Não** trocar a logo nem sua paleta azul/ciano. A palavra `agente` / `agentes` só recebe realce azul em **títulos**, nunca aplicar automaticamente em corpo de texto. Pontos finais não recebem realce de cor.

## Zonas congeladas por padrão

| Arquivo / zona | Regra |
| --- | --- |
| `README.md` | Conteúdo do perfil, slogan, estrutura e narrativa congelados, salvo pedido específico |
| `docs/index.html` | Não reescrever hero, manifesto, menu, cards existentes, fotos, títulos, classes, IDs nem ordem das seções; mudar só o trecho solicitado |
| `docs/styles.css` | **Sem** alteração incidental de cor, tipografia, espaçamentos, grid, breakpoint, animação ou layout |
| `docs/app.js` | Não substituir scripts, interações, dados, comportamento de cards ou estilos via JS sem tarefa técnica específica |
| `docs/assets/` | Não substituir logo, retratos, iconografia ou outras imagens, nem suas resoluções, sem pedido explícito |
| `docs/data/content.json` | Adições/atualizações pontuais de itens **quando solicitadas**; não reescrever grupos de agentes, estados existentes, fontes ou textos não relacionados |
| `.github/`, `AGENTS.md`, `scripts/`, `docs/home-locks.json` | Segurança e governança: não afrouxar ou burlar por conveniência |

**Nunca** executar formatação global ou “melhorias” estéticas como efeito colateral. Preserve a ordem, os nomes, os dados e a estrutura atuais.

## Catálogo e honestidade editorial

- `docs/data/content.json` é a fonte dinâmica do catálogo; `docs/index.html` contém uma versão HTML de apoio. Manter contagens, descrições e estados equivalentes quando uma mudança explícita afetar produtos.
- Uma **ideia/conceito** nunca deve aparecer como lançamento, venda, assinatura, licença, site no ar ou produto validado.
- Ideias sobre franquias de filmes/séries/jogos devem distinguir referências culturais de ativos licenciados. Sem publicar marca, layout reconhecível, personagens, fotos, cenas ou produtos comerciais de terceiros sem verificação de direitos e autorização pertinente.
- Nunca divulgar arquivos privados, clientes ou dados da agência por inferência.

## Trava técnica e processo de revisão

- Os hashes dos arquivos sensíveis ficam em `docs/home-locks.json`; a Action `home-integrity.yml` roda `scripts/verify-home-locks.mjs`.
- Se uma alteração **expressamente aprovada** mudar um arquivo protegido, o humano precisa revisar o diff e aprovar a atualização do hash na mesma proposta; o agente não deve atualizar o hash silenciosamente para “fazer o CI passar”.
- CODEOWNERS solicita revisão do titular. **A proteção só é efetiva quando a branch `main` tem regra de PR/check obrigatório e as credenciais dos agentes não permitem bypass/admin.** Instruções e hashes sozinhos não equivalem a bloqueio de escrita.
- Não desabilitar o workflow ou excluir a regra para passar um check.
- O PR deve documentar testes de integridade, diferenças visuais quando houver, riscos e rollback. Não fazer merge sem autorização explícita do fundador.

**Regra de ouro:** **adicionar uma coisa não dá licença para trocar dez outras**.
