const actions = require('../actions/counterActions');


const initialState = 0;

module.exports = function counter(state=initialState, action) {
    state = state || 0;
    switch (action.type) {
        case actions.INCREMENT:
            return state + 1;
        default:
            return state;
    }
};
