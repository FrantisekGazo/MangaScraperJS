'use strict';

const { app, BrowserWindow } = require('electron');


let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800, height: 600
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('file://' + __dirname + '/src/index.html');

        const tools = require('electron-devtools-installer');
        const installExtension = tools.default;
        const { REDUX_DEVTOOLS } = tools;

        installExtension(REDUX_DEVTOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));

        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // prevents the need to put title inside html file
    mainWindow.on('page-title-updated', function (event) {
        event.preventDefault();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
