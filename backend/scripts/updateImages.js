/* eslint-disable no-console */
const { dbRun } = require('../src/db');

const updates = [
  {
    nome: 'Fone Bluetooth X100',
    imagem_url: '/static/images/Fone.webp',
  },
  {
    nome: 'Smartwatch Pulse',
    imagem_url: '/static/images/smart.jpeg',
  },
  {
    nome: 'Mochila TechPack',
    imagem_url: '/static/images/mochila.webp',
  },
  {
    nome: 'Câmera Action 4K',
    imagem_url: '/static/images/camera.jpg',
  },
];

const applyUpdates = async () => {
  for (const item of updates) {
    await dbRun('UPDATE produtos SET imagem_url = ? WHERE nome = ?', [item.imagem_url, item.nome]);
  }
  console.log('Imagens atualizadas no banco.');
  process.exit(0);
};

applyUpdates().catch((error) => {
  console.error('Erro ao atualizar imagens', error);
  process.exit(1);
});

