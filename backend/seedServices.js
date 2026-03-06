require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("./models/Service");
const ServiceCategory = require("./models/ServiceCategory");

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Create service categories first
    const categories = await ServiceCategory.find({});
    let webDevCategory, graphicDesignCategory;

    if (categories.length === 0) {
      webDevCategory = await ServiceCategory.create({
        name: "Web Development",
        slug: "web-development"
      });

      graphicDesignCategory = await ServiceCategory.create({
        name: "Graphic Design",
        slug: "graphic-design"
      });
    } else {
      webDevCategory = categories.find(c => c.name === "Web Development") || categories[0];
      graphicDesignCategory = categories.find(c => c.name === "Graphic Design") || categories[1];
    }

    // Check if services already exist
    const existingServices = await Service.find({});
    if (existingServices.length > 0) {
      console.log("Services already exist");
      process.exit();
    }

    // Create sample services
    const services = [
      {
        title: "E-commerce Website",
        category: webDevCategory._id,
        description: "Complete e-commerce solution with payment integration",
        features: ["Product catalog", "Shopping cart", "Payment gateway", "Admin dashboard"],
        basePrice: 2500,
        deliveryTime: "4-6 weeks",
        active: true
      },
      {
        title: "Business Website",
        category: webDevCategory._id,
        description: "Professional business website with modern design",
        features: ["Responsive design", "Contact forms", "SEO optimization", "CMS integration"],
        basePrice: 1200,
        deliveryTime: "2-4 weeks",
        active: true
      },
      {
        title: "Logo Design",
        category: graphicDesignCategory._id,
        description: "Custom logo design with brand identity",
        features: ["3 concepts", "Brand guidelines", "Vector files", "Unlimited revisions"],
        basePrice: 300,
        deliveryTime: "1-2 weeks",
        active: true
      },
      {
        title: "Brand Identity Package",
        category: graphicDesignCategory._id,
        description: "Complete brand identity including logo, colors, and guidelines",
        features: ["Logo design", "Color palette", "Typography", "Brand guidelines"],
        basePrice: 800,
        deliveryTime: "2-3 weeks",
        active: true
      },
      {
        title: "Mobile App UI/UX",
        category: webDevCategory._id,
        description: "Mobile application user interface and experience design",
        features: ["Wireframes", "UI mockups", "User flows", "Interactive prototype"],
        basePrice: 1500,
        deliveryTime: "3-5 weeks",
        active: true
      }
    ];

    await Service.insertMany(services);
    console.log("Sample services created successfully!");
    console.log(`Created ${services.length} services across ${categories.length} categories`);

    process.exit();
  } catch (err) {
    console.error("Error seeding services:", err);
    process.exit(1);
  }
}

seedServices();