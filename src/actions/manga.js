const {createAction} = require('./index');


const MANGA_SELECTED = 'MANGA_SELECTED';


module.exports.MANGA_SELECTED = MANGA_SELECTED;

module.exports.loadManga = function (name) {
    return function (dispatch) {
        

        dispatch(createAction(MANGA_SELECTED, name));
    }
};
