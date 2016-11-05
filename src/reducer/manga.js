const {Actions} = require('../actions/manga');


const selectedInitState = {
    title: '',
    error: ''
};
const selected = (state = selectedInitState, action) => {
    switch (action.type) {
        case Actions.SELECT_MANGA:
            return Object.assign({}, state, {
                title: action.manga
            });
        case Actions.SELECT_MANGA_ERROR:
            return Object.assign({}, state, {
                error: action.payload
            });
        default:
            return state
    }
};


const mangaInitState = {
    isFetching: false,
    didInvalidate: false,
    chapters: [],
    lastUpdated: 0
};
const manga = (state = mangaInitState, action) => {
    switch (action.type) {
        case Actions.INVALIDATE_MANGA:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case Actions.REQUEST_MANGA:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case Actions.RECEIVE_MANGA:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                chapters: action.payload,
                lastUpdated: Date.now()
            });
        default:
            return state
    }
};

const mangaLibaryInitState = {};
const mangaLibrary = (state = mangaLibaryInitState, action) => {
    switch (action.type) {
        case Actions.SELECT_MANGA:
            if (state[action.manga]) {
                return state
            } else {
                return Object.assign({}, state, {
                    [action.manga]: manga(state[action.manga], action)
                });
            }
        case Actions.INVALIDATE_MANGA:
        case Actions.REQUEST_MANGA:
        case Actions.RECEIVE_MANGA:
            return Object.assign({}, state, {
                [action.manga]: manga(state[action.manga], action)
            });
        default:
            return state
    }
};

module.exports = {
    selected,
    mangaLibrary
};