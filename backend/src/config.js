const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const rootPath = path.join(__dirname, '..');

module.exports = {
  APP_PORT: process.env.APP_PORT || 4000,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  SESSION_SECRET: process.env.SESSION_SECRET || 'troque-este-segredo-em-producao',
  DB_PATH: process.env.DB_PATH || path.join(rootPath, 'data', 'ecommerce.db'),
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_TLS: process.env.REDIS_TLS === 'true',
  PUBLIC_URL: process.env.PUBLIC_URL || 'http://localhost:4000',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  DEFAULT_NOTIFICATION_EMAIL: process.env.DEFAULT_NOTIFICATION_EMAIL || 'compras@example.com',
};

