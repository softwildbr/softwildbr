# Soft Wild / Direção de interface v6 — catálogo do laboratório

**Data:** 19/11/2026 · **Implementação:** GitHub Pages em main/docs · **Natureza:** base editorial e interativa, não loja nem dashboard operacional.

## Referências de estrutura

- [Hugging Face](https://huggingface.co/) e [Spaces](https://huggingface.co/spaces): busca no topo, taxonomia simples, descoberta de projetos, navegação por áreas e diretório explorável.
- [Together AI](https://www.together.ai/): referência para o componente de cartões brancos com borda fina, símbolo de aplicação, etiqueta de status no topo, categoria discreta, título expressivo e rolagem horizontal com setas; inspirada também no screenshot fornecido pelo fundador em 19/11/2026.
- **Não copiar** marcas, nomes, imagens, código ou aparência literal de terceiros. As referências são padrões de organização e interação; a identidade é Soft Wild.

## Identidade visual preservada

- Fundo principal #f8fafb, cartões #ffffff, texto #161b24 / #313b47, linhas #e2e7ed e acento ciano #00bdc5 / #008a94.
- Usar o monograma SW existente em assets e a fotografia real do fundador; sem mascotes robóticos nem marcas de plataformas externas.
- Estética editorial de plataforma maker: módulos precisos, pouca decoração, respiro e informações verdadeiras.
- Slogan literal: **“Se for pra fazer mais do mesmo, agente nem faz.”**

## Estrutura pública em ordem de leitura

1. Header fixo com marca, busca, navegação principal e GitHub.
2. Perfil lateral Soft Wild, contexto do laboratório e links internos.
3. Hero com slogan e três áreas de investigação apresentadas de forma compacta.
4. **Explorar:** chips de categorias; dois carrosséis, um para projetos e protótipos e outro para conceitos futuros.
5. **Pesquisa:** dez frentes, cada uma com propósito, etapa documentada e próximo marco.
6. **Progresso:** estudo de shoppings e demais pesquisas, sempre sem porcentagem artificial; A = visitantes, B = operação, C = negócios.
7. **Time:** foto de Müller em destaque; carrossel de 44 agentes editoriais; dez retratos ilustrados de referência no início da sequência, demais perfis com monogramas até arte individual aprovada; diretório acessível com todas as descrições.
8. **Manifesto + sinais:** rebeldia construtiva, seis reflexões e rodapé discreto.

## Manutenção

- **Fonte de conteúdo:** docs/data/content.json, contendo 23 produtos/conceitos, 10 frentes e 44 agentes em oito núcleos. Datas e estágios não são dados de telemetria.
- **Regras de apresentação:** docs/app.js inclui mapeamento productArt que define categoria, símbolo e variação visual. Sempre que um produto novo entrar no JSON, revisar esse mapa e o filtro correspondente.
- **Layout:** docs/styles.css com flex scroll-snap para carrosséis e breakpoints mobile; docs/index.html com marcação semântica.
- **Imagem:** dez retratos editoriais existentes incorporados ao CSS; os demais 34 perfis recebem monograma temporário, **não reutilização enganosa da mesma foto**. Melhorias futuras devem gerar assets individuais autorizados.
- **Pesquisa e agentes:** dados públicos são síntese, não cópia de repositórios privados. Não expor contas, clientes, credenciais ou trabalhos de agência.
- **Status:** jamais adicionar “NEW”, “lançado”, “disponível” ou percentuais sem documentação que comprove.

## QA

1. Validar JSON; sintaxe JS; balanceamento CSS; IDs e âncoras.
2. Testar busca de texto, categorias, carrosséis com setas, rolagem por toque, cards de detalhes, filtro do diretório, abertura e fechamento no mobile.
3. Validar largura de 360, 390, 768, 1024 e 1440 px com carregamento real dos assets. Garantir prefers-reduced-motion, foco visível e labels acessíveis.
4. Conferir publicação do workflow Pages com sucesso para o commit na branch principal.
5. Registrar alterações relevantes na issue editorial do laboratório.

**Origem dos dados:** a documentação interna laboratorio-de-ideias, os repositórios de produtos e o PR de shopping (Etapa 1) permanecem fontes canônicas; a vitrine não afirma que 44 agentes estejam executando autonomamente.
