"use strict";

const React = require('react');
const {connect} = require('react-redux');

const Selector = require('../components/Selector.jsx');
const {loadManga} = require('../../actions/manga');


const MangaSelector = connect(
    // state to props
    (state) => {
        return {
        }
    },
    // dispatch functions to props
    (dispatch) => {
        return {
            onSelected: (title) => {
                dispatch(loadManga(title))
            }
        }
    }
)(Selector);

module.exports = MangaSelector;