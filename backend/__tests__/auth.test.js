const request = require('supertest');
const { app, db } = require('../index');

describe('Auth API', () => {
  beforeAll((done) => {
    db.run('DELETE FROM users', done);
  });

  afterAll((done) => {
    db.close(done);
  });

  test('Register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  test('Login with registered user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('Login with wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'wrongpass' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
