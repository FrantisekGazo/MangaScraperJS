"use strict";

const update = require('immutability-helper');

const { ACTIONS } = require('../action/MangaAction');


const initState = {
    title: '',
    image: '',
    chapters: [],
    error: '',
    isDownloading: false,
    downloadInfo: null
};
module.exports = (state = initState, action) => {
    switch (action.type) {
        case ACTIONS.SET_MANGA:
            return action.payload;
        case ACTIONS.TOGGLE_CHAPTER:
            const chapterId = action.payload;
            let i = 0;
            let found = false;
            for (i = 0; i < state.chapters.length; i++) {
                const chapter = state.chapters[i];
                if (chapter.id == chapterId) {
                    found = true;
                    break;
                }
            }

            if (found) {
                return update(state, {
                    chapters: {
                        [i]: {
                            checked: {
                                $apply: function (checked) {
                                    return !checked;
                                }
                            }
                        }

                    }
                });
            } else {
                return state;
            }
        case ACTIONS.DOWNLOAD_CHAPTERS_START:
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
        case ACTIONS.DOWNLOAD_CHAPTERS_END:
            return Object.assign({}, state, {
                isDownloading: false,
            });
        default:
            return state
    }
};
