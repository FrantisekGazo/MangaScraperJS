"use strict";

const ipc = require('electron').ipcRenderer;
const BrowserWindow = require('electron').remote.BrowserWindow;

const { WorkerTasks, workerTaskProgress, workerTaskEnded } = require('./service/WorkerService');
const { scrapeMangaInfo } = require('./service/scraper');
const { downloadMangaChapter } = require('./service/manga');


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

ipc.on(WorkerTasks.DOWNLOAD_MANGA_CHAPTER, function (event, arg, callerId) {
    const { chapter, dirPath } = arg;

    const fromWindow = BrowserWindow.fromId(callerId);

    function downloadChapterProgress(chapterId, status) {
        fromWindow.webContents.send(workerTaskProgress(WorkerTasks.DOWNLOAD_MANGA_CHAPTER), arg, {chapterId, status});
    }

    downloadMangaChapter(chapter, dirPath, downloadChapterProgress)
        .then(() => {
            fromWindow.webContents.send(workerTaskEnded(WorkerTasks.DOWNLOAD_MANGA_CHAPTER), arg, null, null);
        })
        .catch((err) => {
            fromWindow.webContents.send(workerTaskEnded(WorkerTasks.DOWNLOAD_MANGA_CHAPTER), arg, null, err.message);
        });
});
