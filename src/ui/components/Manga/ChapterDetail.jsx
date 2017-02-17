"use strict";

const React = require('react');
const IconDownload = require('material-ui/svg-icons/file/file-download').default;
const IconButton = require('material-ui/IconButton').default;


class ChapterDetail extends React.Component {

    render() {
        const { chapter, onDownloadClick } = this.props;

        return (
            <div>
               {chapter.title}
               <IconButton onTouchTap={onDownloadClick}><IconDownload/></IconButton>
            </div>
        );
    }
}

ChapterDetail.propTypes = {
    chapter: React.PropTypes.object.isRequired,
    onDownloadClick: React.PropTypes.func.isRequired,
};

module.exports = ChapterDetail;
