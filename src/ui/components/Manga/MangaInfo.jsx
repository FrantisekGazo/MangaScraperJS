"use strict";

const React = require('react');
const { Card } = require('material-ui/Card');

const ChapterList = require('./ChapterList.jsx');


class MangaScreen extends React.Component {

    render() {
        const { manga, onChapterClick, onDownloadClick } = this.props;

        let infoItems = null;
        if (manga.downloadInfo) {
            infoItems = Object.keys(manga.downloadInfo)
                .map(key => <li key={key}>{key} : {manga.downloadInfo[key].msg}</li>);
        }

        return (
            <div>

                <img src={manga.image}/>
                <div>
                    <button onClick={onDownloadClick} disabled={manga.isDownloading}>Download</button>
                    <ul>
                        {infoItems}
                    </ul>
                </div>
                <ChapterList chapters={manga.chapters} onChapterClick={onChapterClick}/>
            </div>
        );
    }
}

MangaScreen.propTypes = {
    manga: React.PropTypes.object.isRequired,
    onChapterClick: React.PropTypes.func.isRequired,
    onDownloadClick: React.PropTypes.func.isRequired
};

module.exports = MangaScreen;
