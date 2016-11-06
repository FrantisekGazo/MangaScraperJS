"use strict";

const { combineReducers } = require("redux");

const { selected, mangaLibrary } = require("./manga");


module.exports = combineReducers({
    selected,
    mangaLibrary
});
