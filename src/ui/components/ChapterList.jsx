"use strict";

const React = require('react');

const Chapter = require('./Chapter.jsx');


const ChapterList = ({chapters}) => {
    return <ul>
        {chapters.map(chapter =>
            <Chapter
                key={chapter.id}
                title={chapter.title}
            />
        )}
    </ul>
};

ChapterList.propTypes = {
    chapters: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            title: React.PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
};

module.exports = ChapterList;
