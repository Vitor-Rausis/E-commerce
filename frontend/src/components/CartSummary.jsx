import PropTypes from 'prop-types';

export function CartSummary({ cart, email, onEmailChange, onCheckout, loading, children }) {
  const currency = (value) => Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <section className="cart-summary">
      <header>
        <h2>Carrinho</h2>
        <span>{cart.quantidadeTotal} itens</span>
      </header>

      <div className="cart-summary__list">{children || (cart.items.length === 0 && <p>Seu carrinho está vazio.</p>)}</div>

      <footer>
        <div className="cart-summary__total">
          <span>Total</span>
          <strong>{currency(cart.total)}</strong>
        </div>

        <form
          className="checkout-form"
          onSubmit={(event) => {
            event.preventDefault();
            onCheckout();
          }}
        >
          <label htmlFor="checkout-email">
            E-mail para confirmação
            <input
              id="checkout-email"
              type="email"
              required
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="voce@email.com"
            />
          </label>
          <button type="submit" className="primary" disabled={loading || cart.items.length === 0}>
            {loading ? 'Finalizando...' : 'Finalizar Compra'}
          </button>
        </form>
      </footer>
    </section>
  );
}

CartSummary.propTypes = {
  cart: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        produtoId: PropTypes.number.isRequired,
        nome: PropTypes.string.isRequired,
        quantidade: PropTypes.number.isRequired,
        subtotal: PropTypes.number.isRequired,
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
    quantidadeTotal: PropTypes.number.isRequired,
  }).isRequired,
  email: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

CartSummary.defaultProps = {
  loading: false,
  children: null,
};

