"use strict";

const { createAction } = require('./index');
const { createGoBackAction } = require('./RouterAction');
const { showSaveDirDialog } = require('../service/dialog');
const { WorkerTasks, execByWorker } = require('../service/WorkerService');
const MangaSelector = require('../selector/MangaSelector');


const ACTIONS = {
    SET_MANGA: 'SET_MANGA',
    SHOW_CHAPTER: 'SHOW_CHAPTER',
    DOWNLOAD_CHAPTER_START: 'DOWNLOAD_CHAPTER_START',
    DOWNLOAD_CHAPTER_END: 'DOWNLOAD_CHAPTER_END',
    UPDATE_CHAPTER_DOWNLOAD_STATUS: 'UPDATE_CHAPTER_DOWNLOAD_STATUS',
};


const createSetMangaAction = (manga) => {
    return createAction(ACTIONS.SET_MANGA, manga);
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
        const chapter = MangaSelector.getShownChapter(state);

        dispatch(createStartChapterDownloadAction());

        function downloadChapterProgress({chapterId, status}) {
            dispatch(createChapterDownloadStatusAction(chapterId, status));
        }

        return showSaveDirDialog()
            .then((dirPath) => {
                    return execByWorker(
                        WorkerTasks.DOWNLOAD_MANGA_CHAPTER, {chapter, dirPath}, downloadChapterProgress);
                }
            )
            .then(() => {
                dispatch(createEndChapterDownloadAction());
                return Promise.resolve();
            })
            .catch((err) => {
                dispatch(createEndChapterDownloadAction());
                console.log('Download failed:', err);
            });
    }
}


module.exports = {
    ACTIONS,
    createSetMangaAction,
    downloadShownChapter,
    goBack,
    setManga,
    showChapter,
};
