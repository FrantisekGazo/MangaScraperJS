"use strict";

const Xray = require('x-ray');
const x = Xray({
    filters: {
        MF_pageHref: function (value) {
            if (value.indexOf('javascript') !== -1) {
                return '';
            }
            return value;
        }
    }
});


function scrapeChapterPages(startUrl) {
    return new Promise(function (resolve, reject) {
        x(startUrl, '#image@src')
            .paginate('.next_page@href | MF_pageHref')
            ((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    // they changed url and now it ends with '.jpg?token=...'
                    const images = result.filter(url => url !== undefined && url !== null);
                    resolve(images);
                }
            });
    });
}

function scrapeMangaInfo(mangaId) {
    return new Promise(function (resolve, reject) {
        x(`http://mangafox.me/manga/${mangaId}`, {
            title: '#title h1',
            image: '#series_info .cover img@src',
            chapters: x('ul.chlist li', [{
                title: '.tips',
                date: '.date',
                url: '.tips@href'
            }])
        })(function (err, result) {
            if (err) {
                reject(err);
            } else if (!('title' in result)) {
                reject(Error("Manga not found!"));
            } else {
                let id = 0;
                result.chapters = result.chapters.map(chapter => {
                    id += 1;
                    return Object.assign(chapter, {id: `${mangaId}-${id}`, checked: false})
                });
                let title = result.title;
                if (title.endsWith(" Manga")) {
                    result.title = title.substr(0, title.length - " Manga".length)
                }
                result['mangaId'] = mangaId;
                resolve(result);
            }
        });
    });
}

function mockScrapeMangaInfo(mangaId) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            let chapters = [];
            let i;
            for (i = 0; i < 100; i++) {
                chapters.push({id: `${mangaId}-${i}`, title: `Chapter n.${i}`, url: 'no-url', date: `1.1.1111`, checked: false});
            }

            resolve({
                title: `MOCK ${mangaId}`,
                image: 'no-image',
                chapters: chapters
            });
        }, 2000);
    });
}

module.exports = {
    scrapeChapterPages,
    scrapeMangaInfo
};
