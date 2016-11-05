"use strict";

const React = require('react');

const ChapterList = require('./ChapterList.jsx');


const MangaLayout = ({manga}) => {
    return <div>
        <h2>{manga.title}</h2>
        <ChapterList chapters={manga.chapters}/>
    </div>
};

MangaLayout.propTypes = {
    manga: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        image: React.PropTypes.string.isRequired,
        chapters: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
                title: React.PropTypes.string.isRequired
            }).isRequired
        ).isRequired
    }).isRequired
};

module.exports = MangaLayout;
