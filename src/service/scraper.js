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
    // Return a new promise.
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

module.exports = {
    scrapeChapterPages
};
