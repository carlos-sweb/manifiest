import * as cheerio from 'cheerio';
import postcss from 'postcss';
import unoCss from '@unocss/postcss';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

import hljs from 'highlight.js/lib/core';
import l_sql from 'highlight.js/lib/languages/sql';
import l_ts from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('sql', l_sql);
hljs.registerLanguage('typescript', l_ts);

// Configuración de rutas
const inputFile = resolve('template/uno.css');
const outputFile = resolve('www/styles.css');

// Importación de datos y lectura de Markdown
import mdConfig from "./src/md/items.yaml" with { type: "yaml" };
const mdText = await Bun.file("./src/md/items.md").text();

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



// Extracción de encabezados para el menú lateral
const data = $.extract({
  links: [{
    selector: "h2",
    value: (el) => ({
      link: $(el).attr('id') || '',
      text: $(el).text() || ''
    })
  }],  
});

// Función para procesar el CSS con UnoCSS
async function buildCSS() {
  try {
    console.log(`⏳ Procesando ${inputFile}...`);
    const css = readFileSync(inputFile, 'utf-8');
    const result = await postcss([unoCss()]).process(css, { from: inputFile });
    
    mkdirSync(dirname(outputFile), { recursive: true });
    writeFileSync(outputFile, result.css);
    
    console.log(`✅ CSS generado exitosamente en ${outputFile}\n`);
  } catch (error) {
    console.error('❌ Error al procesar el CSS:', error);
  }
}

// Plantilla base HTML
const rawHtml = 
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
  </head>
  <body>  
    <nav id="nav-menu"></nav>
    <main id="main-content"></main>
    <script type="text/javascript" src="app.js"></script>
  </body>
</html>
`;

function getItem(item: { link: string; text: string }) {
  return `
    <div class="container-item">
      <span><a href="#${item.link}">${item.text}</a></span>
    </div>
  `;
}

function getHeader(data:{title:string;author:string;date:string}){
    return `<header class="article-header">
      <h1>${data.title}</h1>
      <div class="article-meta">
        <span class="meta-item author">
          Por <a href="#">${data.author}</a>
        </span>
        <span class="meta-divider">•</span>
        <time class="meta-item date" datetime="2026-07-26">${data.date}</time>
      </div>
    </header>`
}

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
        el.append(`<link href="${link}" rel="stylesheet" />`, { html: true });
      }
    }
  },
});

rewriter.on("#nav-menu", {
  element(el) {
    for (const item of data.links) {
      el.append(getItem(item), { html: true });
    }  
  },
});

rewriter.on("#main-content", {
  element(el) {
    if (mdConfig?.title) {
      el.append(getHeader(mdConfig), { html: true });      
    }
    el.append(htmlFromMD, { html: true });
  },
});

// Ejecución sincrónicamente ordenada
await Bun.write("./www/index.html", rewriter.transform(rawHtml));
await buildCSS();

