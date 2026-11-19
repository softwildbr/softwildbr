# Soft Wild · Proposta de nomes e estrutura de retratos (pré-aprovação)

> Documento de trabalho. Os nomes abaixo são **propostas**, não identidades aprovadas.
> Esta branch não altera o perfil público enquanto não houver revisão e merge.

## Decisões aplicadas nesta branch

- Cards em formato **pôster fotográfico/ilustrado full bleed**, seguindo a referência visual enviada pelo fundador.
- A informação fica visível na própria peça, na ordem: **nome → selo AGENTE DE IA → cargo → descrição objetiva → ação para ficha completa**.
- Os 44 agentes continuam divididos nos mesmos 8 núcleos, preservando função, texto documental, ordem editorial e origem dos avatares.
- `proposed_name` é somente o nome de exibição; `name` permanece como referência de versão anterior e chave estável do SVG existente. **Não renomear os arquivos de retrato agora.**
- Não foram geradas imagens nesta etapa. Os SVGs existentes são arte provisória.
- A fotografia real do fundador e o card “As vozes na minha cabeça” permanecem sem alterações.
- Seção **Agentes descontinuados**: recupera personagens editoriais de versões visuais anteriores, sem alegar que foram funcionários ou sistemas autônomos ativos.

## Nomes propostos por núcleo

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
- **Tamanho do card CSS no desktop:** 232 × 420 px. **No celular:** 228 × 416 px. A imagem ocupa o card inteiro e recebe crop responsivo pelo `object-fit: cover`.
- **Área útil superior:** manter o rosto, o cabelo e a silhueta principal na região central e superior, com margem horizontal para crop. Evitar texto ou detalhes essenciais dentro da própria imagem.
- **Faixa inferior:** reservar aproximadamente 45% da altura para o gradiente escuro e a sobreposição de textos; evitar elementos narrativos importantes nessa área.
- **Visual:** retratos próximos com personalidade, diversidade de rostos e figurinos, enquadramento semelhante ao exemplo aprovado; manter identidade própria por agente, sem clonar uma face.
- **Acessibilidade:** não incorporar o nome ou o cargo na imagem; os textos devem permanecer HTML editável, legível, pesquisável e acessível.
- **Etapa de SVG animado:** somente depois de aprovar as imagens estáticas; cada personagem receberá animação individual, discreta, opcional, com alternativa estática para `prefers-reduced-motion`.

## Arquivo de ex-colaboradores

Conceito editorial: “Nem todo agente chega à versão 2.0. Não foram demitidos. Foram descontinuados.”

Personagens de propostas anteriores identificados no histórico visual: **Oracle**, **Iris Raven**, **Maya Otter**. Sua inclusão no arquivo descreve **versões de personagem**, não implantação operacional comprovada. Registrar datas e atividades somente quando forem documentalmente verificáveis.

## Critérios de revisão

1. Todos os 44 cards exibem nome brasileiro proposto, cargo e descrição visível abaixo do cargo.
2. Textos grandes não são ocultados sem que a ficha completa esteja acessível.
3. O carrossel funciona com teclado e swipe, sem impedir a navegação, e usa pausa/autoplay já existentes.
4. O diretório, a busca e os detalhes utilizam o mesmo nome público e o mesmo cargo.
5. O arquivo dos descontinuados aparece depois da equipe ativa e antes do manifesto.
6. Sem novas imagens, sem geração de SVG animado e sem alteração da fotografia do fundador nesta fase.
7. Ao aprovar os nomes, atualizar README e demais menções para eliminar divergência entre site e perfil principal.

