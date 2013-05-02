var Resors = require('./resors'),
    MongooseResors = require('./mongoose'),
    mongoose = require.main.require('mongoose'),
    express = require.main.require('express');

module.exports = Resors;
Resors.MongooseResors = MongooseResors;

Resors.middleware = function(resources) {
    resources || (resources = mongoose.models);

    var app = express();

    app.get('/', function(req, res) {
        var r = [];

        Object.keys(resources).forEach(function(path){
            var resource = resources[path],
                name = resource.modelName;

            if (name && false === resource.resors)
                return;

            var o = {};
            o.name = path;
            o.url = req.protocol + '://' + req.host + req.originalUrl.replace(/\/$/, '') + req.route.path + (resource.modelName ? path : resource.path);
            o.methods = name ? (resource.resors && resource.resors.allow || Resors.defaults.allow) : resource.options.allow;
            o.filtering = name ? (resource.resors && resource.resors.filtering || Resors.helpers.paths(resource)) : resource.options.filtering;
            o.fields = name ? (resource.resors && resource.resors.fields || Resors.helpers.paths(resource)) : resource.options.fields;

            r.push(o);
        });

        res.json({
            resources: r
        });
    });

    Object.keys(resources).forEach(function(path) {
        var r = resources[path];

        if (r.modelName && false !== r.resors)
            r = new MongooseResors(r, r.resors || {});

        else if (!r.routes)
            r = new Resors(path, r);

        r.routes(app);
    });

    return app;
};