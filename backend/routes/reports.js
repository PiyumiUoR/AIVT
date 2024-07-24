const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Get all reports
  router.get('/vulnerabilities/', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          v.reportId AS id, 
          v.title, 
          a.artifactName 
        FROM 
          Vul_report v
        JOIN 
          Artifact a ON v.artifactId = a.artifactId
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // Get a specific report by ID
  router.get('/vulnerabilities/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(`
        SELECT 
          v.reportId AS id, 
          v.title, 
          v.description,
          a.artifactName,
          r.name AS reporterName,
          r.email AS reporterEmail,
          r.organization AS reporterOrganization,
          p.phase,
          p.description AS phaseDescription,
          at.attachments
        FROM 
          Vul_report v
        JOIN 
          Artifact a ON v.artifactId = a.artifactId
        JOIN 
          Reporter r ON v.reporterId = r.reporterId
        JOIN 
          Vul_phase p ON v.phId = p.phId
        LEFT JOIN 
          Attachments at ON a.artifactId = at.artifactId
        WHERE 
          v.reportId = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Vulnerability not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create a new report
  router.post('/vulnerabilities/add/', async (req, res) => {
    const { title, description, artifactId, reporterId, phId } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO Vul_report (title, description, artifactId, reporterId, phId) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, artifactId, reporterId, phId]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update a report
  router.put('/vulnerabilities/:id/', async (req, res) => {
    const { id } = req.params;
    const { title, description, artifactId, reporterId, phId } = req.body;
    try {
      const result = await pool.query(
        'UPDATE Vul_report SET title = $1, description = $2, artifactId = $3, reporterId = $4, phId = $5 WHERE reportId = $6 RETURNING *',
        [title, description, artifactId, reporterId, phId, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete a report
  router.delete('/vulnerabilities/:id/', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM Vul_report WHERE reportId = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Endpoint to get the count of vulnerabilities
  // router.get('/vulnerabilities/count/', async (req, res) => {
  //   try {
  //     const result = await pool.query('SELECT COUNT(*) FROM Vul_report');
  //     const count = parseInt(result.rows[0].count, 10);
  //     res.json({ count: count });
  //   } catch (err) {
  //     console.error('Error fetching count:', err.message);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // });  

  return router;
};
