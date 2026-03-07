const PDFDocument = require("pdfkit");
const fs = require("fs");
const Resend = require('resend').Resend;

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * GENERATE PDF STREAM
 * Used for direct downloads from the browser.
 */
function generateInvoicePdf(invoice, res) {
    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
    const brandColor = '#8B1C24';
    const textColor = '#1a1a1a';
    const lightText = '#666666';
    const tableBg = '#FBFBFB'; 

    // Pipe to the response stream
    doc.pipe(res);

    // --- 1. PREMIUM BRANDING & SIDEBAR ---
    doc.rect(0, 0, 4, 842).fill(brandColor); // Elegant left accent line

    doc.fillColor(textColor).fontSize(22).font('Helvetica-Bold').text("ROBINK", 50, 50, { continued: true });
    doc.fillColor(brandColor).text(" CREATIVES");
    doc.fillColor(lightText).fontSize(9).font('Helvetica').text("Premium Digital Artistry & Development", 50, 75);
    doc.text("www.robinkcreatives.com | billing@robinkcreatives.com", 50, 88);

    doc.fillColor(textColor).fontSize(26).font('Helvetica-Bold').text("INVOICE", 350, 50, { align: 'right' });
    doc.fontSize(10).fillColor(brandColor).text(`# ${invoice.invoiceNumber || invoice._id.toString().slice(-8).toUpperCase()}`, 350, 80, { align: 'right' });

    // --- 2. INFORMATION BAR ---
    doc.moveTo(50, 130).lineTo(550, 130).strokeColor('#EEEEEE').lineWidth(1).stroke();

    // Client Info
    doc.fillColor(lightText).fontSize(8).font('Helvetica-Bold').text("BILL TO", 50, 150);
    doc.fillColor(textColor).fontSize(11).font('Helvetica-Bold').text(invoice.clientName || 'Valued Client', 50, 165);
    doc.font('Helvetica').fontSize(9).fillColor(lightText).text(invoice.clientEmail || '', 50, 180);
    if (invoice.clientAddress) {
        doc.text(invoice.clientAddress, 50, 195, { width: 200 });
    }

    // Dates & Currency
    doc.fillColor(lightText).fontSize(8).font('Helvetica-Bold').text("DATE OF ISSUE", 350, 150, { align: 'right' });
    doc.fillColor(textColor).fontSize(9).font('Helvetica').text(new Date(invoice.issueDate).toLocaleDateString('en-GB'), 350, 165, { align: 'right' });
    doc.fillColor(lightText).fontSize(8).font('Helvetica-Bold').text("DUE DATE", 350, 185, { align: 'right' });
    doc.fillColor(brandColor).fontSize(9).text(new Date(invoice.dueDate).toLocaleDateString('en-GB'), 350, 200, { align: 'right' });

    // --- 3. THE PREMIUM ZEBRA TABLE ---
    const tableTop = 260;
    const colDesc = 60;
    const colQty = 330;
    const colPrice = 390;
    const colTotal = 480;

    // Header Row
    doc.rect(50, tableTop, 510, 30).fill('#F4F4F4');
    doc.fillColor(textColor).font('Helvetica-Bold').fontSize(9);
    doc.text("DESCRIPTION", colDesc, tableTop + 11);
    doc.text("QTY", colQty, tableTop + 11);
    doc.text("UNIT PRICE", colPrice, tableTop + 11, { width: 75, align: 'right' });
    doc.text("AMOUNT", colTotal, tableTop + 11, { width: 75, align: 'right' });

    // Table Content Rows
    let y = tableTop + 30;
    const items = invoice.items || invoice.services || [];
    
    items.forEach((item, i) => {
        const itemHeight = 35;
        // Zebra Striping (Light background for alternating rows)
        if (i % 2 === 0) {
            doc.rect(50, y, 510, itemHeight).fill(tableBg);
        }

        doc.fillColor(textColor).font('Helvetica').fontSize(10);
        doc.text(item.name || item.description || "Project Service", colDesc, y + 12, { width: 250 });
        
        doc.fillColor(lightText).text(item.quantity.toString(), colQty, y + 12);
        
        const price = item.unitPrice || item.rate || 0;
        doc.text(`$${price.toFixed(2)}`, colPrice, y + 12, { width: 75, align: 'right' });
        
        const lineTotal = (item.quantity || 1) * price;
        doc.fillColor(textColor).font('Helvetica-Bold').text(`$${lineTotal.toFixed(2)}`, colTotal, y + 12, { width: 75, align: 'right' });

        y += itemHeight;
    });

    // --- 4. TOTALS SECTION ---
    y += 20;
    doc.fillColor(lightText).font('Helvetica').fontSize(10).text("Subtotal", 350, y);
    doc.fillColor(textColor).text(`$${(invoice.subtotal || 0).toFixed(2)}`, colTotal, y, { width: 75, align: 'right' });

    if (invoice.tax) {
        y += 20;
        doc.fillColor(lightText).text(`Tax (${invoice.taxRate || 0}%)`, 350, y);
        doc.fillColor(textColor).text(`$${invoice.tax.toFixed(2)}`, colTotal, y, { width: 75, align: 'right' });
    }

    // High-Contrast Total Box
    y += 35;
    doc.rect(340, y, 220, 45).fill(brandColor);
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10).text("TOTAL AMOUNT", 355, y + 17);
    doc.fontSize(16).text(`$${(invoice.total || 0).toFixed(2)}`, colTotal - 5, y + 15, { width: 80, align: 'right' });

    // --- 5. FOOTER & BANKING ---
    const footerY = 740;
    doc.fillColor('#EEEEEE').rect(50, footerY - 10, 500, 1).fill();
    
    doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold').text("PAYMENT INSTRUCTIONS", 50, footerY);
    doc.fillColor(lightText).fontSize(8).font('Helvetica').text("Please remit payment via Bank Transfer / Wire within 15 days.", 50, footerY + 12);
    doc.text(`Beneficiary: Robink Creatives  |  Bank: ${invoice.bankName || 'International Business Bank'}`, 50, footerY + 22);
    doc.text(`SWIFT/BIC: ${invoice.swiftCode || 'ROBINKINTL'}  |  AC: ${invoice.accountNumber || '********'}`, 50, footerY + 32);

    doc.fillColor(brandColor).fontSize(10).font('Helvetica-Bold').text("Excellence in every pixel.", 350, footerY, { align: 'right' });
    doc.fillColor(lightText).fontSize(8).text("Thank you for choosing Robink Creatives.", 350, footerY + 12, { align: 'right' });

    doc.end();
}

