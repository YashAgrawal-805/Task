const express = require('express');
const routes = express.Router();
const Metric = require('../models/Metric');
const Lead = require('../models/leads');
const Campaign = require('../models/Campaign');

const runETL = async () => {
  try {
    const totalLeads = await Lead.countDocuments();
    const closedLeads = await Lead.countDocuments({ status: 'Closed' });
    const activeCampaigns = await Campaign.countDocuments({ status: 'Active' });

    let leadConversionRate = 0;
    if (totalLeads > 0) {
      leadConversionRate = (closedLeads / totalLeads) * 100;
    }

    const totalCampaignBudget = await Campaign.aggregate([
      { $group: { _id: null, totalBudget: { $sum: '$budget' } } }
    ]);
    
    const budgetMetricValue = totalCampaignBudget.length > 0 ? totalCampaignBudget[0].totalBudget : 0;

    const conversionRateMetric = new Metric({ name: 'leadConversionRate', value: leadConversionRate });
    const budgetMetric = new Metric({ name: 'totalCampaignBudget', value: budgetMetricValue });

    await conversionRateMetric.save();
    await budgetMetric.save();

    console.log('ETL process completed successfully');
  } catch (err) {
    console.error('Error in ETL process:', err);
  }
};

routes.get('/run', async (req, res) => {
  try {
    await runETL();
    res.status(200).json({ message: 'ETL process completed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to run ETL process' });
  }
});

routes.get('/metrics', async (req, res) => {
  try {
    const metrics = await Metric.find();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

module.exports = routes;
