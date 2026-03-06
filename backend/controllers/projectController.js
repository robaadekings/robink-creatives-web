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


// Admin create project

exports.createProject = async (req, res, next) => {
    try {
        const data = req.body;

        const portalToken = crypto.randomBytes(24).toString("hex");

        //attach uploaded assets

        if (req.files && req.files.length > 0) {
            data.assets = req.files.map((file) => file.path);
        }

        // if created from quote auto-fill
        if (data.quoteId) {
            const quote = await Quote.findById(data.quoteId);
            if (!quote) throw new ApiError(404, 'Quote not found');

            // Find the user by email to set the client field
            const user = await User.findOne({ email: quote.clientEmail });
            if (user) {
                data.client = user._id;
            }

            data.clientName = quote.clientName;
            data.clientEmail = quote.clientEmail;
            data.description = quote.description;
            data.serviceId = quote.serviceId;
        }

        // if clientId is provided directly
        if (data.clientId) {
            const user = await User.findById(data.clientId);
            if (!user) throw new ApiError(404, 'Client not found');
            data.client = user._id;
            data.clientName = user.name;
            data.clientEmail = user.email;
        }

        // if clientEmail is provided directly
        if (data.clientEmail && !data.client) {
            const user = await User.findOne({ email: data.clientEmail });
            if (user) {
                data.client = user._id;
                data.clientName = user.name;
            }
        }

        const project = await Project.create(data);
        res.status(201).json({
            success: true,
            data: project,
        });
    } catch (err) {
        next(err);
    }
};



// Admin List projects

exports.listProjects = async (req, res, next) => {
    try {
        const projects = await Project.find()
        .populate("quoteId")
        .populate("serviceId", "title, category");
        res.status(200).json({
            success: true,
            data: projects,
        });
    } catch (err) {
        next(err);
    }
};

// Admin single project details

exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
        .populate("quoteId")
        .populate("serviceId");
        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (err) {
        next(err);
    }
};

// Admin update project

exports.updateProject = async (req, res, next) => {
    try {
        const updates = req.body;

        if (req.files && req.files.length > 0) {
            updates.assets = req.files.map((file) => file.path);
        }
        const project = await Project.findByIdAndUpdate(req.params.id, updates, {
            new: true,
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

// Admin delete project
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

// Admin approve project with quote and invoice generation
exports.approveProject = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId).populate('serviceId').populate('serviceId.category').populate('client');

        if (!project) throw new ApiError(404, 'Project not found');
        if (project.status !== 'pending') throw new ApiError(400, 'Project is not pending approval');
        if (!project.budget || project.budget <= 0) throw new ApiError(400, 'Project must have a valid budget to be approved');
        if (!project.client) throw new ApiError(400, 'Project must have a valid client to be approved');

        // Generate quote
        const quote = await Quote.create({
            clientName: project.clientName,
            clientEmail: project.clientEmail,
            serviceId: project.serviceId,
            serviceCategory: project.serviceId?.category?.slug || 'web-development',
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
            client: project.client,
            clientName: project.clientName,
            clientEmail: project.clientEmail,
            items: invoiceItems,
            subtotal: project.budget || 0,
            tax: 0,
            discount: 0,
            total: project.budget || 0,
            status: "Pending",
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            notes: "Invoice generated upon project approval"
        });

        // Update project
        project.status = 'approved';
        project.quoteId = quote._id;
        project.invoiceId = invoice._id;
        await project.save();

        // Generate PDFs
        const quotePdfBuffer = await generateQuotePdfBuffer(quote);
        const invoicePdfBuffer = await generateInvoicePdfBuffer(invoice);

        // Send email with PDFs
        try {
            await resend.emails.send({
                from: 'Robink Creatives <noreply@robinkcreatives.com>',
                to: project.clientEmail,
                subject: `Project Approved: ${project.title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #8B1C24; text-align: center;">Project Approved!</h1>
                        <p>Dear ${project.clientName},</p>
                        <p>Great news! Your project <strong>"${project.title}"</strong> has been approved and is ready to begin.</p>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #8B1C24; margin-top: 0;">Project Details:</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li><strong>Service:</strong> ${project.serviceId?.title || 'Custom Service'}</li>
                                <li><strong>Budget:</strong> $${project.budget || 'TBD'}</li>
                                <li><strong>Deadline:</strong> ${project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}</li>
                            </ul>
                        </div>

                        <p>Attached to this email are:</p>
                        <ul>
                            <li><strong>Project Quote</strong> - Detailed breakdown of services and pricing</li>
                            <li><strong>Project Invoice</strong> - Payment details and terms</li>
                        </ul>

                        <p>Next Steps:</p>
                        <ol>
                            <li>Review the attached documents</li>
                            <li>Confirm your acceptance and proceed with payment</li>
                            <li>We'll schedule a kickoff meeting to discuss project details</li>
                        </ol>

                        <p>If you have any questions, please don't hesitate to contact us.</p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="mailto:info@robinkcreatives.com"
                               style="background: #8B1C24; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                Contact Us
                            </a>
                        </div>

                        <p style="color: #666; font-size: 14px;">
                            Best regards,<br>
                            The Robink Creatives Team<br>
                            info@robinkcreatives.com<br>
                            www.robinkcreatives.com
                        </p>
                    </div>
                `,
                attachments: [
                    {
                        filename: `quote-${quote._id}.pdf`,
                        content: quotePdfBuffer.toString('base64'),
                        type: 'application/pdf',
                        disposition: 'attachment'
                    },
                    {
                        filename: `invoice-${invoice._id}.pdf`,
                        content: invoicePdfBuffer.toString('base64'),
                        type: 'application/pdf',
                        disposition: 'attachment'
                    }
                ]
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the approval if email fails
        }

        // Admin notification
        await notify.createNotification({
            title: "Project Approved",
            message: `Project "${project.title}" approved for ${project.clientName}`,
            type: "project",
            meta: { projectId: projectId, quoteId: quote._id, invoiceId: invoice._id }
        });

        res.status(200).json({
            success: true,
            message: 'Project approved successfully with quote and invoice generated',
            data: {
                project,
                quote,
                invoice
            }
        });

    } catch (err) {
        next(err);
    }
};