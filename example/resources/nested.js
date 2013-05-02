var Resors = require('../../');

var nested = module.exports = new Resors('hi/nested');

nested.index = function(req, res) {
    res.json({i: 'am nested.'});
};