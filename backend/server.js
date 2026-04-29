const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/posts',    require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));

// ── Health ─────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// ── 404 ───────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 BlogFlow API on port ${PORT}`));
