process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://local/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
  withTransaction: jest.fn(),
  pool: { end: jest.fn() },
}));

const db = require('../src/config/db');
const app = require('../src/app');

describe('Account endpoints', () => {
  const token = jwt.sign({ email: 'user@example.com' }, process.env.JWT_SECRET, {
    subject: '1',
    expiresIn: '1d',
  });

  it('GET /api/v1/accounts requires JWT', async () => {
    const res = await request(app).get('/api/v1/accounts');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/accounts returns account list', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: 10,
          user_id: '1',
          name: 'Main Checking',
          type: 'checking',
          balance: '1000.00',
          currency: 'USD',
          created_at: '2026-02-11T00:00:00.000Z',
        },
      ],
    });

    const res = await request(app).get('/api/v1/accounts').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Main Checking');
  });
});
