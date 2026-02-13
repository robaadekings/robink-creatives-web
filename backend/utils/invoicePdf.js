const PDFDocument = require('pdfkit');

module.exports = function generateInvoicePdf(invoice,res) {
    const doc = new PDFDocument({margin: 50});

    // stream to response
    doc.pipe(res);

    //HEADER

    doc
    .fontSize(22)
    .text('ROBINK CREATIVES', {align: 'left'})
    .fontSize(10)
    .text("GRAPHIC DESIGN & WEBDEVELOPMENT")
    .text("Email: robertmrangiri63@gmail.com")
    
    .moveDown()

    doc
    .fontSize(18)
    .text('INVOICE', {align: 'right'})
    .moveDown()

    //client infor
    doc.fontSize(12);
    doc.text( `Invoice ID: ${invoice._id}`);
    doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
    doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);
    doc.moveDown()

    doc.text(`Bill To: ${invoice.clientName}`);
    doc.text(invoice.clientEmail);
    doc.moveDown()

    //invoice items

    doc.fontSize(12).text('Items', {underline: true});
    doc.moveDown(0.5);

    invoice.items.forEach((item) => {
        doc.text(
            `${item.name} -${item.quantity} x ${item.unitprice} = ${item.total}`
        );
        if(item.description){
        doc.fontSize(10).text(item.description);
        doc.fontSize(12);
        }
        doc.moveDown(0.5);
    });

    //totals

    doc.moveDown();
    doc.text(`Subtotal: ${invoice.subtotal}`);
    doc.text(` Tax: ${invoice.tax}`);
    doc.text(` Discount: ${invoice.discount}`);
     doc.fontSize(14).text(`Total: ${invoice.total}`, {bold: true});

     //NOTES

        if(invoice.notes){
            doc.moveDown();
            doc.fontSize(11).text('Notes:');
            doc.text(invoice.notes);
        }

        //FOOTER
        doc.moveDown(2);
        doc.fontSize(10).text('Thank you for your business!', 
            {align: 'center'});

doc.end();}