"use strict";

const React = require('react');

const ChapterList = require('./ChapterList.jsx');


class MangaScreen extends React.Component {

    render() {
        const { manga, onChapterClick } = this.props;

        let infoItems = null;
        if (manga.downloadInfo) {
            infoItems = Object.keys(manga.downloadInfo)
                .map(key => <li key={key}>{key} : {manga.downloadInfo[key].msg}</li>);
        }

        return (
            <div>
                <img src={manga.image}/>
                <div>
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
};

module.exports = MangaScreen;
