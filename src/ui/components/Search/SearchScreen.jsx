"use strict";

const React = require('react');
const PropTypes = require('prop-types');
const AppBar = require('material-ui/AppBar').default;
const CircularProgress = require('material-ui/CircularProgress').default;
const IconButton = require('material-ui/IconButton').default;
const IconSearch = require('material-ui/svg-icons/action/search').default;
const TextField = require('material-ui/TextField').default;

const ResultList = require('./ResultList.jsx');


const style = {
    appBar: {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
    },
    input: {
        position: 'absolute',
        top: '100px',
        // center it:
        left: '50%',
        transform: 'translate(-50%)',
    },
    results: {
        position: 'absolute',
        top: '200px',
        left: '50%',
        transform: 'translate(-50%)'
    },
    progress: {
        position: 'relative',
        left: '50%',
        transform: 'translate(-50%)',
    }
};

class SearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.input = props.lastTitle;
    }

    handleSearchClick(event) {
        event.preventDefault();

        if (!this.input || !this.input.trim()) {
            return;
        }

        this.props.onSearchClick(this.input);
    }

    render() {
        const { error, isLoading, lastTitle, results, onResultClick } = this.props;

        const progressNode = (isLoading) ? (<CircularProgress style={style.progress}/>) : null;
        const errorNode = (error) ? (
            <div style={{color: '#ff0000'}}>
                {error}
            </div>
        ) : null;

        return (
            <div>
                <AppBar
                    style={style.appBar}
                    title='Manga'
                    iconElementLeft={(<div/>)}/>

                <div style={style.input}>
                    <form
                        onSubmit={this.handleSearchClick.bind(this)}>
                        <TextField
                            id="manga-name"
                            floatingLabelText='Manga title'
                            disabled={isLoading}
                            defaultValue={lastTitle}
                            onChange={(event, newValue) => this.input = newValue}/>

                        <IconButton
                            disabled={isLoading}
                            label="Search"
                            type="submit">
                            <IconSearch/>
                        </IconButton>
                    </form>

                    {errorNode}

                    {progressNode}
                </div>

                <div style={style.results}>
                    <ResultList results={results} onResultClick={onResultClick}/>
                </div>
            </div>
        )
    }
}

SearchScreen.propTypes = {
    error: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    lastTitle: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired,
    onSearchClick: PropTypes.func.isRequired,
    onResultClick: PropTypes.func.isRequired,
};


module.exports = SearchScreen;
