"use strict";

const { createLogic } = require('redux-logic');

const MangaAction = require('../action/MangaAction');
const RouterAction = require('../action/RouterAction');
const { WorkerTasks, execByWorker } = require('../service/WorkerService');
const FileService = require('../service/FileService');
const MangaSelector = require('../selector/MangaSelector');


const validateEnqueuedChapter = createLogic({
    type: MangaAction.ACTIONS.ENQUEUE_CHAPTER_DOWNLOAD,
    validate({ getState, action }, allow, reject) {
        const chapterId = action.payload;
        const enqueuedIds = MangaSelector.getDownloadChapterIds(getState());

        if (enqueuedIds.indexOf(chapterId) === -1) {
            allow(action);
        } else {
            reject();
        }
    }
});

const startDownload = createLogic({
    type: MangaAction.ACTIONS.ENQUEUE_CHAPTER_DOWNLOAD,
    process({ getState, action }, dispatch, done) {
        downloadNextChapter(dispatch, getState)
            .then(() => done());
    }
});

function downloadNextChapter(dispatch, getState) {
    const state = getState();

    if (MangaSelector.isDownloading(state)) {
        return Promise.resolve();
    }

    const chapterIds = MangaSelector.getDownloadChapterIds(state);

    if (chapterIds.length === 0) {
        return Promise.resolve();
    }

    const chapter = MangaSelector.getChapter(state, chapterIds[0]);

    dispatch(MangaAction.createStartChapterDownloadAction());

    function downloadChapterProgress({chapterId, status}) {
        dispatch(MangaAction.createChapterDownloadStatusAction(chapterId, status));
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
            dispatch(MangaAction.createEndChapterDownloadAction());
            return downloadNextChapter(dispatch, getState);
        })
        .catch((err) => {
            dispatch(MangaAction.createEndChapterDownloadAction());
            console.log('Download failed:', err);
            return downloadNextChapter(dispatch, getState);
        });
}


module.exports = [
    validateEnqueuedChapter,
    startDownload
];
