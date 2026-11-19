# Retratos da Soft Wild — rodada 01 (10 imagens individuais)

**Data do registro:** 19/11/2026
**Status:** arquivos gerados e validados no ambiente de trabalho; **binários ainda não enviados a este repositório**. Não substituir referências de imagens no site enquanto os arquivos não estiverem no GitHub.

## Contrato técnico

Os dez retratos usam **WebP RGB**, resolução **928 × 1720 pixels**, sem cards, pranchetas, texto, logo ou gradiente incorporado. O CSS existente aplica o degradê e o HTML mostra nome, cargo e descrição. A fotografia do fundador, Müller Multitarefa, permanece inalterada.

### Inventário e integridade (SHA-256)

| Nome final | Tamanho (bytes) | SHA-256 |
| --- | ---: | --- |
| `ana-litica.webp` | 248120 | `ec12fe58af71ad4a2276a16798f5b28e233b0474a7b35528165583469381d8c1` |
| `zeca-escuta.webp` | 373330 | `42a2700a2c0018408e43725442fa8ad9aa13a5d4dda67d7d8cb1a01e2802a70b` |
| `jana-jornada.webp` | 292596 | `791737f47a4510aee0cac6110fae1da9de69a7b98bd7518eeb11f0c414bab06f` |
| `lia-layout.webp` | 247108 | `fa3a5278402f093b132c7709695e99ae2957c6c42c3e2e22f9ca5481190050b9` |
| `mara-movimento.webp` | 307760 | `da522059f38ee94b42ae001db818aa68fa4d940047448acf5ebbdcda3923f506` |
| `beto-backend.webp` | 352120 | `348561cba2e353a2cd72294d110ad1c4c2028890d348de36d87145499adaf257` |
| `andre-androide.webp` | 333010 | `f71bb3003e7df26b2a1ecd768ccf2b627023ae0fa42edbfd27b91d708c704043` |
| `zilda-firewall.webp` | 198630 | `f9f3721764634c2104e58cef6ff0c36b4a10b30ba8291ca00cd5b55c8b27fdcc` |
| `orlando-orquestra.webp` | 284358 | `691199661aa2111671cd4e15a97fdb67dd99b128f1c8e4a02e21a8cf67d1a372` |
| `malu-multimodal.webp` | 375256 | `28d0328c7059b8cb5b06809eb5acb54154342919b483a6dd99fdcb31212263a6` |

**Diretório final de destino:** `docs/assets/agents/`.

Os arquivos individuais estão empacotados na entrega da conversa como `softwild-agentes-rodada-01.zip`. **Esta documentação é apenas o registro de produção, não uma cópia das imagens.** O link de download da conversa não constitui um URL público permanente para o GitHub.

### Procedimento para importar o pacote quando os binários estiverem acessíveis ao executor

1. Extrair os dez `.webp` na pasta `docs/assets/agents/` da cópia local deste repositório.
2. Validar dimensões **928 × 1720**, formato WebP, cores RGB e hashes SHA-256 listados acima.
3. Fazer um commit contendo os dez arquivos, sem sobrescrever os SVGs que ainda servem como fallback.
4. **Somente depois do commit confirmado**, trocar `portrait_file` dos dez agentes em `docs/data/content.json` e as respectivas referências estáticas em `docs/index.html`.
5. Conferir o carrossel nos tamanhos mobile e desktop, o contraste de texto e o atributo `alt`.
6. Guardar os SVGs originais até concluir a revisão visual de todas as 20 fotos.

### Atenções de QA

- Um arquivo é um único retrato vertical, não é montagem de equipe ou card com textos.
- **Jana Jornada:** mulher com tranças negras, jaqueta mostarda e fundo verde-pastel.
- O fundo da imagem é limpo; o degradê pertence exclusivamente ao CSS.
- A rodada 2 (agentes 11–20) permanece independente.
