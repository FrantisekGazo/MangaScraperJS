"use strict";

const React = require('react');
const AppBar = require('material-ui/AppBar').default;
const IconBack = require('material-ui/svg-icons/navigation/arrow-back').default;
const IconButton = require('material-ui/IconButton').default;

const MangaInfo = require('./MangaInfo.jsx');
const ChapterDetail = require('./ChapterDetail.jsx');


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
        position: 'absolute',
        width: '250px',
        top: '0px',
        bottom: '0px',
        left: '0px',
    },
    right: {
        display: 'inline-block',
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        right: '0px',
        left: '250px',
    }
};

class MangaScreen extends React.Component {

    render() {
        const { manga, shownChapter, onBackClick, onChapterClick, onDownloadClick } = this.props;

        return (
            <div style={style.base}>
                <AppBar
                    style={style.appBar}
                    title={manga.title}
                    iconElementLeft={(<IconButton onTouchTap={onBackClick}><IconBack/></IconButton>)}/>

                <div
                    key={`manga-${manga.title}`}
                    style={style.content}>

                    <div style={style.left}>
                        <MangaInfo
                            manga={manga}
                            onChapterClick={onChapterClick}/>
                    </div>

                    <div style={style.right}>
                        {shownChapter ? (<ChapterDetail chapter={shownChapter} onDownloadClick={onDownloadClick}/>) : null}
                    </div>

                </div>
            </div>
        );
    }
}

MangaScreen.propTypes = {
    manga: React.PropTypes.object.isRequired,
    shownChapter: React.PropTypes.object,
    onBackClick: React.PropTypes.func.isRequired,
    onChapterClick: React.PropTypes.func.isRequired,
    onDownloadClick: React.PropTypes.func.isRequired,
};

module.exports = MangaScreen;
