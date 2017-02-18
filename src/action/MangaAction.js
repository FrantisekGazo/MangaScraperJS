"use strict";

const { app } = require('electron').remote;
const path = require('path');
const fs = require('fs');

const { createAction } = require('./index');
const { createGoBackAction } = require('./RouterAction');
const { showSaveDirDialog } = require('../service/dialog');
const { WorkerTasks, execByWorker } = require('../service/WorkerService');
const MangaSelector = require('../selector/MangaSelector');


const ACTIONS = {
    SET_MANGA: 'SET_MANGA',
    SHOW_CHAPTER: 'SHOW_CHAPTER',
    ENQUEUE_CHAPTER_DOWNLOAD: 'ENQUEUE_CHAPTER_DOWNLOAD',
    DOWNLOAD_CHAPTER_START: 'DOWNLOAD_CHAPTER_START',
    DOWNLOAD_CHAPTER_END: 'DOWNLOAD_CHAPTER_END',
    UPDATE_CHAPTER_DOWNLOAD_STATUS: 'UPDATE_CHAPTER_DOWNLOAD_STATUS',
};


const createSetMangaAction = (manga) => {
    return createAction(ACTIONS.SET_MANGA, manga);
};

const createEnqueueChapterDownloadAction = (chapterId) => {
    return createAction(ACTIONS.ENQUEUE_CHAPTER_DOWNLOAD, chapterId);
};

const createStartChapterDownloadAction = () => {
    return createAction(ACTIONS.DOWNLOAD_CHAPTER_START);
};

const createChapterDownloadStatusAction = (id, status) => {
    return createAction(ACTIONS.UPDATE_CHAPTER_DOWNLOAD_STATUS, {id, status});
};

const createEndChapterDownloadAction = () => {
    return createAction(ACTIONS.DOWNLOAD_CHAPTER_END);
};

const createShowChapterAction = (chapterId) => {
    return createAction(ACTIONS.SHOW_CHAPTER, chapterId);
};


function setManga(manga) {
    return function (dispatcher, getState) {
        dispatcher(createSetMangaAction(manga));
    };
}

function goBack() {
    return function (dispatcher, getState) {
        dispatcher(createGoBackAction());
    };
}

function showChapter(chapterId) {
    return function (dispatcher, getState) {
        dispatcher(createShowChapterAction(chapterId));
    };
}

function downloadShownChapter() {
    return (dispatch, getState) => {
        const state = getState();
        const chapterId = MangaSelector.getShownChapterId(state);
        const ids = MangaSelector.getDownloadChapterIds(state);

        if (ids.indexOf(chapterId) === -1) {
            dispatch(createEnqueueChapterDownloadAction(chapterId));
            return downloadNextChapter(dispatch, getState);
        } else {
            return Promise.resolve();
        }
    }
}

function downloadNextChapter(dispatch, getState) {
    const state = getState();

    if (MangaSelector.isDownloading(state)) {
        return;
    }

    const chapterIds = MangaSelector.getDownloadChapterIds(state);

    if (chapterIds.length === 0) {
        return;
    }

    const chapter = MangaSelector.getChapter(state, chapterIds[0]);

    dispatch(createStartChapterDownloadAction());

    function downloadChapterProgress({chapterId, status}) {
        dispatch(createChapterDownloadStatusAction(chapterId, status));
    }

    const mangaTitle = MangaSelector.getManga(state).title;
    const managaDirPath = getMangaDirectory(mangaTitle);
    return execByWorker(WorkerTasks.DOWNLOAD_MANGA_CHAPTER, {chapter, path: managaDirPath}, downloadChapterProgress)
        .then(() => {
            dispatch(createEndChapterDownloadAction());
            return downloadNextChapter(dispatch, getState);
        })
        .catch((err) => {
            dispatch(createEndChapterDownloadAction());
            console.log('Download failed:', err);
            return downloadNextChapter(dispatch, getState);
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
    ACTIONS,
    createSetMangaAction,
    downloadShownChapter,
    goBack,
    setManga,
    showChapter,
};
