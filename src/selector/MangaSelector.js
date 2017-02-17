"use strict";


const mangaState = (state) => state.manga;

const getManga = (state) => mangaState(state);

const getShownChapter = (state) => {
    const manga = mangaState(state);
    const chapterId = manga.shownChapterId;

    if (chapterId === null || chapterId === undefined) {
        return null;
    }

    let chapter;
    for (let i = 0; i < manga.chapters.length; i++) {
        chapter = manga.chapters[i];
        if (chapter.id === chapterId) {
            return chapter;
        }
    }

    return null;
};


module.exports = {
    getManga,
    getShownChapter,
};
