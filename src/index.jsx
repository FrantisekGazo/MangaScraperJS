const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./ui/containers/App.jsx');

const {Provider} = require('react-redux');
const {createStore} = require('redux');

const counter = require('./reducer/counter');

const store = createStore(counter);

if (process.env.NODE_ENV === 'development') {
    require('watch-glob')(['src/reducer/**/*.js'], {callbackArg: 'absolute'}, f => {
        console.log('Hot reload reducer', f);
        delete require.cache[require.resolve(f)];
        const nextReducer = require(f);
        store.replaceReducer(nextReducer);
    });
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));