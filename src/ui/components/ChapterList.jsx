"use strict";

const React = require('react');

const Chapter = require('./Chapter.jsx');


const ChapterList = ({chapters, onChapterClick}) => {
    return <ul>
        {chapters.map(chapter =>
            <Chapter
                key={chapter.id}
                chapter={chapter}
                onClick={() => onChapterClick(chapter.id)}
            />
        )}
    </ul>
};

ChapterList.propTypes = {
    chapters: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired,
            date: React.PropTypes.string.isRequired,
            checked: React.PropTypes.bool.isRequired
        }).isRequired
    ).isRequired,
    onChapterClick: React.PropTypes.func.isRequired
};

module.exports = ChapterList;
