const {createAction} = require('./index');

const Actions = {
    SELECT_MANGA: 'SELECT_MANGA',
    SELECT_MANGA_ERROR: 'SELECT_MANGA_ERROR',
    INVALIDATE_MANGA: 'INVALIDATE_MANGA',
    REQUEST_MANGA: 'REQUEST_MANGA',
    RECEIVE_MANGA: 'RECEIVE_MANGA',
};


const selectManga = (title) => {
    return createAction(Actions.SELECT_MANGA, title);
};

const selectMangaError = (title, error) => {
    return createAction(Actions.SELECT_MANGA_ERROR, title, error);
};

const invalidateManga = (title) => {
    return createAction(Actions.INVALIDATE_MANGA, title);
};

const requestManga = (title) => {
    return createAction(Actions.REQUEST_MANGA, title);
};

const receiveManga = (title, data) => {
    return createAction(Actions.RECEIVE_MANGA, title, data);
};

const loadManga = (title) => {
    return (dispatch, getState) => {
        if (title != getState().selected.title) {
            // only ich manga changed
            dispatch(selectManga(title));
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve();
        }
    }
};


module.exports = {
    Actions,
    invalidateManga,
    requestManga,
    receiveManga,
    loadManga
};