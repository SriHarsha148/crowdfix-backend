const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
require('dotenv').config();

console.log('MONGO URI:', process.env.MONGO_URI); // ← add this

const app = express();

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());

// ── DATABASE CONNECTION ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// ── ROUTES ──
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));

// ── TEST ROUTE ──
app.get('/', (req, res) => {
  res.json({ message: '🚀 CrowdFix API is running!' });
});

// ── START SERVER ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});