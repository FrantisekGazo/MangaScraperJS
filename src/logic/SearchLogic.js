"use strict";

const { createLogic } = require('redux-logic');

const SearchAction = require('../action/SearchAction');
const MangaAction = require('../action/MangaAction');
const RouterAction = require('../action/RouterAction');
const { WorkerTasks, execByWorker } = require('../service/WorkerService');
const FileService = require('../service/FileService');
const ScraperService = require('../service/ScraperService');
const DownloadStatusCode = require('../model/DownloadStatusCode');


const mangaTitleToId = (title) => {
    return title.toLowerCase().trim().replace(' ', '_').replace(/[^a-zA-Z0-9_]/, '');
};

// FIXME : move load logic to MangaLogic.js
const loadManga = createLogic({
    type: SearchAction.ACTIONS.SET_SEARCH_TEXT,
    latest: true,
    process({ getState, action }, dispatch, done) {
        const mangaTitle = action.payload;
        const mangaId = mangaTitleToId(mangaTitle);

        dispatch(SearchAction.createSearchStartAction());
        execByWorker(WorkerTasks.LOAD_MANGA, mangaId)
            .then((manga) => {
                const chapters = manga.chapters;
                let chapter, filePath;
                for (let chapterId in chapters) {
                    if (!chapters.hasOwnProperty(chapterId)) continue;

                    chapter = chapters[chapterId];
                    filePath = FileService.getMangaChapterFile(manga.title, chapter.title);
                    if (FileService.exists(filePath)) {
                        chapter.status = {
                            code: DownloadStatusCode.DONE,
                            msg: filePath
                        };
                    }
                }

                return manga;
            })
            .then((manga) => {
                dispatch(SearchAction.createSearchEndAction());
                dispatch(MangaAction.createSetMangaAction(manga));
                dispatch(RouterAction.createGoToMangaScreenAction(mangaId));
            })
            .then(() => {
                return ScraperService.scrapeSearch(mangaTitle);
            })
            .catch((err) => {
                dispatch(SearchAction.createSearchErrorAction(err.message));
            })
            .then(() => done());
    }
});

const searchManga = createLogic({
    type: SearchAction.ACTIONS.SET_SEARCH_TEXT,
    latest: true,
    process({ getState, action }, dispatch, done) {
        const mangaTitle = action.payload;

        dispatch(SearchAction.createSearchStartAction());
        ScraperService.scrapeSearch(mangaTitle)
            .then((mangaList) => {
                dispatch(SearchAction.createSearchEndAction(mangaList));
            })
            .catch((err) => {
                dispatch(SearchAction.createSearchErrorAction(err.message));
            })
            .then(() => done());
    }
});


module.exports = [
    searchManga,
];
