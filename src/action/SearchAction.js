"use strict";

const { createAction } = require('./index');
const { createSetMangaAction } = require('./MangaAction');
const { createGoToMangaScreenAction, createGoBackAction } = require('./RouterAction');
const { WorkerTasks, execByWorker } = require('../service/WorkerService');


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



const mangaTitleToId = (title) => {
    return title.toLowerCase().trim().replace(' ', '_').replace(/[^a-zA-Z0-9_]/, '');
};

const loadManga = (mangaId) => {
    return execByWorker(WorkerTasks.LOAD_MANGA, mangaId);
};

function execSearch(mangaTitle) {
    return function (dispatch, getState) {
        const mangaId = mangaTitleToId(mangaTitle);

        dispatch(createSearchStartAction(mangaTitle));

        return loadManga(mangaId)
            .then((manga) => {
                dispatch(createSearchEndAction());
                dispatch(createSetMangaAction(manga));
                dispatch(createGoToMangaScreenAction(mangaId));
            })
            .catch((err) => {
                dispatch(createSearchErrorAction(err.message));
            });
    }
}


module.exports = {
    ACTIONS,
    execSearch,
};
