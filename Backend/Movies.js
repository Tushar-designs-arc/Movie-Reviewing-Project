const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Movies route
app.get('/api/movies', (req, res) => {
  res.json([
    { id: 1, title: 'Movie 1', rating: 4.5 },
    { id: 2, title: 'Movie 2', rating: 4.0 }
  ]);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});