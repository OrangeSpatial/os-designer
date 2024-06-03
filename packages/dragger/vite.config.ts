import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts'
    },
    rollupOptions: {
      external: [],
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
          format: 'umd',
          name: 'dragger.umd',
          entryFileNames: 'dragger.umd.js',
          dir: 'dist/umd'
        }
      ]
    }
  },
  plugins: []
})
