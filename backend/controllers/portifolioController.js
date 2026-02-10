const portifolio = require('../models/Portifolio');
const ApiError = require('../utils/ApiError');

exports.createPortfolio = async (req, res, next) => {
    try {
        const data = req.body;

        if (req.files && req.files.length > 0) {
            data.images = req.files.map(file => file.path);
        }

        const item = await portifolio.create(data);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

exports.updatePortfolio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (req.files && req.files.length > 0) {
            updates.images = req.files.map(file => file.path);
        }
        const item = await portifolio.findByIdAndUpdate(id, updates, { new: true });
        if (!item) {
            return next(new ApiError(404, 'Portfolio item not found'));
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

exports.deletePortfolio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await portifolio.findByIdAndDelete(id);
        if (!item) throw new ApiError(404, 'Portfolio item not found');
        res.status(200).json({ success: true, message: 'Portfolio item deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.listPortfolios = async (req, res, next) => {
    try {
        const { category, featured } = req.query;

        const filter = {active: true};
        if (category) filter.category = category;
        if (featured) filter.featured = featured === 'true';

        const items = await portifolio.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

exports.getPortfolio = async (req, res, next) => {
    try {
        const item = await portifolio.findById(req.params.id);
        if (!item) throw new ApiError(404, 'Portfolio item not found');
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};
