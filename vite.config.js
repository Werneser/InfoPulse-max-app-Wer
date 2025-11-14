// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(() => {
    const certDir = path.resolve(__dirname, 'certs')
    const keyPath = path.join(certDir, 'dev.key')
    const certPath = path.join(certDir, 'dev.crt')

    const httpsConfig = fs.existsSync(keyPath) && fs.existsSync(certPath)
        ? {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        }
        : false

    return {
        base: '/InfoPulse-max-app-Wer/',
        plugins: [react()],
        server: {
            host: true,       
            port: 3000,
            https: httpsConfig
        }
    }
})
