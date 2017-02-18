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

const getShownChapter = (state) => {
    const manga = mangaState(state);
    const chapterId = manga.shownChapterId;
    return manga.chapters[chapterId];
};


module.exports = {
    getManga,
    getMangaChapters,
    getShownChapter,
};
