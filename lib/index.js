var Resors = require('./resors'),
    MongooseResors = require('./mongoose');

module.exports = Resors;
Resors.MongooseResors = MongooseResors;

Resors.middleware = function(express, resources) {
    var app = express();

    app.get('/', function(req, res) {
        res.json({
            resources: Object.keys(resources)
        });
    });

    Object.keys(resources).forEach(function(path) {
        var r = resources[path];

        if (r.modelName)
            r = new MongooseResors(r, r.resors || {});

        else if (!r.routes)
            r = new Resors(path, r);

        r.routes(app);
    });

    return app;
};