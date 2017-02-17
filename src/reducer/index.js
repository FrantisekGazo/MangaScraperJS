"use strict";

const { combineReducers } = require("redux");
const { routerReducer } = require('react-router-redux');

const manga = require("./MangaReducer");
const search = require("./SearchReducer");


module.exports = combineReducers({
    routing: routerReducer,
    search: search,
    manga: manga,
});
