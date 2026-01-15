import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // La sezione server/proxy non serve più perché axios punta diretto a 8080
})