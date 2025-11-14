import PropTypes from 'prop-types';

export function CartItem({ item, onChangeQuantity, disabled }) {
  return (
    <div className="cart-item">
      <div className="cart-item__info">
        <strong>{item.nome}</strong>
        <span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}</span>
      </div>
      <div className="cart-item__actions">
        <label>
          Qtd.
          <input
            type="number"
            min="0"
            value={item.quantidade}
            disabled={disabled}
            onChange={(event) => onChangeQuantity(item.produtoId, Number(event.target.value))}
          />
        </label>
        <span className="cart-item__subtotal">
          {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}
        </span>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    produtoId: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    preco: PropTypes.number.isRequired,
    quantidade: PropTypes.number.isRequired,
    subtotal: PropTypes.number.isRequired,
  }).isRequired,
  onChangeQuantity: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

CartItem.defaultProps = {
  disabled: false,
};

