"use strict";

const { ACTIONS } = require('../action/SearchAction');


const initState = {
    lastTitle: '',
    loading: false,
    results: [],
    error: '',
};

const search = (state = initState, action) => {
    switch (action.type) {
        case ACTIONS.SET_SEARCH_TEXT:
            return Object.assign({}, state, {
                lastTitle: action.payload,
                error: ''
            });
        case ACTIONS.SEARCH_START:
            return Object.assign({}, state, {
                loading: true,
                error: ''
            });
        case ACTIONS.SEARCH_END:
            const results = action.payload;
            return Object.assign({}, state, {
                loading: false,
                results: results,
                error: ''
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
