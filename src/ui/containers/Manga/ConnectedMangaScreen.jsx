"use strict";

const React = require('react');
const { connect } = require('react-redux');

const MangaScreen = require('../../components/Manga/MangaScreen.jsx');
const MangaAction = require('../../../action/MangaAction');
const RouterAction = require('../../../action/RouterAction');
const MangaSelector = require('../../../selector/MangaSelector');


module.exports = connect(
    // state to props
    (state) => {
        return {
            manga: MangaSelector.getManga(state),
            downloadingChapters: MangaSelector.getDownloadChapters(state),
            chapters: MangaSelector.getMangaChapters(state),
            shownChapter: MangaSelector.getShownChapter(state),
        };
    },
    // dispatch functions to props
    (dispatch) => {
        return {
            onBackClick: () => {
                dispatch(MangaAction.createCloseMangaAction());
            },
            onChapterClick: (chapterId) => {
                dispatch(MangaAction.createShowChapterAction(chapterId));
            },
            onDownloadClick: (chapterId) => {
                dispatch(MangaAction.createEnqueueChapterDownloadAction(chapterId));
            },
        };
    }
)(MangaScreen);
