const mongoose = require("mongoose");
const crypto = require("crypto");

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  unitPrice: Number,
  total: Number
});

const invoiceSchema = new mongoose.Schema({

  // ===== Core =====
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  invoiceNumber: {
    type: String,
    unique: true
  },

  clientName: String,
  clientEmail: String,

  items: [itemSchema],

  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,

  currency: { type: String, default: "KSH" },

  // ===== Status =====
  status: {
    type: String,
    enum: [
      "Pending",
      "Paid",     
      "Overdue"
    ],
    default: "Draft"
  },

  // ===== Dates =====
  issueDate: Date,
  dueDate: Date,
  paidDate: Date,

  // ===== Portal Support =====

  portalToken: {
    type: String,
    unique: true,
    index: true
  },

  lastViewedAt: Date,

  // ===== Email Tracking =====

  emailSentAt: Date,
  emailMessageId: String,

  // ===== Extras =====

  notes: String,
  terms: String,
  footer: String

}, { timestamps: true });


// =============================
// AUTO FIELDS
// =============================

invoiceSchema.pre("save", function(next) {

  // invoice number generator
  if (!this.invoiceNumber) {
    this.invoiceNumber = "INV-" + Date.now();
  }

  // secure client portal token
  if (!this.portalToken) {
    this.portalToken = crypto.randomBytes(24).toString("hex");
  }

  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);

 