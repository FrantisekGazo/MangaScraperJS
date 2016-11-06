const {createAction} = require('./index');
const {scrapeMangaInfo} = require('../service/scraper.js');
const {showSaveDirDialog} = require('../service/dialog.js');
const {downloadMangaChapters} = require('../service/manga.js');


const Actions = {
    SELECT_MANGA: 'SELECT_MANGA',
    REQUEST_MANGA: 'REQUEST_MANGA',
    RECEIVE_MANGA: 'RECEIVE_MANGA',
    RECEIVE_MANGA_ERROR: 'RECEIVE_MANGA_ERROR',
    TOGGLE_CHAPTER: 'TOGGLE_CHAPTER',
    DOWNLOAD_CHAPTERS: 'DOWNLOAD_CHAPTERS',
};

const mangaTitleToId = (title) => {
    return title.toLowerCase().trim().replace(' ', '_').replace(/[^a-zA-Z0-9_]/, '');
};

const selectManga = (mangaId) => {
    return createAction(Actions.SELECT_MANGA, mangaId);
};

const requestManga = (mangaId) => {
    return createAction(Actions.REQUEST_MANGA, mangaId);
};

const receiveManga = (mangaId, manga) => {
    return createAction(Actions.RECEIVE_MANGA, mangaId, manga);
};

const receiveMangaError = (mangaId, error) => {
    return createAction(Actions.RECEIVE_MANGA_ERROR, mangaId, error);
};

const loadManga = (title) => {
    return (dispatch, getState) => {
        const mangaId = mangaTitleToId(title);

        if (mangaId == getState().selected.mangaId) {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve();
        }

        if (mangaId in getState().mangaLibrary) {
            dispatch(selectManga(mangaId));
            return Promise.resolve();
        }

        dispatch(selectManga(mangaId));
        dispatch(requestManga(mangaId));

        return scrapeMangaInfo(mangaId)
            .then(manga => {
                dispatch(receiveManga(mangaId, manga));
                return Promise.resolve();
            })
            .catch(err => {
                dispatch(receiveMangaError(mangaId, err.message));
            });
    }
};

const toggleChapter = (chapterId) => {
    const ids = chapterId.split('-');
    return createAction(Actions.TOGGLE_CHAPTER, ids[0], chapterId);
};

const downloadChapters = () => {
    return (dispatch, getState) => {
        const mangaId = getState().selected;
        const manga = getState().mangaLibrary[mangaId];

        let downloadChapters = manga.chapters.filter(chapter => chapter.checked);

        if (downloadChapters.length == 0) {
            return Promise.resolve();
        }

        return showSaveDirDialog()
            .then(dirPath => {
                return downloadMangaChapters(downloadChapters, dirPath);
            })
            .catch(err => {
                console.log('Download failed:', err);
            });
    }
};


module.exports = {
    Actions,
    loadManga,
    toggleChapter,
    downloadChapters
};

/*
 const Xray = require('x-ray');
 const x = Xray({
 filters: {
 MF_pageHref: function (value) {
 return `http://mangafox.me/directory/${value}`;
 }
 }
 });

 x('http://mangafox.me/directory/?az', 'li', [{
 title: '.manga_text .title',
 img: '.manga_img@href',
 }])
 .paginate('.next:parent@href | MF_pageHref')
 .write('results.json')
 /*
 ((err, result) => {
 console.log('ERROR:', err);
 console.log('RESULT:', result);
 });
 */