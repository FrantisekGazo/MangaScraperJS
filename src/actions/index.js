"use strict";

module.exports.createAction = function (type, payload=null) {
    return {type, payload}
};
