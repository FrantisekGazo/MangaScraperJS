"use strict";

const React = require('react');


const Selector = ({onSelected}) => {
    let input;

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault();

                if (!input.value.trim()) {
                    return;
                }

                onSelected(input.value);
            }}>
                <input ref={node => {
                    input = node
                }}/>
                <button type="submit">Load</button>
            </form>
        </div>
    )
};

Selector.propTypes = {
    onSelected: React.PropTypes.func.isRequired
};

module.exports = Selector;
