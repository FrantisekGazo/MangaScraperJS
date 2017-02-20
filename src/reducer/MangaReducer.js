"use strict";

const update = require('immutability-helper');

const DownloadStatusCode = require('../model/DownloadStatusCode');

const { ACTIONS } = require('../action/MangaAction');


const initState = {
    id: null,
    loading: false,
    loaded: false,
    error: '',
    // info
    title: '',
    image: '',
    chapters: {},
    shownChapterId: null,
    // download
    downloadChapterIds: [],
    isDownloading: false,
};
module.exports = (state = initState, action) => {
    switch (action.type) {
        case ACTIONS.LOAD_MANGA:
            return loadManga(state, action);
        case ACTIONS.LOAD_MANGA_DONE:
            return loadMangaDone(state, action);
        case ACTIONS.LOAD_MANGA_FAILED:
            return loadMangaFailed(state, action);
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


function loadManga(state, action) {
    return Object.assign({}, initState, { // use INITIAL STATE
        id: action.payload,
        loading: true,
        loaded: false,
    });
}

function loadMangaDone(state, action) {
    return Object.assign({}, state, action.payload, {
        loading: false,
        loaded: true,
    });
}

function loadMangaFailed(state, action) {
    return Object.assign({}, state, {
        loading: false,
        loaded: false,
        error: action.payload
    });
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
