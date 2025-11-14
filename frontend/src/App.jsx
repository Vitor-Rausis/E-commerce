import { useEffect, useState } from 'react';
import { apiClient } from './api/client';
import { ProductCard } from './components/ProductCard';
import { CartItem } from './components/CartItem';
import { CartSummary } from './components/CartSummary';
import { AppHeader } from './components/AppHeader';
import { InlineAlert } from './components/InlineAlert';
import './App.css';

const emptyCart = { items: [], total: 0, quantidadeTotal: 0 };

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(emptyCart);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [pendingAction, setPendingAction] = useState(false);
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState({ type: 'info', message: '' });

  const currency = (value) => Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const loadInitialData = async () => {
    try {
      setLoadingProducts(true);
      const [produtos, carrinho] = await Promise.all([apiClient.getProducts(), apiClient.getCart()]);
      setProducts(produtos);
      setCart(carrinho);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleAddToCart = async (produtoId) => {
    try {
      setPendingAction(true);
      const updatedCart = await apiClient.addToCart(produtoId, 1);
      setCart(updatedCart);
      setFeedback({ type: 'success', message: 'Produto adicionado ao carrinho.' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setPendingAction(false);
    }
  };

  const handleChangeQuantity = async (produtoId, quantidade) => {
    try {
      setPendingAction(true);
      const updatedCart = await apiClient.updateCartItem(produtoId, quantidade);
      setCart(updatedCart);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setPendingAction(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setPendingAction(true);
      const response = await apiClient.checkout(email);
      setCart(emptyCart);
      setFeedback({
        type: 'success',
        message: `Pedido ${response.pedido.orderId} confirmado! Verifique o e-mail.`,
      });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setPendingAction(false);
    }
  };

  return (
    <div className="app-shell">
      <AppHeader />

      <InlineAlert type={feedback.type} message={feedback.message} onClose={() => setFeedback({ type: 'info', message: '' })} />

      <main className="app-grid">
        <section className="product-section">
          <header>
            <h2>Produtos</h2>
            <p>Selecione um item para adicioná-lo ao carrinho.</p>
          </header>

          {loadingProducts ? (
            <p>Carregando produtos...</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={handleAddToCart} disabled={pendingAction} />
              ))}
            </div>
          )}
        </section>

        <aside className="cart-section">
          <CartSummary
            cart={cart}
            email={email}
            onEmailChange={setEmail}
            onCheckout={handleCheckout}
            loading={pendingAction}
          >
            {cart.items.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              cart.items.map((item) => (
                <CartItem key={item.produtoId} item={item} onChangeQuantity={handleChangeQuantity} disabled={pendingAction} />
              ))
            )}
          </CartSummary>
        </aside>
      </main>

      <footer className="app-footer">
        <span>Total da compra: {currency(cart.total)}</span>
        <span>Itens: {cart.quantidadeTotal}</span>
      </footer>
    </div>
  );
}

export default App;
