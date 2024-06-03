import { PluginOption, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const importCssPlugin = (): PluginOption => ({
  name: 'vite-plugin-vue-import-css',
  apply: 'build',
  enforce: 'post',
  generateBundle(_, bundle) {
    if (_.format !== 'es') return
    for (const chunk in bundle) {
      // 找到style.css文件, 导入index.mjs顶部
      if (chunk === 'index.mjs') {
        const file = bundle[chunk] as { code: string }
        file.code = `import './style.css';\n${file.code}`
      }
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'core',
      // formats: ["es", "umd", "cjs"],
      fileName: format => `core.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
          dir: 'dist/es'
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
          dir: 'dist/lib'
        }
      ]
    }
  },
  plugins: [
    vue(),
    dts({
      outDir: ['dist/types'],
      entryRoot: 'src',
      tsconfigPath: 'tsconfig.json',
      compilerOptions: {
        // declarationDir: "dist/es",
        declaration: true,
        emitDeclarationOnly: true
      }
    }),
    importCssPlugin()
  ]
})
