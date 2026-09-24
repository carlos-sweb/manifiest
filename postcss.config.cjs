// postcss.config.cjs — pipeline postcss del proyecto (Panda es una capa).
// La sección gestionada por `panda-ui-mithril config` (Postcss → Configure)
// es el bloque entre los dos comentarios pum:postcss dentro de plugins —
// no edites su interior a mano. Las entradas que añadas fuera del bloque se
// conservan al guardar desde el editor.
module.exports = {
  plugins: {
    /* pum:postcss */
    "@pandacss/dev/postcss": {"configPath":"panda.config.ts"},
    "cssnano": {},
    /* /pum:postcss */
  },
}
