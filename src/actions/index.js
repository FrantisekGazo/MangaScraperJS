module.exports.createAction = function (type, mangaId, payload=null) {
    return {type, mangaId, payload}
};
