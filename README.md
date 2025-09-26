# Aiqfome API (TypeScript)

API Node.js/Express em TypeScript com Clean Architecture, HMAC em rotas e testes com Jest.

## Setup

1. Copie `.env.example` para `.env` e ajuste se necessário:
```
PORT=3000
NODE_ENV=development
HMAC_SECRET=change-me
HMAC_TOLERANCE_SECONDS=300
```

2. Instale dependências:
```
npm install
```

3. Rodar em desenvolvimento:
```
npm run dev
```

4. Build e start:
```
npm run build
npm start
```

5. Testes e lint:
```
npm test
npm run lint
```

## Endpoints

- GET `/health` → `{ status: 'ok' }`
- POST `/users` (protegido por HMAC)
  - Body: `{ name: string, email: string, password: string }`
  - 201: `{ id, name, email, createdAt }`
- POST `/auth/login` (protegido por HMAC)
  - Body: `{ email: string, password: string }`
  - 200: `{ token: string }`

## HMAC nas rotas

Headers obrigatórios:
- `x-hmac-timestamp`: epoch em segundos
- `x-hmac-signature`: `hex( HMAC_SHA256( timestamp + ':' + rawBody ) )`

Exemplo em Node (cliente):
```js
const crypto = require('crypto');

function signBody(secret, timestamp, body) {
  const payload = `${timestamp}:${body}`;
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

const body = JSON.stringify({ name: 'John', email: 'john@example.com', password: 'secret123' });
const ts = Math.floor(Date.now() / 1000).toString();
const sig = signBody(process.env.HMAC_SECRET, ts, body);

// headers:
// 'x-hmac-timestamp': ts
// 'x-hmac-signature': sig
```

Observação: O servidor captura `rawBody` via `express.json({ verify })` para validar a assinatura.

## Arquitetura

- `domain/`: entidades e contratos
- `application/`: casos de uso e ports
- `infrastructure/`: implementações (ex.: repositório em memória, hash de senha, tokens)
- `interfaces/`: HTTP (rotas, controllers, validação, middlewares)

Repositório atual: `InMemoryUserRepository` (sem banco). Ao migrar para DB, substitua apenas a implementação do `UserRepository` e ajuste o container.

## Desenvolvimento

- Lint: ESLint v9 com config flat (`eslint.config.js`) e TypeScript
- Formatação: Prettier
- Testes: Jest + ts-jest + Supertest

## Resultados atuais de testes

- Suites: 4 passed
- Tests: 10 passed

## Segurança

- HMAC em rotas sensíveis
- Tolerância de timestamp configurável (`HMAC_TOLERANCE_SECONDS`)
- Hash de senha com `scrypt` (Node `crypto`)

