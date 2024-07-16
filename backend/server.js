const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (Replace <your_mongo_db_uri> with your actual MongoDB URI)
mongoose.connect('<your_mongo_db_uri>', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import routes
const reportsRouter = require('./routes/reports');
app.use('/api/reports', reportsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
