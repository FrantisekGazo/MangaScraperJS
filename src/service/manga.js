"use strict";

const fs = require('fs');
const path = require('path');

const DownloadState = require('../model/DownloadState');
const {scrapeChapterPages} = require('./scraper');
const {downloadImages} = require('./image');
const {imgToPdf} = require('./pdf');


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

    progressCallback(chapter.id, {msg: 'Loading images...', code: DownloadState.IN_PROGRESS});
    const scrapeProgress = (msg) => {
        progressCallback(chapter.id, {msg: msg, code: DownloadState.IN_PROGRESS});
    };

    return scrapeChapterPages(chapter.url, scrapeProgress)
        .then((imageUrls) => {
            progressCallback(chapter.id, {msg: `Downloading ${imageUrls.length} images...`, code: DownloadState.IN_PROGRESS});
            if (!fs.existsSync(tempDirPath)) {
                fs.mkdirSync(tempDirPath);
            }

            //console.log('Got pages', imageUrls);
            return downloadImages(imageUrls, tempDirPath);
        })
        .then((imageFilePaths) => {
            //console.log('All downloaded', imageFilePaths);
            const filePath = path.join(outDirPath, `${chapter.title}.pdf`);
            progressCallback(chapter.id, {msg: `Creating PDF...`, code: DownloadState.IN_PROGRESS});
            return imgToPdf(imageFilePaths, filePath);
        })
        .then((filePath) => {
            if (fs.existsSync(tempDirPath)) {
                deleteFolderRecursive(tempDirPath);
                //console.log('Removed', tempDirPath);
            }

            //console.log('Done', filePath);
            progressCallback(chapter.id, {msg: `Done (${filePath})`, code: DownloadState.DONE});
            return Promise.resolve();
        })
        .catch((err) => {
            progressCallback(chapter.id, {msg: err.message, code: DownloadState.FAILED});
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