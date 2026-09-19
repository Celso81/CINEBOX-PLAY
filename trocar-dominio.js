/**
 * trocar-dominio.js — troca o domínio do site em TODOS os lugares de uma vez.
 *
 * Por que existe: o domínio está cravado em ~30 pontos (canonical, og:url,
 * og:image, twitter:image, todo o JSON-LD, sitemap.xml e robots.txt). Trocar
 * na mão erra — basta esquecer o canonical para o Google continuar indexando
 * o endereço velho e tratar o novo como cópia.
 *
 * Vai ser usado pelo menos duas vezes:
 *   1) Netlify  -> pages.dev          (migração de 18/09/2026)
 *   2) pages.dev -> cineboxplay.com.br (quando comprar o domínio próprio)
 *
 * Uso:
 *   node trocar-dominio.js cineboxplay.netlify.app cinebox-play.pages.dev
 *   node trocar-dominio.js --conferir            (só mostra o que está no ar hoje)
 *
 * Não commita nada: você confere com `git diff` antes de subir.
 */

const fs = require('fs');
const path = require('path');

const ALVOS = ['public/index.html', 'public/sitemap.xml', 'public/robots.txt', 'LEIA-ME.md'];
const RAIZ = __dirname;

const args = process.argv.slice(2);

function dominiosPresentes() {
  const achados = new Map();
  for (const arq of ALVOS) {
    const p = path.join(RAIZ, arq);
    if (!fs.existsSync(p)) continue;
    const txt = fs.readFileSync(p, 'utf8');
    for (const m of txt.matchAll(/https?:\/\/([a-z0-9.-]+\.(?:app|dev|com|com\.br|net|io))/gi)) {
      const d = m[1].toLowerCase();
      if (d.includes('schema.org') || d.includes('w3.org') || d.includes('google')) continue;
      achados.set(d, (achados.get(d) || 0) + 1);
    }
  }
  return achados;
}

if (args[0] === '--conferir' || args.length === 0) {
  console.log('\n  Domínios encontrados nos arquivos do site:\n');
  const a = dominiosPresentes();
  if (!a.size) console.log('    (nenhum)');
  for (const [d, n] of [...a].sort((x, y) => y[1] - x[1])) {
    console.log(`    ${String(n).padStart(3)}x  ${d}`);
  }
  console.log('\n  Para trocar:  node trocar-dominio.js <de> <para>\n');
  process.exit(0);
}

const [de, para] = args;
if (!de || !para) {
  console.error('\n  Faltou argumento.\n  node trocar-dominio.js cineboxplay.netlify.app cinebox-play.pages.dev\n');
  process.exit(1);
}
if (de === para) {
  console.error('\n  Origem e destino são iguais. Nada a fazer.\n');
  process.exit(1);
}

console.log(`\n  Trocando  ${de}  ->  ${para}\n`);
let totalTrocas = 0;

for (const arq of ALVOS) {
  const p = path.join(RAIZ, arq);
  if (!fs.existsSync(p)) {
    console.log(`    ${arq.padEnd(14)} (não existe, pulando)`);
    continue;
  }
  const antes = fs.readFileSync(p, 'utf8');
  // escapa ponto para o domínio não virar curinga
  const re = new RegExp(de.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const n = (antes.match(re) || []).length;
  if (!n) {
    console.log(`    ${arq.padEnd(14)} 0 ocorrências`);
    continue;
  }
  fs.writeFileSync(p, antes.replace(re, para), 'utf8');
  totalTrocas += n;
  console.log(`    ${arq.padEnd(14)} ${n} trocada(s)`);
}

console.log(`\n  Total: ${totalTrocas} ocorrência(s).`);
console.log('\n  Confira antes de subir:');
console.log('    git diff --stat');
console.log('    git diff index.html | head -40\n');

if (totalTrocas) {
  const restou = dominiosPresentes();
  if (restou.has(de.toLowerCase())) {
    console.log(`  ⚠️  Ainda sobrou "${de}" em algum lugar — confira à mão.\n`);
  }
}
