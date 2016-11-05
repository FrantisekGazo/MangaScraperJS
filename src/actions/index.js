module.exports.createAction = function (type, manga, payload=null) {
    return {type, manga, payload}
};
