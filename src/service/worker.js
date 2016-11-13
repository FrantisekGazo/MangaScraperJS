const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');


const WorkerTasks = {
    LOAD_MANGA: 'load-manga'
};

function workerTaskEnded(name) {
    return `${name}-done`;
}

function execByWorker(key, arg) {
    return new Promise(function (resolve, reject) {
        const window = BrowserWindow.getFocusedWindow();
        const workerWindow = window.getChildWindows()[0];

        workerWindow.webContents.send(key, arg, window.id);

        ipcRenderer.on(`${key}-done`, function (event, input, output, err) {
            if (err) {
                reject(Error(err)); // Error cannot be passed from another process, so wrap it to new one
            } else {
                resolve(output);
            }
        });
    });
}

module.exports = {
    WorkerTasks,
    workerTaskEnded,
    execByWorker
};
