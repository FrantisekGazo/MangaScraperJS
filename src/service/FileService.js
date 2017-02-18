"use strict";

const { app, dialog, getCurrentWindow, shell } = require('electron').remote;
const path = require('path');
const fs = require('fs');


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
    getMangaDirectory,
    openFile,
    showDirectory,
    showFileInDirectory,
    showSaveDirDialog,
};
