const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: true
  },
  email: {
    type:     String,
    required: true,
    unique:   true,
    lowercase: true
  },
  password: {
    type:     String,
    required: true
  },
  role: {
    type:    String,
    enum:    ['citizen', 'official'],
    default: 'citizen'
  },
  points: {
    type:    Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);