const { v4: uuidv4 } = require('uuid');
const { dbGet, dbRun, dbAll, runInTransaction } = require('./db');
const { PUBLIC_URL } = require('./config');

const basePublicUrl = PUBLIC_URL?.endsWith('/') ? PUBLIC_URL.slice(0, -1) : PUBLIC_URL;
const normalizeImageUrl = (url) => {
  if (!url) {
    return url;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `${basePublicUrl}${url}`;
};

const ensureCart = (session) => {
  if (!session.cart) {
    session.cart = { items: {} };
  }
  return session.cart;
};

const mapCartItems = (session) => {
  if (!session.cart || !session.cart.items) {
    return [];
  }
  return Object.values(session.cart.items);
};

const formatCartPayload = (session) => {
  const items = mapCartItems(session).map((item) => ({
    produtoId: item.produtoId,
    nome: item.nome,
    preco: item.preco,
    imagemUrl: item.imagemUrl,
    quantidade: item.quantidade,
    subtotal: Number((item.preco * item.quantidade).toFixed(2)),
  }));

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  return {
    items,
    total: Number(total.toFixed(2)),
    quantidadeTotal: items.reduce((acc, item) => acc + item.quantidade, 0),
  };
};

const getProducts = async () => {
  const produtos = await dbAll('SELECT * FROM produtos ORDER BY nome ASC');
  return produtos.map((produto) => ({
    ...produto,
    imagem_url: normalizeImageUrl(produto.imagem_url),
  }));
};

const addItemToCart = async (session, produtoId, quantidade = 1) => {
  if (!produtoId || quantidade <= 0) {
    throw new Error('Produto ou quantidade inválidos');
  }

  const produto = await dbGet('SELECT * FROM produtos WHERE id = ?', [produtoId]);
  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  const cart = ensureCart(session);
  const existingItem = cart.items[produtoId];

  const novaQuantidade = (existingItem?.quantidade || 0) + quantidade;
  if (produto.estoque < novaQuantidade) {
    throw new Error(`Estoque insuficiente para ${produto.nome}`);
  }

  cart.items[produtoId] = {
    produtoId: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    imagemUrl: normalizeImageUrl(produto.imagem_url),
    quantidade: novaQuantidade,
  };

  return formatCartPayload(session);
};

const updateCartItem = async (session, produtoId, quantidade) => {
  const cart = ensureCart(session);
  if (!cart.items[produtoId]) {
    throw new Error('Item não encontrado no carrinho');
  }

  if (quantidade <= 0) {
    delete cart.items[produtoId];
    return formatCartPayload(session);
  }

  const produto = await dbGet('SELECT estoque FROM produtos WHERE id = ?', [produtoId]);
  if (!produto) {
    delete cart.items[produtoId];
    throw new Error('Produto não encontrado');
  }

  if (produto.estoque < quantidade) {
    throw new Error('Estoque insuficiente');
  }

  cart.items[produtoId].quantidade = quantidade;
  return formatCartPayload(session);
};

const clearCart = (session) => {
  session.cart = { items: {} };
};

const finalizePurchase = async (session, email) => {
  if (!email) {
    throw new Error('Email é obrigatório para finalizar a compra');
  }

  const cartItems = mapCartItems(session);
  if (!cartItems.length) {
    throw new Error('Carrinho vazio');
  }

  const orderId = uuidv4();
  const total = cartItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  await runInTransaction(async () => {
    for (const item of cartItems) {
      const produto = await dbGet('SELECT estoque FROM produtos WHERE id = ?', [item.produtoId]);
      if (!produto || produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para ${item.nome}`);
      }
      await dbRun('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [item.quantidade, item.produtoId]);
    }

    await dbRun('INSERT INTO vendas (id, email, total) VALUES (?, ?, ?)', [orderId, email, total.toFixed(2)]);

    for (const item of cartItems) {
      await dbRun(
        'INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.produtoId, item.quantidade, item.preco, item.preco * item.quantidade]
      );
    }
  });

  const resumo = {
    orderId,
    total: Number(total.toFixed(2)),
    itens: cartItems.map((item) => ({
      nome: item.nome,
      quantidade: item.quantidade,
      subtotal: Number((item.preco * item.quantidade).toFixed(2)),
    })),
  };

  clearCart(session);
  return resumo;
};

module.exports = {
  getProducts,
  addItemToCart,
  updateCartItem,
  formatCartPayload,
  finalizePurchase,
};