/**
 * GENERATE PDF BUFFER
 * Used for creating an attachment to send via email.
 */
function generateInvoicePdfBuffer(invoice) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const buffers = [];
        
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", (err) => reject(err));

        // Use a wrapper or the same logic to draw the PDF
        // Note: For DRY code, you can move the drawing logic to a separate function
        // For this file, we call generateInvoicePdf passing a mock response object
        generateInvoicePdf(invoice, {
            pipe: () => {},
            on: () => {},
            end: () => doc.end(),
            // Mocking the write behavior for the buffer
            write: (chunk) => doc.write(chunk)
        });
    });
}

/**
 * SEND EMAIL WITH ATTACHMENT
 * Powered by Resend.
 */
async function sendInvoiceEmail(invoice) {
    try {
        const pdfBuffer = await generateInvoicePdfBuffer(invoice);
        const fileName = `Invoice_${invoice.invoiceNumber || invoice._id}.pdf`;

        const response = await resend.emails.send({
            from: "Robink Creatives <billing@robinkcreatives.com>",
            to: invoice.clientEmail,
            subject: `Invoice ${invoice.invoiceNumber || 'New'} from Robink Creatives`,
            html: `
                <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #8B1C24;">Invoice Received</h2>
                    <p>Dear ${invoice.clientName},</p>
                    <p>We hope you are well. Please find your invoice attached for your recent project.</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <p><strong>Total Amount:</strong> $${invoice.total.toFixed(2)}</p>
                    <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #666;">If you have any questions, feel free to contact our billing team.</p>
                    <p>Best regards,<br/><strong>The Robink Creatives Team</strong></p>
                </div>
            `,
            attachments: [
                {
                    filename: fileName,
                    content: pdfBuffer,
                },
            ],
        });

        console.log("Email sent successfully:", response.id);
        return response;
    } catch (error) {
        console.error("Failed to send invoice email:", error);
        throw error;
    }
}

module.exports = { 
    generateInvoicePdf, 
    generateInvoicePdfBuffer, 
    sendInvoiceEmail 
};