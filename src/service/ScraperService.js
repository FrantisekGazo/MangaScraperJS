"use strict";

const DownloadStatusCode = require('../model/DownloadStatusCode');

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
x.delay(100);


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

function scrapeChapterPages(startUrl, progress) {
    return scrapeChapterPageUrls(startUrl)
        .then(pageUrls => {
            // console.log('page urls:', pageUrls);
            let imageUrls = [];

            const scrapers = pageUrls.map((pageUrl) => () => {
                return scrapeChapterPageImageUrl(pageUrl).then((imageUrl) => {
                    imageUrls.push(imageUrl);
                    progress(`Loading page ${imageUrls.length}/${pageUrls.length}`);
                });
            });

            return scrapers.reduce((p, fn) => p.then(fn), Promise.resolve())
                    .then(() => {
                        if (pageUrls.length === imageUrls.length) {
                            // console.log('image urls:', imageUrls);
                            const cleanImageUrls = imageUrls.filter(url => {
                                if (url === null || url === undefined) return false;
                                if (url.indexOf('.jpg') === -1) return false;
                                if (url.indexOf('_credits.jpg') >= 0) return false;
                                if (url.indexOf('_note.jpg') >= 0) return false;
                                if (url.indexOf('_recruit.jpg') >= 0) return false;
                                return true;
                            });
                            console.log('cleaned image urls:', cleanImageUrls);
                            return cleanImageUrls;
                        } else {
                            throw new Error(`Missing ${pageUrls.length === imageUrls.length} pages. Please try again.`);
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
                // manga id
                result['id'] = mangaId;
                // fix title
                let title = result.title;
                if (title.endsWith(" Manga")) {
                    result.title = title.substr(0, title.length - " Manga".length)
                }
                // map chapters
                let id = result.chapters.length;
                let chaptersMap = {};
                result.chapters.map(chapter => {
                    const numbers = chapter.title.match(/(\d+\.\d+|\d+)$/);
                    if (numbers.length > 0) {
                        const last = numbers[numbers.length-1];
                        const number = parseFloat(last);
                        if (!isNaN(number)) {
                            let n = last;
                            if (number < 10) {
                                n = '00' + n;
                            } else if (number < 100) {
                                n = '0' + n;
                            }
                            chapter.title = n;
                        }
                    }

                    id -= 1;
                    const c = Object.assign(chapter, {
                        id: `${mangaId}-${id}`,
                        status: {
                            code: DownloadStatusCode.NONE,
                            msg: ''
                        }
                    });
                    chaptersMap[c.id] = c;
                });
                result.chapters = chaptersMap;

                resolve(result);
            }
        });
    });
}


module.exports = {
    scrapeChapterPages,
    scrapeMangaInfo
};
