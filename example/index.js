var extend = require('xtend'),
    models = require('./models'),
    resources = require('./resources');

module.exports = extend(resources, models);