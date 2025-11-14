## Loja Virtual - Desafio E-commerce

Solução full-stack com API Node.js + SQLite e front-end React/Vite para gerenciamento de carrinho, listagem de produtos e finalização de compra com envio de e-mail.

### Principais recursos
- Listagem de produtos com imagem, preço e estoque.
- Carrinho persistido por sessão com adicionar/remover/atualizar quantidade.
- Cálculo automático de subtotal por item e total geral.
- Finalização com registro da venda em banco relacional e disparo de e-mail.
- Proteções básicas (Helmet, CORS, Rate limit, sessões httpOnly).
- Extras: persistência do carrinho entre sessões, controle de estoque, histórico de vendas na base e layout responsivo.

---

## Backend (`/backend`)

### Tecnologias
Express, SQLite (sqlite3), express-session, Nodemailer, Helmet, Rate Limit.

### Configuração
1. Instalar dependências:
   ```bash
   cd /home/vitor/Desafio_E-commerce/backend
   npm install
   ```
2. Duplicar `env.example` para `.env` e ajustar valores (porta, origem do front e SMTP opcional).
3. Popular o banco:
   ```bash
   npm run seed
   ```
4. Subir a API:
   ```bash
   npm run dev
   ```
   A API ficará disponível em `http://localhost:4000`.

### Endpoints
| Método | Rota                 | Descrição                                      |
|--------|----------------------|-----------------------------------------------|
| GET    | `/produtos`          | Lista produtos disponíveis.                   |
| GET    | `/carrinho`          | Retorna estado atual do carrinho da sessão.   |
| POST   | `/carrinho`          | Adiciona produto ao carrinho.                 |
| PUT    | `/carrinho`          | Atualiza quantidade ou remove item (qtd = 0). |
| POST   | `/finalizar-compra`  | Finaliza compra, salva venda e envia e-mail.  |


---

## Front-end (`/frontend`)

### Tecnologias
React + Vite, CSS moderno responsivo.

### Configuração
1. Instalar dependências:
   ```bash
   cd /home/vitor/Desafio_E-commerce/frontend
   npm install
   ```
2. Copiar `env.example` para `.env` e ajustar `VITE_API_URL`.
3. Rodar em modo desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:5173`.
4. Para build:
   ```bash
   npm run build
   ```

### Fluxo de uso
1. A tela inicial mostra produtos carregados da API.
2. Ao clicar em “Adicionar”, o item é enviado ao carrinho (requisição com credenciais para manter a sessão).
3. No painel do carrinho é possível alterar quantidades ou zerar para remover.
4. Informe um e-mail válido e finalize a compra; o back-end confirma estoque, grava a venda, dispara e-mail e limpa o carrinho da sessão.

---

## Observações de Segurança
- Cookies `httpOnly` + `sameSite=lax`.
- Helmet e rate limit básicos já habilitados.
- Validações simples de entrada e checagem de estoque no servidor.
- Para produção configure HTTPS, segredo de sessão robusto e SMTP real.

---

## Scripts úteis
| Local     | Script          | Descrição                          |
|-----------|-----------------|------------------------------------|
| backend   | `npm run dev`   | Inicia API com hot reload.         |
| backend   | `npm run seed`  | Popula banco SQLite.               |
| frontend  | `npm run dev`   | Inicia Vite em modo dev.           |
| frontend  | `npm run build` | Build estático para produção.      |

---

## Próximos passos sugeridos
- Implementar autenticação de usuários para histórico individual.
- Substituir sessão em memória por store persistente.
- Integrar gateway de pagamento real (Stripe, PagSeguro, etc.).
- Publicar o build front-end em CDN e a API em ambiente gerenciado.

