require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const pool = require('./config/database'); 
const reportRoutes = require('./routes/reports'); 
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(bodyParser.json());

// Use routes
app.use('/api', reportRoutes);
app.use('/api/auth', authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


