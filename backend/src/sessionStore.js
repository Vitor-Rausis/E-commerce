const { createClient } = require('redis');
const { RedisStore } = require('connect-redis');
const { REDIS_URL, REDIS_TLS } = require('./config');

const redisClient = createClient({
  url: REDIS_URL,
  socket: REDIS_TLS
    ? {
        tls: true,
        rejectUnauthorized: false,
      }
    : undefined,
});

redisClient.on('error', (error) => {
  console.error('Erro no Redis', error);
});

redisClient.on('connect', () => {
  console.info('Redis conectado com sucesso');
});

redisClient.connect().catch((error) => {
  console.error('Não foi possível conectar ao Redis', error);
});

const sessionStore = new RedisStore({
  client: redisClient,
  prefix: 'sess:ecomm:',
});

module.exports = { sessionStore, redisClient };

