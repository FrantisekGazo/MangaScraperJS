"use strict";

const React = require('react');
const { connect } = require('react-redux');

const SearchScreen = require('../../components/Search/SearchScreen.jsx');
const SearchAction = require('../../../action/SearchAction');
const SearchSelector = require('../../../selector/SearchSelector');


module.exports = connect(
    // state to props
    (state) => {
        return {
            error: SearchSelector.getError(state),
            isLoading: SearchSelector.isLoading(state),
            lastTitle: SearchSelector.getLastTitle(state),
            results: SearchSelector.getResults(state),
        };
    },
    // dispatch functions to props
    (dispatch) => {
        return {
            onSearchClick: (title) => {
                dispatch(SearchAction.createSetSearchTextAction(title));
            }
        };
    }
)(SearchScreen);
