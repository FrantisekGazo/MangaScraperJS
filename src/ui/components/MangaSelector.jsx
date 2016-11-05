"use strict";

const React = require('react');


/**
 * @type {MangaSelector}
 *
 * expects: mangaSelected
 */
module.exports = class MangaSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.props.mangaSelected(this.state.value);
    }

    render() {
        return (
            <div>
                <input type="text"
                       placeholder="Manga"
                       value={this.state.value}
                       onChange={this.handleChange.bind(this)}/>

                <button onClick={this.handleSubmit.bind(this)}>Load</button>
            </div>
        );
    }
};

