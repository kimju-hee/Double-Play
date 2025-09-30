import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // REST API는 /api 로 프록시
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 웹소켓(STOMP/SockJS) 엔드포인트도 프록시
      '/ws-chat': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  define: {
    global: 'window', // sockjs-client의 global 참조 이슈 우회
  },
})
