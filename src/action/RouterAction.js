"use strict";

const { replace, push, goBack } = require('react-router-redux');


function createGoBackAction() {
    return goBack();
}

function createGoToSearchScreenAction() {
    return replace({pathname: '/'});
}

function createGoToMangaScreenAction(mangaId) {
    return push({pathname: 'manga/' + mangaId});
}


module.exports = {
    createGoBackAction,
    createGoToSearchScreenAction,
    createGoToMangaScreenAction,
};
