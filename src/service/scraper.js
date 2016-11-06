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


const scrapeChapterPages = (startUrl) => {
    return new Promise(function (resolve, reject) {
        x(startUrl, '#image@src')
            .paginate('.next_page@href | MF_pageHref')
            ((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const images = result.filter(url => url && url.endsWith('.jpg'));
                    resolve(images);
                }
            });
    });
};

const scrapeMangaInfo = (mangaId) => {
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

                resolve(result);
            }
        });
    });
};

module.exports = {
    scrapeChapterPages,
    scrapeMangaInfo
};
