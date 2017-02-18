"use strict";

const React = require('react');


class DownloadInfo extends React.Component {

    render() {
        const { isDownloading, chapters } = this.props;

        if (!isDownloading) {
            return null;
        }

        const titles = chapters.map((c) => c.title).join(', ');

        return (
            <div style={{padding: '10px'}}>
                Downloading {chapters.length} chapters...
                <br/>
                {titles}
            </div>
        );
    }
}

DownloadInfo.propTypes = {
    isDownloading: React.PropTypes.bool.isRequired,
    chapters: React.PropTypes.array.isRequired,
};

module.exports = DownloadInfo;
