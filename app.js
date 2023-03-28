const express = require('express');
const app = express();

const port = 23000;

// health
app.get('/api/health', (req, res) => {
  res.send({ status: 'ok' });
});

// start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
