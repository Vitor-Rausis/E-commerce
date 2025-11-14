const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { APP_PORT, CLIENT_ORIGIN, SESSION_SECRET } = require('./config');
const { initDb } = require('./db');
const {
  getProducts,
  addItemToCart,
  updateCartItem,
  formatCartPayload,
  finalizePurchase,
} = require('./cartService');
const { sendOrderConfirmation } = require('./emailService');
const { sessionStore } = require('./sessionStore');

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
  })
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/produtos', async (_req, res, next) => {
  try {
    const produtos = await getProducts();
    res.json(produtos);
  } catch (error) {
    next(error);
  }
});

app.get('/carrinho', (req, res) => {
  res.json(formatCartPayload(req.session));
});

app.post('/carrinho', async (req, res, next) => {
  try {
    const { produtoId, quantidade = 1 } = req.body;
    const carrinho = await addItemToCart(req.session, Number(produtoId), Number(quantidade));
    res.status(201).json(carrinho);
  } catch (error) {
    next(error);
  }
});

app.put('/carrinho', async (req, res, next) => {
  try {
    const { produtoId, quantidade } = req.body;
    const carrinho = await updateCartItem(req.session, Number(produtoId), Number(quantidade));
    res.json(carrinho);
  } catch (error) {
    next(error);
  }
});

app.post('/finalizar-compra', async (req, res, next) => {
  try {
    const { email } = req.body;
    const resumo = await finalizePurchase(req.session, email);
    await sendOrderConfirmation({ email, order: resumo });
    res.status(201).json({
      mensagem: 'Compra finalizada com sucesso',
      pedido: resumo,
    });
  } catch (error) {
    next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 400;
  res.status(status).json({ mensagem: err.message || 'Erro inesperado' });
});

const bootstrap = async () => {
  await initDb();
  app.listen(APP_PORT, () => {
    console.log(`API pronta em http://localhost:${APP_PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('Erro ao iniciar servidor', error);
  process.exit(1);
});

