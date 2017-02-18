"use strict";

const fs = require('fs');
const sizeOf = require('image-size');
const PDFDocument = require('pdfkit');


function imagesToPdf(imageFilePaths, filePath) {
    return new Promise(function (resolve, reject) {
        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(filePath));

        // add content
        let i;
        for (i = 0; i < imageFilePaths.length; i++) {
            const image = imageFilePaths[i];

            if (i > 0) {
                doc.addPage();
            }

            // get image dimensions fitted to the page
            const fittedSize = fittedSizeOf(image, doc.page);

            // center the image on the page
            const x = (doc.page.width - fittedSize.width) / 2;
            const y = (doc.page.height - fittedSize.height) / 2;

            doc.image(image, x, y, {fit: [doc.page.width, doc.page.height]});
        }

        doc.end();
        resolve(filePath);
    });
}

function fittedSizeOf(imagePath, pageSize) {
    const dimensions = sizeOf(imagePath);

    let out = {width: dimensions.width, height: dimensions.height};

    if (out.width > pageSize.width) {
        const diff = pageSize.width / out.width;
        out.width = pageSize.width;
        out.height = out.height * diff;
    }

    if (out.height > pageSize.height) {
        const diff = pageSize.height / out.height;
        out.height = pageSize.height;
        out.width = out.width * diff;
    }

    return out;
}

module.exports = {
    imagesToPdf
};
