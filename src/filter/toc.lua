-- Normalización de caracteres UTF-8 a ASCII
local replacements = {
  ["á"] = "a", ["é"] = "e", ["í"] = "i", ["ó"] = "o", ["ú"] = "u",
  ["Á"] = "a", ["É"] = "e", ["Í"] = "i", ["Ó"] = "o", ["Ú"] = "u",
  ["ñ"] = "n", ["Ñ"] = "n", ["ü"] = "u", ["Ü"] = "u"
}

local function safe_slug(str)
  if not str then return "" end
  
  -- 1. Pasar a minúsculas usando el módulo UTF-8 nativo de Pandoc
  str = pandoc.text.lower(str)
  
  -- 2. Reemplazar vocales acentuadas por sus equivalentes simples
  for k, v in pairs(replacements) do
    str = string.gsub(str, k, v)
  end
  
  -- 3. Cambiar cualquier carácter no alfanumérico por un solo guión
  str = string.gsub(str, "[^%w%.%_]+", "-")
  
  -- 4. Limpiar guiones duplicados o al inicio/final
  str = string.gsub(str, "%-+", "-")
  str = string.gsub(str, "^%-", "")
  str = string.gsub(str, "%-$", "")
  
  return str
end

function Pandoc(doc)
  local items = {}

  for _, block in ipairs(doc.blocks) do
    -- Evaluamos si es Header y si es de nivel 2 o 3
    if block.t == "Header" and (block.level == 2 or block.level == 3) then
      local text = pandoc.utils.stringify(block.content)
      local safe_id = safe_slug(text)
      
      -- Sincronizamos el ID del encabezado con el enlace
      block.identifier = safe_id

      -- Definimos la clase según el nivel del encabezado
      local item_class = "toc-item"
      if block.level == 3 then
        item_class = "toc-subitem"
      end

      table.insert(
        items,
        string.format(
          '<div class="%s"><a class="toc-item-a" href="#%s">%s</a></div>',
          item_class,
          safe_id,
          text
        )
      )
    end
  end

  local html = table.concat(items, "\n")

  doc.meta.mytoc = pandoc.MetaBlocks({
    pandoc.RawBlock("html", html)
  })

  return doc
end
