# Soft Wild — manutenção do site público

**Site HTML:** `docs/index.html` · **Estilos:** `docs/styles.css` · **Interatividade:** `docs/app.js` · **Dados:** `docs/data/content.json` · **Revisão inicial:** 18/11/2026.

## Publicar pelo GitHub Pages

O site foi preparado para o endereço de projeto **https://softwildbr.github.io/softwildbr/**.

Configuração inicial necessária **uma única vez** na interface do GitHub:

1. Acesse [softwildbr/softwildbr → Settings → Pages](https://github.com/softwildbr/softwildbr/settings/pages).
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Branch: **main**. Pasta: **/docs**.
4. Clique **Save**.
5. Confira o resultado na página de Pages e visite o endereço publicado.

O conector atualmente utilizado para editar o repositório não disponibiliza a alteração das configurações de Pages. **Não afirmar que o endereço está no ar antes de verificar a implantação.** Depois de habilitar, cada novo commit em `main/docs` pode iniciar uma nova publicação.

## Como atualizar conteúdo sem refazer o site

Edite `docs/data/content.json`, usando as seguintes estruturas:

- **`products`**: `name`, `description`, `status`, `stage` (`prototype` para projetos com repositório próprio, `concept` para hipóteses). Não confundir protótipos, alfas, ideias e lançamentos.
- **`fronts`**: `name`, `status`, `progress`, `next`, `updated`. Dados de progresso são factuais e datados, sem percentuais inventados.
- **`groups`**: núcleo `name` e `agents` com `name`, `role`, `description`, `gender` (apenas para diversidade visual da ilustração, não identidade real). Os 44 agentes são personagens editoriais de IA; **não declarar operação autônoma sem configuração e evidência**.
- **`updated`**: data ISO da última revisão do catálogo. Não atualizar a data sem conferir a fonte.

A seção **Sinais do futuro** e o **manifesto** estão em `index.html` e precisam ser editados com curadoria específica. O slogan oficial é **“Se for pra fazer mais do mesmo, agente nem faz.”**. Preservar “agente” junto.

## Arte e identidade

- **Logo aprovado:** `docs/assets/softwild-logo.webp` — cópia otimizada da arte aprovada para o GitHub. O PNG original de 512×512, não redesenhado, continua sendo o arquivo de referência para avatar de conta.
- **Fotografia de Müller:** `docs/assets/muller.webp` — derivado compacto da fotografia que o fundador forneceu e autorizou para a página. Se substituir por versão em resolução maior, preservar rosto, enquadramento e direitos.
- **Agentes:** retratos ilustrados vetoriais gerados pelo próprio `app.js`, com formas e variações definidas; não são imagens de pessoas reais nem robôs. A equipe de destaque possui oito estilos de cabelo distintos.
- **Estética:** branco/marfim, preto-azulado e acentos em ciano/verde-água, tipografia editorial, respiro e simplicidade. Evitar gradientes exagerados, ícones genéricos de tecnologia e dados inventados.

## QA antes de cada publicação

1. Conferir no JSON se nomes, estados e progresso estão corretos na data da edição.
2. Abrir o HTML num servidor HTTP local (ex.: `python3 -m http.server 8000 --directory docs`) e testar desktop/mobile.
3. Validar navegação por teclado, menu mobile, filtros de projetos, botão “Explorar mais”, diálogos de detalhes, seção expansível de pesquisas e diretório completo.
4. Testar acessibilidade básica, contraste e `prefers-reduced-motion`.
5. Checar imagens, links, carregamento do JSON e ausência de erros no console.
6. Conferir o estado publicado no endereço GitHub Pages, após commit e implantação.
7. Registrar data, link do commit e mudanças na [Issue #8 do Laboratório de Ideias](https://github.com/softwildbr/laboratorio-de-ideias/issues/8).

## Privacidade e rastreabilidade

O catálogo público é uma síntese editorial. **Não copiar para `docs/`** documentos inteiros de repositórios privados, dados de clientes, credenciais ou relatórios de agência. Confirmar a fonte original em `empresa-maker-central`, `pesquisas`, `laboratorio-de-ideias` e nos repositórios individuais antes de atualizar afirmações públicas.

**Shopping centers:** “30 dossiês” refere-se a uma amostra de pesquisa documental num PR de Etapa 1; não representa 30 auditorias visuais, testes de aplicativos ou produto lançado. A Etapa 2 de UX/visual foi suspensa.
