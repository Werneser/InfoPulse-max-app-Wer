# Production image for Vite app — билд и preview
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
# ставим зависимости
RUN npm ci

COPY . .
RUN npm run build

# runtime image
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
# Установим только production зависимости, а также глобально serve для отдачи static-файлов
RUN npm ci --production && npm install -g serve

# копируем сборку из builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# команда запуска serve, слушает 0.0.0.0:3000
CMD ["serve", "-s", "dist", "-l", "3000"]