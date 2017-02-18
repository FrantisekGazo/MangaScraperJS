"use strict";

const fs = require('fs');
const path = require('path');

const DownloadStatusCode = require('../model/DownloadStatusCode');
const ScraperService = require('./ScraperService');
const ImageService = require('./ImageService');
const PDFService = require('./PDFService');


const deleteFolderRecursive = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file, index) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
};

const downloadMangaChapter = (chapter, outDirPath, progressCallback) => {
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
            const filePath = path.join(outDirPath, `${chapter.title}.pdf`);
            progressCallback(chapter.id, {msg: `Creating PDF...`, code: DownloadStatusCode.IN_PROGRESS});
            return PDFService.imgToPdf(imageFilePaths, filePath);
        })
        .then((filePath) => {
            if (fs.existsSync(tempDirPath)) {
                deleteFolderRecursive(tempDirPath);
                //console.log('Removed', tempDirPath);
            }

            //console.log('Done', filePath);
            progressCallback(chapter.id, {msg: filePath, code: DownloadStatusCode.DONE});
            return Promise.resolve();
        })
        .catch((err) => {
            progressCallback(chapter.id, {msg: err.message, code: DownloadStatusCode.FAILED});
        });
};

const downloadMangaChapters = (chapters, outDirPath, progressCallback) => {
    // download chapters sequentially
    const downloads = chapters.map((chapter) => () => downloadMangaChapter(chapter, outDirPath, progressCallback));
    return downloads.reduce((p, fn) => p.then(fn), Promise.resolve());
};

module.exports = {
    downloadMangaChapter,
    downloadMangaChapters,
};