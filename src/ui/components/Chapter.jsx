"use strict";

const React = require('react');


const Chapter = ({title}) => {
    return <li>{title}</li>
};

Chapter.propTypes = {
    title: React.PropTypes.string.isRequired
};

module.exports = Chapter;
