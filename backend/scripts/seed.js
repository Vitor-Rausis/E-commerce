/* eslint-disable no-console */
const { initDb, dbRun, dbGet } = require('../src/db');

const produtosBase = [
  {
    nome: 'Fone Bluetooth X100',
    descricao: 'Cancelamento ativo de ruído e bateria de 30h.',
    preco: 399.9,
    imagem_url: '/static/images/Fone.webp',
    estoque: 25,
  },
  {
    nome: 'Smartwatch Pulse',
    descricao: 'Monitoramento cardíaco contínuo e GPS integrado.',
    preco: 699.0,
    imagem_url: '/static/images/smart.jpeg',
    estoque: 18,
  },
  {
    nome: 'Mochila TechPack',
    descricao: 'Compartimentos acolchoados para laptop até 17".',
    preco: 289.5,
    imagem_url: '/static/images/mochila.webp',
    estoque: 40,
  },
  {
    nome: 'Câmera Action 4K',
    descricao: 'Resistente à água e estabilização eletrônica.',
    preco: 1199.9,
    imagem_url: '/static/images/camera.jpg',
    estoque: 12,
  },
];

const seed = async () => {
  await initDb();

  const existing = await dbGet('SELECT COUNT(*) as total FROM produtos');
  if (existing.total > 0) {
    console.log('Produtos já cadastrados, nada a fazer.');
    process.exit(0);
  }

  for (const produto of produtosBase) {
    await dbRun(
      'INSERT INTO produtos (nome, descricao, preco, imagem_url, estoque) VALUES (?, ?, ?, ?, ?)',
      [produto.nome, produto.descricao, produto.preco, produto.imagem_url, produto.estoque]
    );
  }

  console.log('Banco populado com produtos iniciais.');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Erro ao executar seed', error);
  process.exit(1);
});

