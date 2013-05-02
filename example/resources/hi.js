var Resors = require('../../');

var hi = module.exports = new Resors('hi', {
        allow: [ 'post' ]
    }
);

hi.create = function(req, res) {
    res.json('hi');
};