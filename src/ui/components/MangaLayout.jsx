"use strict";

const React = require('react');

const ChapterList = require('./ChapterList.jsx');


const MangaLayout = ({title, chapters}) => {
    return <div>
        <h2>{title}</h2>
        <ChapterList chapters={chapters}/>
    </div>
};

MangaLayout.propTypes = {
    title: React.PropTypes.string.isRequired,
    chapters: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            title: React.PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
};

module.exports = MangaLayout;
