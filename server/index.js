const express = require('express');
const cors = require('cors');
const { query } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Health Check Endpoint
 * GET /api/health
 * Returns 200 OK if server is running
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

/**
 * Create Submission Endpoint
 * POST /api/submissions
 * 
 * Request body:
 * {
 *   "name": "string",
 *   "email": "string",
 *   "message": "string"
 * }
 * 
 * Response:
 * {
 *   "id": number,
 *   "created_at": "ISO timestamp"
 * }
 */
app.post('/api/submissions', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, and message are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    // Insert into database
    const result = await query(
      'INSERT INTO submissions (name, email, message) VALUES ($1, $2, $3) RETURNING id, created_at',
      [name, email, message]
    );

    const { id, created_at } = result.rows[0];

    console.log(`New submission created: ID ${id}`);

    res.status(201).json({
      id,
      created_at,
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started - listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
