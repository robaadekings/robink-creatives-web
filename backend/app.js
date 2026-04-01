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
const serviceCategoryRoutes= require("./routes/serviceCategoryRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// 🔹 Helmet for security headers
app.use(helmet());

// 🔹 Proper CORS setup for your frontend
const corsOptions = {
  origin: "https://robink-creatives-web.vercel.app", // exact frontend origin
  credentials: true, // allow cookies/credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // required headers
};

app.use(cors(corsOptions));         // apply to all requests
app.options("*", cors(corsOptions)); // handle preflight OPTIONS requests

// 🔹 Logging & parsing
app.use(morgan('dev'));
app.use(express.json());

// 🔹 Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use("/api/client", clientInvoiceRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/service-categories', serviceCategoryRoutes);
app.use("/api/contact", contactRoutes);

// 🔹 Error middleware
app.use(errorMiddleware);

module.exports = app;
