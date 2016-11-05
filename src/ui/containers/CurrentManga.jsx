"use strict";

const React = require('react');
const {connect} = require('react-redux');

const MangaLayout = require('../components/MangaLayout.jsx');
const {toggleChapter, downloadChapters} = require('../../actions/manga');


const CurrentManga = connect(
    // state to props
    (state) => {
        return {
            manga: state.mangaLibrary[state.selected]
        };
    },
    // dispatch functions to props
    (dispatch) => {
        return {
            onChapterClick: (chapterId) => {
                dispatch(toggleChapter(chapterId))
            },
            onDownloadClick: () => {
                dispatch(downloadChapters())
            }
        }
    }
)(MangaLayout);

module.exports = CurrentManga;
