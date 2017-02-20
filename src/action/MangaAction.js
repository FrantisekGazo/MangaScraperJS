"use strict";

const { createAction } = require('./index');


const ACTIONS = {
    LOAD_MANGA: 'LOAD_MANGA',
    LOAD_MANGA_DONE: 'LOAD_MANGA_DONE',
    LOAD_MANGA_FAILED: 'LOAD_MANGA_FAILED',
    SHOW_CHAPTER: 'SHOW_CHAPTER',
    ENQUEUE_CHAPTER_DOWNLOAD: 'ENQUEUE_CHAPTER_DOWNLOAD',
    DOWNLOAD_CHAPTER_START: 'DOWNLOAD_CHAPTER_START',
    DOWNLOAD_CHAPTER_END: 'DOWNLOAD_CHAPTER_END',
    UPDATE_CHAPTER_DOWNLOAD_STATUS: 'UPDATE_CHAPTER_DOWNLOAD_STATUS',
};


const createLoadMangaAction = (url) => {
    return createAction(ACTIONS.LOAD_MANGA, url);
};

const createLoadMangaDoneAction = (manga) => {
    return createAction(ACTIONS.LOAD_MANGA_DONE, manga);
};

const createLoadMangaFailedAction = (errorMessage) => {
    return createAction(ACTIONS.LOAD_MANGA_FAILED, errorMessage);
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


module.exports = {
    ACTIONS,
    createChapterDownloadStatusAction,
    createEndChapterDownloadAction,
    createEnqueueChapterDownloadAction,
    createLoadMangaAction,
    createLoadMangaDoneAction,
    createLoadMangaFailedAction,
    createShowChapterAction,
    createStartChapterDownloadAction,
};
