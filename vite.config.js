import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(async ({ command, mode }) => {
  const ENV = loadEnv(mode, process.cwd(), '')

  return {
    root: path.join(process.cwd()),
    base: '/',
    mode: ENV.NODE_ENV,
    define: {},
    plugins: [],
    publicDir: 'dist',
    build: {
      outDir: 'dist',
      manifest: true,
      rollupOptions: {
        input: {
          // vite не включает CSS в манифест, если он указан как entry
          // https://github.com/vitejs/vite/issues/4198
          // https://github.com/innocenzi/laravel-vite/issues/153
          // 'main.css': 'src/theme/main.css',
          'styles.js': 'src/theme/styles.js',
          'main.js': 'src/theme/main.js',
        }
      }
    }
  }
})