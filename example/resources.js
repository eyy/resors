var Resors = require('../'),
    models = require('./models');

var hi = new Resors('hi');
hi.index = function(req, res) {
    res.json('hi');
};

module.exports = {
    hi: hi,
    users: models.users,
    posts: models.posts
};