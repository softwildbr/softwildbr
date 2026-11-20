# Soft Wild — contrato de manutenção das páginas internas

**Vigência:** proposta de Produtos e Ideias, 20/11/2026.  
**Escopo:** arquivos novos em `docs/produtos/`, `docs/ideias/`, `docs/portal.css`, `docs/portal.js` e respectivos testes.

## Regra inegociável
O fundador aprovou a Home do GitHub Pages e pediu que ela **continue exatamente como está**. Uma tarefa de criar/editar páginas internas **não autoriza** alterar `docs/index.html`, `docs/styles.css`, `docs/app.js`, `docs/data/content.json`, `README.md`, logo, fotos, manifesto, slogans ou outros arquivos existentes.

Antes de qualquer mudança, ler os documentos vigentes de marca em `empresa-maker-central`, o manifesto público na Home e as regras de `github-governance`. Não modificar a navegação da Home apenas para adicionar links às páginas internas. Comunicar URLs diretas das páginas quando necessário.

## Identidade
- Soft Wild é laboratório independente de **produtos e experiências próprios**, não agência ou prestadora sob encomenda.
- Voz: curiosa, maker, irreverente com medida e precisa. Distinguir protótipo, estudo, alfa, teste e lançamento.
- Reutilizar as cores oficiais e a tipografia presentes na Home; **não** confundir a marca Soft Wild com a estética Windows 98 de um produto.
- Preservar a frase aprovada: “Se for pra fazer mais do mesmo, agente nem faz.” com `agente` junto e o ponto final sem cor especial.

## Arquitetura
- `docs/produtos/index.html`: catálogo único e estático com 15 projetos/protótipos e detalhes no próprio documento.
- `docs/ideias/index.html`: 9 conceitos (8 na fonte pública mais 1 em proposta documentada). A ideia dos universos ficcionais não é produto lançado.
- `docs/portal.css` e `docs/portal.js`: arquivos **exclusivos** das duas páginas, não incluídos pela Home.
- Sem JavaScript, todos os cards e detalhes continuam legíveis. Com JavaScript, busca, filtro, menu e âncoras funcionam.
- Os registros internos dos produtos são a fonte canônica de estágio, mas os links para repositórios privados não são oferecidos como material público.
- Não inserir screenshots gerados por IA como se fossem capturas de software real. Os elementos geométricos atuais são decoração abstrata.
- URLs de navegação para futuras páginas não devem ser inventadas. Pesquisas, manifesto e laboratório apontam para âncoras reais da Home.

## Para os agentes
1. Alterar apenas arquivos expressamente solicitados; fazer diff pequeno em branch.
2. Antes de mudar descrição/estado de um produto, conferir README/STATUS, release e evidências no seu repositório.
3. Não usar material de clientes da agência ou referências privadas como portfólio público.
4. Não afirmar afiliação, licenciamento, receita, usuários ou lançamento sem prova. Ideias envolvendo filmes e séries dependem de verificação de direitos.
5. Rodar o check `portal-preview`, conferir capturas desktop/mobile e verificar que a Home não aparece no diff.
6. Abrir PR, registrar o que mudou, e só integrar a `main` quando houver autorização para publicar.

## Observação
Estas instruções documentais auxiliam o escopo, mas controles efetivos exigem proteção da branch e credenciais de agentes sem possibilidade de bypass.
