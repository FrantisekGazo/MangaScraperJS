"use strict";

const React = require('react');
const TextField = require('material-ui/TextField').default;

const ChapterList = require('./ChapterList.jsx');


class MangaInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            chapters: props.chapters
        };
    }

    componentWillUpdate() {
        this.state.chapters = this.filterChapters(this.props.chapters, this.state.text);
    }

    filterChapters(allChapters, text) {
        let chapters = [];

        if (text) {
            let chapter;
            for (let i = 0; i < allChapters.length; i++) {
                chapter = allChapters[i];
                if (chapter.title.indexOf(text) >= 0) {
                    chapters.push(chapter);
                }
            }
        } else {
            chapters = allChapters;
        }

        return chapters;
    }

    handleFilter(event, newValue) {
        this.setState({
            text: newValue,
            chapters: this.filterChapters(this.props.chapters, newValue)
        });
    }

    render() {
        const { manga, onChapterClick } = this.props;
        const { chapters } = this.state;

        return (
            <div>
                <img src={manga.image}/>

                <TextField
                    id='chapter-filter'
                    onChange={this.handleFilter.bind(this)}/>

                <ChapterList
                    chapters={chapters}
                    onChapterClick={onChapterClick}/>
            </div>
        );
    }
}

MangaInfo.propTypes = {
    manga: React.PropTypes.object.isRequired,
    chapters: React.PropTypes.array.isRequired,
    onChapterClick: React.PropTypes.func.isRequired,
};

module.exports = MangaInfo;
