"use strict";

const {Actions} = require('../actions/manga');


const selectedInitState = '';
const selected = (state = selectedInitState, action) => {
    switch (action.type) {
        case Actions.SELECT_MANGA:
            return action.mangaId;
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
            return Object.assign({}, state, {
                isLoading: true
            });
        case Actions.RECEIVE_MANGA:
            return Object.assign({}, state, action.payload, {
                isLoading: false,
                lastUpdated: Date.now()
            });
        case Actions.RECEIVE_MANGA_ERROR:
            return Object.assign({}, state, {
                isLoading: false,
                error: action.payload
            });
        case Actions.TOGGLE_CHAPTER:
            let newState = Object.assign({}, state);
            newState.chapters = state.chapters.slice();

            var i = 0;
            for (i = 0; i < newState.chapters.length; i++) {
                const chapter = newState.chapters[i];
                if (chapter.id == action.payload) {
                    newState.chapters[i] = Object.assign({}, chapter, {checked: !chapter.checked});
                    break;
                }
            }

            return newState;
        case Actions.DOWNLOAD_CHAPTERS_START:
            return Object.assign({}, state, {
                isDownloading: true,
                downloadInfo: null
            });
        case Actions.DOWNLOAD_INFO:
            const newInfo = Object.assign({}, state.downloadInfo, {
                [action.payload.key]: action.payload
            });
            return Object.assign({}, state, {
                downloadInfo: newInfo
            });
        case Actions.DOWNLOAD_CHAPTERS_END:
            return Object.assign({}, state, {
                isDownloading: false
            });
        default:
            return state
    }
};

const mangaLibaryInitState = {};
const mangaLibrary = (state = mangaLibaryInitState, action) => {
    switch (action.type) {
        case Actions.SELECT_MANGA:
            if (action.mangaId in state) {
                return state
            } else {
                return Object.assign({}, state, {
                    [action.mangaId]: manga(state[action.mangaId], action)
                });
            }
        case Actions.REQUEST_MANGA:
        case Actions.RECEIVE_MANGA:
        case Actions.RECEIVE_MANGA_ERROR:
        case Actions.TOGGLE_CHAPTER:
        case Actions.DOWNLOAD_CHAPTERS_START:
        case Actions.DOWNLOAD_INFO:
        case Actions.DOWNLOAD_CHAPTERS_END:
            return Object.assign({}, state, {
                [action.mangaId]: manga(state[action.mangaId], action)
            });
        default:
            return state
    }
};

module.exports = {
    selected,
    mangaLibrary
};