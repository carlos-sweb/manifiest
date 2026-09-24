import { build } from 'esbuild';
import { cpSync, rmSync, mkdirSync, existsSync, statSync, readdirSync } from 'fs';
import { resolve } from 'path';

// Misma fuente de verdad que build.ts — los assets CSS se definen en el YAML
import mdConfig from "./../src/md/items.yaml" with { type: "yaml" };

const ROOT = resolve(import.meta.dir, '..');
const SRC  = resolve(ROOT, 'www');
const DEST = resolve(ROOT, 'www-static');

const STYLED_SYSTEM = resolve(ROOT, 'styled-system');

/* ── Paso 0: limpiar destino ─────────────────────────────────────── */
if (existsSync(DEST)) {
  rmSync(DEST, { recursive: true, force: true });
  console.log(`🧹  Limpiado ${DEST}`);
}

mkdirSync(DEST, { recursive: true });

/* ── Paso 1: leer router.json para inlinearlo en el bundle ──────── */
const routerJsonPath = resolve(SRC, 'router.json');
const routerData = await Bun.file(routerJsonPath).text();

/* ── Paso 2: bundle de main.js con router.json inlineado ─────────── */
const outfile = resolve(DEST, 'main.js');

await build({
  entryPoints: [resolve(SRC, 'main.js')],
  outfile,
  format: 'esm',
  target: 'es2020',
  minify: true,
  sourcemap: false,
  bundle: true,
  plugins: [
    {
      name: 'inline-router-json',
      setup(b) {
        b.onResolve({ filter: /router\.json/ }, (args) => {
          console.log(`  📍  Interceptado: ${args.path} (desde ${args.importer})`);
          return {
            path: routerJsonPath,
            namespace: 'inline-json',
          };
        });
        b.onLoad({ filter: /.*/, namespace: 'inline-json' }, () => ({
          contents: routerData,
          loader: 'json',
        }));
      },
    },
    {
      // panda-ui-mithril usa imports relativos como
      //   import { css } from '../../../styled-system/css'
      // que desde node_modules/ no resuelven. Este plugin captura
      // cualquier path que contenga "styled-system/" y lo redirige
      // al directorio raíz del proyecto.
      name: 'styled-system',
      setup(b) {
        b.onResolve({ filter: /styled-system\// }, (args) => {
          if (args.path.startsWith('/')) return;
          let resolved = resolve(STYLED_SYSTEM, args.path.replace(/.*styled-system\//, ''));
          try {
            if (statSync(resolved).isDirectory()) {
              resolved = resolve(resolved, 'index.mjs');
            }
          } catch { /* no existe, esbuild fallará con buen error */ }
          return { path: resolved };
        });
      },
    },
  ],
});

console.log(`📦  Bundle → ${outfile}`);

/* ── Paso 3: copiar assets CSS desde el YAML (misma fuente que build.ts) ─ */
const cssLinks: string[] = mdConfig?.links ?? [];

if (!Array.isArray(cssLinks) || cssLinks.length === 0) {
  console.warn('⚠️  No se encontraron assets en src/md/items.yaml → links');
}

for (const file of cssLinks) {
  const srcPath = resolve(SRC, file);
  if (existsSync(srcPath)) {
    const destPath = resolve(DEST, file);
    cpSync(srcPath, destPath);
    console.log(`📄  Copiado  ${file}`);
  } else {
    console.warn(`⚠️  Asset declarado en YAML pero no encontrado: ${file}`);
  }
}

/* ── Paso 4: copiar directorio fonts/ ─────────────────────────────── */
const fontsSrc = resolve(SRC, 'fonts');
if (existsSync(fontsSrc)) {
  const fontsDest = resolve(DEST, 'fonts');
  cpSync(fontsSrc, fontsDest, { recursive: true });
  const fontFiles = readdirSync(fontsDest);
  console.log(`🔤  Fuentes  → fonts/ (${fontFiles.length} archivos)`);
}

/* ── Paso 5: copiar index.html ────────────────────────────────────── */
const htmlSrc = resolve(SRC, 'index.html');
const htmlDest = resolve(DEST, 'index.html');
cpSync(htmlSrc, htmlDest);
console.log(`📄  Copiado  index.html`);

/* ── Resumen ──────────────────────────────────────────────────────── */
console.log(`\n✅  Sitio estático generado en ${DEST}`);
