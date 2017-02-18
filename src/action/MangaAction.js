"use strict";

const { createAction } = require('./index');
const { createGoBackAction } = require('./RouterAction');
const { WorkerTasks, execByWorker } = require('../service/WorkerService');
const FileService = require('../service/FileService');
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
    const managaDirPath = FileService.getMangaDirectory(mangaTitle);
    const arg = {
        chapter,
        dirPath: managaDirPath,
        fileName: FileService.getMangaChapterFileName(mangaTitle, chapter.title)
    };
    return execByWorker(WorkerTasks.DOWNLOAD_MANGA_CHAPTER, arg, downloadChapterProgress)
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


module.exports = {
    ACTIONS,
    createSetMangaAction,
    downloadShownChapter,
    goBack,
    setManga,
    showChapter,
};
