const actions = require('../actions/manga');


const initialState = {
    name: null,
    chapters: []
};

module.exports = function counter(state=initialState, action) {
    switch (action.type) {
        case actions.MANGA_SELECTED:
            return Object.assign({}, state, {
                name: action.payload
            });
        default:
            return state;
    }
};
