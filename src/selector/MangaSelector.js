"use strict";


const mangaState = (state) => state.manga;

const getManga = (state) => {
    return Object.assign({}, mangaState(state), {
        chapters: null // so that it cannot be used
    });
};

const chapterSort = (a, b) => {
    const aId = parseInt(a.id.split('-')[1]);
    const bId = parseInt(b.id.split('-')[1]);
    return (aId > bId) ? -1 : 1;
};
const getMangaChapters = (state) => {
    let chapters = [];

    const manga = mangaState(state);
    for (let chapterId in manga.chapters) {
        if (manga.chapters.hasOwnProperty(chapterId)) {
            chapters.push(manga.chapters[chapterId]);
        }
    }

    return chapters.sort(chapterSort);
};

const getChapter = (state, chapterId) => {
    const manga = mangaState(state);
    return manga.chapters[chapterId];
};

const getShownChapterId = (state) => {
    const manga = mangaState(state);
    return manga.shownChapterId;
};

const getShownChapter = (state) => {
    const chapterId = getShownChapterId(state);
    return getChapter(state, chapterId);
};

const getDownloadChapterIds = (state) => {
    const manga = mangaState(state);
    return manga.downloadChapterIds;
};

const getDownloadChapters = (state) => {
    const manga = mangaState(state);
    return manga.downloadChapterIds.map(id => getChapter(state, id));
};

const isDownloading = (state) => {
    const manga = mangaState(state);
    return manga.isDownloading;
};


module.exports = {
    getChapter,
    getDownloadChapterIds,
    getDownloadChapters,
    getManga,
    getMangaChapters,
    getShownChapter,
    getShownChapterId,
    isDownloading,
};
