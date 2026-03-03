const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Quote = require('../models/Quote');
const Message = require('../models/Message');
const ApiError = require('../utils/ApiError');
const generateInvoicePdf = require('../utils/invoicePdf');


// ===============================
// Client — List Their Projects
// ===============================
exports.getClientProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      client: req.user._id
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
      .findOne({
        _id: req.params.id,
        client: req.user._id
      })
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
      client: req.user._id
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

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      client: req.user._id
    });

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
      clientEmail: req.user.email
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

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      client: req.user._id
    });

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


// ===============================
// Client — Dashboard Stats
// ===============================
exports.getDashboardStats = async (req, res, next) => {
  try {
    const activeProjects = await Project.countDocuments({
      client: req.user._id,
      status: 'in_progress'
    });

    const completedProjects = await Project.countDocuments({
      client: req.user._id,
      status: 'completed'
    });

    const pendingInvoices = await Invoice.countDocuments({
      client: req.user._id,
      status: 'Pending'
    });

    const paidInvoices = await Invoice.find({
      client: req.user._id,
      status: 'Paid'
    });

    const totalPaid = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

    res.json({
      success: true,
      data: {
        activeProjects,
        completedProjects,
        pendingInvoices,
        totalPaid
      }
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Client — List Their Files (from projects)
// ===============================
exports.getClientFiles = async (req, res, next) => {
  try {
    const projects = await Project.find({
      client: req.user._id
    }).select('title assets deliverables');

    const files = [];

    projects.forEach(project => {
      // Assets
      if (project.assets && project.assets.length > 0) {
        project.assets.forEach(asset => {
          files.push({
            _id: asset,
            name: asset.split('/').pop(),
            url: asset,
            projectName: project.title,
            type: 'asset'
          });
        });
      }

      // Deliverables
      if (project.deliverables && project.deliverables.length > 0) {
        project.deliverables.forEach(deliverable => {
          files.push({
            _id: deliverable,
            name: deliverable.split('/').pop(),
            url: deliverable,
            projectName: project.title,
            type: 'deliverable'
          });
        });
      }
    });

    res.json({ success: true, data: files });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Client — List Project Messages
// ===============================
exports.getProjectMessages = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      client: req.user._id
    });

    if (!project) throw new ApiError(404, "Project not found");

    const messages = await Message.find({
      project: req.params.projectId
    })
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: messages });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Client — Send Message to Project
// ===============================
exports.sendProjectMessage = async (req, res, next) => {
  try {
    const { message, attachments } = req.body;

    const project = await Project.findOne({
      _id: req.params.projectId,
      client: req.user._id
    });

    if (!project) throw new ApiError(404, "Project not found");

    const newMessage = await Message.create({
      project: req.params.projectId,
      sender: req.user._id,
      text: message,
      attachments: attachments || []
    });

    await newMessage.populate('sender', 'name email role');

    res.status(201).json({
      success: true,
      data: newMessage
    });

  } catch (err) {
    next(err);
  }
};