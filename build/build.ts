import * as cheerio from 'cheerio';
import { resolve } from 'path';
import mdConfig from "./../src/md/items.yaml" with { type: "yaml" };

import hljs from 'highlight.js/lib/core';
import l_sql from 'highlight.js/lib/languages/sql';
import l_ts from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('sql', l_sql);
hljs.registerLanguage('typescript', l_ts);


// Importación de datos y lectura de Markdown

const mdText = await Bun.file( resolve( import.meta.dirname,"../src/md/items.md")).text();

// Generación del HTML desde Markdown
const htmlFromMD = new HTMLRewriter()
.on("code.language-sql",{
  text(el){  
      el.replace( hljs.highlight(el.text,{ language: 'sql' }).value ,{html:true})
  }
}).on("code.language-ts",{
  text(el){  
      el.replace( hljs.highlight(el.text,{ language: 'typescript' }).value ,{html:true})
  }
}).transform(
  Bun.markdown.html(mdText, { headings: { ids: true } })
) 
const $ = cheerio.load(htmlFromMD);



// Partición del documento en secciones (una por cada <h2>) para que la SPA
// de Mithril pueda enrutar cada sección con m.route en vez de recibir todo
// el HTML ya inyectado por el servidor.
type Section = { link: string; text: string; html: string };

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

const routerData = {
  title: mdConfig?.title ?? '',
  author: mdConfig?.author?.name ?? '',
  author_link: mdConfig?.author?.link ?? '',
  date: mdConfig?.date ?? '',
  sections,
};

await Bun.file(resolve(import.meta.dirname,'../www/router.json')).write(JSON.stringify(routerData,null,1))

// Plantilla base HTML — el shell que monta la SPA de Mithril. El nav y el
// contenido los arma main.js en el cliente a partir de router.json vía m.route.
// El CSS del sitio lo genera scripts/build-css.ts (Panda), no este script.
const rawHtml =
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="main.js"></script>
  </body>
</html>
`;

// Transformación con HTMLRewriter
const rewriter = new HTMLRewriter();

rewriter.on("title", {
  element(el) {
    if (mdConfig?.title) el.setInnerContent(mdConfig.title);
  }
});

rewriter.on("head", {
  element(el) {
    if (Array.isArray(mdConfig?.links)) {
      for (const link of mdConfig.links) {
        el.append(`<link href="${link}" rel="stylesheet" />\n`, { html: true });
      }
    }
  },
});

// Ejecución sincrónicamente ordenada
await Bun.write( 
  resolve(import.meta.dirname,"../www/index.html") , 
  rewriter.transform(rawHtml)
);

