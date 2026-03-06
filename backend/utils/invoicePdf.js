const PDFDocument = require("pdfkit");
const fs = require("fs");
const Resend = require('resend').Resend;

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate PDF and pipe directly to response stream.
 * @param {Object} invoice - The invoice data.
 * @param {Object} res - Express response object.
 */
function generateInvoicePdf(invoice, res) {
  const doc = new PDFDocument({ margin: 40 });
  const brandColor = '#8B1C24';

  doc.pipe(res);

  // ===== BRAND HEADER WITH COLOR =====
  doc.fillColor(brandColor);
  doc.rect(0, 0, doc.page.width, 80).fill(brandColor);
  
  doc.fillColor('white');
  doc.fontSize(28).font('Helvetica-Bold').text("ROBINK CREATIVES", 50, 20);
  doc.fontSize(14).text("Invoice", 50, 55);
  
  doc.fillColor('black');
  doc.moveDown(8);

  // ===== INVOICE META INFO =====
  const invoiceNum = invoice.invoiceNumber || invoice._id.toString().slice(-8).toUpperCase();
  const invoiceDate = new Date(invoice.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  doc.fontSize(11).font('Helvetica');
  doc.text(`Invoice #${invoiceNum}`, { align: 'right' });
  doc.text(`Issue Date: ${invoiceDate}`, { align: 'right' });
  doc.text(`Due Date: ${dueDate}`, { align: 'right' });
  doc.moveDown(1);

  // ===== BILL TO BOX =====
  doc.fillColor(brandColor).fontSize(12).font('Helvetica-Bold');
  doc.rect(40, doc.y, 250, 60).stroke(brandColor);
  doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("BILL TO", 50, doc.y + 8);
  
  doc.fillColor('black').fontSize(11).font('Helvetica');
  doc.text(invoice.clientName, 50, doc.y + 22);
  doc.text(invoice.clientEmail, 50, doc.y);  
  doc.text(invoice.clientAddress || '', 50, doc.y);
  doc.moveDown(4);

  // ===== SERVICES TABLE =====
  const tableTop = doc.y;
  const itemX = 40;
  const qtyX = 350;
  const rateX = 420;
  const amountX = 480;

  // Table headers
  doc.fillColor(brandColor).fontSize(12).font('Helvetica-Bold');
  doc.text("DESCRIPTION", itemX, tableTop);
  doc.text("QTY", qtyX, tableTop);
  doc.text("RATE", rateX, tableTop);
  doc.text("AMOUNT", amountX, tableTop);
  
  doc.moveTo(40, doc.y + 15).lineTo(550, doc.y + 15).stroke(brandColor);
  doc.moveDown(2);

  // Table rows
  doc.fillColor('black').fontSize(10).font('Helvetica');
  let yPosition = doc.y;
  
  if (invoice.services && invoice.services.length > 0) {
    invoice.services.forEach((service, index) => {
      const itemName = service.name || service.description || 'Service';
      const quantity = service.quantity || 1;
      const rate = service.rate || service.price || 0;
      const amount = quantity * rate;

      doc.text(itemName, itemX, yPosition);
      doc.text(quantity.toString(), qtyX, yPosition);
      doc.text(`$${rate.toFixed(2)}`, rateX, yPosition);
      doc.text(`$${amount.toFixed(2)}`, amountX, yPosition);
      
      yPosition += 20;
    });
  } else {
    // Fallback if no services array
    doc.text("Design Services", itemX, yPosition);
    doc.text("1", qtyX, yPosition);
    doc.text(`$${(invoice.total || 0).toFixed(2)}`, rateX, yPosition);
    doc.text(`$${(invoice.total || 0).toFixed(2)}`, amountX, yPosition);
  }

  doc.moveDown(2);

  // ===== SUMMARY =====
  const summaryX = 400;
  doc.fontSize(12).font('Helvetica-Bold').fillColor(brandColor);
  doc.text(`SUBTOTAL: $${(invoice.subtotal || invoice.total || 0).toFixed(2)}`, summaryX);
  
  if (invoice.tax) {
    doc.text(`TAX: $${invoice.tax.toFixed(2)}`, summaryX);
  }
  
  doc.fontSize(14).font('Helvetica-Bold').fillColor(brandColor);
  doc.text(`TOTAL: $${(invoice.total || 0).toFixed(2)}`, summaryX);
  
  doc.moveDown(2);
  doc.fontSize(10).fillColor('black').font('Helvetica');
  if (invoice.notes) {
    doc.text(`Notes: ${invoice.notes}`);
    doc.moveDown(1);
  }

  // ===== PAYMENT INFO =====
  doc.fontSize(10).font('Helvetica').fillColor('gray');
  doc.text("_".repeat(80), { align: 'center' });
  
  doc.fontSize(9);
  doc.text("Payment Terms & Banking Details", { align: 'center' });
  doc.text("Please remit payment to: Robink Creatives | Bank: [Your Bank]", { align: 'center' });
  doc.text("Account: [Your Account] | Reference: Invoice # " + invoiceNum, { align: 'center' });
  
  doc.moveDown(1);
  doc.fontSize(9).text("Thank you for your business!", { align: 'center' });
  doc.text("info@robinkcreatives.com | www.robinkcreatives.com", { align: 'center' });

  doc.end();
}

/**
 * Generate PDF buffer for an invoice.
 * @param {Object} invoice - The invoice data.
 * @returns {Promise<Buffer>} - PDF as a buffer.
 */
function generateInvoicePdfBuffer(invoice) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];
    const brandColor = '#8B1C24';

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // ===== BRAND HEADER WITH COLOR =====
    doc.fillColor(brandColor);
    doc.rect(0, 0, doc.page.width, 80).fill(brandColor);
    
    doc.fillColor('white');
    doc.fontSize(28).font('Helvetica-Bold').text("ROBINK CREATIVES", 50, 20);
    doc.fontSize(14).text("Invoice", 50, 55);
    
    doc.fillColor('black');
    doc.moveDown(8);

    // ===== INVOICE META INFO =====
    const invoiceNum = invoice.invoiceNumber || invoice._id.toString().slice(-8).toUpperCase();
    const invoiceDate = new Date(invoice.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    doc.fontSize(11).font('Helvetica');
    doc.text(`Invoice #${invoiceNum}`, { align: 'right' });
    doc.text(`Issue Date: ${invoiceDate}`, { align: 'right' });
    doc.text(`Due Date: ${dueDate}`, { align: 'right' });
    doc.moveDown(1);

    // ===== BILL TO BOX =====
    doc.fillColor(brandColor).fontSize(12).font('Helvetica-Bold');
    doc.rect(40, doc.y, 250, 60).stroke(brandColor);
    doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("BILL TO", 50, doc.y + 8);
    
    doc.fillColor('black').fontSize(11).font('Helvetica');
    doc.text(invoice.clientName, 50, doc.y + 22);
    doc.text(invoice.clientEmail, 50, doc.y + 35);
    doc.text(invoice.clientAddress || '', 50, doc.y + 48);
    doc.moveDown(4);

    // ===== SERVICES TABLE =====
    const tableTop = doc.y;
    const itemX = 40;
    const qtyX = 350;
    const rateX = 420;
    const amountX = 480;

    // Table headers
    doc.fillColor(brandColor).fontSize(12).font('Helvetica-Bold');
    doc.text("DESCRIPTION", itemX, tableTop);
    doc.text("QTY", qtyX, tableTop);
    doc.text("RATE", rateX, tableTop);
    doc.text("AMOUNT", amountX, tableTop);
    
    doc.moveTo(40, doc.y + 15).lineTo(550, doc.y + 15).stroke(brandColor);
    doc.moveDown(2);

    // Table rows
    doc.fillColor('black').fontSize(10).font('Helvetica');
    let yPosition = doc.y;
    
    if (invoice.services && invoice.services.length > 0) {
      invoice.services.forEach((service, index) => {
        const itemName = service.name || service.description || 'Service';
        const quantity = service.quantity || 1;
        const rate = service.rate || service.price || 0;
        const amount = quantity * rate;

        doc.text(itemName, itemX, yPosition);
        doc.text(quantity.toString(), qtyX, yPosition);
        doc.text(`$${rate.toFixed(2)}`, rateX, yPosition);
        doc.text(`$${amount.toFixed(2)}`, amountX, yPosition);
        
        yPosition += 20;
      });
    } else {
      // Fallback if no services array
      doc.text("Design Services", itemX, yPosition);
      doc.text("1", qtyX, yPosition);
      doc.text(`$${(invoice.total || 0).toFixed(2)}`, rateX, yPosition);
      doc.text(`$${(invoice.total || 0).toFixed(2)}`, amountX, yPosition);
    }

    doc.moveDown(2);

    // ===== SUMMARY =====
    const summaryX = 400;
    doc.fontSize(12).font('Helvetica-Bold').fillColor(brandColor);
    doc.text(`SUBTOTAL: $${(invoice.subtotal || invoice.total || 0).toFixed(2)}`, summaryX);
    
    if (invoice.tax) {
      doc.text(`TAX: $${invoice.tax.toFixed(2)}`, summaryX);
    }
    
    doc.fontSize(14).font('Helvetica-Bold').fillColor(brandColor);
    doc.text(`TOTAL: $${(invoice.total || 0).toFixed(2)}`, summaryX);
    
    doc.moveDown(2);
    doc.fontSize(10).fillColor('black').font('Helvetica');
    if (invoice.notes) {
      doc.text(`Notes: ${invoice.notes}`);
      doc.moveDown(1);
    }

    // ===== PAYMENT INFO =====
    doc.fontSize(10).font('Helvetica').fillColor('gray');
    doc.text("_".repeat(80), { align: 'center' });
    
    doc.fontSize(9);
    doc.text("Payment Terms & Banking Details", { align: 'center' });
    doc.text("Please remit payment to: Robink Creatives | Bank: [Your Bank]", { align: 'center' });
    doc.text("Account: [Your Account] | Reference: Invoice # " + invoiceNum, { align: 'center' });
    
    doc.moveDown(1);
    doc.fontSize(9).text("Thank you for your business!", { align: 'center' });
    doc.text("info@robinkcreatives.com | www.robinkcreatives.com", { align: 'center' });

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
  generateInvoicePdf,
  generateInvoicePdfBuffer,
  saveInvoicePdfToFile,
  sendInvoiceEmail,
};
