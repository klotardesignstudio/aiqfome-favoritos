import request from 'supertest';
import { createApp } from '../app';

describe('Docs', () => {
  it('serves openapi.json', async () => {
    const app = createApp();
    const res = await request(app).get('/openapi.json');
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);
    expect(res.body).toHaveProperty('openapi');
    expect(res.body).toHaveProperty('paths');
  });

  it('serves swagger UI', async () => {
    const app = createApp();
    const res = await request(app).get('/docs/');
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/html/);
  });
});
