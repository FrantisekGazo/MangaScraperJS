"use strict";

const React = require('react');
const ReactDOM = require('react-dom');
const {Provider} = require('react-redux');

const App = require('./ui/containers/App.jsx');
const store = require('./store/renderer');


if (process.env.NODE_ENV === 'development') {
    require('watch-glob')(['src/reducer/**/*.js'], {callbackArg: 'absolute'}, f => {
        console.log('Hot reload reducer', f);
        // delete changed reducer from cache
        delete require.cache[require.resolve(f)];
        // delete combined reducers from cache
        f = f.replace(/[a-z]*.js/, '/index.js');
        delete require.cache[require.resolve(f)];
        // replace with new reducer
        const nextReducer = require(f);
        store.replaceReducer(nextReducer);
    });
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
