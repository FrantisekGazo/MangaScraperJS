"use strict";

const {connect} = require('react-redux');

const MainLayout = require('../components/App.jsx');
const {increment} = require('../../actions/counter');


module.exports = connect(
    state => ({counter: state.counter}),
    {increment}
)(MainLayout);
