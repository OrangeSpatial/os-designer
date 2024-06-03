import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts'
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
  plugins: []
})
