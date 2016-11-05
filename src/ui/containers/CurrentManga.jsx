"use strict";

const React = require('react');
const {connect} = require('react-redux');

const MangaLayout = require('../components/MangaLayout.jsx');


const CurrentManga = connect(
    // state to props
    (state) => {
        const selected = state.selected.title;
        if (selected) {
            return Object.assign({},
                {title: selected},
                state.mangaLibrary[selected]
            );
        } else {
            return {
                title: '',
                chapters: []
            };
        }
    },
    // dispatch functions to props
    (dispatch) => {
        return {}
    }
)(MangaLayout);

module.exports = CurrentManga;
