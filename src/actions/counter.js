const {createAction} = require('./index');


const INCREMENT = 'INCREMENT';
module.exports.INCREMENT = INCREMENT;

module.exports.increment = function() {
    return createAction(INCREMENT)
};