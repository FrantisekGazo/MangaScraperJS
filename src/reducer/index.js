const { combineReducers } = require("redux");

const counter = require("./counter");
const manga = require("./manga");


module.exports = combineReducers({
    counter,
    manga
});
