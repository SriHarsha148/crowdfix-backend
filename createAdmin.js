require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB...');

  const existing = await User.findOne({ email: 'admin@crowdfix.in' });
  if (existing) {
    console.log('⚠️  Admin already exists!');
    process.exit();
  }

  const password = await bcrypt.hash('admin123', 10);

  await User.create({
    name:     'CrowdFix Admin',
    email:    'admin@crowdfix.in',
    password: password,
    role:     'official'
  });

  console.log('✅ Admin account created!');
  console.log('   Email:    admin@crowdfix.in');
  console.log('   Password: admin123');
  process.exit();
}

createAdmin();