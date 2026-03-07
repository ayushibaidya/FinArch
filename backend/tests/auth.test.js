process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://local/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const request = require('supertest');
const bcrypt = require('bcrypt');

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
  withTransaction: jest.fn(),
  pool: { end: jest.fn() },
}));

const db = require('../src/config/db');
const app = require('../src/app');

describe('Auth endpoints', () => {
  it('POST /api/v1/auth/register should create user and return JWT', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            email: 'user@example.com',
            full_name: 'John Doe',
            created_at: '2026-02-11T00:00:00.000Z',
          },
        ],
      });

    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'user@example.com',
      fullName: 'John Doe',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('user@example.com');
    expect(res.body.token).toBeTruthy();
  });

  it('POST /api/v1/auth/login should validate credentials and return JWT', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);

    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          email: 'user@example.com',
          full_name: 'John Doe',
          password_hash: passwordHash,
        },
      ],
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(1);
    expect(res.body.token).toBeTruthy();
  });
});
