const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Global headers for tests
app.use((req, res, next) => {
  res.set('server', 'cloudflare');
  next();
});

// JSON parser with error handling for malformed JSON
app.use(express.json());
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON' });
  }
  if (err) {
    return res.status(400).json({ error: 'Bad Request' });
  }
  next();
});

// Health endpoint for CI waits
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Mock data similar to reqres.in
const users = [
  { id: 1, email: 'george.bluth@reqres.in', first_name: 'George', last_name: 'Bluth', avatar: 'https://reqres.in/img/faces/1-image.jpg' },
  { id: 2, email: 'janet.weaver@reqres.in', first_name: 'Janet', last_name: 'Weaver', avatar: 'https://reqres.in/img/faces/2-image.jpg' },
  { id: 3, email: 'emma.wong@reqres.in', first_name: 'Emma', last_name: 'Wong', avatar: 'https://reqres.in/img/faces/3-image.jpg' },
  { id: 4, email: 'eve.holt@reqres.in', first_name: 'Eve', last_name: 'Holt', avatar: 'https://reqres.in/img/faces/4-image.jpg' },
  { id: 5, email: 'charles.morris@reqres.in', first_name: 'Charles', last_name: 'Morris', avatar: 'https://reqres.in/img/faces/5-image.jpg' },
  { id: 6, email: 'tracey.ramos@reqres.in', first_name: 'Tracey', last_name: 'Ramos', avatar: 'https://reqres.in/img/faces/6-image.jpg' },
];

// K6 sample data for crocodiles public API
const crocodiles = [
  { id: 1, name: 'Bert', sex: 'M', date_of_birth: '2010-06-27' },
  { id: 2, name: 'Alf', sex: 'M', date_of_birth: '2014-06-27' },
  { id: 3, name: 'Alice', sex: 'F', date_of_birth: '2012-06-27' },
  { id: 4, name: 'Larry', sex: 'M', date_of_birth: '2001-06-27' },
];

// GET /public/crocodiles/
app.get('/public/crocodiles/', (req, res) => {
  res.status(200).json(crocodiles);
});

// GET /api/users?page=2 -> return a list with page and data
app.get('/api/users', (req, res) => {
  const page = Number(req.query.page || 1);
  const per_page = users.length;
  res.status(200).json({
    page,
    per_page,
    total: users.length * 2,
    total_pages: 2,
    data: users,
    support: {
      url: 'http://localhost:3000/support',
      text: 'Local API for tests. Customize as needed.',
    },
  });
});

// GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({});
  return res.status(200).json({ data: user });
});

// POST /api/users
app.post('/api/users', (req, res) => {
  const { name, job } = req.body || {};
  // behave like reqres: echo back name/job with id and createdAt
  const created = {
    name,
    job,
    id: String(Math.floor(Math.random() * 1000) + 100),
    createdAt: new Date().toISOString(),
  };
  return res.status(201).json(created);
});

// POST /api/users/:id - allow POST to specific user endpoint (test expects 201)
app.post('/api/users/:id', (req, res) => {
  const { id } = req.params;
  return res.status(201).json({ id, createdAt: new Date().toISOString() });
});

// PUT /api/users/:id
app.put('/api/users/:id', (req, res) => {
  const { name, job } = req.body || {};
  return res.status(200).json({ name, job, updatedAt: new Date().toISOString() });
});

// DELETE /api/users/:id
app.delete('/api/users/:id', (req, res) => {
  return res.status(204).send();
});

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Missing password' });
  // Basic success response
  return res.status(200).json({ token: 'QpwL5tke4Pnpja7X4' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});
