"use strict";

const React = require('react');
const TextField = require('material-ui/TextField').default;

const ChapterList = require('./ChapterList.jsx');


class MangaInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            chapters: props.chapters
        };
    }

    handleFilter(event, newValue) {
        const allChapters = this.props.chapters;
        let chapters = [];

        if (newValue) {
            let chapter;
            for (let i = 0; i < allChapters.length; i++) {
                chapter = allChapters[i];
                if (chapter.title.indexOf(newValue) >= 0) {
                    chapters.push(chapter);
                }
            }
        } else {
            chapters = allChapters;
        }

        this.setState({
            chapters: chapters
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
