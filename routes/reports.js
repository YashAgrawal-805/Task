const express = require('express');
const routes = express.Router();
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const Lead = require('../models/leads');
const Campaign = require('../models/Campaign');

// CSV Route
routes.get('/csv', async (req, res) => {
  try {
    const leads = await Lead.find({}); 
    const campaigns = await Campaign.find({});
    
    let csvData = [];

    csvData.push({
      lead_id: '',
      lead_name: '',
      lead_email: '',
      lead_phone: '',
      lead_status: '',
      campaign_name: '',
      campaign_budget: '',
      campaign_status: '',
      campaign_start_date: '',
      campaign_end_date: ''
    });

    leads.forEach((lead) => {
      csvData.push({
        lead_id: lead.id || 'N/A',
        lead_name: lead.name || 'N/A',
        lead_email: lead.email || 'N/A',
        lead_phone: lead.phone || 'N/A',
        lead_status: lead.status || 'N/A'
      });
    });

    campaigns.forEach((campaign) => {
      csvData.push({
        campaign_name: campaign.name || 'N/A',
        campaign_budget: campaign.budget || 'N/A',
        campaign_status: campaign.status || 'N/A',
        campaign_start_date: campaign.startDate || 'N/A',
        campaign_end_date: campaign.endDate || 'N/A'
      });
    });

    const json2csvParser = new Parser({
      fields: [
        'lead_id', 'lead_name', 'lead_email', 'lead_phone', 'lead_status', 
        'campaign_name', 'campaign_budget', 'campaign_status', 
        'campaign_start_date', 'campaign_end_date'
      ]
    });
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads_campaign_report.csv');
    return res.send(csv);
  } catch (err) {
    console.error('Error generating CSV report:', err);
    res.status(500).json({ error: 'Failed to generate CSV report' });
  }
});

// PDF Route
routes.get('/pdf', async (req, res) => {
  try {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_report.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Leads and Campaign Report', { align: 'center' });
    doc.moveDown();

    const leads = await Lead.find({});
    const campaigns = await Campaign.find({});

    leads.forEach((lead) => {
      doc.fontSize(12).text(`Lead ID: ${lead.id || 'N/A'}`);
      doc.text(`Name: ${lead.name || 'N/A'}`);
      doc.text(`Email: ${lead.email || 'N/A'}`);
      doc.text(`Phone: ${lead.phone || 'N/A'}`);
      doc.text(`Status: ${lead.status || 'N/A'}`);
      doc.text(`Created At: ${lead.createdAt || 'N/A'}`);
      doc.moveDown();
    });

    campaigns.forEach((campaign) => {
      doc.fontSize(12).text(`Campaign ID: ${campaign.id || 'N/A'}`);
      doc.text(`Campaign Name: ${campaign.name || 'N/A'}`);
      doc.text(`Campaign Budget: ${campaign.budget || 'N/A'}`);
      doc.text(`Campaign Status: ${campaign.status || 'N/A'}`);
      doc.text(`Campaign Start Date: ${campaign.startDate || 'N/A'}`);
      doc.text(`Campaign End Date: ${campaign.endDate || 'N/A'}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error('Error generating PDF report:', err);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

module.exports = routes;
