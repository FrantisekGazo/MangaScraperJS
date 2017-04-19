"use strict";

const React = require('react');
const PropTypes = require('prop-types');
const { ListItem } = require('material-ui/List');

const DownloadStatusCode = require('../../../model/DownloadStatusCode');

class ChapterListItem extends React.Component {

    render() {
        const {style, chapter, isShown, onClick} = this.props;

        let itemStyle = {
            color: '#000',
            backgroundColor: isShown ? '#dcdcdc' : '#fff'
        };
        switch (chapter.status.code) {
            case DownloadStatusCode.IN_QUEUE:
                itemStyle.color = '#006a8e';
                break;
            case DownloadStatusCode.IN_PROGRESS:
                itemStyle.color = '#ffa72d';
                break;
            case DownloadStatusCode.DONE:
                itemStyle.color = '#5abb00';
                break;
            case DownloadStatusCode.FAILED:
                itemStyle.color = '#c13904';
                break;
        }

        return (
            <div
                style={style}
                onClick={onClick}>
                <ListItem
                    style={itemStyle}
                    primaryText={`${chapter.title} (${chapter.date})`}/>
            </div>
        );
    }
}

ChapterListItem.propTypes = {
    chapter: PropTypes.object.isRequired,
    isShown: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

module.exports = ChapterListItem;
