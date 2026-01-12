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
  // Moha: API artık sayfalama desteği ile { data, total, page, pageSize } formatında döner.
  it('should list customers', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('pageSize');
  });
});
