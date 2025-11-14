import PropTypes from 'prop-types';

export function ProductCard({ product, onAdd, disabled }) {
  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={product.imagem_url} alt={product.nome} loading="lazy" />
      </div>
      <div className="product-card__body">
        <div>
          <h3>{product.nome}</h3>
          <p className="product-card__description">{product.descricao}</p>
        </div>
        <div className="product-card__footer">
          <span className="product-card__price">
            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
          </span>
          <button type="button" className="primary" disabled={disabled || product.estoque <= 0} onClick={() => onAdd(product.id)}>
            {product.estoque > 0 ? 'Adicionar' : 'Esgotado'}
          </button>
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    descricao: PropTypes.string,
    preco: PropTypes.number.isRequired,
    imagem_url: PropTypes.string,
    estoque: PropTypes.number,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ProductCard.defaultProps = {
  disabled: false,
};

