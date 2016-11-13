"use strict";

const React = require('react');

class Loader extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return (<div className="load_bar">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </div>);
    }
}

module.exports = Loader;
