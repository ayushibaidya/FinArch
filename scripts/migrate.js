const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

const runMigrations = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGSERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const migrationsDir = path.resolve(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((name) => name.endsWith('.sql')).sort();

  for (const file of files) {
    const already = await db.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [file]);
    if (already.rowCount > 0) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

    await db.withTransaction(async (client) => {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
    });

    console.log(`Applied migration: ${file}`);
  }
};

runMigrations()
  .then(async () => {
    await db.pool.end();
    console.log('Migrations complete');
  })
  .catch(async (error) => {
    console.error('Migration failed', error);
    await db.pool.end();
    process.exit(1);
  });
