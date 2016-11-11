"use strict";

const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const ChapterList = require('./ChapterList.jsx');
const Loader = require('./Loader.jsx');

const MangaLayout = ({manga, onChapterClick, onDownloadClick}) => {
    let content = null;

    if (manga.isLoading) {
        content = <div key="load">
            <Loader/>
        </div>
    } else if (manga.error) {
        return <div key="error">
            {manga.error}
        </div>
    } else {
        let infoItems = null;
        if (manga.downloadInfo) {
            infoItems = Object.keys(manga.downloadInfo)
                .map(key => <li key={key}>{key} : {manga.downloadInfo[key].msg}</li>);
        }

        content = <div key={`manga-${manga.title}`}>
            <h2>{manga.title}</h2>
            <img src={manga.image}/>
            <div>
                <button onClick={onDownloadClick} disabled={manga.isDownloading}>Download</button>
                <ul>
                    {infoItems}
                </ul>
            </div>
            <ChapterList chapters={manga.chapters} onChapterClick={onChapterClick}/>
        </div>
    }


    return <div>
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
            {content}
        </ReactCSSTransitionGroup>
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
