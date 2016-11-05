"use strict";

const React = require('react');

const Counter = require('./Counter.jsx');
const MangaSelector = require('../containers/MangaSelector.jsx');
const CurrentManga = require('../containers/CurrentManga.jsx');


module.exports = class App extends React.Component {

    render() {
        return <div>
            <Counter counter={this.props.counter} increment={this.props.increment}/>
            <MangaSelector />
            <CurrentManga />
        </div>
    }
};
