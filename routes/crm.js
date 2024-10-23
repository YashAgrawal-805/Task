const express = require('express');
const routes = express.Router();
const crmData = require("../DummyData/crm.json");
const leads = crmData.leads;
const Lead = require('../models/leads');

routes.get('/leads', (req, res) => {
    res.json({ leads });
});

routes.get('/leads/:id', (req, res) => {
    let leadId = Number(req.params.id);
    const lead = leads.find((lead) => lead.id === leadId);
    if (lead) {
      return res.json(lead);
    } else {
      return res.status(404).json({ error: 'Lead not found' });
    }
});
  
routes.post('/leads/:id', async (req, res) => {
  let leadId = Number(req.params.id);
  const lead = leads.find((lead) => lead.id === leadId);
  
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  try {
    const existingLead = await Lead.findOne({ id: lead.id });
    
    if (existingLead) {
      return res.status(409).json({ error: 'Lead already exists in the database' });
    }

    const newLead = new Lead({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      createdAt: lead.createdAt 
    });

    await newLead.save();
    res.status(201).json(newLead);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

module.exports = routes;