var Resors = require('./resors'),
    MongooseResors = require('./mongoose'),
    express = require.main.require('express'),
    mongoose;

try {
    mongoose = require.main.require('mongoose');
}
catch(e) {
    mongoose = { models: [] };
}

module.exports = Resors;
Resors.MongooseResors = MongooseResors;

Resors.middleware = function(resources) {
    resources || (resources = mongoose.models);

    var app = express(),
        resors = Object.keys(resources)
        .filter(function(path) {
            var r = resources[path];
            return false !== r.resors && r.modelName[0] !== '_';
        })
        .map(function(path) {
            var r = resources[path],
                name = r.modelName;

            if (r.modelName)
                r = new MongooseResors(r, r.resors || {});

            else if (!r.routes)
                r = new Resors(path, r);

            r.routes(app);
            return r;
        });

    app.get('/', function(req, res) {
        res.json({
            resources: resors.map(function(resource) {
                return {
                    name: resource.path,
                    url: req.protocol + '://' + req.host + req.originalUrl.replace(/\/$/, '') + req.route.path + resource.path,
                    methods: resource.options.methods,
                    filtering: resource.options.filtering,
                    fields: resource.options.fields
                };
            })
        });
    });

    return app;
};