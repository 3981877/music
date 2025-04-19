import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 5173,
    strictPort: true, // 如果端口已被占用则会直接退出
    open: true, // 启动时自动打开浏览器
  }
})
