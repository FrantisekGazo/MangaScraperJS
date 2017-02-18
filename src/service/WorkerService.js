const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');

const WINDOW_IDS = {
    MAIN: 0,
    WORKER: 0,
};

function listenForWindowIds() {
    ipcRenderer.on('set-main-window-id', function (event, input, output, err) {
        WINDOW_IDS.MAIN = input;
        console.log('set-main-window-id', event, input, output, err);
    });
    ipcRenderer.on('set-worker-window-id', function (event, input, output, err) {
        WINDOW_IDS.WORKER = input;
        console.log('set-worker-window-id', event, input, output, err);
    });
}

const WorkerTasks = {
    LOAD_MANGA: 'load-manga',
    DOWNLOAD_MANGA_CHAPTER: 'download-manga-chapter'
};

function workerTaskEnded(name) {
    return `${name}-done`;
}

function workerTaskProgress(name) {
    return `${name}-progress`;
}

function execByWorker(key, arg, progressCallback=null) {
    return new Promise(function (resolve, reject) {
        const mainWindow = BrowserWindow.fromId(WINDOW_IDS.MAIN);
        const workerWindow = BrowserWindow.fromId(WINDOW_IDS.WORKER);

        ipcRenderer.on(workerTaskEnded(key), function (event, input, output, err) {
            if (err) {
                reject(Error(err)); // Error cannot be passed from another process, so wrap it to new one
            } else {
                resolve(output);
            }
            ipcRenderer.removeAllListeners(workerTaskEnded(key));
            ipcRenderer.removeAllListeners(workerTaskProgress(key));
        });

        if (progressCallback) {
            ipcRenderer.on(workerTaskProgress(key), function (event, input, progress) {
                progressCallback(progress);
            });
        }

        workerWindow.webContents.send(key, arg, mainWindow.id);
    });
}

module.exports = {
    listenForWindowIds,
    WorkerTasks,
    workerTaskProgress,
    workerTaskEnded,
    execByWorker
};
