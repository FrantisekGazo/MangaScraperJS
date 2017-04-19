"use strict";

const React = require('react');
const PropTypes = require('prop-types');
const IconButton = require('material-ui/IconButton').default;
const IconDownload = require('material-ui/svg-icons/file/file-download').default;
const IconShow = require('material-ui/svg-icons/file/folder-open').default;
const IconOpen = require('material-ui/svg-icons/action/visibility').default;

const FileService = require('../../../service/FileService');
const DownloadStatusCode = require('../../../model/DownloadStatusCode');


class ChapterDetail extends React.Component {

    render() {
        const {chapter, onDownloadClick} = this.props;

        return (
            <div>
                {chapter.title}

                {
                    (chapter.status.code === DownloadStatusCode.DONE) ? (
                        <span>
                            <IconButton onTouchTap={() => FileService.showFileInDirectory(chapter.status.msg)}><IconShow/></IconButton>
                            <IconButton onTouchTap={() => FileService.openFile(chapter.status.msg)}><IconOpen/></IconButton>
                        </span>
                    ) : (
                        <span>
                            <IconButton onTouchTap={() => onDownloadClick(chapter.id)}><IconDownload/></IconButton>
                            {chapter.status.msg}
                        </span>
                    )
                }
            </div>
        );
    }
}

ChapterDetail.propTypes = {
    chapter: PropTypes.object.isRequired,
    onDownloadClick: PropTypes.func.isRequired,
};

module.exports = ChapterDetail;
