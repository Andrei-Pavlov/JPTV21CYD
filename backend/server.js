const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');

app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database'
});

app.get('/download/:id', (req, res) => {
  const fileId = req.params.id;

  db.query('SELECT filename, mimetype, data FROM files WHERE id = ?', [fileId], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (!results.length) return res.status(404).send('File not found');

    const file = results[0];

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.data);
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
