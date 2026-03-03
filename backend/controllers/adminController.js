const User = require("../models/User");
const Project = require("../models/Project");
const Invoice = require("../models/Invoice");
const Quote = require("../models/Quote");
const ApiError = require("../utils/ApiError");

// ===============================
// Admin — List All Clients
// ===============================
exports.listClients = async (req, res, next) => {
  try {
    const clients = await User.find({ role: "client" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: clients
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Admin — Get Client Details
// ===============================
exports.getClientDetails = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id).select("-password");
    if (!client) throw new ApiError(404, "Client not found");

    const projects = await Project.countDocuments({ client: req.params.id });
    const invoices = await Invoice.countDocuments({ client: req.params.id });
    const totalSpent = await Invoice.aggregate([
      { $match: { client: require("mongoose").Types.ObjectId(req.params.id) } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    res.json({
      success: true,
      data: {
        ...client.toObject(),
        projects,
        invoices,
        totalSpent: totalSpent[0]?.total || 0
      }
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Admin — List All Projects
// ===============================
exports.listProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Admin — Update Project Status
// ===============================
exports.updateProjectStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("client", "name email");

    if (!project) throw new ApiError(404, "Project not found");

    res.json({
      success: true,
      data: project
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Admin — List All Invoices
// ===============================
exports.listInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find()
      .populate("client", "name email")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: invoices
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Admin — Update Invoice Status
// ===============================
exports.updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!invoice) throw new ApiError(404, "Invoice not found");

    res.json({
      success: true,
      data: invoice
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Admin — List All Quotes
// ===============================
exports.listQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: quotes
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Admin — Update Quote Status
// ===============================
exports.updateQuoteStatus = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;
    
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    );

    if (!quote) throw new ApiError(404, "Quote not found");

    res.json({
      success: true,
      data: quote
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// Admin — Promote User to Admin
// ===============================
exports.promoteToAdmin = async (req, res, next) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) throw new ApiError(404, "User not found");

    user.role = "admin";
    await user.save();

    res.json({
      success: true,
      message: "User promoted to admin"
    });

  } catch (err) {
    next(err);
  }  
};