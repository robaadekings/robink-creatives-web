const PDFDocument = require("pdfkit");
const fs = require("fs");

/**
 * Generate PDF buffer for a quote.
 * @param {Object} quote - The quote data.
 * @returns {Promise<Buffer>} - PDF as a buffer.
 */
function generateQuotePdfBuffer(quote) {
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
    doc.fontSize(14).text("Project Quote", 50, 55);
    
    doc.fillColor('black');
    doc.moveDown(8);

    // ===== QUOTE META INFO =====
    const quoteNum = quote._id.toString().slice(-8).toUpperCase();
    const quoteDate = new Date(quote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    doc.fontSize(11).font('Helvetica');
    doc.text(`Quote #${quoteNum}`, { align: 'right' });
    doc.text(`Date: ${quoteDate}`, { align: 'right' });
    doc.moveDown(1);

    // ===== CLIENT INFORMATION BOX =====
    doc.fillColor(brandColor).fontSize(12).font('Helvetica-Bold');
    doc.rect(40, doc.y, 250, 60).stroke(brandColor);
    doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("BILL TO", 50, doc.y + 8);
    
    doc.fillColor('black').fontSize(11).font('Helvetica');
    doc.text(quote.clientName, 50, doc.y + 22);
    doc.text(quote.clientEmail, 50, doc.y);
    doc.moveDown(5);

    // ===== SERVICE DETAILS =====
    doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("SERVICE DETAILS");
    doc.moveDown(0.5);
    
    doc.fillColor(brandColor).rect(40, doc.y, doc.page.width - 80, 1).fill();
    doc.moveDown(1);
    
    doc.fillColor('black').fontSize(11).font('Helvetica');
    doc.text(`Service: ${quote.serviceId?.title || 'Custom Service'}`);
    doc.text(`Category: ${quote.serviceCategory}`);
    if (quote.budgetRange) {
      doc.text(`Budget Range: ${quote.budgetRange}`);
    }
    if (quote.deadline) {
      doc.text(`Deadline: ${new Date(quote.deadline).toLocaleDateString()}`);
    }
    doc.moveDown(1);

    // ===== PROJECT DESCRIPTION =====
    if (quote.description) {
      doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("PROJECT DESCRIPTION");
      doc.moveDown(0.5);
      doc.fillColor(brandColor).rect(40, doc.y, doc.page.width - 80, 1).fill();
      doc.moveDown(1);
      
      doc.fillColor('black').fontSize(11).font('Helvetica');
      doc.text(quote.description, { align: 'left' });
      doc.moveDown(1);
    }

    // ===== TERMS AND CONDITIONS =====
    doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("TERMS & CONDITIONS");
    doc.moveDown(0.5);
    doc.fillColor(brandColor).rect(40, doc.y, doc.page.width - 80, 1).fill();
    doc.moveDown(1);
    
    doc.fillColor('black').fontSize(10).font('Helvetica');
    doc.text("• This quote is valid for 30 days from the date of issue.");
    doc.text("• Final pricing may vary based on specific project requirements.");
    doc.text("• Payment terms: 50% upfront, 50% upon completion.");
    doc.text("• All deliverables are the exclusive property of Robink Creatives © 2026");
    doc.moveDown(1);

    // ===== FOOTER =====
    doc.fontSize(10).fillColor('gray');
    doc.text("_".repeat(80), { align: 'center' });
    doc.fontSize(9).text("Robink Creatives | info@robinkcreatives.com | www.robinkcreatives.com");
    doc.text("Professional Design & Development Services", { align: 'center' });

    doc.end();
  });
}

/**
 * Generate PDF and pipe directly to response stream.
 * @param {Object} quote - The quote data.
 * @param {Object} res - Express response object.
 */
