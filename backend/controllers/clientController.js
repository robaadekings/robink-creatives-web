const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Quote = require('../models/Quote');
const Message = require('../models/Message');
const ApiError = require('../utils/ApiError');
const generateInvoicePdf = require('../utils/invoicePdf');
const { generateQuotePdf } = require('../utils/quotePdf');
const notify = require('../services/notificationService');


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
// Client — Create Project Request
// ===============================
exports.createClientProject = async (req, res, next) => {
  try {
    const { title, description, serviceId, budget, deadline } = req.body;

    const project = await Project.create({
      title,
      description,
      serviceId,
      budget,
      deadline,
      client: req.user._id,
      clientName: req.user.name,
      clientEmail: req.user.email,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: project });
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
    const invoiceId = req.params.id;
    const userId = req.user._id;

    // Try to find invoice by client reference
    let invoice = await Invoice.findOne({
      _id: invoiceId,
      client: userId
    });

    // Fallback: try to find by invoice ID only (in case client field is missing)
    if (!invoice) {
      invoice = await Invoice.findById(invoiceId);
      if (invoice) {
        console.log(`⚠️ Invoice ${invoiceId} found but client field may be missing. Owner: ${invoice.clientEmail}`);
      }
    }

    if (!invoice) {
      console.log(`❌ Invoice not found: ${invoiceId} for client ${userId}`);
      throw new ApiError(404, "Invoice not found");
    }

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
// Client — Download Quote PDF
// ===============================
exports.downloadClientQuotePdf = async (req, res, next) => {
  try {
    const quoteId = req.params.id;
    const userEmail = req.user.email;

    // Find quote by ID and client email
    const quote = await Quote.findOne({
      _id: quoteId,
      clientEmail: userEmail
    });

    if (!quote) {
      console.log(`❌ Quote not found: ${quoteId} for client ${userEmail}`);
      throw new ApiError(404, "Quote not found");
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=quote-${quote._id}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    generateQuotePdf(quote, res);

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


// ===============================
// Client — Approve Quote
// ===============================
exports.approveQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      clientEmail: req.user.email
    });

    if (!quote) throw new ApiError(404, "Quote not found");
    if (quote.clientApproved) throw new ApiError(400, "Quote already approved");

    quote.clientApproved = true;
    quote.approvedAt = new Date();
    await quote.save();

    // Notify admin
    await notify.createNotification({
      title: "Quote Approved by Client",
      message: `${quote.clientName} approved quote #${quote._id.toString().slice(-8).toUpperCase()}`,
      type: "quote",
      meta: { quoteId: quote._id, clientName: quote.clientName, clientEmail: quote.clientEmail }
    });

    res.status(200).json({
      success: true,
      message: 'Quote approved successfully',
      data: quote
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Client — Approve Invoice
// ===============================
exports.approveInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      client: req.user._id
    });

    if (!invoice) throw new ApiError(404, "Invoice not found");
    if (invoice.clientApproved) throw new ApiError(400, "Invoice already approved");

    invoice.clientApproved = true;
    invoice.approvedAt = new Date();
    await invoice.save();

    // Notify admin
    await notify.createNotification({
      title: "Invoice Approved by Client",
      message: `${invoice.clientName} approved invoice #${invoice.invoiceNumber}`,
      type: "invoice",
      meta: { invoiceId: invoice._id, clientName: invoice.clientName, clientEmail: invoice.clientEmail }
    });

    res.status(200).json({
      success: true,
      message: 'Invoice approved successfully',
      data: invoice
    });

  } catch (err) {
    next(err);
  }
};