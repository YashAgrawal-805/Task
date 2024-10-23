// models/Metric.js
const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  name: String, // Name of the metric (e.g., 'leadConversionRate')
  value: Number, // Value of the metric
  date: { type: Date, default: Date.now } // Date when the metric was calculated
});

const Metric = mongoose.model('Metric', metricSchema);
module.exports = Metric;
