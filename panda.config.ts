import { defineConfig } from '@pandacss/dev'
import pandaPreset from '@pandacss/preset-panda'
import { pumPreset } from './pum/preset'

export default defineConfig({
                                    /* pum:fontfaces */
  globalFontface: {
    'IBM Plex Sans': [
      { fontStyle: 'italic', fontDisplay: 'swap', fontWeight: 100, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-100-italic.woff2) format("woff2")' },
      { fontStyle: 'normal', fontDisplay: 'swap', fontWeight: 100, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-100-normal.woff2) format("woff2")' },
      { fontStyle: 'italic', fontDisplay: 'swap', fontWeight: 200, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-200-italic.woff2) format("woff2")' },
      { fontStyle: 'normal', fontDisplay: 'swap', fontWeight: 200, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-200-normal.woff2) format("woff2")' },
      { fontStyle: 'italic', fontDisplay: 'swap', fontWeight: 300, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-300-italic.woff2) format("woff2")' },
      { fontStyle: 'normal', fontDisplay: 'swap', fontWeight: 300, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-300-normal.woff2) format("woff2")' },
      { fontStyle: 'italic', fontDisplay: 'swap', fontWeight: 400, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-italic.woff2) format("woff2")' },
      { fontStyle: 'normal', fontDisplay: 'swap', fontWeight: 400, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2) format("woff2")' },
      { fontStyle: 'italic', fontDisplay: 'swap', fontWeight: 500, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-italic.woff2) format("woff2")' },
      { fontStyle: 'normal', fontDisplay: 'swap', fontWeight: 500, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2) format("woff2")' },
      { fontStyle: 'italic', fontDisplay: 'swap', fontWeight: 600, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-italic.woff2) format("woff2")' },
      { fontStyle: 'normal', fontDisplay: 'swap', fontWeight: 600, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2) format("woff2")' },
      { fontStyle: 'italic', fontDisplay: 'swap', fontWeight: 700, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-italic.woff2) format("woff2")' },
      { fontStyle: 'normal', fontDisplay: 'swap', fontWeight: 700, src: 'url(../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2) format("woff2")' },
    ],
  },
preflight: true,
  presets: [pandaPreset, pumPreset],
  include: [
    './www/main.js',
    './src/**/*.{js,ts}',
  ],
  staticCss: {
    recipes: '*',
  },
  outdir: 'styled-system',
  globalCss: {
    html: {
      minHeight: '100%',
    },    
    body: {
      margin: '0',
      minHeight: '100vh',
      bg: 'base-200',
      color: 'base-content',
      fontFamily: 'sans',
    },
    '#main-content': {
      '& h3': {
        fontSize: 'lg',
        fontWeight: 'medium',
        color: 'base-content',
        marginTop: '6',
        marginBottom: '2',
      },
      '& h4': {
        fontSize: 'md',
        fontWeight: 'semibold',
        color: 'base-content',
        marginTop: '5',
        marginBottom: '2',
      },
      '& p': {
        lineHeight: 'relaxed',
        color: 'base-content',
        marginBottom: '4',
        opacity: 0.9,
        size:18,
      },
      '& a': {
        color: 'primary',
      },
      '& ul, & ol': {
        marginBottom: '4',
        paddingLeft: '6',
      },
      '& li': {
        marginBottom: '1',
      },
      '& code': {
        fontFamily: 'mono',
        fontSize: 'sm',
        paddingX: '1',
        paddingY: '0.5',
        borderRadius: 'sm',
        bg: 'base-300',
      },
      '& pre': {
        bg: 'base-100',        
        padding: '4',
        borderRadius: 'lg',
        overflowX: 'auto',
        my: '4',
        fontSize: 'sm',
      },
      '& pre code': {
        bg: 'transparent',
        color: 'inherit',
        padding: '0',
        fontSize: 'inherit',
      },
      '& blockquote': {
        padding: '4',
        my: '4',
        bg: 'base-300',
        borderRadius: 'md',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderLeftColor: 'primary',
      },
      '& blockquote p': {
        fontStyle: 'italic',
        color: 'base-content',
        marginBottom: '0',
      },
      '& table': {
        width: '100%',
        marginTop: '6',
        marginBottom: '6',
        borderCollapse: 'collapse',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'base-300',
        borderRadius: '8px',
        fontSize: 'sm',
        lineHeight: '1.5',
        color: 'base-content',
        bg: 'base-100',        
      },
      '& th': {
        paddingX: '4',
        paddingY: '2.5',
        bg: 'base-200',
        fontWeight: 'semibold',
        fontSize: 'xs',
        textTransform: 'uppercase',
        letterSpacing: 'wider',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        borderBottomWidth: '2px',
        borderBottomColor: 'base-300',
      },
      '& td': {
        paddingX: '4',
        paddingY: '2.5',
        borderTopWidth: '1px',
        borderTopColor: 'base-300',
        verticalAlign: 'top',
      },
      '& tbody tr:nth-child(even)': {
        bg: 'base-200',
      },      
      '& th[align="right"], & td[align="right"]': {
        textAlign: 'right',
      },
      '& th[align="center"], & td[align="center"]': {
        textAlign: 'center',
      },
      '& td code, & th code': {
        fontFamily: 'mono',
        fontSize: '0.85em',
        paddingX: '1',
        paddingY: '0.5',
        bg: 'base-200',
        borderWidth: '1px',
        borderColor: 'base-300',
        borderRadius: 'sm',
      },
      '& .hljs-string': {
        textWrap: 'wrap',
      },
    },
  },
})
