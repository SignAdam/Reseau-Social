const request = require('supertest');
const express = require('express');
const uploadRoute = require('../routes/upload');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', uploadRoute);

describe('Test upload image endpoint', () => {
  it('should upload an image successfully', async () => {
    const res = await request(app)
      .post('/api/user/upload')
      .attach('image', path.join(__dirname, 'test-image.jpg'));

    expect(res.statusCode).toEqual(200);
    expect(res.text).toMatch(/Image uploaded successfully/);
  });

  it('should return an error if no file is uploaded', async () => {
    const res = await request(app)
      .post('/api/user/upload');

    expect(res.statusCode).toEqual(500);
    expect(res.text).toMatch(/An error occurred while uploading the image/);
  });
});
