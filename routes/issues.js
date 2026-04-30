const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');

// ── HELPER ──
function generateTrackingId() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CRX-${num}`;
}

// ── GET ALL ISSUES ──
router.get('/', async (req, res) => {
  try {
    const Issue  = require('../models/Issue');
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: issues.length, issues });

  } catch (err) {
    console.error('GET ISSUES ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET SINGLE ISSUE BY ID ──
router.get('/:id', async (req, res) => {
  try {
    const Issue = require('../models/Issue');

    // Handle tracking ID like CRX-XXXXX
    if (req.params.id.startsWith('CRX-')) {
      const issue = await Issue.findOne({ trackingId: req.params.id.toUpperCase() })
        .populate('reportedBy', 'name');
      if (!issue) return res.status(404).json({ error: 'Issue not found' });
      return res.json({ success: true, issue });
    }

    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name');
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    res.json({ success: true, issue });

  } catch (err) {
    console.error('GET ISSUE ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── TRACK BY CRX ID ──
router.get('/track/:trackingId', async (req, res) => {
  try {
    const Issue = require('../models/Issue');
    const issue = await Issue.findOne({
      trackingId: req.params.trackingId.toUpperCase()
    }).populate('reportedBy', 'name');

    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    res.json({ success: true, issue });

  } catch (err) {
    console.error('TRACK ISSUE ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE ISSUE ──
router.post('/', auth, async (req, res) => {
  try {
    const Issue = require('../models/Issue');
    const User  = require('../models/User');
    const { title, description, category, priority, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ error: 'Fill all required fields' });
    }

    const issue = await Issue.create({
      trackingId:  generateTrackingId(),
      title,
      description,
      category,
      priority:    priority || 'medium',
      location,
      reportedBy:  req.user.id
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });

    res.status(201).json({
      success:    true,
      trackingId: issue.trackingId,
      issue
    });

  } catch (err) {
    console.error('CREATE ISSUE ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── UPVOTE ──
router.patch('/:id/vote', async (req, res) => {
  try {
    const Issue = require('../models/Issue');
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    res.json({ success: true, votes: issue.votes });

  } catch (err) {
    console.error('VOTE ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── UPDATE STATUS ──
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const Issue = require('../models/Issue');

    if (req.user.role !== 'official') {
      return res.status(403).json({ error: 'Only officials can update status' });
    }

    const { status } = req.body;
    const valid = ['open', 'in_progress', 'resolved'];

    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    res.json({ success: true, issue });

  } catch (err) {
    console.error('STATUS ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;