"use strict";

const update = require('immutability-helper');

const { ACTIONS } = require('../action/MangaAction');


const initState = {
    title: '',
    image: '',
    chapters: [],
    shownChapterId: null,
    error: '',
    isDownloading: false,
    downloadInfo: null
};
module.exports = (state = initState, action) => {
    switch (action.type) {
        case ACTIONS.SET_MANGA:
            return action.payload;
        case ACTIONS.SHOW_CHAPTER:
            const chapterId = action.payload;

            return Object.assign({}, state, {
                shownChapterId: chapterId
            });
        case ACTIONS.DOWNLOAD_CHAPTER_START:
            return Object.assign({}, state, {
                isDownloading: true,
                downloadInfo: null
            });
        case ACTIONS.DOWNLOAD_INFO:
            const info = action.payload;

            if (state.downloadInfo) {
                return update(state, {
                    downloadInfo: {
                        [info.key]: {$set: info}
                    }
                });
            } else {
                return update(state, {
                    downloadInfo: {$set: {[info.key]: info}}
                });
            }
        case ACTIONS.DOWNLOAD_CHAPTER_END:
            return Object.assign({}, state, {
                isDownloading: false,
            });
        default:
            return state
    }
};
