const { createStore, applyMiddleware, compose } = require('redux');
const thunkMiddleware = require('redux-thunk').default;

const reducer = require('../reducer');


let enhancer;
if (process.env.NODE_ENV === 'development') {
    let logger = require('redux-logger');

    enhancer = compose(
        applyMiddleware(thunkMiddleware, logger())
    );
} else { // production
    enhancer = compose(
        applyMiddleware(thunkMiddleware)
    );
}

module.exports = createStore(reducer, enhancer);
