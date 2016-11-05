const fs = require('fs');
const sizeOf = require('image-size');
const PDFDocument = require('pdfkit');


const imgToPdf = (imageFilePaths, filePath) => {
    return new Promise(function (resolve, reject) {
        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(filePath));

        // add content
        let i;
        for (i = 0; i < imageFilePaths.length; i++) {
            if (i > 0) {
                doc.addPage();
            }

            const image = imageFilePaths[i];
            const opts = {fit: [doc.page.width, doc.page.height]};

            const dimensions = sizeOf(image);

            doc.image(image, 0, 0, opts);
        }

        doc.end();
        resolve(filePath);
    });
};

module.exports = {
    imgToPdf
};
