// build.ts
import postcss from 'postcss'
import unoCss from '@unocss/postcss'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

// Configuración de rutas
const inputFile = resolve('template/uno.css')
const outputFile = resolve('www/styles.css')
const isWatch = process.argv.includes('-w') || process.argv.includes('--watch')

// Función que hace el trabajo pesado
async function build() {
  try {
    console.log(`⏳ Procesando ${inputFile}...`)
    
    // 1. Leer tu archivo CSS
    const css = readFileSync(inputFile, 'utf-8')
    
    // 2. Pasarlo por PostCSS con el plugin de UnoCSS
    // (El plugin busca el @unocss all y los @apply y los resuelve)
    const result = await postcss([unoCss()]).process(css, { from: inputFile })
    
    // 3. Asegurar que la carpeta de salida existe
    mkdirSync(dirname(outputFile), { recursive: true })
    
    // 4. Escribir el CSS final
    writeFileSync(outputFile, result.css)
    
    console.log(`✅ CSS generado exitosamente en ${outputFile}\n`)
  } catch (error) {
    console.error('❌ Error al procesar el CSS:', error)
  }
}

// Ejecutar por primera vez
build()


