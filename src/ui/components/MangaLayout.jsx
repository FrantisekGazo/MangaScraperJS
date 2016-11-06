"use strict";

const React = require('react');

const ChapterList = require('./ChapterList.jsx');
const Loader = require('./Loader.jsx');


const MangaLayout = ({manga, onChapterClick, onDownloadClick}) => {
    if (manga.isLoading) {
        return <Loader />
    }

    if (manga.error) {
        return <div>
            {manga.error}
        </div>
    }

    let downloadInfo = null;
    if (manga.downloadInfo) {
        const infoItems = Object.keys(manga.downloadInfo).map(key => <li key={key}>{key}
            : {manga.downloadInfo[key].msg}</li>);

        downloadInfo = <ul>
            {infoItems}
        </ul>
    }

    return <div>
        <h2>{manga.title}</h2>
        <img src={manga.image}/>
        <div>
            <button onClick={onDownloadClick} disabled={manga.isDownloading}>Download</button>
            {downloadInfo}
        </div>
        <ChapterList chapters={manga.chapters} onChapterClick={onChapterClick}/>
    </div>
};

MangaLayout.propTypes = {
    manga: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        image: React.PropTypes.string.isRequired,
        chapters: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
                title: React.PropTypes.string.isRequired,
                date: React.PropTypes.string.isRequired
            }).isRequired
        ).isRequired
    }).isRequired,
    onChapterClick: React.PropTypes.func.isRequired,
    onDownloadClick: React.PropTypes.func.isRequired
};

module.exports = MangaLayout;
