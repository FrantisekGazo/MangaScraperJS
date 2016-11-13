"use strict";

const React = require('react');

class Chapter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return this.inRender(this.props.chapter, this.props.onClick)
    }

    inRender(chapter, onClick) {
        return <li onClick={onClick}>
            <input type="checkbox" checked={chapter.checked}/> {chapter.title} ({chapter.date})
        </li>
    }

    shouldComponentUpdate(nextProps, nextState) {
        const chapter = this.props.chapter;
        const nextChapter = nextProps.chapter;
        return chapter.id !== nextChapter.id || chapter.checked !== nextChapter.checked;
    }
}

Chapter.propTypes = {
    chapter: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        date: React.PropTypes.string.isRequired,
        checked: React.PropTypes.bool.isRequired
    }).isRequired,
    onClick: React.PropTypes.func.isRequired
};

module.exports = Chapter;
