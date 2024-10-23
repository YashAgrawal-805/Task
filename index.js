const express = require('express');
const app = express();
const port = 3000;
const crmRoute = require("./routes/crm");
const marketingRoute = require("./routes/marketing");
const etl = require("./routes/etl");
const reports = require("./routes/reports");
const {sendEmailAlert} = require("./utils/sendEmail"); 
const cron = require('node-cron');
const Lead = require('./models/leads');
const mongoose = require("./config/mongoose_connection")


app.use(express.json());


app.use('/api/crm', crmRoute);

app.use('/api/marketing', marketingRoute);

app.use('/api/etl', etl);

app.use('/api/reports', reports);

cron.schedule('*/10 * * * *', async () => {
  const leadThreshold = 50;

  console.log('Checking lead count...');

  try {
    const leadCount = await Lead.countDocuments();

    if (leadCount > leadThreshold) {
      const subject = 'Lead Count Exceeded Threshold';
      const message = `Alert: The number of leads has exceeded ${leadThreshold}. Current lead count: ${leadCount}.`;

      await sendEmailAlert(subject, message);
      console.log('Alert email sent');
    } else {
      console.log('Lead count is below the threshold');
    }
  } catch (err) {
    console.error('Error checking lead count:', err);
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
