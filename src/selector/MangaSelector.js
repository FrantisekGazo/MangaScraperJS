"use strict";


const mangaState = (state) => state.mangaLibrary;

const getManga = (state) => mangaState(state);


module.exports = {
    getManga,
};
