"use strict";

const { combineReducers } = require("redux");
const { routerReducer } = require('react-router-redux');

const mangaLibrary = require("./MangaReducer");
const search = require("./SearchReducer");


module.exports = combineReducers({
    routing: routerReducer,
    search: search,
    mangaLibrary: mangaLibrary,
});
