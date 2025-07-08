import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5174,
      strictPort: true,
      // Permitir todos os hosts (incluindo ngrok)
      allowedHosts: 'all',
      // Configurações de CORS
      cors: {
        origin: true,
        credentials: true
      },
      // Headers para acesso externo
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      },
      // Configurações para ngrok e desenvolvimento
      hmr: {
        port: 5174
      },
      // Configurações específicas para ngrok
      disableHostCheck: true,
      // Configurações de segurança flexíveis para desenvolvimento
      https: false,
      open: false
    },
    // Configurações para desenvolvimento
    define: {
      global: 'globalThis',
    },
    // Configurações para build
    build: {
      target: env.VITE_BUILD_TARGET || 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
    }
  }
})
