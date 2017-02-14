"use strict";

const {createAction} = require('./index');
const {showSaveDirDialog} = require('../service/dialog');
const {WorkerTasks, execByWorker} = require('../service/worker');


const Actions = {
    SELECT_MANGA: 'SELECT_MANGA',
    REQUEST_MANGA: 'REQUEST_MANGA',
    RECEIVE_MANGA: 'RECEIVE_MANGA',
    RECEIVE_MANGA_ERROR: 'RECEIVE_MANGA_ERROR',
    TOGGLE_CHAPTER: 'TOGGLE_CHAPTER',
    DOWNLOAD_CHAPTERS_START: 'DOWNLOAD_CHAPTERS_START',
    DOWNLOAD_CHAPTERS_END: 'DOWNLOAD_CHAPTERS_END',
    DOWNLOAD_INFO: 'DOWNLOAD_INFO',
};

const mangaTitleToId = (title) => {
    return title.toLowerCase().trim().replace(' ', '_').replace(/[^a-zA-Z0-9_]/, '');
};

const selectManga = (mangaId) => {
    return createAction(Actions.SELECT_MANGA, {mangaId});
};

const requestManga = (mangaId) => {
    return createAction(Actions.REQUEST_MANGA, {mangaId});
};

const receiveManga = (manga) => {
    return createAction(Actions.RECEIVE_MANGA, manga);
};

const receiveMangaError = (mangaId, error) => {
    return createAction(Actions.RECEIVE_MANGA_ERROR, {mangaId, error});
};

const startChapterDownload = (mangaId) => {
    return createAction(Actions.DOWNLOAD_CHAPTERS_START, {mangaId});
};

const chapterDownloadInfo = (mangaId, info) => {
    return createAction(Actions.DOWNLOAD_INFO, {mangaId, info});
};

const endChapterDownload = (mangaId) => {
    return createAction(Actions.DOWNLOAD_CHAPTERS_END, {mangaId});
};

const loadManga = (title) => {
    return (dispatch, getState) => {
        const mangaId = mangaTitleToId(title);

        if (mangaId === getState().selected) {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve();
        }

        if (mangaId in getState().mangaLibrary) {
            dispatch(selectManga(mangaId));
            return Promise.resolve();
        }

        dispatch(selectManga(mangaId));
        dispatch(requestManga(mangaId));

        return execByWorker(WorkerTasks.LOAD_MANGA, mangaId)
            .then((manga) => dispatch(receiveManga(manga)))
            .catch((err) => dispatch(receiveMangaError(mangaId, err.message)));
    }
};

const toggleChapter = (chapterId) => {
    const ids = chapterId.split('-');
    return createAction(Actions.TOGGLE_CHAPTER, {mangaId: ids[0], chapterId});
};

const chapterSort = (a, b) => (a.title > b.title) ? 1 : -1;

function downloadChapters() {
    return (dispatch, getState) => {
        const mangaId = getState().selected;
        const manga = getState().mangaLibrary[mangaId];

        let downloadChapters = manga.chapters.filter(chapter => chapter.checked).sort(chapterSort);

        if (downloadChapters.length == 0) {
            return Promise.resolve();
        }

        dispatch(startChapterDownload(mangaId));

        function downloadChaptersProgress(info) {
            dispatch(chapterDownloadInfo(mangaId, info));
        }

        return showSaveDirDialog()
            .then((dirPath) => {
                    return execByWorker(
                        WorkerTasks.DOWNLOAD_MANGA_CHAPTERS, {
                            mangaId: mangaId,
                            chapters: downloadChapters,
                            dirPath: dirPath
                        }, downloadChaptersProgress);
                }
            )
            .then(() => {
                dispatch(endChapterDownload(mangaId));
                return Promise.resolve();
            })
            .catch((err) => {
                dispatch(endChapterDownload(mangaId));
                console.log('Download failed:', err);
            });
    }
}


module.exports = {
    Actions,
    loadManga,
    toggleChapter,
    downloadChapters
};
