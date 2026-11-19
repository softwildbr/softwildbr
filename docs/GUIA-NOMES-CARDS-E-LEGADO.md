# Soft Wild · Equipe brasileira, cards editoriais e memorial digital (v10)

> Os 44 nomes brasileiros foram aprovados pelo fundador em 19/11/2026. Esta versão implementa HTML/CSS/JS e documenta a etapa posterior de criação dos retratos. A publicação em `main` depende da integração do PR.

## Decisões aplicadas nesta branch

- Cards em formato **pôster fotográfico/ilustrado full bleed**, seguindo a referência visual enviada pelo fundador.
- A informação fica visível na própria peça, na ordem: **nome → selo AGENTE DE IA → cargo → descrição objetiva → ação para ficha completa**.
- Os 44 agentes continuam divididos nos mesmos 8 núcleos, preservando função, texto documental, ordem editorial e origem dos avatares.
- `name` é o nome brasileiro definitivo; `portrait_file` preserva o nome técnico do SVG existente até a produção e a migração dos novos retratos.
- Não foram geradas imagens nesta etapa. Os SVGs existentes são arte provisória.
- A fotografia real do fundador e o card “As vozes na minha cabeça” permanecem sem alterações.
- Seção **Agentes descontinuados**: recupera personagens editoriais de versões visuais anteriores, sem alegar que foram funcionários ou sistemas autônomos ativos.

## Nomes aprovados por núcleo

### Pesquisa, cultura e descoberta
- Caio Lobo
- Felipe Raposo
- Otávio Falcão
- Sérgio Dantas
- Davi Nogueira
- Íris Moura

### Experiência, UX e sistemas visuais
- Teo Lins
- Luana Reis
- Mateus Pires
- Nara Sampaio
- Henrique Monteiro
- Vera Guimarães

### Engenharia de software e qualidade
- Heitor Braga
- Lucas Corrêa
- Márcio Rezende
- Clara Viana
- Gabriel Castro
- Maia Nascimento
- Hugo Almeida

### Inteligência artificial e automação
- Álvaro Costa
- Ada Valente
- Isaque Teixeira
- Nina Abreu
- Júlio Vidal

### Hardware, fabricação e objetos
- Bruno Bittencourt
- Artur Farias
- Eva Martins
- Murilo Pacheco
- Samuel Neri

### Arte, narrativa, música e experiências
- Dênis Tavares
- Tainá Campos
- Rafael Souto
- Jade Rocha
- Caetano Freire
- Olívia Azevedo

### Produto, negócio e crescimento
- Natã Ribeiro
- Roberta Dias
- Alex Duarte
- Marcos Ávila
- Samara Lima

### Ambientes, comércio e shoppings
- Helena Araújo
- Cora Barreto
- Sofia Paiva
- Beatriz Moreira

## Guia para geração das imagens — etapa posterior

- **Tamanho principal de produção:** 960 × 1440 px (proporção 2:3), entrega por agente em arquivo individual.
- **Tamanho do card CSS no desktop:** 232 × 430 px. **No celular:** 222 × 420 px. A imagem ocupa o card inteiro e recebe crop responsivo pelo `object-fit: cover`.
- **Área útil superior:** manter o rosto, o cabelo e a silhueta principal na região central e superior, com margem horizontal para crop. Evitar texto ou detalhes essenciais dentro da própria imagem.
- **Faixa inferior:** reservar aproximadamente 50% da altura para o gradiente e a sobreposição de nome, selo, cargo, descrição curta e acesso aos detalhes. Evitar elementos essenciais nessa região.
- **Visual:** retratos próximos com personalidade, diversidade de rostos e figurinos, enquadramento semelhante ao exemplo aprovado; manter identidade própria por agente, sem clonar uma face.
- **Acessibilidade:** não incorporar o nome ou o cargo na imagem; os textos devem permanecer HTML editável, legível, pesquisável e acessível.
- **Etapa de SVG animado:** somente depois de aprovar as imagens estáticas; cada personagem receberá animação individual, discreta, opcional, com alternativa estática para `prefers-reduced-motion`.

## Arquivo de ex-colaboradores

### Redação pública e tom de voz

Título: **Nem todo agente chega à versão 2.0.**

Abertura: **Alguns fizeram história. Outros fizeram o que puderam. Não foram demitidos: foram descontinuados. Uns perderam a função. Outros perderam o botão. Todos foram para um lugar melhor — provavelmente com mais memória RAM.**

O memorial é parte do universo de personagens digitais e do humor do laboratório, e não uma relação de funcionários humanos. Não acrescentar datas falsas de contratações/demissões, métricas inventadas de entrega nem atribuir incidentes reais a pessoas ou produtos.

### Estrutura de ficha

1. Crachá **DESCONTINUADO**;
2. Nome brasileiro, inclusive para os três personagens que existiam com nomes internacionais em propostas anteriores;
3. Especialidade;
4. Descrição curta do personagem;
5. **POR QUE SAIU** — punchline;
6. **FOI PARA UM LUGAR MELHOR** — destino absurdo e seco.

