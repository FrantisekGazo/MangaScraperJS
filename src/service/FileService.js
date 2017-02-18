"use strict";

const { app, dialog, getCurrentWindow, shell } = require('electron').remote;
const path = require('path');
const fs = require('fs');


function deleteDirectoryRecursive(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file, index) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteDirectoryRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}

function exists(filePath) {
    return fs.existsSync(filePath);
}

function openFile(filePath) {
    shell.openItem(filePath);
}

function showFileInDirectory(filePath) {
    shell.showItemInFolder(filePath);
}

function showDirectory(dirPath) {
    shell.openItem(dirPath);
}

function showSaveDirDialog() {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        dialog.showOpenDialog(getCurrentWindow(), {
            properties: ['createDirectory', 'openDirectory']
        }, (dirPaths) => {
            if (dirPaths && dirPaths[0]) {
                const outDirPath = dirPaths[0];
                resolve(outDirPath);
            } else {
                reject(Error('Nothing selected'));
            }
        });
    });
}

function getMangaChapterFile(mangaTitle, chapterTitle) {
    return path.join(getMangaDirectory(mangaTitle), getMangaChapterFileName(mangaTitle, chapterTitle));
}

function getMangaChapterFileName(mangaTitle, chapterTitle) {
    return `${mangaTitle} ${chapterTitle}.pdf`;
}

function getMangaDirectory(title) {
    const appPath = path.join(app.getPath('downloads'), 'MangaSraper');
    if (!fs.existsSync(appPath)) {
        fs.mkdirSync(appPath);
    }
    const managaDirPath = path.join(appPath, title);
    if (!fs.existsSync(managaDirPath)) {
        fs.mkdirSync(managaDirPath);
    }
    return managaDirPath;
}


module.exports = {
    deleteDirectoryRecursive,
    exists,
    getMangaChapterFile,
    getMangaChapterFileName,
    getMangaDirectory,
    openFile,
    showDirectory,
    showFileInDirectory,
    showSaveDirDialog,
};
