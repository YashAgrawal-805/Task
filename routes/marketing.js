const express = require('express');
const routes = express.Router();
const marketingData = require("../DummyData/marketing.json");
const campaigns = marketingData.campaigns;

routes.get('/campaigns', (req, res) => {
  res.json({ campaigns });
});

routes.get('/campaigns/:id', (req, res) => {
  const campaignId = Number(req.params.id);
  const campaign = campaigns.find(c => c.id === campaignId);
  if (campaign) {
    res.json(campaign);
  } else {
    res.status(404).json({ error: 'Campaign not found' });
  }
});

routes.post('/campaigns/:id', async (req, res) => {
  let campaignId = Number(req.params.id);
  const campaign = campaigns.find((campaign) => campaign.id === campaignId);
  
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  try {
    const existingCampaign = await Campaign.findOne({ id: campaign.id });
    
    if (existingCampaign) {
      return res.status(409).json({ error: 'Campaign already exists in the database' });
    }

    const newCampaign = new Campaign({
      id: campaign.id,
      name: campaign.name,
      budget: campaign.budget,
      status: campaign.status,
      startDate: campaign.start_date,
      endDate: campaign.end_date,
      createdAt: campaign.created_at
    });

    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Failed to save campaign' });
  }
});

module.exports = routes;