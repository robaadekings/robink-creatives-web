const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware'); 
const serviceRoutes = require('./routes/serviceRoutes');
const portfolioRoutes = require('./routes/PortfolioRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const projectRoutes = require('./routes/projectRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const clientInvoiceRoutes = require("./routes/clientInvoiceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clientRoutes = require('./routes/clientRoutes');
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const clientAuthRoutes = require("./routes/clientAuthRoutes")

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use("/api/client", clientInvoiceRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/client', clientRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/client-auth", clientAuthRoutes);

app.use(errorMiddleware);

module.exports = app;