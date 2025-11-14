import PropTypes from 'prop-types';

export function InlineAlert({ type = 'info', message, onClose }) {
  if (!message) {
    return null;
  }
  return (
    <div className={`inline-alert inline-alert--${type}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Fechar aviso">
          ×
        </button>
      )}
    </div>
  );
}

InlineAlert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'error']),
  message: PropTypes.string,
  onClose: PropTypes.func,
};

InlineAlert.defaultProps = {
  type: 'info',
  message: '',
  onClose: undefined,
};

