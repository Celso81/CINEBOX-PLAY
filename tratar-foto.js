/* ============================================================
   Otimiza a foto da sala para uso no site.

   O QUE ELE FAZ (sempre):
   - Redimensiona e comprime para a web
   - Gera versão .webp (mais leve, melhora o Core Web Vitals e o SEO)

   OPCIONAL (desligado):
   - Desfocar as áreas da TV onde aparecem capas de filmes e séries.
     Para ligar, troque DESFOCAR para true na linha abaixo.

   COMO USAR:
   1. Salve a foto original em:  assets/img/sala-original.jpg
   2. Rode:  node tratar-foto.js
   3. Ele gera:  assets/img/sala-cinebox.jpg  e  sala-cinebox.webp
============================================================ */

const path = require('path');
const fs = require('fs');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('\n  Falta a biblioteca "sharp" para processar a imagem.');
  console.error('  Instale rodando este comando dentro desta pasta:\n');
  console.error('    npm install sharp\n');
  console.error('  IMPORTANTE: depois de instalar, NAO suba a pasta node_modules');
  console.error('  para a Netlify. Ela nao faz parte do site.\n');
  process.exit(1);
}

const DIR = path.join(__dirname, 'assets', 'img');
const ENTRADA = path.join(DIR, 'sala-original.jpg');
const SAIDA_JPG = path.join(DIR, 'sala-cinebox.jpg');
const SAIDA_WEBP = path.join(DIR, 'sala-cinebox.webp');

const LARGURA_FINAL = 1600;

const DESFOCAR = false;  // <-- troque para true se quiser desfocar as capas
const DESFOQUE = 14;

/* Áreas a desfocar, em fração da imagem (0 a 1).
   Só são usadas se DESFOCAR estiver como true. */
const AREAS = [
  { nome: 'parede de capas (canto sup. dir.)', x: 0.670, y: 0.070, w: 0.195, h: 0.205 },
  { nome: 'fileira "Populares"',               x: 0.378, y: 0.318, w: 0.482, h: 0.160 },
  { nome: 'fileira "Lançamentos"',             x: 0.378, y: 0.470, w: 0.482, h: 0.095 },
];

async function tratar() {
  if (!fs.existsSync(ENTRADA)) {
    console.error('\n  Nao encontrei a foto original.');
    console.error('  Salve o arquivo como:\n  ' + ENTRADA + '\n');
    process.exit(1);
  }

  const base = sharp(ENTRADA).rotate();
  const meta = await base.metadata();
  const { width: W, height: H } = meta;
  console.log(`Foto original: ${W}x${H}`);

  // Recorta cada area, desfoca e prepara para colar de volta
  const remendos = [];
  for (const a of DESFOCAR ? AREAS : []) {
    const left = Math.round(a.x * W);
    const top = Math.round(a.y * H);
    const width = Math.min(Math.round(a.w * W), W - left);
    const height = Math.min(Math.round(a.h * H), H - top);

    if (width <= 0 || height <= 0) {
      console.warn(`  ignorado (fora da imagem): ${a.nome}`);
      continue;
    }

    const buf = await sharp(ENTRADA)
      .extract({ left, top, width, height })
      .blur(DESFOQUE)
      .toBuffer();

    remendos.push({ input: buf, left, top });
    console.log(`  desfocado: ${a.nome}  (${width}x${height})`);
  }

  await sharp(ENTRADA)
    .composite(remendos)
    .resize({ width: LARGURA_FINAL, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(SAIDA_JPG);

  await sharp(ENTRADA)
    .composite(remendos)
    .resize({ width: LARGURA_FINAL, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(SAIDA_WEBP);

  const kb = (f) => Math.round(fs.statSync(f).size / 1024);
  const orig = kb(ENTRADA);
  console.log(`\nPronto!`);
  console.log(`  original           ${orig} KB`);
  console.log(`  sala-cinebox.jpg   ${kb(SAIDA_JPG)} KB`);
  console.log(`  sala-cinebox.webp  ${kb(SAIDA_WEBP)} KB  <- o mais leve`);
  console.log(`\nConfira o resultado antes de publicar.`);
}

tratar().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
