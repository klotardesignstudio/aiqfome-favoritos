import express from 'express';
import request from 'supertest';
import { hmacAuth, signBody } from '../interfaces/middlewares/hmacAuth';
import { env } from '../config/env';

function buildApp() {
  const app = express();
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as any).rawBody = buf.toString('utf8');
      },
    })
  );
  app.post('/protected', hmacAuth, (req, res) => {
    res.json({ ok: true });
  });
  return app;
}

describe('hmacAuth middleware', () => {
  it('accepts valid signature', async () => {
    const app = buildApp();
    const body = JSON.stringify({ a: 1 });
    const timestamp = String(Math.floor(Date.now() / 1000));
    const sig = signBody(body, env.HMAC_SECRET, timestamp);

    const res = await request(app)
      .post('/protected')
      .set('x-hmac-timestamp', timestamp)
      .set('x-hmac-signature', sig)
      .send(JSON.parse(body));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('rejects invalid signature', async () => {
    const app = buildApp();
    const timestamp = String(Math.floor(Date.now() / 1000));

    const res = await request(app)
      .post('/protected')
      .set('x-hmac-timestamp', timestamp)
      .set('x-hmac-signature', 'deadbeef')
      .send({ a: 1 });

    expect(res.status).toBe(401);
  });

  it('rejects stale timestamp', async () => {
    const app = buildApp();
    const past = String(Math.floor(Date.now() / 1000) - env.HMAC_TOLERANCE_SECONDS - 5);
    const body = JSON.stringify({ a: 1 });
    const sig = signBody(body, env.HMAC_SECRET, past);

    const res = await request(app)
      .post('/protected')
      .set('x-hmac-timestamp', past)
      .set('x-hmac-signature', sig)
      .send(JSON.parse(body));

    expect(res.status).toBe(401);
  });
});
