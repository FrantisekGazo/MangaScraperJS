"use strict";

const { createAction } = require('./index');
const { createGoBackAction } = require('./RouterAction');
const { showSaveDirDialog } = require('../service/dialog');
const { WorkerTasks, execByWorker } = require('../service/worker');
const MangaSelector = require('../selector/MangaSelector');


const ACTIONS = {
    SET_MANGA: 'SET_MANGA',
    TOGGLE_CHAPTER: 'TOGGLE_CHAPTER',
    DOWNLOAD_CHAPTERS_START: 'DOWNLOAD_CHAPTERS_START',
    DOWNLOAD_CHAPTERS_END: 'DOWNLOAD_CHAPTERS_END',
    DOWNLOAD_INFO: 'DOWNLOAD_INFO',
};


const createSetMangaAction = (manga) => {
    return createAction(ACTIONS.SET_MANGA, manga);
};

const createStartChapterDownloadAction = () => {
    return createAction(ACTIONS.DOWNLOAD_CHAPTERS_START);
};

const createChapterDownloadInfoAction = (info) => {
    return createAction(ACTIONS.DOWNLOAD_INFO, info);
};

const createEndChapterDownloadAction = () => {
    return createAction(ACTIONS.DOWNLOAD_CHAPTERS_END);
};

const createToggleChapterAction = (chapterId) => {
    return createAction(ACTIONS.TOGGLE_CHAPTER, chapterId);
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

function toggleChapter(chapterId) {
    return function (dispatcher, getState) {
        dispatcher(createToggleChapterAction(chapterId));
    };
}

const chapterSort = (a, b) => (a.title > b.title) ? 1 : -1;

function downloadChapters() {
    return (dispatch, getState) => {
        const state = getState();
        const manga = MangaSelector.getManga(state);

        let downloadChapters = manga.chapters.filter(chapter => chapter.checked).sort(chapterSort);

        if (downloadChapters.length == 0) {
            return Promise.resolve();
        }

        dispatch(createStartChapterDownloadAction());

        function downloadChaptersProgress(info) {
            dispatch(createChapterDownloadInfoAction(info));
        }

        return showSaveDirDialog()
            .then((dirPath) => {
                    return execByWorker(
                        WorkerTasks.DOWNLOAD_MANGA_CHAPTERS, {
                            mangaId: manga.id,
                            chapters: downloadChapters,
                            dirPath: dirPath
                        }, downloadChaptersProgress);
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
    downloadChapters,
    goBack,
    setManga,
    toggleChapter,
};
