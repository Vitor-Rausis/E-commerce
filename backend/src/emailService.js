const nodemailer = require('nodemailer');
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  DEFAULT_NOTIFICATION_EMAIL,
} = require('./config');

const hasSmtpConfig = SMTP_HOST && SMTP_USER && SMTP_PASS;

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });

const buildOrderEmailHtml = (order) => {
  const itemsList = order.itens
    .map(
      (item) =>
        `<tr>
          <td>${item.nome}</td>
          <td style="text-align:center;">${item.quantidade}</td>
          <td style="text-align:right;">R$ ${item.subtotal.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  return `
    <h2>Pedido confirmado!</h2>
    <p>Pedido: <strong>${order.orderId}</strong></p>
    <table width="100%" cellspacing="0" cellpadding="8" border="1" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Qtd</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList}
      </tbody>
    </table>
    <p><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
    <p>Obrigado por comprar com a gente!</p>
  `;
};

const sendOrderConfirmation = async ({ email, order }) => {
  const message = {
    from: DEFAULT_NOTIFICATION_EMAIL,
    to: email,
    subject: `Confirmação do pedido ${order.orderId}`,
    html: buildOrderEmailHtml(order),
  };

  const info = await transporter.sendMail(message);
  if (!hasSmtpConfig) {
    console.info('E-mail enviado em modo de teste:\n', info.message.toString());
  }
  return info;
};

module.exports = { sendOrderConfirmation };

