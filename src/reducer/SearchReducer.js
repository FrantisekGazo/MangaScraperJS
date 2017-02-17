"use strict";

const { ACTIONS } = require('../action/SearchAction');


const initState = {
    loading: false,
    lastTitle: '',
    error: '',
};

const search = (state = initState, action) => {
    switch (action.type) {
        case ACTIONS.SEARCH_START:
            return Object.assign({}, state, {
                loading: true,
                lastTitle: action.payload
            });
        case ACTIONS.SEARCH_END:
            return Object.assign({}, state, {
                loading: false
            });
        case ACTIONS.SEARCH_ERROR:
            return Object.assign({}, state, {
                loading: false,
                error: action.payload
            });
        default:
            return state;
    }
};

module.exports = search;
