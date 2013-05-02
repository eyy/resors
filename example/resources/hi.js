var Resors = require('../../');

var hi = module.exports = new Resors('hi', {
        allow: [ 'post', 'get' ]
    }
);

hi.create = function(req, res) {
    res.json('hi');
};