const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('Content', contentSchema);
