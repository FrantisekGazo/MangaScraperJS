"use strict";

const update = require('immutability-helper');

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
            return action.payload;
        case ACTIONS.SHOW_CHAPTER:
            const chapterId = action.payload;

            return Object.assign({}, state, {
                shownChapterId: chapterId
            });
        case ACTIONS.DOWNLOAD_CHAPTER_START:
            return Object.assign({}, state, {
                isDownloading: true
            });
        case ACTIONS.UPDATE_CHAPTER_DOWNLOAD_STATUS:
            const { id, status } = action.payload;

            return update(state, {
                chapters: {
                    [id]: {
                        status: {$set: status}
                    }
                }
            });
        case ACTIONS.DOWNLOAD_CHAPTER_END:
            return Object.assign({}, state, {
                isDownloading: false
            });
        default:
            return state
    }
};
