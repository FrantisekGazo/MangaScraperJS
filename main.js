'use strict';

const {app, BrowserWindow} = require('electron');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let loadingScreen;
let windowParams = {
    width: 800,
    height: 500,
    show: false
};

function createMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow(windowParams);

    // and load the index.html of the app.
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(`file://${__dirname}/src/index.html`);

        // installREDUX debug tools
        const tools = require('electron-devtools-installer');
        const installExtension = tools.default;
        const {REDUX_DEVTOOLS} = tools;

        installExtension(REDUX_DEVTOOLS)
            .then(name => console.log(`Added Extension: ${name}`))
            .catch(err => console.log(`An error occurred: ${err}`));

        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // prevents the need to put title inside html file
    mainWindow.on('page-title-updated', function (event) {
        event.preventDefault();
    });


    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();

        if (loadingScreen) {
            let loadingScreenBounds = loadingScreen.getBounds();
            mainWindow.setBounds(loadingScreenBounds);
            loadingScreen.close();
        }
    });
}

function createSplashScreen() {
    loadingScreen = new BrowserWindow(Object.assign(windowParams, {parent: mainWindow}));
    if (process.env.NODE_ENV === 'development') {
        loadingScreen.loadURL(`file://${__dirname}/src/splash.html`);
    } else {
        loadingScreen.loadURL(`file://${__dirname}/dist/splash.html`);
    }

    loadingScreen.on('closed', () => loadingScreen = null);
    loadingScreen.webContents.on('did-finish-load', () => {
        loadingScreen.show();
    });
}

function createWindow() {
    createSplashScreen();
    createMainWindow();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
