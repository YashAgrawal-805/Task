
1] Download it on your Computer
2] create a .env file
  - MONGO_URI containing mogoose server
  - EMAIL_USER containing email address
  - EMAIL_PASS containing app password
  - EMAIL_RECIEVER containing email of reciever
3] CRM: (https://server.com/api/crm)
  - /leads  =  Give all leads in data (GET)
  - /leads/:id =  Give a particular lead (GET)
  - /leads/:id = Fetch and add particular lead to mongoose Server(POST)
4] MARKETING: (https://server.com/api/marketing)
  - /campaigns  = Give all campaigns in data (GET)
  - /campaigns/:id = Give a campaigns lead (GET)
  - /campaigns/:id = Fetch and add particular lead to mongoose Server(POST)
5] ETL: (https://server.com/api/etl)
  - /run = Run the ETL and forms a metric and save it in mongoose Server
  - /metrics = Shows the metrics saved in mongoose server
6] PDF/CSV: (https://server.com/api/reports)
  - /csv = downloads the csv file of data stored in server
  - /pdf = downloads the pdf file of data stored in server
7] We are also running alert message sending every 10 min depending on a condition.
