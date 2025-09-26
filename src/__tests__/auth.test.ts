import request from 'supertest';
import { createApp } from '../app';
import { env } from '../config/env';
import { signBody } from '../interfaces/middlewares/hmacAuth';

function hmacHeaders(body: object) {
  const json = JSON.stringify(body);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = signBody(json, env.HMAC_SECRET, ts);
  return { ts, sig };
}

describe('POST /auth/login', () => {
  it('returns token on valid credentials', async () => {
    const app = createApp();
    const user = { name: 'Auth', email: 'auth@example.com', password: 'secret123' };
    const h1 = hmacHeaders(user);
    await request(app)
      .post('/users')
      .set('x-hmac-timestamp', h1.ts)
      .set('x-hmac-signature', h1.sig)
      .send(user)
      .expect(201);

    const login = { email: user.email, password: user.password };
    const h2 = hmacHeaders(login);
    const res = await request(app)
      .post('/auth/login')
      .set('x-hmac-timestamp', h2.ts)
      .set('x-hmac-signature', h2.sig)
      .send(login);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('rejects invalid password', async () => {
    const app = createApp();
    const user = { name: 'Bad', email: 'bad@example.com', password: 'secret123' };
    const h1 = hmacHeaders(user);
    await request(app)
      .post('/users')
      .set('x-hmac-timestamp', h1.ts)
      .set('x-hmac-signature', h1.sig)
      .send(user)
      .expect(201);

    const login = { email: user.email, password: 'wrong' };
    const h2 = hmacHeaders(login);
    const res = await request(app)
      .post('/auth/login')
      .set('x-hmac-timestamp', h2.ts)
      .set('x-hmac-signature', h2.sig)
      .send(login);

    expect(res.status).toBe(401);
  });

  it('rejects invalid payload', async () => {
    const app = createApp();
    const payload = { email: 'nope', password: '' };
    const h = hmacHeaders(payload);
    const res = await request(app)
      .post('/auth/login')
      .set('x-hmac-timestamp', h.ts)
      .set('x-hmac-signature', h.sig)
      .send(payload);

    expect(res.status).toBe(400);
  });
});
