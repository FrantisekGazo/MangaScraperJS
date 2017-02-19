"use strict";

const { createAction } = require('./index');


const ACTIONS = {
    SEARCH_START: 'SEARCH_START',
    SEARCH_END: 'SEARCH_END',
    SEARCH_ERROR: 'SEARCH_ERROR',
};


const createSearchStartAction = (title) => {
    return createAction(ACTIONS.SEARCH_START, title);
};

const createSearchEndAction = () => {
    return createAction(ACTIONS.SEARCH_END);
};

const createSearchErrorAction = (errorMessage) => {
    return createAction(ACTIONS.SEARCH_ERROR, errorMessage);
};


module.exports = {
    ACTIONS,
    createSearchStartAction,
    createSearchEndAction,
    createSearchErrorAction,
};
