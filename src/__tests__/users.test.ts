import request from 'supertest';
import { createApp } from '../app';
import { env } from '../config/env';
import { signBody } from '../interfaces/middlewares/hmacAuth';

function hmacHeaders(body: object) {
  const json = JSON.stringify(body);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = signBody(json, env.HMAC_SECRET, ts);
  return { ts, sig, json };
}

describe('POST /users', () => {
  it('creates a user and returns 201', async () => {
    const app = createApp();
    const payload = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
    const { ts, sig } = hmacHeaders(payload);

    const res = await request(app)
      .post('/users')
      .set('x-hmac-timestamp', ts)
      .set('x-hmac-signature', sig)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject({ name: 'John Doe', email: 'john@example.com' });
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('returns 409 when email already exists', async () => {
    const app = createApp();
    const payload = { name: 'Jane', email: 'dup@example.com', password: 'password123' };
    const { ts, sig } = hmacHeaders(payload);

    await request(app)
      .post('/users')
      .set('x-hmac-timestamp', ts)
      .set('x-hmac-signature', sig)
      .send(payload);

    const { ts: ts2, sig: sig2 } = hmacHeaders(payload);
    const res2 = await request(app)
      .post('/users')
      .set('x-hmac-timestamp', ts2)
      .set('x-hmac-signature', sig2)
      .send(payload);

    expect(res2.status).toBe(409);
  });

  it('returns 400 on invalid payload', async () => {
    const app = createApp();
    const payload = { name: 'A', email: 'not-an-email', password: '123' };
    const { ts, sig } = hmacHeaders(payload);

    const res = await request(app)
      .post('/users')
      .set('x-hmac-timestamp', ts)
      .set('x-hmac-signature', sig)
      .send(payload);

    expect(res.status).toBe(400);
  });
});
