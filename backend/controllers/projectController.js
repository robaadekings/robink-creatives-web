const Project = require('../models/Project');
const Quote = require('../models/Quote');
const Invoice = require('../models/Invoice');
const ApiError = require('../utils/ApiError');
const crypto = require("crypto");
const { generateQuotePdfBuffer } = require('../utils/quotePdf');
const { generateInvoicePdfBuffer } = require('../utils/invoicePdf');
const resend = require('../utils/mailer');
const notify = require("../services/notificationService");
const User = require('../models/User');

// ==========================================
// Admin — Create Project
// ==========================================
exports.createProject = async (req, res, next) => {
    try {
        const data = req.body;
        data.clientPortalToken = crypto.randomBytes(24).toString("hex");

        if (req.files && req.files.length > 0) {
            data.assets = req.files.map((file) => file.path);
        }

        let foundUser = null;

        if (data.quoteId) {
            const quote = await Quote.findById(data.quoteId);
            if (!quote) throw new ApiError(404, 'Quote not found');
            
            foundUser = await User.findOne({ email: quote.clientEmail });
            data.sourceQuote = quote._id;
            data.clientName = quote.clientName;
            data.clientEmail = quote.clientEmail;
            data.description = data.description || quote.description;
            data.serviceId = data.serviceId || quote.serviceId;
        }

        if (!foundUser && data.clientId) {
            foundUser = await User.findById(data.clientId);
        }

        if (!foundUser && data.clientEmail) {
            foundUser = await User.findOne({ email: data.clientEmail });
        }

        if (!foundUser) {
            throw new ApiError(400, 'A valid registered client is required to create a project.');
        }

        data.client = foundUser._id;
        data.clientName = data.clientName || foundUser.name;
        data.clientEmail = data.clientEmail || foundUser.email;

        const project = await Project.create(data);
        
        res.status(201).json({
            success: true,
            data: project,
        });
    } catch (err) {
        next(err);
    }
};

// ==========================================
// Admin — List Projects (RESTORED)
// ==========================================
exports.listProjects = async (req, res, next) => {
    try {
        const projects = await Project.find()
            .populate("quoteId")
            .populate("serviceId", "title category")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: projects,
        });
    } catch (err) {
        next(err);
    }
};

// ==========================================
// Admin — Get Single Project (RESTORED)
// ==========================================
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("quoteId")
            .populate("serviceId")
            .populate("client", "name email");
        if (!project) throw new ApiError(404, 'Project not found');
        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (err) {
        next(err);
    }
};

// ==========================================
// Admin — Update Project (RESTORED)
// ==========================================
exports.updateProject = async (req, res, next) => {
    try {
        const updates = req.body;
        if (req.files && req.files.length > 0) {
            updates.assets = req.files.map((file) => file.path);
        }
        const project = await Project.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });
        if (!project) throw new ApiError(404, 'Project not found');

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (err) {
        next(err);
    }
};

// ==========================================
// Admin — Delete Project (RESTORED)
// ==========================================
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) throw new ApiError(404, 'Project not found');
        res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};

// ==========================================
// Admin — Approve Project (Improved)
// ==========================================
exports.approveProject = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId)
            .populate('serviceId')
            .populate('client');

        if (!project) throw new ApiError(404, 'Project not found');
        if (project.status !== 'pending') throw new ApiError(400, 'Project is not pending approval');
        if (!project.budget || project.budget <= 0) throw new ApiError(400, 'Project must have a valid budget to be approved');
        if (!project.client) throw new ApiError(400, 'Project must have a valid client to be approved');

        const category = project.serviceId?.category || 'General Service';

        // Generate quote
        const quote = await Quote.create({
            clientName: project.clientName,
            clientEmail: project.clientEmail,
            serviceId: project.serviceId?._id,
            serviceCategory: category,
            description: project.description || `${project.title} - Project Quote`,
            projectId: projectId,
            status: 'approved'
        });

        // Generate invoice
        const invoiceItems = [{
            name: project.title || "Project Work",
            description: project.description || "Custom project work",
            quantity: 1,
            unitPrice: project.budget || 0,
            total: project.budget || 0
        }];

        const invoice = await Invoice.create({
            projectId: projectId,
            client: project.client._id,
            clientName: project.clientName,
            clientEmail: project.clientEmail,
            items: invoiceItems,
            subtotal: project.budget || 0,
            total: project.budget || 0,
            status: "Pending",
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        project.status = 'approved';
        project.quoteId = quote._id;
        project.invoiceId = invoice._id;
        await project.save();

        // PDF & Email (Background Task)
        try {
            const quotePdfBuffer = await generateQuotePdfBuffer(quote);
            const invoicePdfBuffer = await generateInvoicePdfBuffer(invoice);

            await resend.emails.send({
                from: 'Robink Creatives <noreply@robinkcreatives.com>',
                to: project.clientEmail,
                subject: `Project Approved: ${project.title}`,
                html: `<p>Dear ${project.clientName}, your project has been approved. Please find the quote and invoice attached.</p>`,
                attachments: [
                    { filename: `quote-${quote._id}.pdf`, content: quotePdfBuffer.toString('base64'), type: 'application/pdf' },
                    { filename: `invoice-${invoice._id}.pdf`, content: invoicePdfBuffer.toString('base64'), type: 'application/pdf' }
                ]
            });
        } catch (emailError) {
            console.error('Email/PDF Error:', emailError);
        }

        await notify.createNotification({
            title: "Project Approved",
            message: `Project "${project.title}" approved for ${project.clientName}`,
            type: "project",
            meta: { projectId, quoteId: quote._id, invoiceId: invoice._id }
        });

        res.status(200).json({
            success: true,
            message: 'Project approved successfully',
            data: { project, quote, invoice }
        });

    } catch (err) {
        next(err);
    }
};