"use strict";

const { createStore, applyMiddleware, compose } = require('redux');
const thunkMiddleware = require('redux-thunk').default;
const { createLogicMiddleware } = require('redux-logic'); // TODO: remove redux-thunk and use only redux-logic
const logic = require('../logic');
const { routerMiddleware } = require('react-router-redux');
const { hashHistory } = require('react-router');

const reducer = require('../reducer');


let enhancer;
if (process.env.NODE_ENV === 'development') {
    const { composeWithDevTools } = require('redux-devtools-extension');

    const composeEnhancers = composeWithDevTools({
        // Specify here name, actionsBlacklist, actionsCreators and other options
    });

    enhancer = composeEnhancers(
        applyMiddleware(
            thunkMiddleware,
            createLogicMiddleware(logic),
            routerMiddleware(hashHistory)
        )
    );
} else { // production
    enhancer = compose(
        applyMiddleware(
            thunkMiddleware,
            createLogicMiddleware(logic),
            routerMiddleware(hashHistory)
        )
    );
}

module.exports = createStore(reducer, enhancer);
