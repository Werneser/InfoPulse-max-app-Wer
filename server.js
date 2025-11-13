// server.js - опционально, для запуска production-like https сервера
import fs from 'fs'
import https from 'https'
import express from 'express'
import path from 'path'

const app = express()
const port = 3443

app.use(express.static(path.join(process.cwd(), 'dist')))

const keyPath = path.join(process.cwd(), 'certs', 'dev.key')
const certPath = path.join(process.cwd(), 'certs', 'dev.crt')

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error('Certificates not found in ./certs. Generate them first.')
    process.exit(1)
}

const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
}

https.createServer(options, app).listen(port, '0.0.0.0', () => {
    console.log(`HTTPS server listening at https://0.0.0.0:${port}`)
})