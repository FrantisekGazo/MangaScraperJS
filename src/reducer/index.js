const { combineReducers } = require("redux");

const counter = require("./counter");


module.exports = combineReducers({
    counter
});
