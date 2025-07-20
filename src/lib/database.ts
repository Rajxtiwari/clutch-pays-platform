import { Pool } from 'pg';

// Local PostgreSQL connection
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'clutch_pays',
  password: 'password123',
  port: 5432,
});

export { pool };
