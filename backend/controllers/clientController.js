const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Quote = require('../models/Quote');
const ApiError = require('../utils/ApiError');
const generateInvoicePdf = require('../utils/invoicePdf');


// ===============================
// Client — List Their Projects
// ===============================
exports.getClientProjects = async (req, res, next) => {
  try {

    const projects = await Project.find({
      clientEmail: req.params.email
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: projects });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Client — Single Project
// ===============================
exports.getClientProject = async (req, res, next) => {
  try {

    const project = await Project
      .findById(req.params.id)
      .populate('serviceId', 'title category');

    if (!project) throw new ApiError(404, "Project not found");

    res.json({ success: true, data: project });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Client — List Their Invoices
// ===============================
exports.getClientInvoices = async (req, res, next) => {
  try {

    const invoices = await Invoice.find({
      clientEmail: req.params.email
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: invoices });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Client — Single Invoice
// ===============================
exports.getClientInvoice = async (req, res, next) => {
  try {

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) throw new ApiError(404, "Invoice not found");

    res.json({ success: true, data: invoice });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Client — List Their Quotes
// ===============================
exports.getClientQuotes = async (req, res, next) => {
  try {

    const quotes = await Quote.find({
      clientEmail: req.params.email
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: quotes });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Client — Download Invoice PDF
// ===============================
exports.downloadClientInvoicePdf = async (req, res, next) => {
  try {

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) throw new ApiError(404, "Invoice not found");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice._id}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    generateInvoicePdf(invoice, res);

  } catch (err) {
    next(err);
  }
};
