const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aivtdb',
  password: 'admin',
  port: 5432, // Default PostgreSQL port
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL at:', result.rows[0].now);
  });
});

// Import routes
const reportsRouter = require('./routes/reports')(pool);
app.use('/api', reportsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
