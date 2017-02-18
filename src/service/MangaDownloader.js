"use strict";

const fs = require('fs');
const path = require('path');

const DownloadStatusCode = require('../model/DownloadStatusCode');
const ScraperService = require('./ScraperService');
const ImageService = require('./ImageService');
const PDFService = require('./PDFService');
const FileService = require('./FileService');


function downloadMangaChapter(chapter, outDirPath, fileName, progressCallback) {
    const tempDirPath = path.join(outDirPath, `.${chapter.title}`);

    progressCallback(chapter.id, {msg: 'Loading images...', code: DownloadStatusCode.IN_PROGRESS});
    const scrapeProgress = (msg) => {
        progressCallback(chapter.id, {msg: msg, code: DownloadStatusCode.IN_PROGRESS});
    };

    return ScraperService.scrapeChapterPages(chapter.url, scrapeProgress)
        .then((imageUrls) => {
            progressCallback(chapter.id, {msg: `Downloading ${imageUrls.length} images...`, code: DownloadStatusCode.IN_PROGRESS});
            if (!fs.existsSync(tempDirPath)) {
                fs.mkdirSync(tempDirPath);
            }

            //console.log('Got pages', imageUrls);
            return ImageService.downloadImages(imageUrls, tempDirPath);
        })
        .then((imageFilePaths) => {
            //console.log('All downloaded', imageFilePaths);
            const filePath = path.join(outDirPath, fileName);
            progressCallback(chapter.id, {msg: `Creating PDF...`, code: DownloadStatusCode.IN_PROGRESS});
            return PDFService.imagesToPdf(imageFilePaths, filePath);
        })
        .then((filePath) => {
            if (fs.existsSync(tempDirPath)) {
                FileService.deleteDirectoryRecursive(tempDirPath);
                //console.log('Removed', tempDirPath);
            }

            //console.log('Done', filePath);
            progressCallback(chapter.id, {msg: filePath, code: DownloadStatusCode.DONE});
            return Promise.resolve();
        })
        .catch((err) => {
            progressCallback(chapter.id, {msg: err.message, code: DownloadStatusCode.FAILED});
        });
}

module.exports = {
    downloadMangaChapter,
};