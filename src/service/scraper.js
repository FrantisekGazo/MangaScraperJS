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
// add an artificial delay
x.delay(300, 800);


function scrapeChapterPageNumbers(startUrl) {
    return new Promise(function (resolve, reject) {
        x(startUrl, {
            items: x('#top_center_bar .l option', [{
                title: '@html'
            }])
        })(function (err, result) {
            if (err) {
                reject(err);
            } else {
                const pageNumbers = result.items.map(item => parseInt(item.title)).filter(num => !isNaN(num));
                resolve(pageNumbers);
            }
        });
    });
}

function scrapeChapterPageUrls(startUrl) {
    const lastSlash = startUrl.lastIndexOf('/');
    const baseUrl = startUrl.substr(0, lastSlash + 1);

    return scrapeChapterPageNumbers(startUrl)
        .then((pageNumbers) => {
            console.log('page numbers:', pageNumbers);
            return pageNumbers.map(num => `${baseUrl}${num}.html`);
        });
}

function scrapeChapterPageImageUrl(pageUrl) {
    return new Promise(function (resolve, reject) {
        x(pageUrl, '#image@src')((err, result) => {
            if (err) {
                reject(err);
            } else if (result === undefined) {
                reject(Error('Image not found!'));
            } else {
                resolve(result);
            }
        });
    });
}

function scrapeChapterPages(startUrl) {
    return scrapeChapterPageUrls(startUrl)
        .then(pageUrls => {
            console.log('page urls:', pageUrls);
            let imageUrls = [];

            const scrapers = pageUrls.map((pageUrl) => () => {
                return scrapeChapterPageImageUrl(pageUrl).then((imageUrl) => imageUrls.push(imageUrl))
            });

            return scrapers.reduce((p, fn) => p.then(fn), Promise.resolve())
                    .then(() => imageUrls);
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


module.exports = {
    scrapeChapterPages,
    scrapeMangaInfo
};
