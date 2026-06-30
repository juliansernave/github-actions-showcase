const request = require('supertest');
const app = require('../../app/src/api');

describe('API', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /calculate adds two numbers', async () => {
    const res = await request(app).get('/calculate?op=add&a=2&b=3');
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test('GET /calculate subtracts', async () => {
    const res = await request(app).get('/calculate?op=subtract&a=10&b=4');
    expect(res.body.result).toBe(6);
  });

  test('GET /calculate divide by zero returns 400', async () => {
    const res = await request(app).get('/calculate?op=divide&a=1&b=0');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/zero/i);
  });

  test('GET /calculate unknown op returns 400', async () => {
    const res = await request(app).get('/calculate?op=sqrt&a=9&b=0');
    expect(res.status).toBe(400);
  });

  test('POST /echo reflects body', async () => {
    const res = await request(app).post('/echo').send({ msg: 'hello', n: 42 });
    expect(res.body).toEqual({ msg: 'hello', n: 42 });
  });
});
