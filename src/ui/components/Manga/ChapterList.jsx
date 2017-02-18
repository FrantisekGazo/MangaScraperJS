"use strict";

const React = require('react');
const { AutoSizer, List } = require('react-virtualized');

const ChapterListItem = require('./ChapterListItem.jsx');


class ChapterList extends React.Component {

    renderRow({ index, key, style }) {
        const {chapters, onChapterClick, shownChapterId} = this.props;
        const chapter = chapters[index];
        return (
            <ChapterListItem
                key={key}
                chapter={chapter}
                isShown={shownChapterId === chapter.id}
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
                        rowHeight={45}
                        rowRenderer={this.renderRow.bind(this)}
                        width={width}/>
                )}
            </AutoSizer>
        );
    }
}

ChapterList.propTypes = {
    chapters: React.PropTypes.array.isRequired,
    shownChapterId: React.PropTypes.string.isRequired,
    onChapterClick: React.PropTypes.func.isRequired,
};

module.exports = ChapterList;
