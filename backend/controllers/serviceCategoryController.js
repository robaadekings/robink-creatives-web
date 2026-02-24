const ServiceCategory = require("../models/ServiceCategory");

/* ================= PUBLIC ================= */

exports.listCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* ================= ADMIN ================= */

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const category = await ServiceCategory.create({
      name,
      slug,
      description,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Failed to create category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const category = await ServiceCategory.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/\s+/g, "-");
    }

    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: "Failed to update category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category" });
  }
}