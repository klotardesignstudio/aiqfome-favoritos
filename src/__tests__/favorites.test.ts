import request from 'supertest';
import { createApp } from '../app';
import { env } from '../config/env';
import { signBody } from '../interfaces/middlewares/hmacAuth';

function hmacHeaders(body: object | string) {
  const json = typeof body === 'string' ? body : JSON.stringify(body);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = signBody(json, env.HMAC_SECRET, ts);
  return { ts, sig };
}

describe('Favorites flow', () => {
  it('adds, lists and removes favorites', async () => {
    const app = createApp();

    // Create user
    const user = { name: 'Fav', email: 'fav@example.com', password: 'secret123' };
    const h1 = hmacHeaders(user);
    await request(app)
      .post('/users')
      .set('x-hmac-timestamp', h1.ts)
      .set('x-hmac-signature', h1.sig)
      .send(user)
      .expect(201);

    // Login
    const login = { email: user.email, password: user.password };
    const h2 = hmacHeaders(login);
    const authRes = await request(app)
      .post('/auth/login')
      .set('x-hmac-timestamp', h2.ts)
      .set('x-hmac-signature', h2.sig)
      .send(login)
      .expect(200);

    const token = authRes.body.token as string;

    // Add favorite productId=1
    const addBody = { productId: 1 };
    const h3 = hmacHeaders(addBody);
    await request(app)
      .post('/favorites')
      .set('x-hmac-timestamp', h3.ts)
      .set('x-hmac-signature', h3.sig)
      .set('Authorization', `Bearer ${token}`)
      .send(addBody)
      .expect(204);

    // List favorites
    const h4 = hmacHeaders('');
    const listRes = await request(app)
      .get('/favorites')
      .set('x-hmac-timestamp', h4.ts)
      .set('x-hmac-signature', h4.sig)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listRes.body.productIds)).toBe(true);
    expect(listRes.body.productIds).toContain(1);

    // Remove favorite
    const h5 = hmacHeaders('');
    await request(app)
      .delete('/favorites/1')
      .set('x-hmac-timestamp', h5.ts)
      .set('x-hmac-signature', h5.sig)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // List again to ensure removal
    const h6 = hmacHeaders('');
    const listRes2 = await request(app)
      .get('/favorites')
      .set('x-hmac-timestamp', h6.ts)
      .set('x-hmac-signature', h6.sig)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(listRes2.body.productIds).not.toContain(1);
  });
});
