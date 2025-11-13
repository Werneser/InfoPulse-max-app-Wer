import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем .env из корневой папки max-bot
config({ path: resolve(__dirname, '..', '.env') });

export const BOT_CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  WEB_APP_URL: process.env.WEB_APP_URL || 'http://localhost:3000',
  ADMIN_IDS: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map(Number) : [],
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEV: process.env.NODE_ENV === 'development',
};