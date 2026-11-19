# Soft Wild — Faixa “Powered by” e cartão do fundador

**Data:** 19/11/2026 · **Versão:** v8.1 · **Status:** edição aplicada ao site GitHub Pages após solicitação do fundador.

## Contexto visual

O usuário forneceu captura do rodapé visual de [Together AI](https://www.together.ai/) contendo o texto “TRUSTED BY” e uma sequência leve de logos cinza, com bordas esmaecidas. A adaptação da Soft Wild usa o rótulo exato **“POWERED BY”**, imagens discretas e movimento horizontal sutil, com botão de pausa.

A faixa aparece **entre a abertura e o primeiro núcleo de conteúdo (“A gente. E os agentes”)**. A ordem de seções da v7 permanece inalterada, exceto por essa faixa visual.

## Marcas incluídas — somente as dez solicitadas

ChatGPT, ElevenLabs, Epidemic Sound, Google, Google Flow, Adobe, Figma, ClickUp, Higgsfield, Hugging Face. Não incluir outras marcas automaticamente.

**Varredura do ecossistema:** foram inspecionadas as árvores de arquivos dos 35 repositórios `softwildbr` acessíveis na rodada. Os repositórios `retrozim-icons-win95-98`, `retrozim-launcher` e `retrozim-icons-xiaomi` contêm ícones retrô de ChatGPT, Google, Figma, ClickUp e Adobe, **mas essas versões são estilizações históricas e não substituem os logos institucionais**. Nenhuma biblioteca completa de logos oficiais das dez ferramentas foi localizada nos demais repositórios.

| Marca | Fonte vetorial ou de exibição |
| --- | --- |
| ChatGPT | `docs/assets/brands/chatgpt.svg` — [arte disponibilizada pela OpenAI em repositório público](https://github.com/openai/sign-in-with-chatgpt-devkit/blob/main/assets/brand/chatgpt-card-24.svg) |
| ElevenLabs | `docs/assets/brands/elevenlabs.svg` — [Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/icons/elevenlabs.svg) |
| Epidemic Sound | [Wordmark em Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Epidemic_Sound_Logo_Black.svg), extraído do press kit oficial histórico (verificar identidade atual periodicamente); carregado remotamente |
| Google | `docs/assets/brands/google.svg` — [Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/icons/google.svg) |
| Google Flow | [Wordmark Google Flow em Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Google_Flow_logo.svg), baseado no [asset Google Labs](https://labs.google/flow/about/hero/wordmark.svg); carregado remotamente |
| Adobe | `docs/assets/brands/adobe.svg` — [Tabler Icons](https://github.com/tabler/tabler-icons/blob/main/icons/outline/brand-adobe.svg) |
| Figma | `docs/assets/brands/figma.svg` — [Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/icons/figma.svg) |
| ClickUp | `docs/assets/brands/clickup.svg` — [Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/icons/clickup.svg) |
| Higgsfield | `docs/assets/brands/higgsfield.svg` — [assets publicados pela equipe Higgsfield](https://github.com/higgsfield-ai/skills/blob/main/assets/icon.svg) |
| Hugging Face | `docs/assets/brands/huggingface.svg` — [Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/icons/huggingface.svg) |

**Precisão institucional:** “Powered by” é uma linguagem editorial para ferramentas e plataformas utilizadas ou pesquisadas no laboratório; não implica *parceria, patrocínio, afiliação, aprovação comercial ou integração técnica comprovada* com todas as marcas. O texto de ressalva fica visível sob a faixa. Logos e nomes pertencem aos respectivos titulares. Em especial, a [identidade da OpenAI](https://openai.com/brand/) não deve ser apresentada como uma parceria oficial sem autorização.

**Interação:** CSS anima um duplicado decorativo da lista, com velocidade moderada; no hover, foco, aba oculta e fora da viewport a faixa pausa. O botão permite pausar/iniciar manualmente. Dispositivos configurados para redução de movimento iniciam pausados.

## Perfil do fundador

**Título humorístico escolhido:** **Fundador · Adestrador de agentes** (sem substituir o fato de ser direção criativa).

**Card ao lado:** **“As vozes na minha cabeça.”**

Texto de apresentação na página:

> Era só uma ideia às três da manhã. Agora são 44 agentes querendo discutir UX, firmware e se uma torradeira merece Bluetooth. Dei nome, cargo e backlog pra cada um. Pronto: o caos ganhou organograma.

Assinatura: **“Fora de controle? Não. Em versão beta.”**

O humor segue a [identidade verbal Soft Wild v3](https://github.com/softwildbr/empresa-maker-central/blob/main/marca/identidade-verbal/2026-11-17-identidade-verbal-v3-voz-unificada.md): provocação construtiva, irreverência com competência, sem ridicularizar pessoas nem declarar fatos biográficos inventados. Trata-se de um texto editorial cômico, não depoimento literal do fundador.

## Checklist de qualidade

- [ ] Verificar logos vetoriais carregados, incluindo dois recursos remotos, no navegador real.
- [ ] Garantir que a faixa não se sobreponha à primeira seção no celular.
- [ ] Conferir pausa, hover/foco, `prefers-reduced-motion` e legibilidade dos 10 nomes.
- [ ] Conferir o card ao lado da foto no desktop e abaixo dela no mobile.
- [ ] Validar CSS/JS/HTML e o deploy do GitHub Pages; registrar o commit.
- [ ] Confirmar que a faixa não seja interpretada como lista de patrocinadores.

**Não alterar os nomes dos agentes, projetos ou estágios sem nova evidência.**
