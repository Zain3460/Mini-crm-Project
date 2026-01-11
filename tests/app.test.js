const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});

describe('Customers API', () => {
  it('should list customers', async (s) => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
