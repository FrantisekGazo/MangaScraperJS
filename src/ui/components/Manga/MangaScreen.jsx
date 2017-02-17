"use strict";

const React = require('react');
const AppBar = require('material-ui/AppBar').default;
const IconBack = require('material-ui/svg-icons/navigation/arrow-back').default;
const IconButton = require('material-ui/IconButton').default;

const ChapterList = require('./ChapterList.jsx');


class MangaScreen extends React.Component {

    render() {
        const { manga, onBackClick, onChapterClick, onDownloadClick } = this.props;

        let infoItems = null;
        if (manga.downloadInfo) {
            infoItems = Object.keys(manga.downloadInfo)
                .map(key => <li key={key}>{key} : {manga.downloadInfo[key].msg}</li>);
        }

        return (
            <div>
                <AppBar
                    title={manga.title}
                    iconElementLeft={(<IconButton onTouchTap={onBackClick}><IconBack/></IconButton>)}/>

                <div key={`manga-${manga.title}`}>
                    <img src={manga.image}/>
                    <div>
                        <button onClick={onDownloadClick} disabled={manga.isDownloading}>Download</button>
                        <ul>
                            {infoItems}
                        </ul>
                    </div>
                    <ChapterList chapters={manga.chapters} onChapterClick={onChapterClick}/>
                </div>
            </div>
        );
    }
}

MangaScreen.propTypes = {
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
    onBackClick: React.PropTypes.func.isRequired,
    onChapterClick: React.PropTypes.func.isRequired,
    onDownloadClick: React.PropTypes.func.isRequired
};

module.exports = MangaScreen;
