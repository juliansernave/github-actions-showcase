const { Client } = require('pg');

// These tests require a running Postgres instance.
// In CI, use workflow 07-service-containers.yml which spins up postgres:15 automatically.
// Locally: docker run -e POSTGRES_PASSWORD=testpassword -p 5432:5432 postgres:15
const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://testuser:testpassword@localhost:5432/testdb',
});

beforeAll(async () => {
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS test_runs (
      id        SERIAL PRIMARY KEY,
      name      VARCHAR(100) NOT NULL,
      passed    BOOLEAN      NOT NULL,
      created_at TIMESTAMP   DEFAULT NOW()
    )
  `);
});

afterAll(async () => {
  await client.query('DROP TABLE IF EXISTS test_runs');
  await client.end();
});

test('can insert and read a test run record', async () => {
  await client.query(
    'INSERT INTO test_runs (name, passed) VALUES ($1, $2)',
    ['smoke-suite', true]
  );
  const res = await client.query(
    'SELECT * FROM test_runs WHERE name = $1',
    ['smoke-suite']
  );
  expect(res.rows).toHaveLength(1);
  expect(res.rows[0].passed).toBe(true);
});

test('can count records in the table', async () => {
  const res = await client.query('SELECT COUNT(*) FROM test_runs');
  expect(parseInt(res.rows[0].count, 10)).toBeGreaterThan(0);
});
