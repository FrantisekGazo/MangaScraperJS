const INCREMENT = 'INCREMENT';
module.exports.INCREMENT = INCREMENT;

module.exports.increment = function() {
    return {
        type: INCREMENT
    }
};