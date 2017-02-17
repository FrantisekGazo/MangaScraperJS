"use strict";

const React = require('react');
const { ListItem } = require('material-ui/List');


class ChapterListItem extends React.Component {

    render() {
        const {style, chapter, onClick} = this.props;

        return (
            <div
                style={style}
                onClick={onClick}>
                <ListItem
                    primaryText={chapter.title}
                    secondaryText={`(${chapter.date})`}
                />
            </div>
        );
    }
}

ChapterListItem.propTypes = {
    chapter: React.PropTypes.object.isRequired,
    style: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired,
};

module.exports = ChapterListItem;