Há **19 fichas** nesta versão (incluindo João Quase-Pronto e Lurdes Mortelas); mostrar 6 e oferecer **Ver as 19 fichas**. A busca do site encontra também motivos, destinos e nomes antigos. Não gerar retratos desses personagens nesta etapa.

### Fontes de inspiração verificadas nos repositórios (19/11/2026)

- **Minamp**: o recurso de Músicas Curtidas e a integração autenticada com a biblioteca do Spotify foram cancelados (não o aplicativo como um todo). Personagem: Zeca Curtidas.
- **REVER / extensão de navegador**: a beta foi reconduzida a uma única função principal, Guardar momento; recursos secundários saem da interface e APIs com cobrança não entram na primeira fase. Personagens: Lourdes Multitelas e Dora Assinatura.
- **REVER / naming e conceito**: DESVIO e IMPREVÊ constam como nomes/fases históricas anteriores ao nome vigente REVER; um conceito de feed anterior foi superado pelo foco em YouTube. Personagens: Sônia Rebatiza e Joca Feed.
- **Retrozim Launcher**: foram retirados o widget interno de data/hora, as instruções em páginas vazias e os marcadores de paginação; widgets seguem sem a moldura extra do launcher. Personagens: Dona Horária, César Tutorial, Beto Pontinhos e Nando Moldura.
- **Media 98**: a direção visual “Clássico adaptado” foi substituída por linguagem mais fiel ao player clássico em revisões seguintes. Personagem: Mauro Adaptado.
- **Design System**: para a apresentação de uma interface, há diretrizes por telas individuais, não mosaicos minúsculos. Personagem: Bia Mosaico.
- **Métodos de trabalho e manifesto**: experimentar, testar e aprender sem tratar protótipos como lançamentos; preferir clareza a excessos visuais. Personagens: Tadeu Sem Teste, Dudu Degradê e Tina Reuniões.
- **Perfis visuais anteriores**: Oracle, Iris Raven e Maya Otter inspiraram as fichas Oráculo Pereira, Íris Rabelo e Maia Otoni.

**Não confundir conceito, interface, funcionalidade ou nome retirado com um repositório encerrado.** Os repositórios consultados continuam com outros trabalhos ou fases em andamento. Nesta seção as situações documentadas servem de ponto de partida para o humor dos personagens; os desfechos fazem parte do universo criativo da Soft Wild. Nenhum dado de cliente ou bastidor de agência deve ser copiado para o site.

### Política de humor

- Irreverência com concisão: risada no fim, não parágrafos de stand-up.
- O alvo da piada é o excesso de complexidade, a burocracia, a dúvida ou o apego a ideias antigas — não pessoas reais.
- Não insinuar fraude, incompetência profissional real ou incidentes operacionais sem base.
- O contraste é deliberado: visual de ficha séria, texto absurdamente específico.
- Manter acessibilidade, busca e navegação por teclado intactas.

## Critérios de revisão

1. Todos os 44 cards exibem nome brasileiro proposto, cargo e descrição visível abaixo do cargo.
2. Textos grandes não são ocultados sem que a ficha completa esteja acessível.
3. O carrossel funciona com teclado e swipe, sem impedir a navegação, e usa pausa/autoplay já existentes.
4. O diretório, a busca e os detalhes utilizam o mesmo nome público e o mesmo cargo.
5. O memorial com 19 perfis descontinuados e um agradecimento explícito aparece depois da equipe ativa e antes do manifesto; 6 fichas iniciais, expansão acessível e busca em todo o arquivo.
6. Sem novas imagens, sem geração de SVG animado e sem alteração da fotografia do fundador nesta fase.
7. README atualizado com os nomes brasileiros e o memorial. Testar a versão publicada após a integração do PR.


## Registro da implementação v10 — 19/11/2026

- `docs/index.html`: navegação para a homenagem, cards com contagem, pontos de carrossel e bloco especial de agradecimento.
- `docs/styles.css`: retratos em formato full-bleed, legibilidade sobre gradiente, responsividade e acessibilidade de movimento reduzido; memorial separado em fichas com campos editoriais.
- `docs/app.js`: nomes canônicos, chave `portrait_file`, descrições curtas dos cards, detalhes completos, busca, carrossel com pontos e arquivo expansível.
- `docs/data/content.json`: 44 nomes definitivos, 44 descrições curtas e 19 perfis de ex-agentes.
- `README.md`: equipe com nomes brasileiros e memorial colapsável.

**Importante:** nesta entrega foram reutilizados os SVGs existentes como retratos temporários. A etapa de geração de 44 imagens individuais ainda não ocorreu; os arquivos futuros devem usar nomes novos estáveis e acompanhar um mapa de migração dos `portrait_file`.
