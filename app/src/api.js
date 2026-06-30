const express = require('express');
const { add, subtract, multiply, divide } = require('./calculator');

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/calculate', (req, res) => {
  const { op, a, b } = req.query;
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  const ops = { add, subtract, multiply, divide };

  if (!ops[op]) return res.status(400).json({ error: `Unknown operation: ${op}` });

  try {
    res.json({ result: ops[op](numA, numB) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/echo', (req, res) => res.json(req.body));

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

module.exports = app;
