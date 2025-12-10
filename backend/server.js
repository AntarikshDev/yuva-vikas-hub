const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const programRoutes = require('./routes/programRoutes');
const locationRoutes = require('./routes/locationRoutes');
const sectorRoutes = require('./routes/sectorRoutes');
const jobRoleRoutes = require('./routes/jobRoleRoutes');
const documentTypeRoutes = require('./routes/documentTypeRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/sectors', sectorRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/document-types', documentTypeRoutes);
app.use('/api/work-orders', workOrderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
