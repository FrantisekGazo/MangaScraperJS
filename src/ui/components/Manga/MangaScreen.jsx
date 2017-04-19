"use strict";

const React = require('react');
const PropTypes = require('prop-types');
const AppBar = require('material-ui/AppBar').default;
const CircularProgress = require('material-ui/CircularProgress').default;
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
    },
    center: {
        position: 'relative',
        width: '100px',
        left: '50%',
        transform: 'translate(-50%)',
    }
};

class MangaScreen extends React.Component {

    handleOpenClick() {
        const path = FileService.getMangaDirectory(this.props.manga.title);
        FileService.showDirectory(path);
    }

    render() {
        const { manga, chapters, downloadingChapters, shownChapter, onBackClick, onChapterClick, onDownloadClick } = this.props;

        let title = null;
        let content = null;

        if (manga.loading) {
            content = (
                <div style={style.center}>
                    <CircularProgress/>
                </div>
            );
        } else if (manga.error) {
            content = (
                <div style={style.center}>
                    Error: {manga.error}
                </div>
            );
        } else if (manga.loaded) {
            title = manga.title;
            content = (
                <div>
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
            );
        }

        return (
            <div style={style.base}>
                <AppBar
                    style={style.appBar}
                    title={title}
                    iconElementLeft={
                        <IconButton onTouchTap={onBackClick}><IconBack/></IconButton>
                    }
                    iconElementRight={
                        <IconButton onTouchTap={this.handleOpenClick.bind(this)}><IconOpenFolder/></IconButton>
                    }/>

                <div style={style.content}>
                    { content }
                </div>
            </div>
        );
    }
}

MangaScreen.propTypes = {
    manga: PropTypes.object.isRequired,
    chapters: PropTypes.array.isRequired,
    downloadingChapters: PropTypes.array.isRequired,
    shownChapter: PropTypes.object,
    onBackClick: PropTypes.func.isRequired,
    onChapterClick: PropTypes.func.isRequired,
    onDownloadClick: PropTypes.func.isRequired,
};

module.exports = MangaScreen;
