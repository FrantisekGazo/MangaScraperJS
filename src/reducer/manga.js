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
    lastUpdated: 0
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