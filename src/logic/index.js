"use strict";


const SearchLogic = require('./SearchLogic');
const MangaLogic = require('./MangaLogic');


module.exports = [
    ...SearchLogic,
    ...MangaLogic,
];
