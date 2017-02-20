"use strict";

const { createLogic } = require('redux-logic');

const SearchAction = require('../action/SearchAction');
const ScraperService = require('../service/ScraperService');


const searchManga = createLogic({
    type: SearchAction.ACTIONS.SET_SEARCH_TEXT,
    latest: true,
    process({ getState, action }, dispatch, done) {
        const mangaTitle = action.payload;

        dispatch(SearchAction.createSearchStartAction());

        ScraperService.scrapeSearch(mangaTitle)
            .then((mangaList) => {
                dispatch(SearchAction.createSearchEndAction(mangaList));
            })
            .catch((err) => {
                dispatch(SearchAction.createSearchErrorAction(err.message));
            })
            .then(() => done());
    }
});


module.exports = [
    searchManga,
];
