pandoc -s ./src/md/items.md \
--toc \
--lua-filter ./src/filter/toc.lua \
--template="template/template.html" \
--from="markdown" \
--to="html" \
--output="www/index.html"

bun run build.ts



 #ctx7sk-19a5bb94-e7a0-42c8-9779-f8fb3d3a08e9
 #sudo ~/llama.cpp/build/bin/llama-server -m ~/qwen2.5-coder-3b.gguf -c 32768 -t 8 --chat-template chatml --jinja --ui-mcp-proxy --port 8080 --host 127.0.0.1
