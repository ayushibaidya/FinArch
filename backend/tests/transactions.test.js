process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://local/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const request = require('supertest');
const jwt = require('jsonwebtoken');

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
  withTransaction: jest.fn(async (cb) => {
    await mockClient.query('BEGIN');
    try {
      const result = await cb(mockClient);
      await mockClient.query('COMMIT');
      return result;
    } catch (e) {
      await mockClient.query('ROLLBACK');
      throw e;
    } finally {
      mockClient.release();
    }
  }),
  pool: { end: jest.fn() },
}));

const app = require('../src/app');

describe('Transaction endpoints', () => {
  const token = jwt.sign({ email: 'user@example.com' }, process.env.JWT_SECRET, {
    subject: '1',
    expiresIn: '1d',
  });

  beforeEach(() => {
    mockClient.query.mockReset();
    mockClient.release.mockReset();
  });

  it('POST /api/v1/transactions creates transaction and updates balance in DB transaction', async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [{ id: 1, user_id: '1', name: 'Checking', type: 'checking', balance: '1000.00', currency: 'USD' }],
      })
      .mockResolvedValueOnce({ rows: [{ id: 2, user_id: '1', name: 'Groceries', type: 'expense' }] })
      .mockResolvedValueOnce({
        rows: [{ id: 1, user_id: '1', name: 'Checking', type: 'checking', balance: '950.00', currency: 'USD' }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 100,
            user_id: '1',
            account_id: 1,
            category_id: 2,
            transaction_type: 'expense',
            amount: '50.00',
            description: 'Weekly groceries',
            transaction_date: '2026-02-11',
            created_at: '2026-02-11T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({});

    const res = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        accountId: 1,
        categoryId: 2,
        type: 'expense',
        amount: 50,
        description: 'Weekly groceries',
        transactionDate: '2026-02-11',
      });

    expect(res.status).toBe(201);
    expect(res.body.transaction.transaction_type).toBe('expense');
    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
  });
});
