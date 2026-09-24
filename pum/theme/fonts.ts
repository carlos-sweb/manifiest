import { defineTokens } from '@pandacss/dev'

/**
 * Tipografías de panda-ui-mithril. Valores crudos (sin variante de tema).
 *
 * Roles tipográficos: `sans` (cuerpo/base), `display` (titulares) y `mono`
 * (código/valores). `display` arranca compartiendo el stack de `sans` para
 * no cambiar la apariencia por defecto; asignar otra familia al rol display
 * (p. ej. Playfair Display desde el editor) hace que los componentes de
 * título usen esa familia.
 */

export const fontsTokens = defineTokens({
  fonts: {
    sans: { value: '"IBM Plex Sans", system-ui, sans-serif' },
    display: { value: '"IBM Plex Sans", system-ui, sans-serif' },
    mono: { value: '"JetBrains Mono", monospace' },
  },
})
