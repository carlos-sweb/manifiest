import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,  
} from 'unocss'

import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'


export default defineConfig({  
  content: {
    filesystem: [
      '**/*.{html,js,ts,jsx,tsx,vue,svelte,astro,marko}',
      'template/uno.css'
    ],
  },
  preflights : [
    {
      getCSS: ({ theme }) => `        
            
      `,
    },

  ], 
  theme: {
    fontFamily: {
      sans: "Poppins, sans-serif",
      mono: "JetBrains Mono, monospace",
    },
    colors: {
      // ...
    }
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      provider: 'fontsource', // default provider
      fonts: {
        // these will extend the default theme
        mono: ['Fira Mono','JetBrains Mono'],
      },
      processors : createLocalFontProcessor({
         cacheDir: 'node_modules/.cache/unocss/fonts',
         fontAssetsDir: 'www/assets/fonts',
         fontServeBaseUrl: '/assets/fonts',
         fetch : async url => await fetch(url)
      })
},),

  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})