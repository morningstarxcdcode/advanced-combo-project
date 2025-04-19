const request = require('supertest');
const app = require('../index'); // Assuming your Express app is exported from index.js

describe('Auth API', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(4001, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('Login with registered user', async () => {
    const response = await request(server)
      .post('/api/login')
      .send({ username: 'admin', password: 'password' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  test('Login with wrong password', async () => {
    const response = await request(server)
      .post('/api/login')
      .send({ username: 'admin', password: 'wrongpassword' });
    expect(response.statusCode).toBe(401);
  });
});
