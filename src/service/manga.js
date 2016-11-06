"use strict";

const fs = require('fs');
const path = require('path');

const {scrapeChapterPages} = require('./scraper.js');
const {downloadImages} = require('./image.js');
const {imgToPdf} = require('./pdf.js');


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

    progressCallback(chapter, {msg: 'Loading images...', status: 'IN PROGRESS'});

    return scrapeChapterPages(chapter.url)
        .then((imageUrls) => {
            progressCallback(chapter, {msg: `Downloading ${imageUrls.length} images...`, status: 'IN PROGRESS'});
            if (!fs.existsSync(tempDirPath)) {
                fs.mkdirSync(tempDirPath);
            }

            //console.log('Got pages', imageUrls);
            return downloadImages(imageUrls, tempDirPath);
        })
        .then((imageFilePaths) => {
            //console.log('All downloaded', imageFilePaths);
            const filePath = path.join(outDirPath, `${chapter.title}.pdf`);
            progressCallback(chapter, {msg: `Creating PDF...`, status: 'IN PROGRESS'});
            return imgToPdf(imageFilePaths, filePath);
        })
        .then((filePath) => {
            if (fs.existsSync(tempDirPath)) {
                deleteFolderRecursive(tempDirPath);
                //console.log('Removed', tempDirPath);
            }

            //console.log('Done', filePath);
            progressCallback(chapter, {msg: 'Done', status: 'DONE', output: filePath});
            return Promise.resolve();
        })
        .catch((err) => {
            progressCallback(chapter, {msg: err.message, status: 'FAILED'});
        });
};

const downloadMangaChapters = (chapters, outDirPath, progressCallback) => {
    const downloads = chapters.map(chapter => downloadMangaChapter(chapter, outDirPath, progressCallback));
    return Promise.all(downloads);
};

module.exports = {
    downloadMangaChapters
};