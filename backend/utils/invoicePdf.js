const PDFDocument = require("pdfkit");
const fs = require("fs");
const Resend = require('resend').Resend;

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate PDF buffer for an invoice.
 * @param {Object} invoice - The invoice data.
 * @returns {Promise<Buffer>} - PDF as a buffer.
 */
function generateInvoicePdfBuffer(invoice) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // ===== PDF CONTENT =====
    doc.fontSize(20).text("ROBINK CREATIVES");
    doc.text("Invoice");
    doc.moveDown();

    doc.text(`Invoice: ${invoice._id}`);
    doc.text(`Client: ${invoice.clientName}`);
    doc.text(`Email: ${invoice.clientEmail}`);
    doc.moveDown();

    invoice.items.forEach(i => {
      doc.text(`${i.name} — ${i.quantity} × ${i.unitPrice} = ${i.total}`);
    });

    doc.moveDown();
    doc.text(`Total: ${invoice.total}`);

    doc.end();
  });
}

/**
 * Save PDF buffer to a file (optional).
 * @param {Buffer} pdfBuffer - PDF buffer.
 * @param {string} filePath - Where to save the file.
 */
function saveInvoicePdfToFile(pdfBuffer, filePath) {
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`Invoice saved to ${filePath}`);
}

/**
 * Send invoice via Resend email with PDF attachment.
 * @param {Object} invoice - The invoice data.
 */
async function sendInvoiceEmail(invoice) {
  const pdfBuffer = await generateInvoicePdfBuffer(invoice);

  // Optional: save a copy on disk
  const filePath = `invoices/Invoice-${invoice._id}.pdf`;
  saveInvoicePdfToFile(pdfBuffer, filePath);

  // Send via Resend
  try {
    const response = await resend.emails.send({
      from: "Robink Creatives <onboarding@resend.dev>",
      to: invoice.clientEmail,
      subject: `Invoice #${invoice._id}`,
      html: `<p>Dear ${invoice.clientName},</p>
             <p>Please find attached your invoice.</p>`,
      attachments: [
        {
          filename: `Invoice-${invoice._id}.pdf`,
          content: pdfBuffer,
          type: "application/pdf",
        },
      ],
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending invoice:", error);
  }
}

module.exports = {
  generateInvoicePdfBuffer,
  saveInvoicePdfToFile,
  sendInvoiceEmail,
};
