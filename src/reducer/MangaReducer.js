"use strict";

const update = require('immutability-helper');

const DownloadStatusCode = require('../model/DownloadState');

const { ACTIONS } = require('../action/MangaAction');


const initState = {
    // info
    title: '',
    image: '',
    chapters: {},
    shownChapterId: null,
    // error
    error: '',
    // download
    downloadChapterIds: [],
    isDownloading: false,
};
module.exports = (state = initState, action) => {
    switch (action.type) {
        case ACTIONS.SET_MANGA:
            return setManga(state, action);
        case ACTIONS.SHOW_CHAPTER:
            return showChapter(state, action);
        case ACTIONS.DOWNLOAD_CHAPTER_START:
            return chapterDonloadStart(state, action);
        case ACTIONS.ENQUEUE_CHAPTER_DOWNLOAD:
            return enqueueChapterDonload(state, action);
        case ACTIONS.UPDATE_CHAPTER_DOWNLOAD_STATUS:
            return chapterDonloadStatus(state, action);
        case ACTIONS.DOWNLOAD_CHAPTER_END:
            return chapterDonloadEnd(state, action);
        default:
            return state;
    }
};


function setManga(state, action) {
    return Object.assign({}, initState, action.payload);
}

function showChapter(state, action) {
    const chapterId = action.payload;

    return Object.assign({}, state, {
        shownChapterId: chapterId
    });
}

function enqueueChapterDonload(state, action) {
    const chapterId = action.payload;
    return update(state, {
        downloadChapterIds: {$set: state.downloadChapterIds.concat([chapterId])},
        chapters: {
            [chapterId]: {
                status: {$set: {code: DownloadStatusCode.IN_QUEUE, msg: 'Waiting...'}}
            }
        }
    });
}

function chapterDonloadStart(state, action) {
    return Object.assign({}, state, {
        isDownloading: true
    });
}

function chapterDonloadStatus(state, action) {
    const { id, status } = action.payload;

    return update(state, {
        chapters: {
            [id]: {
                status: {$set: status}
            }
        }
    });
}

function chapterDonloadEnd(state, action) {
    return Object.assign({}, state, {
        isDownloading: false,
        downloadChapterIds: state.downloadChapterIds.slice(1, state.downloadChapterIds.length),
    });
}
