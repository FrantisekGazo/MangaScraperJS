"use strict";

const React = require('react');
const AppBar = require('material-ui/AppBar').default;
const IconBack = require('material-ui/svg-icons/navigation/arrow-back').default;
const IconButton = require('material-ui/IconButton').default;
const IconOpenFolder = require('material-ui/svg-icons/file/folder-open').default;

const FileService = require('../../../service/FileService');
const ChapterDetail = require('./ChapterDetail.jsx');
const DownloadInfo = require('./DownloadInfo.jsx');
const MangaInfo = require('./MangaInfo.jsx');


const style = {
    appBar: {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
    },
    content: {
        position: 'absolute',
        top: '70px',
        bottom: '0px',
        right: '0px',
        left: '0px',
    },
    left: {
        display: 'inline-block',
        float: 'left',
        width: '250px',
        padding: '10px',
    },
    right: {
        display: 'inline-block',
        float: 'left',
        padding: '10px',
    }
};

class MangaScreen extends React.Component {

    handleOpenClick() {
        const path = FileService.getMangaDirectory(this.props.manga.title);
        FileService.showDirectory(path);
    }

    render() {
        const { manga, chapters, downloadingChapters, shownChapter, onBackClick, onChapterClick, onDownloadClick } = this.props;

        return (
            <div style={style.base}>
                <AppBar
                    style={style.appBar}
                    title={manga.title}
                    iconElementLeft={(<IconButton onTouchTap={onBackClick}><IconBack/></IconButton>)}
                    iconElementRight={(<IconButton onTouchTap={this.handleOpenClick.bind(this)}><IconOpenFolder/></IconButton>)}/>

                <div style={style.content}>
                    <DownloadInfo
                        isDownloading={manga.isDownloading}
                        chapters={downloadingChapters}/>

                    <div style={style.left}>
                        <MangaInfo
                            manga={manga}
                            chapters={chapters}
                            shownChapterId={shownChapter ? shownChapter.id : ''}
                            onChapterClick={onChapterClick}/>
                    </div>

                    <div style={style.right}>
                        {
                            shownChapter ? (
                                <ChapterDetail
                                    chapter={shownChapter}
                                    onDownloadClick={onDownloadClick}/>
                            ) : null
                        }
                    </div>

                </div>
            </div>
        );
    }
}

MangaScreen.propTypes = {
    manga: React.PropTypes.object.isRequired,
    chapters: React.PropTypes.array.isRequired,
    downloadingChapters: React.PropTypes.array.isRequired,
    shownChapter: React.PropTypes.object,
    onBackClick: React.PropTypes.func.isRequired,
    onChapterClick: React.PropTypes.func.isRequired,
    onDownloadClick: React.PropTypes.func.isRequired,
};

module.exports = MangaScreen;
