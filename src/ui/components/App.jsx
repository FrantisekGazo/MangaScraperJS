"use strict";

const React = require('react');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;


module.exports = ({children}) => <MuiThemeProvider children={children}/>;
