// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(() => {
    const certDir = path.resolve(__dirname, 'certs')
    const keyPath = path.join(certDir, 'dev.key')
    const certPath = path.join(certDir, 'dev.crt')

    // если сертификатов нет, Vite всё равно запустится по http
    const httpsConfig = fs.existsSync(keyPath) && fs.existsSync(certPath)
        ? {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        }
        : false

    return {
        plugins: [react()],
        server: {
            host: true,       // слушать все интерфейсы (0.0.0.0)
            port: 3000,
            https: httpsConfig
        }
    }
})