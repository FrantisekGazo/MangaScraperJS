"use strict";

const React = require('react');
const AppBar = require('material-ui/AppBar').default;
const CircularProgress = require('material-ui/CircularProgress').default;
const IconButton = require('material-ui/IconButton').default;
const IconSearch = require('material-ui/svg-icons/action/search').default;
const TextField = require('material-ui/TextField').default;


const SearchScreen = ({error, isLoading, lastTitle, onSearchClick}) => {
    let input = lastTitle;

    const progressNode = (isLoading) ? (<CircularProgress/>) : null;
    const errorNode = (error) ? (
        <div style={{ color: '#ff0000' }}>
            {error}
        </div>
    ) : null;

    return (
        <div>
            <AppBar
                title='Manga'
                iconElementLeft={(<div/>)}/>

            <form onSubmit={e => {
                e.preventDefault();

                if (!input || !input.trim()) {
                    return;
                }

                onSearchClick(input);
            }}>
                <TextField id="manga-name" defaultValue={lastTitle} onChange={(event, newValue) => input = newValue}/>
                <IconButton label="Search" type="submit">
                    <IconSearch/>
                </IconButton>
            </form>

            {errorNode}

            {progressNode}

        </div>
    )
};

SearchScreen.propTypes = {
    error: React.PropTypes.string.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    lastTitle: React.PropTypes.string.isRequired,
    onSearchClick: React.PropTypes.func.isRequired,
};


module.exports = SearchScreen;
