"use strict";

const update = require('immutability-helper');

const {Actions} = require('../actions/manga');


const selectedInitState = '';
const selected = (state = selectedInitState, action) => {
    switch (action.type) {
        case Actions.SELECT_MANGA:
            return action.payload.mangaId;
        default:
            return state;
    }
};


const mangaInitState = {
    title: '',
    image: '',
    chapters: [],
    isLoading: false,
    lastUpdated: 0,
    error: '',
    isDownloading: false,
    downloadInfo: null
};
const manga = (state = mangaInitState, action) => {
    switch (action.type) {
        case Actions.REQUEST_MANGA:
            return update(state, {
                isLoading: {$set: true}
            });
        case Actions.RECEIVE_MANGA:
            return update(state, {
                $merge: {
                    title: action.payload.title,
                    image: action.payload.image,
                    chapters: action.payload.chapters,
                    isLoading: false,
                    lastUpdated: Date.now()
                }
            });
        case Actions.RECEIVE_MANGA_ERROR:
            return update(state, {
                $merge: {
                    isLoading: false,
                    error: action.payload.error
                }
            });
        case Actions.TOGGLE_CHAPTER:
            let i = 0;
            let found = false;
            for (i = 0; i < state.chapters.length; i++) {
                const chapter = state.chapters[i];
                if (chapter.id == action.payload.chapterId) {
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
        case Actions.DOWNLOAD_CHAPTERS_START:
            return update(state, {
                $merge: {
                    isDownloading: true,
                    downloadInfo: null
                }
            });
        case Actions.DOWNLOAD_INFO:
            if (state.downloadInfo) {
                return update(state, {
                    downloadInfo: {
                        [action.payload.info.key]: {$set: action.payload.info}
                    }
                });
            } else {
                return update(state, {
                    downloadInfo: {
                        $set: {
                            [action.payload.info.key]: action.payload.info
                        }
                    }
                });
            }
        case Actions.DOWNLOAD_CHAPTERS_END:
            return update(state, {
                isDownloading: {$set: false}
            });
        default:
            return state
    }
};

const mangaLibaryInitState = {};
const mangaLibrary = (state = mangaLibaryInitState, action) => {
    switch (action.type) {
        case Actions.SELECT_MANGA:
            if (action.payload.mangaId in state) {
                return state
            } else {
                return update(state, {
                    [action.payload.mangaId]: {$set: manga(state[action.payload.mangaId], action)}
                });
            }
        case Actions.REQUEST_MANGA:
        case Actions.RECEIVE_MANGA:
        case Actions.RECEIVE_MANGA_ERROR:
        case Actions.TOGGLE_CHAPTER:
        case Actions.DOWNLOAD_CHAPTERS_START:
        case Actions.DOWNLOAD_INFO:
        case Actions.DOWNLOAD_CHAPTERS_END:
            return update(state, {
                [action.payload.mangaId]: {$set: manga(state[action.payload.mangaId], action)}
            });
        default:
            return state
    }
};

module.exports = {
    selected,
    mangaLibrary
};