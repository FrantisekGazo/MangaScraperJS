"use strict";

const { createAction } = require('./index');


const ACTIONS = {
    SET_SEARCH_TEXT: 'SET_SEARCH_TEXT',
    SEARCH_START: 'SEARCH_START',
    SEARCH_END: 'SEARCH_END',
    SEARCH_ERROR: 'SEARCH_ERROR',
};


const createSetSearchTextAction = (title) => {
    return createAction(ACTIONS.SET_SEARCH_TEXT, title);
};

const createSearchStartAction = () => {
    return createAction(ACTIONS.SEARCH_START);
};

const createSearchEndAction = () => {
    return createAction(ACTIONS.SEARCH_END);
};

const createSearchErrorAction = (errorMessage) => {
    return createAction(ACTIONS.SEARCH_ERROR, errorMessage);
};


module.exports = {
    ACTIONS,
    createSetSearchTextAction,
    createSearchStartAction,
    createSearchEndAction,
    createSearchErrorAction,
};