function generateQuotePdf(quote, res) {
  const doc = new PDFDocument({ margin: 40 });
  const brandColor = '#8B1C24';

  doc.pipe(res);

  // ===== BRAND HEADER WITH COLOR =====
  doc.fillColor(brandColor);
  doc.rect(0, 0, doc.page.width, 80).fill(brandColor);
  
  doc.fillColor('white');
  doc.fontSize(28).font('Helvetica-Bold').text("ROBINK CREATIVES", 50, 20);
  doc.fontSize(14).text("Project Quote", 50, 55);
  
  doc.fillColor('black');
  doc.moveDown(8);

  // ===== QUOTE META INFO =====
  const quoteNum = quote._id.toString().slice(-8).toUpperCase();
  const quoteDate = new Date(quote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  doc.fontSize(11).font('Helvetica');
  doc.text(`Quote #${quoteNum}`, { align: 'right' });
  doc.text(`Date: ${quoteDate}`, { align: 'right' });
  doc.moveDown(1);

  // ===== CLIENT INFORMATION BOX =====
  doc.fillColor(brandColor).fontSize(12).font('Helvetica-Bold');
  doc.rect(40, doc.y, 250, 60).stroke(brandColor);
  doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("BILL TO", 50, doc.y + 8);
  
  doc.fillColor('black').fontSize(11).font('Helvetica');
  doc.text(quote.clientName, 50, doc.y + 22);
  doc.text(quote.clientEmail, 50, doc.y);
  doc.moveDown(5);

  // ===== SERVICE DETAILS =====
  doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("SERVICE DETAILS");
  doc.moveDown(0.5);
  
  doc.fillColor(brandColor).rect(40, doc.y, doc.page.width - 80, 1).fill();
  doc.moveDown(1);
  
  doc.fillColor('black').fontSize(11).font('Helvetica');
  doc.text(`Service: ${quote.serviceId?.title || 'Custom Service'}`);
  doc.text(`Category: ${quote.serviceCategory}`);
  if (quote.budgetRange) {
    doc.text(`Budget Range: ${quote.budgetRange}`);
  }
  if (quote.deadline) {
    doc.text(`Deadline: ${new Date(quote.deadline).toLocaleDateString()}`);
  }
  doc.moveDown(1);

  // ===== PROJECT DESCRIPTION =====
  if (quote.description) {
    doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("PROJECT DESCRIPTION");
    doc.moveDown(0.5);
    doc.fillColor(brandColor).rect(40, doc.y, doc.page.width - 80, 1).fill();
    doc.moveDown(1);
    
    doc.fillColor('black').fontSize(11).font('Helvetica');
    doc.text(quote.description, { align: 'left' });
    doc.moveDown(1);
  }

  // ===== TERMS AND CONDITIONS =====
  doc.fillColor(brandColor).fontSize(13).font('Helvetica-Bold').text("TERMS & CONDITIONS");
  doc.moveDown(0.5);
  doc.fillColor(brandColor).rect(40, doc.y, doc.page.width - 80, 1).fill();
  doc.moveDown(1);
  
  doc.fillColor('black').fontSize(10).font('Helvetica');
  doc.text("• This quote is valid for 30 days from the date of issue.");
  doc.text("• Final pricing may vary based on specific project requirements.");
  doc.text("• Payment terms: 50% upfront, 50% upon completion.");
  doc.text("• All deliverables are the exclusive property of Robink Creatives © 2026");
  doc.moveDown(1);

  // ===== FOOTER =====
  doc.fontSize(10).fillColor('gray');
  doc.text("_".repeat(80), { align: 'center' });
  doc.fontSize(9).text("Robink Creatives | info@robinkcreatives.com | www.robinkcreatives.com");
  doc.text("Professional Design & Development Services", { align: 'center' });

  doc.end();
}

/**
 * Save PDF buffer to a file (optional).
 * @param {Buffer} pdfBuffer - PDF buffer.
 * @param {string} filePath - Where to save the file.
 */
function saveQuotePdfToFile(pdfBuffer, filePath) {
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`Quote saved to ${filePath}`);
}

module.exports = {
  generateQuotePdf,
  generateQuotePdfBuffer,
  saveQuotePdfToFile
};