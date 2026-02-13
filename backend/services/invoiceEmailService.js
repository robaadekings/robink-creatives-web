const resend = require("../utils/mailer");
const generatePdfBuffer = require("../utils/invoicePdf");

exports.sendInvoiceEmail = async (invoice) => {
  const pdfBuffer = await generatePdfBuffer(invoice);

  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: invoice.clientEmail,
    subject: `Invoice from Robink Creatives`,
    html: `
      <h2>Invoice Ready</h2>
      <p>Hello ${invoice.clientName},</p>
      <p>Your invoice is attached.</p>
      <p>Total Due: ${invoice.total}</p>
      <p>Thank you.</p>
    `,
    attachments: [
      {
        filename: `invoice-${invoice._id}.pdf`,
        data: pdfBuffer.toString("base64"),
        type: "application/pdf",
        disposition: "attachment"
      }
    ]
  });
};
