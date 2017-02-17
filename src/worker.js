"use strict";

const ipc = require('electron').ipcRenderer;
const BrowserWindow = require('electron').remote.BrowserWindow;

const { WorkerTasks, workerTaskProgress, workerTaskEnded } = require('./service/worker');
const { scrapeMangaInfo } = require('./service/scraper');
const { downloadMangaChapters } = require('./service/manga');


ipc.on(WorkerTasks.LOAD_MANGA, function (event, mangaId, callerId) {
    const fromWindow = BrowserWindow.fromId(callerId);
    scrapeMangaInfo(mangaId)
        .then((manga) => {
            fromWindow.webContents.send(workerTaskEnded(WorkerTasks.LOAD_MANGA), mangaId, manga, null);
        })
        .catch((err) => {
            fromWindow.webContents.send(workerTaskEnded(WorkerTasks.LOAD_MANGA), mangaId, null, err.message);
        });
});

ipc.on(WorkerTasks.DOWNLOAD_MANGA_CHAPTERS, function (event, arg, callerId) {
    const mangaId = arg.mangaId;
    const downloadChapters = arg.chapters;
    const dirPath = arg.dirPath;

    const fromWindow = BrowserWindow.fromId(callerId);

    function downloadChaptersProgress(chapter, info) {
        info = Object.assign(info, {key: chapter.title});
        fromWindow.webContents.send(workerTaskProgress(WorkerTasks.DOWNLOAD_MANGA_CHAPTERS), mangaId, info);
    }

    downloadMangaChapters(downloadChapters, dirPath, downloadChaptersProgress)
        .then(() => {
            fromWindow.webContents.send(workerTaskEnded(WorkerTasks.DOWNLOAD_MANGA_CHAPTERS), mangaId, null, null);
        })
        .catch((err) => {
            fromWindow.webContents.send(workerTaskEnded(WorkerTasks.DOWNLOAD_MANGA_CHAPTERS), mangaId, null, err.message);
        });
});
