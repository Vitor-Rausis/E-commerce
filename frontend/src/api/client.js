const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.mensagem || data.message || 'Erro ao comunicar com o servidor';
    throw new Error(message);
  }
  return data;
};

export const apiClient = {
  async getProducts() {
    return request('/produtos');
  },
  async getCart() {
    return request('/carrinho');
  },
  async addToCart(produtoId, quantidade = 1) {
    return request('/carrinho', {
      method: 'POST',
      body: JSON.stringify({ produtoId, quantidade }),
    });
  },
  async updateCartItem(produtoId, quantidade) {
    return request('/carrinho', {
      method: 'PUT',
      body: JSON.stringify({ produtoId, quantidade }),
    });
  },
  async checkout(email) {
    return request('/finalizar-compra', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

