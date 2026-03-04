const Contact = require("../models/Contact");
const resend = require("../utils/mailer");

exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to DB
    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // Send Email via Resend
    await resend.emails.send({
      from: "Robink Creatives <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

// Get single message
exports.getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.findById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch message",
    });
  }
};

// Send reply to message
exports.replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Send email reply
    await resend.emails.send({
      from: "Robink Creatives <onboarding@resend.dev>",
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      html: `
        <h2>Re: ${contact.subject}</h2>
        <p>Thank you for reaching out to Robink Creatives!</p>
        <hr />
        <p>${replyMessage}</p>
        <hr />
        <p><strong>Original Message:</strong></p>
        <p>${contact.message}</p>
      `,
    });

    // Update status to replied
    contact.status = "replied";
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
    });
  }
};