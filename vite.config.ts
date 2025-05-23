import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/inventory/', // 👈 اسم مجلد مشروعك على GitHub
  plugins: [react()],
})
