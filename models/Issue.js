const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  trackingId: {
    type:   String,
    unique: true
  },
  title: {
    type:     String,
    required: true
  },
  description: {
    type:     String,
    required: true
  },
  category: {
    type:     String,
    enum:     ['road', 'water', 'power', 'waste', 'traffic', 'other'],
    required: true
  },
  priority: {
    type:    String,
    enum:    ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type:    String,
    enum:    ['open', 'in_progress', 'resolved'],
    default: 'open'
  },
  location: {
    type:     String,
    required: true
  },
  votes: {
    type:    Number,
    default: 0
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);