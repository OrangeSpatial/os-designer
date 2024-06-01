import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import elementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), elementPlus({})],
  resolve: {
    alias: {}
  }
})
