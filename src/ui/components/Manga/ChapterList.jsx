"use strict";

const React = require('react');
const { AutoSizer, List } = require('react-virtualized');

const ChapterListItem = require('./ChapterListItem.jsx');


class ChapterList extends React.Component {

    renderRow({ index, key, style }) {
        const {chapters, onChapterClick} = this.props;
        const chapter = chapters[index];
        return (
            <ChapterListItem
                key={key}
                chapter={chapter}
                onClick={() => onChapterClick(chapter.id)}
                style={style}/>
        );
    }

    render() {
        const {chapters} = this.props;
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        height={height}
                        rowCount={chapters.length}
                        rowHeight={70}
                        rowRenderer={this.renderRow.bind(this)}
                        width={width}/>
                )}
            </AutoSizer>
        );
    }
}

ChapterList.propTypes = {
    chapters: React.PropTypes.array.isRequired,
    onChapterClick: React.PropTypes.func.isRequired,
};

module.exports = ChapterList;
