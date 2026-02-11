const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const serviceRoutes = require('./routes/serviceRoutes');
const portfolioRoutes = require('./routes/PortfolioRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/quotes', quoteRoutes);

app.use(errorMiddleware);

module.exports = app;