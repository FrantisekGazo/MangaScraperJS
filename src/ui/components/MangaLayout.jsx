"use strict";

const React = require('react');

/**
 * @type {MangaLayout}
 *
 * expects: manga
 */
module.exports = class MangaLayout extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>{this.props.manga.name}</h2>
            </div>
        );
    }
};
