"use strict";

const React = require('react');


const Chapter = ({chapter, onClick}) => {
    return <li onClick={onClick}>
        <input type="checkbox" checked={chapter.checked} /> {chapter.title} ({chapter.date})
    </li>
};

Chapter.propTypes = {
    chapter: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        date: React.PropTypes.string.isRequired,
        checked: React.PropTypes.bool.isRequired
    }).isRequired,
    onClick: React.PropTypes.func.isRequired
};

module.exports = Chapter;
