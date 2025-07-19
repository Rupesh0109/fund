const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const stripeRoutes = require('./routes/stripe');
const campaignRoutes = require('./routes/campaign');

const app = express();
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
// app.use('/uploads', express.static('uploads'));

// Serve agreements folder statically
const path = require('path');
app.use('/api/agreements', express.static(path.join(__dirname, 'agreements')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
const uploadsRoutes = require('./routes/uploads');

app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/uploads', uploadsRoutes);

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
