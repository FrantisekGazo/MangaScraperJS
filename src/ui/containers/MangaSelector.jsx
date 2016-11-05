"use strict";

const React = require('react');
const {connect} = require('react-redux');

const MangaSelector = require('../components/MangaSelector.jsx');
const {loadManga} = require('../../actions/manga');


module.exports = connect(
    (state) => ({}),
    { mangaSelected: loadManga }
)(MangaSelector);
