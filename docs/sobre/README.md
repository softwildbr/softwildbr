# Sobre — Soft Wild

**Página:** `/softwildbr/sobre/` · **Proposta editorial aprovada:** 21/11/2026, após planejamento da sexta página.

## Escopo

Página institucional editorial com o título **“A gente prefere fazer.”**, sem repetição integral do manifesto e sem apresentar a Soft Wild como agência ou prestadora de desenvolvimento por encomenda.

Estrutura da página:
1. Abertura e posicionamento da empresa independente;
2. Modelo de criação de produtos próprios, não encomendados;
3. Quatro territórios: software/interfaces, eletrônica/objetos, experiências, coleções;
4. Quatro princípios: inventividade, liberdade, encantamento, confiança;
5. Direção humana e uso criterioso de IA e agentes;
6. Estado real do portfólio (projetos em pesquisa, protótipo e teste);
7. Convite a ler o manifesto **integral já publicado na Home**, e navegação para Produtos, Ideias e Laboratório.

O texto da origem pessoal do fundador não foi escrito por inferência. O dossiê da marca diz que esse relato cabe ao fundador, que poderá autorizar material futuro específico. Não inventar biografia, datas, conquistas ou clientes.

## Referências canônicas

- `docs/index.html`: manifesto publicado, identidade, slogan e Home **intocada**;
- `softwildbr/empresa-maker-central/marca/naming/2026-11-16-briefing-v1.md`: produtos autorais e escopo maker;
- `softwildbr/empresa-maker-central/marca/plataforma/2026-11-17-plataforma-soft-wild-v4-direcao-conceitual.md`: posicionamento e pilares;
- `softwildbr/empresa-maker-central/marca/identidade-verbal/2026-11-18-slogan-oficial-agente-nem-faz.md`: slogan aprovado literalmente;
- `softwildbr/empresa-maker-central/marca/manifesto/2026-11-17-manifesto-v2-edicoes-limitadas.md`: edições pequenas e limites de narrativa.

## Implementação

- `docs/sobre/index.html`: HTML estático, sem JavaScript exclusivo; menu mobile utiliza o `../portal.js` existente.
- `docs/sobre/sobre.css`: ajustes exclusivamente locais de composição e responsividade; cores oficiais e tipografia continuam vindo do `../portal.css`.
- Navegação interna de Produtos, Ideias, Pesquisas e Laboratório recebe o item `Sobre` no menu e no rodapé.
- **Não editar** `docs/index.html`, `docs/styles.css`, `docs/app.js`, `docs/data/content.json`, `README.md`, fontes/imagens, `docs/portal.css` ou `docs/portal.js`. A Home conserva seu menu atual até autorização específica.

## Verificação e manutenção

`python3 scripts/check_sobre.py` (Playwright e Chrome) verifica os textos e a estrutura, quatro territórios, quatro princípios, nove larguras de 320 a 1920 px, links internos, navegação mobile, renderização sem JavaScript, console sem erros e ausência de overflow horizontal.

O checklist técnico também verifica que somente os arquivos previstos entram no PR. Atualizações devem separar fato, hipótese, protótipo e produto efetivamente disponível. Não adicionar CTAs de orçamento, prestação de serviços ou parcerias comerciais inexistentes.

**Slogan literal obrigatório:** `Se for pra fazer mais do mesmo, agente nem faz.`
