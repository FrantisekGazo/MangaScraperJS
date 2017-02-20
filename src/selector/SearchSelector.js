"use strict";


const searchState = (state) => state.search;

const getLastTitle = (state) => searchState(state).lastTitle;

const getError = (state) => searchState(state).error;

const isLoading = (state) => searchState(state).loading;

const getResults = (state) => searchState(state).results;


module.exports = {
    getError,
    getLastTitle,
    getResults,
    isLoading,
};
