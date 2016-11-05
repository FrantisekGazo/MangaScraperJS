const path = require('path');
const fs = require('fs');
const imgDownloader = require('image-downloader');


const downloadImage = (url, filePath) => {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        const options = {
            url: url,
            dest: filePath,
            done: function (err, filename, image) {
                if (err) {
                    //console.log('Error', filename);
                    reject(err);
                } else {
                    //console.log('Success', filename);
                    resolve(filename);
                }
            },
        };
        imgDownloader(options);
    });
};

const downloadImages = (urls, dirPath) => {
    let i = 0;
    const downloads = urls.map(url => {
        const filePath = path.join(dirPath, `${++i}.jpg`);
        return downloadImage(url, filePath);
    });
    return Promise.all(downloads);
};


module.exports = {
    downloadImage,
    downloadImages
};
