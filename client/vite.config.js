import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// En producción el sitio vive en https://<usuario>.github.io/SciFinder/,
// por eso el build usa esa ruta base; en desarrollo sigue siendo "/".
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/SciFinder/' : '/',
}))
