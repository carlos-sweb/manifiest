import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

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
        body {
          font-family: 'Fira Mono', monospace;
          font-optical-sizing: auto;
          font-weight: 400;
          font-style: normal;
        }
        code{
          font-family: "JetBrains Mono", monospace;
          font-optical-sizing: auto;
          font-weight: 600;
          font-style: normal;
        }       
      `,
    },

  ],
  shortcuts: {

  layout: `
    min-h-screen
    flex
    bg-gray-50
    text-gray-800
  `,

  toc: `
    hidden
    lg:block
    w-72
    shrink-0
    sticky
    top-0
    h-screen
    overflow-y-auto
    border-r    
    bg-white
    p-0
    m-0    
  `,
  'toc-item': `
    flex-1
    flex    
  `,
  'toc-subitem': `
    flex-1
    flex    
  `,  
  'toc-title': `
    text-lg
    font-bold
    mb-5
  `,

  content: `
    flex-1
    min-w-0
    overflow-x-hidden
  `,

  container: `
    max-w-5xl
    mx-auto
    px-8
    py-12
  `,

  'title-block': `
    mb-12
  `,

  title: `
    text-5xl
    font-bold
    leading-tight
    mb-4
  `,

  subtitle: `
    text-2xl
    text-gray-600
    mb-6
  `,

  author: `
    text-gray-600
  `,

  date: `
    text-sm
    text-gray-500
    mt-1
    mb-8
  `,

  abstract: `
    border-l-4
    border-blue-500
    bg-blue-50
    p-5
    rounded
    my-8
  `,

  'abstract-title': `
    font-semibold
    mb-2
  `,

  prose: `
    leading-7
    text-gray-800
  `,
  sourceCode:`    
    bg-gray-100
    rounded-md
    py-1
    pl-2
    block
    shadow-md

  `
  

}, 
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
},),

  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})