"use strict";

const React = require('react');
const AppBar = require('material-ui/AppBar').default;
const { Card } = require('material-ui/Card');
const IconBack = require('material-ui/svg-icons/navigation/arrow-back').default;
const IconButton = require('material-ui/IconButton').default;

const MangaInfo = require('./MangaInfo.jsx');


const style = {
    appBar: {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
    },
    content: {
        position: 'relative',
        top: '70px',
        bottom: '0px',
        right: '0px',
        left: '0px',
    },
    left: {
        display: 'inline-block',
        position: 'relative',
        width: '50%',
        top: '0px',
        bottom: '0px',
        left: '0px',
    },
    right: {
        display: 'inline-block',
        position: 'relative',
        top: '0px',
        bottom: '0px',
        right: '0px',
        width: '50%',
    }
};

class MangaScreen extends React.Component {

    render() {
        const { manga, onBackClick, onChapterClick, onDownloadClick } = this.props;

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
                            onChapterClick={onChapterClick}
                            onDownloadClick={onDownloadClick}/>
                    </div>

                    <div style={style.right}>
                    </div>

                </div>
            </div>
        );
    }
}

MangaScreen.propTypes = {
    manga: React.PropTypes.object.isRequired,
    onBackClick: React.PropTypes.func.isRequired,
    onChapterClick: React.PropTypes.func.isRequired,
    onDownloadClick: React.PropTypes.func.isRequired
};

module.exports = MangaScreen;
