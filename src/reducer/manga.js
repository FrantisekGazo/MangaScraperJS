const actions = require('../actions/manga');


const initialState = {
    title: '',
    chapters: []
};

module.exports = function counter(state=initialState, action) {
    switch (action.type) {
        case actions.MANGA_SELECTED:
            return Object.assign({}, state, {
                title: action.payload,
                chapters: [
                    {id: 1, title: `Fake ${action.payload} Chapter 1`},
                    {id: 2, title: `Fake ${action.payload} Chapter 2`},
                    {id: 3, title: `Fake ${action.payload} Chapter 3`}
                ]
            });
        default:
            return state;
    }
};
