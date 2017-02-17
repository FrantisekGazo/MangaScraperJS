"use strict";

const React = require('react');
const {connect} = require('react-redux');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;

const MangaSelector = require('./MangaSelector.jsx');
const CurrentManga = require('./CurrentManga.jsx');
const NothingSelected = require('../components/NothingSelected.jsx');


const AppLayout = ({state}) => {
    const content = state.selected ? <CurrentManga /> : <NothingSelected />;

    return (
        <MuiThemeProvider>
            <div>
                <MangaSelector/>
                { content }
            </div>
        </MuiThemeProvider>
    );
};

module.exports = connect(
    // state to props
    (state) => {
        return {state};
    },
    // dispatch functions to props
    (dispatch) => {
        return {}
    }
)(AppLayout);
