import * as cheerio from 'cheerio';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'fs';
import hljs from 'highlight.js/lib/core';
import l_sql from 'highlight.js/lib/languages/sql';
import l_ts from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('sql', l_sql);
hljs.registerLanguage('typescript', l_ts);

const ROOT = resolve(import.meta.dir, '..');
const MD_DIR = resolve(ROOT, 'src/md');

type Section = { link: string; text: string; html: string };
type Mantenedor = {
  id: string;
  title: string;
  author: string;
  author_link: string;
  date: string;
  links: string[];
  sections: Section[];
};

/* ── Escanea src/md/ en busca de subdirectorios con index.md + config.yaml ─ */
const entries = readdirSync(MD_DIR, { withFileTypes: true });
const mantenedores: Mantenedor[] = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;

  const dir = resolve(MD_DIR, entry.name);
  const mdPath = resolve(dir, 'index.md');
  const yamlPath = resolve(dir, 'config.yaml');

  if (!existsSync(mdPath) || !existsSync(yamlPath)) continue;

  // Importación dinámica del YAML (Bun la resuelve en el acto)
  const cfg = await import(yamlPath, { with: { type: 'yaml' } });
  const mdConfig = cfg.default || cfg;

  const mdText = await Bun.file(mdPath).text();

  // Generación del HTML desde Markdown con highlight.js
  const htmlFromMD = new HTMLRewriter()
    .on("code.language-sql", {
      text(el) {
        el.replace(hljs.highlight(el.text, { language: 'sql' }).value, { html: true });
      },
    })
    .on("code.language-ts", {
      text(el) {
        el.replace(hljs.highlight(el.text, { language: 'typescript' }).value, { html: true });
      },
    })
    .transform(
      Bun.markdown.html(mdText, { headings: { ids: true } })
    );

  const $ = cheerio.load(htmlFromMD);

  // Partición en secciones (una por cada <h2>)
  const sections: Section[] = [];
  let current: Section | null = null;

  $('body').children().each((_, el) => {
    if (el.tagName === 'h2') {
      if (current) sections.push(current);
      const $el = $(el);
      current = { link: $el.attr('id') || '', text: $el.text() || '', html: '' };
      return;
    }
    if (current) {
      current.html += $.html(el);
    }
  });
  if (current) sections.push(current);

  mantenedores.push({
    id: entry.name,
    title: mdConfig?.title ?? '',
    author: mdConfig?.author?.name ?? '',
    author_link: mdConfig?.author?.link ?? '',
    date: mdConfig?.date ?? '',
    links: Array.isArray(mdConfig?.links) ? mdConfig.links : [],
    sections,
  });

  console.log(`  📄  ${entry.name} → ${sections.length} secciones`);
}

/* ── Escribir router.json ─────────────────────────────────────────── */
const routerData = { mantenedores };
await Bun.file(resolve(ROOT, 'www/router.json')).write(
  JSON.stringify(routerData, null, 1)
);

/* ── Generar index.html (plantilla SPA) ────────────────────────────── */
const firstTitle = mantenedores[0]?.title ?? 'Manifiest';

// CSS links: unión de todos los links de todos los mantenedores
const allLinks = new Set<string>();
for (const m of mantenedores) {
  for (const link of m.links) allLinks.add(link);
}

const rawHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${firstTitle}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="main.js"></script>
  </body>
</html>
`;

const rewriter = new HTMLRewriter();

rewriter.on("title", {
  element(el) {
    el.setInnerContent(firstTitle);
  },
});

rewriter.on("head", {
  element(el) {
    for (const link of allLinks) {
      el.append(`<link href="${link}" rel="stylesheet" />\n`, { html: true });
    }
  },
});

await Bun.write(
  resolve(ROOT, 'www/index.html'),
  rewriter.transform(rawHtml)
);

console.log(`\n✅  ${mantenedores.length} mantenedor(es) compilado(s)`);
