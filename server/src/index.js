const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env vars before everything else
dotenv.config();

const rateLimit = require('express-rate-limit');

require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Security Checks for Production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.CLIENT_URL) {
    console.warn('⚠️ WARNING: CLIENT_URL is not set in production! CORS may fail or be overly permissive.');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️ WARNING: JWT_SECRET is missing or too short. Use a long, complex string for production security.');
  }
}

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL] 
  : ['http://localhost:3000', process.env.CLIENT_URL].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // Or if the origin is in our allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parser
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../../server/uploads'), {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.pdf')) {
      res.set('Content-Disposition', 'attachment; filename="Resume.pdf"');
    }
  },
}));

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 5000,
});
app.use('/api/', apiLimiter);

// Mount routers
app.use('/api/projects',   require('./routes/projects'));
app.use('/api/contact',    require('./routes/contact'));
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/upload',     require('./routes/upload'));
app.use('/api/skills',     require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/profile',    require('./routes/profile'));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
