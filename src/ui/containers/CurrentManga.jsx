"use strict";

const React = require('react');
const {connect} = require('react-redux');

const MangaLayout = require('../components/MangaLayout.jsx');


const CurrentManga = connect(
    // state to props
    (state) => {
        return {
            title: state.manga.title,
            chapters: state.manga.chapters
        }
    },
    // dispatch functions to props
    (dispatch) => {
        return {
        }
    }
)(MangaLayout);

module.exports = CurrentManga;
