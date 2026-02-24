const Service = require('../models/Service');
const ApiError = require('../utils/ApiError');

exports.createService = async (req, res, next) => {
    try {
        const ServiceData = req.body;
        if (req.file) {
            ServiceData.imageUrl = req.file.path;
        }
        const service = await Service.create(ServiceData);
        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

exports.updateService = async (req, res, next) => {
    try {
        const {id} = req.params;
        const update = req.body;
        if (req.file) {
            update.imageUrl = req.file.path;
        }
        const service = await Service.findByIdAndUpdate(id, update, {new: true});
        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteService = async (req, res, next) => {
    try {
        const {id} = req.params;
        await Service.findByIdAndDelete(id);
        
        if (!service) throw new ApiError(404, 'Service not found');

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.listServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};