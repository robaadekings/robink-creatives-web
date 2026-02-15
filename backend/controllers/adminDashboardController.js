const Invoice = require("../models/Invoice");
const Quote = require("../models/Quote");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Portfolio = require("../models/Portfolio");


// ================= DASHBOARD STATS =================

exports.getDashboardStats = async (req, res, next) => {
  try {

    const revenueAgg = await Invoice.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const revenueTotal = revenueAgg[0]?.total || 0;

    const invoicesPending = await Invoice.countDocuments({ status: "pending" });
    const invoicesPaid = await Invoice.countDocuments({ status: "paid" });

    const quotesOpen = await Quote.countDocuments({ status: "open" });
    const projectsActive = await Project.countDocuments({ status: "active" });
    const servicesCount = await Service.countDocuments();
    const portfolioCount = await Portfolio.countDocuments();

    const recentInvoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("clientName total status createdAt");

    res.json({
      success: true,
      data: {
        revenueTotal,
        invoicesPending,
        invoicesPaid,
        quotesOpen,
        projectsActive,
        servicesCount,
        portfolioCount,
        recentInvoices
      }
    });

  } catch (err) {
    next(err);
  }
};


// ================= INVOICE STATUS CHART =================

exports.getInvoiceStatusChart = async (req, res, next) => {
  try {

    const stats = await Invoice.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      pending: 0,
      paid: 0,
      overdue: 0
    };

    stats.forEach(item => {
      result[item._id] = item.count;
    });

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};
