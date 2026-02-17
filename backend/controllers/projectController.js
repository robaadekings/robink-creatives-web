const Project = require('../models/Project');
const Quote = require('../models/Quote');
const ApiError = require('../utils/ApiError');
const crypto = require("crypto");


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

            data.clientName = quote.clientName;
            data.clientEmail = quote.clientEmail;
            data.description = quote.description;
            data.serviceId = quote.serviceId;
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