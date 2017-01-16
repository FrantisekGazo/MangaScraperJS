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


function scrapeChapterPageNumbers(startUrl) {
    return new Promise(function (resolve, reject) {
        setInterval(() => {
            x(startUrl, {
                items: x('#top_center_bar .l option', [{
                    title: '@html'
                }])
            })(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    // console.log('RES', result);
                    const pageNumbers = result.items.map(item => parseInt(item.title)).filter(num => !isNaN(num));
                    resolve(pageNumbers);
                }
            });
        }, 1000); // FIXME : add delay
    });
}

function scrapeChapterPageUrls(startUrl) {
    const lastSlash = startUrl.lastIndexOf('/');
    const baseUrl = startUrl.substr(0, lastSlash + 1);

    return scrapeChapterPageNumbers(startUrl)
        .then((pageNumbers) => {
            const pageUrls = pageNumbers.map(num => `${baseUrl}${num}.html`);
            // console.log('PAGES:', pageUrls);
            return pageUrls;
        });
}

function scrapeChapterPageImageUrl(pageUrl, delay, retryMax = 3) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            x(pageUrl, '#image@src')
            ((err, result) => {
                if (err) {
                    // console.log('reject:', pageUrl, err);
                    reject(err);
                } else if (result === undefined) { // retry if image url was not found
                    if (retryMax <= 0) {
                        // console.log('MAX', pageUrl, retryMax);
                        reject(Error('Image not found!'));
                    } else {
                        // console.log('RETRY', pageUrl, retryMax);
                        scrapeChapterPageImageUrl(pageUrl, delay, retryMax - 1)
                            .then((result) => {
                                resolve(result);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                } else {
                    // console.log('resolve:', pageUrl, result);
                    resolve(result);
                }
            });
        }, delay); // FIXME : add delay
    });
}

function scrapeChapterPages(startUrl) {
    return scrapeChapterPageUrls(startUrl)
        .then(pageUrls => {
            let i = 1; // exec scraps 300ms apart (because web web made a countermeasure against many subsequent requests)
            return Promise.all(
                pageUrls.map(pageUrl => scrapeChapterPageImageUrl(pageUrl, (++i) * 300))
            );
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
