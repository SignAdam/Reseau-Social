const request = require('supertest');
const express = require('express');
const userRoute = require('../routes/user.routes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRoute);

describe('Test user endpoints', () => {
  it('should create a new user successfully', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should not create a user with existing username', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});
