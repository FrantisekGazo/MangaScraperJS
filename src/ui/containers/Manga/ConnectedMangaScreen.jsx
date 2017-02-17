"use strict";

const React = require('react');
const { connect } = require('react-redux');

const MangaScreen = require('../../components/Manga/MangaScreen.jsx');
const MangaAction = require('../../../action/MangaAction');
const MangaSelector = require('../../../selector/MangaSelector');


module.exports = connect(
    // state to props
    (state) => {
        return {
            manga: MangaSelector.getManga(state)
        };
    },
    // dispatch functions to props
    (dispatch) => {
        return {
            onBackClick: () => {
                dispatch(MangaAction.goBack());
            },
            onChapterClick: (chapterId) => {
                dispatch(MangaAction.toggleChapter(chapterId));
            },
            onDownloadClick: () => {
                dispatch(MangaAction.downloadChapters());
            },
        };
    }
)(MangaScreen);
