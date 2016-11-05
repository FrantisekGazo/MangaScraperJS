"use strict";

const React = require('react');
const {connect} = require('react-redux');

const MangaLayout = require('../components/MangaLayout.jsx');


const CurrentManga = connect(
    // state to props
    (state) => {
        return {
            manga: state.mangaLibrary[state.selected]
        };
    },
    // dispatch functions to props
    (dispatch) => {
        return {}
    }
)(MangaLayout);

module.exports = CurrentManga;
