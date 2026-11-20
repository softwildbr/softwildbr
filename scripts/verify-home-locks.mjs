#!/usr/bin/env node
// Soft Wild: detectar mudanças não revisadas em arquivos congelados do GitHub Pages.
// Sem dependências externas. A segurança efetiva requer branch rules + checks obrigatórios + agentes sem bypass.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const locks = JSON.parse(readFileSync('docs/home-locks.json', 'utf8'));
const problems = [];
const blobSha = (contents) => createHash('sha1')
  .update(Buffer.from(`blob ${contents.length}\0`))
  .update(contents)
  .digest('hex');

for (const [path, expected] of Object.entries(locks.file_git_blob_sha1)) {
  try {
    const current = blobSha(readFileSync(path));
    if (current !== expected) problems.push(`Arquivo protegido alterado: ${path} (hash atual ${current}; baseline ${expected}).`);
  } catch (error) {
    problems.push(`Arquivo protegido não pôde ser lido: ${path}: ${error.message}`);
  }
}
const index = readFileSync('docs/index.html', 'utf8');
const catalog = JSON.parse(readFileSync('docs/data/content.json', 'utf8'));
const slogan = 'Se for pra fazer mais do mesmo, agente nem faz.';

function textOf(element) {
  return element.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
const hero = index.match(/<h1 id="hero-title">([\s\S]*?)<\/h1>/);
if (!hero || textOf(hero[1]) !== slogan) problems.push('Título principal/slogan aprovado foi modificado.');
if (catalog.slogan !== slogan) problems.push('Slogan no catálogo foi modificado.');
if (!index.includes('<section class="manifesto-section" id="manifesto"') ||
    !index.includes('O óbvio já tem gente demais fazendo')) problems.push('Manifesto não foi encontrado.');
if (!index.includes('assets/softwild-logo.webp')) problems.push('Referência à marca visual foi removida.');
const types = {prototype: 0, concept: 0};
for (const item of catalog.products || []) {
  if (!Object.hasOwn(types, item.stage)) problems.push(`Estágio desconhecido: ${item.name}`);
  else types[item.stage] += 1;
}
for (const [type, expected] of Object.entries(types)) {
  const id = type === 'prototype' ? 'count-prototypes' : 'count-futures';
  const m = index.match(new RegExp(`id="${id}">(\\d+)<`));
  if (!m || Number(m[1]) !== expected) problems.push(`Contagem HTML ${id} divergente de catalog.products (${expected}).`);
}
const total = index.match(/class="total-caption"><strong>(\d+)<\/strong>/);
if (!total || Number(total[1]) !== catalog.products.length) problems.push('Total visível do catálogo diverge do JSON.');
const names = catalog.products.map(p => p.name);
if (new Set(names).size !== names.length) problems.push('Nomes duplicados no catálogo.');
if (!names.includes('Websites de universos fictícios')) problems.push('Conceito autoral registrado foi removido.');
for (const [mark, expected] of [['prototypes', types.prototype], ['futures', types.concept]]) {
  const begin = `<!-- catálogo:track-${mark} -->`;
  const end = `<!-- fim:track-${mark} -->`;
  const content = index.split(begin)[1]?.split(end)[0];
  const actual = content ? (content.match(/<article class="experiment-card">/g) || []).length : -1;
  if (actual !== expected) problems.push(`Fallback HTML ${mark}: ${actual} cards para ${expected} no catálogo.`);
}
if (problems.length) {
  process.stderr.write('\nSOFT WILD / HOME PROTEGIDA — BLOQUEIO DE INTEGRIDADE\n');
  problems.forEach(p => process.stderr.write('- ' + p + '\n'));
  process.stderr.write('Se o fundador aprovou uma mudança, documente o diff e solicite revisão humana antes de atualizar hashes. NÃO atualize o baseline apenas para passar no check.\n');
  process.exit(1);
}
process.stdout.write('Soft Wild: home, textos congelados, marca e catálogo íntegros.\n');
