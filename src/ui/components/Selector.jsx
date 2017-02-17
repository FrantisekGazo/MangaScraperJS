"use strict";

const React = require('react');
const TextField = require('material-ui/TextField').default;
const IconButton = require('material-ui/IconButton').default;
const IconSearch = require('material-ui/svg-icons/action/search').default;


const Selector = ({onSelected}) => {
    let input;

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault();

                if (!input || !input.trim()) {
                    return;
                }

                onSelected(input);
            }}>
                <TextField id="'manga-name" onChange={(event, newValue) => input = newValue}/>
                <IconButton label="Search" type="submit">
                    <IconSearch/>
                </IconButton>
            </form>
        </div>
    )
};

Selector.propTypes = {
    onSelected: React.PropTypes.func.isRequired
};

module.exports = Selector;
