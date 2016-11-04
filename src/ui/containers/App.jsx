"use strict";

const React = require('react');
const {connect} = require('react-redux');

const Counter = require('../components/Counter.jsx');
const {increment} = require('../../actions/counterActions');


module.exports = connect(
    state => ({counter: state.counter}),
    {increment}
)(Counter);
