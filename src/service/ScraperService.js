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
    return promiseWithDelay(scrapeChapterPageUrls(startUrl), 200)
        .then(pageUrls => {
            let imageUrls = [];

            // prepare scrappers for all page images
            const scrapers = pageUrls.map((pageUrl) => () => {
                return promiseWithDelay(scrapeChapterPageImageUrl(pageUrl), 100)
                // return promiseWithRetry(scrapeChapterPageImageUrl(pageUrl), 10, 100)
                    .then((imageUrl) => {
                        imageUrls.push(imageUrl);
                        progress(`Loading page ${imageUrls.length}/${pageUrls.length}`);
                    });
            });

            // scrape all images sequentially
            const scrapeAllImageUrls = scrapers.reduce((p, fn) => p.then(fn), Promise.resolve());

            return scrapeAllImageUrls
                    .then(() => {
                        if (pageUrls.length === imageUrls.length) {
                            // keep only real images
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

function scrapeSearch(title) {
    return new Promise(function (resolve, reject) {
        const titleSlug = title.replace(' ', '+');

        x(`http://mangafox.me/search.php?name_method=cw&name=${titleSlug}&type=&author_method=cw&author=&artist_method=cw&artist=&genres%5BAction%5D=0&genres%5BAdult%5D=0&genres%5BAdventure%5D=0&genres%5BComedy%5D=0&genres%5BDoujinshi%5D=0&genres%5BDrama%5D=0&genres%5BEcchi%5D=0&genres%5BFantasy%5D=0&genres%5BGender+Bender%5D=0&genres%5BHarem%5D=0&genres%5BHistorical%5D=0&genres%5BHorror%5D=0&genres%5BJosei%5D=0&genres%5BMartial+Arts%5D=0&genres%5BMature%5D=0&genres%5BMecha%5D=0&genres%5BMystery%5D=0&genres%5BOne+Shot%5D=0&genres%5BPsychological%5D=0&genres%5BRomance%5D=0&genres%5BSchool+Life%5D=0&genres%5BSci-fi%5D=0&genres%5BSeinen%5D=0&genres%5BShoujo%5D=0&genres%5BShoujo+Ai%5D=0&genres%5BShounen%5D=0&genres%5BShounen+Ai%5D=0&genres%5BSlice+of+Life%5D=0&genres%5BSmut%5D=0&genres%5BSports%5D=0&genres%5BSupernatural%5D=0&genres%5BTragedy%5D=0&genres%5BWebtoons%5D=0&genres%5BYaoi%5D=0&genres%5BYuri%5D=0&released_method=eq&released=&rating_method=eq&rating=&is_completed=&advopts=1&sort=rating&order=za`, {
            // this is used to make sure result are shown
            header: x('#listing th', [{
                title: 'a',
            }]),
            // get all results
            list: x('#mangalist li', [{
                title: '.title',
                imageUrl: 'img@src',
                url: '.title@href'
            }])
        })(function (err, result) {
            if (err) {
                reject(err);
            } else if (result.header.length === 0) {
                reject(Error('Sorry, can‘t search again within 5 seconds.'));
            } else {
                resolve(result.list);
            }
        });
    });
}

function promiseWithDelay(promise, timeout) {
    return new Promise((resolve, reject) => {
        promise.then((result) => {
            setTimeout(() => {
                resolve(result);
            }, timeout);
        }).catch((err) => {
            setTimeout(() => {
                reject(err);
            }, timeout);
        });
    });
}

function promiseWithRetry(promise, max, timeout) {
    // console.log("promiseWithRetry()", promise, max, timeout);
    return new Promise((resolve, reject) => {
        promiseWithDelay(promise, timeout)
            .then((result) => {
                // console.log("finished on 1st try");
                resolve(result);
            })
            .catch((err) => {
                const newMax = (max - 1);
                if (newMax > 0) {
                    // console.log("failed " + newMax + " tries left");
                    promiseWithRetry(promise, newMax, timeout * 2)
                        .then((result) => {
                            resolve(result);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reject(err);
                }
            });
    });
}


module.exports = {
    scrapeChapterPages,
    scrapeMangaInfo,
    scrapeSearch,
};
