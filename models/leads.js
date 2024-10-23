const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  phone: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Lead', leadSchema);
