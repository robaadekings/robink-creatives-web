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

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  // 🔥 NEW RELATION
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending"
  },

  issueDate: Date,
  dueDate: Date,
  paidDate: Date,

  portalToken: {
    type: String,
    unique: true,
    index: true
  },

  lastViewedAt: Date,
  emailSentAt: Date,
  emailMessageId: String,

  notes: String,
  terms: String,
  footer: String

}, { timestamps: true });


invoiceSchema.pre("save", function(next) {

  if (!this.invoiceNumber) {
    this.invoiceNumber = "INV-" + Date.now();
  }

  if (!this.portalToken) {
    this.portalToken = crypto.randomBytes(24).toString("hex");
  }

  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);