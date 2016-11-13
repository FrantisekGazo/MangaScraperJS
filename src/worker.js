const ipc = require('electron').ipcRenderer;
const BrowserWindow = require('electron').remote.BrowserWindow;

const {WorkerTasks, workerTaskEnded} = require('./service/worker');
const {scrapeMangaInfo} = require('./service/scraper');


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
