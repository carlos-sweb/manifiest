/**
 * Servidor de desarrollo para Manifiest.
 *
 * Sirve www/ con Cache-Control: no-cache para evitar que el navegador
 * sirva router.json o main.js cacheados tras un rebuild.
 *
 * Uso:
 *   bun run dev
 */

import { serve, file } from 'bun';

const PORT = 9000;
const WWW = new URL('../www', import.meta.url).pathname;

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname === '/' ? '/index.html' : url.pathname;
    const filePath = WWW + path;

    const f = file(filePath);
    const exists = await f.exists();

    if (!exists) {
      return new Response('Not Found', { status: 404 });
    }

    return new Response(f.stream(), {
      headers: {
        'Content-Type': f.type || 'application/octet-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  },
});

console.log(`🚀  Servidor de desarrollo en http://localhost:${PORT}`);
