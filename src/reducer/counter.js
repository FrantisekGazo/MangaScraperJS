const actions = require('../actions/counter');


const initialState = 0;

module.exports = function counter(state=initialState, action) {
    switch (action.type) {
        case actions.INCREMENT:
            return state + 1;
        default:
            return state;
    }
};
