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