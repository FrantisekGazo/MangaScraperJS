"use strict";

const React = require('react');
const connect = require('react-redux').connect;
const Counter = require('../components/Counter.jsx');
const increment = require('../../actions/counterActions').increment;

module.exports = connect(
    state => ({counter: state}),
    {increment}
)(Counter);
