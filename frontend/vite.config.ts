import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({}),
  ],
  server: {
    port: 8802,
    proxy: {
      '/api': {
        target: 'http://localhost:8801',
        changeOrigin: true,
      },
    },
  },
})
