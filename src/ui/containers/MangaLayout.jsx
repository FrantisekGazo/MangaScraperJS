"use strict";

const React = require('react');
const {connect} = require('react-redux');

const MangaLayout = require('../components/MangaLayout.jsx');


module.exports = connect(
    (state) => ({manga: state.manga}),
    {}
)(MangaLayout);
