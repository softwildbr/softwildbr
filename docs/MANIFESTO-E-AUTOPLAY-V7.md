# Soft Wild — diretriz e changelog v7

**Atualização:** 19/11/2026 · **Referências:** pesquisa de UI GitHub e manifesto do Laboratório de Ideias; mudanças explícitas do fundador na conversa.

## Nova hierarquia da homepage

A abertura com a marca e o slogan continua compacta. **Imediatamente depois da abertura:**
1. **A gente. E os agentes** — colaboradores digitais, foto real do fundador e carrossel dos 44 perfis, com cargos, descrição e identificação de IA.
2. **Manifesto completo** — o texto editorial integral documentado no arquivo `pagina-publica/2026-11-19-MANIFESTO-REFERENCIA-GITHUB-APROVADA.md` no Laboratório de Ideias. Mostrado num painel semelhante a um arquivo README, branco, com borda fina, sem transformar parágrafos em cards ou seções temáticas.
3. **Produtos e experimentos** — carrosséis de produtos atuais e conceitos futuros, filtros e busca.
4. **Frentes de pesquisa** — dez áreas com etapa e próximo marco.
5. **Progresso** — métricas e evidências documentais, sem porcentagens fictícias.

Os links de navegação e as numerações editoriais acompanham a nova ordem.

## Autoplay dos três carrosséis

- Agentes: avanço automático a cada 4,3 segundos.
- Projetos e conceitos futuros: avanço a cada 5 segundos.
- Fim da lista retorna ao primeiro cartão, sem ocultar conteúdo.
- Controles: anterior/próximo e botão **pausar/reproduzir** individual por carrossel.
- Pausa automática enquanto o ponteiro está sobre a faixa, durante foco, gesto de toque, diálogo aberto, aba oculta ou seção fora do viewport.
- Em **prefers-reduced-motion**, reprodução automática inicia pausada; o visitante pode iniciá-la manualmente.

## Equipe: colaboradores digitais com identidade própria

Os 44 perfis são apresentados como **colaboradores digitais** da Soft Wild, todos rotulados **Agente de IA**. O tom pode ser próximo à apresentação de um time de estúdio, com áreas, cargos e responsabilidades. Isso **não** significa que sejam pessoas empregadas, sócios jurídicos ou sistemas autônomos já instalados/operacionais. A operação de cada agente exige infraestrutura e validação próprias.

O catálogo de perfis continua em `docs/data/content.json`. Cada avatar tem arte individual em `docs/assets/agents/<slug>.svg`, vetorial/escalável e sem perda de nitidez, sem monogramas como substituto. Como são ilustrações procedurais, a revisão de direção de arte continua aberta; o GIF/animado desses retratos será uma **etapa posterior**, não parte desta publicação.

A foto do fundador deve continuar sendo a **fotografia original** enviada, nunca um rosto sintético; o original de 691×1536 está no contexto da conversa. A versão recortada e preservada será incorporada somente depois que o binário de alta resolução for efetivamente enviado ao repositório; não afirmar troca antes de confirmar.

## Qualidade e manutenção

- Manter branco/cinza-claro, ciano e grafite da identidade Soft Wild.
- A pesquisa aprovada do GitHub informa a **seção Manifesto**, não autoriza fingir controles nativos de GitHub que não existem.
- Manter status de produtos e estudos separados de promessas comerciais.
- Verificar carregamento de 44 arquivos de imagens, quebra mobile, navegabilidade, filtros, posição e pausas dos carrosséis.
- Confirmar deploy do GitHub Pages após commit e registrar na issue editorial.

**Fontes de decisões**:
- [Referência UI/manifesto aprovada](https://github.com/softwildbr/laboratorio-de-ideias/blob/main/pagina-publica/2026-11-19-MANIFESTO-REFERENCIA-GITHUB-APROVADA.md)
- [Slogan oficial](https://github.com/softwildbr/empresa-maker-central/blob/main/marca/identidade-verbal/2026-11-18-slogan-oficial-agente-nem-faz.md)
