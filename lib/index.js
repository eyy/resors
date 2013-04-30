var Resors = require('./resors');

var resors = module.exports = function(express, models) {
    var app = express();

    app.get('/', function(req, res) {
        res.json({
            models: Object.keys(models)
        });
    });

    Object.keys(models).forEach(function(name) {
        var resource = Resors.fetch(models[name]);
        resource.routes(app);
    });

    return app;
};
resors.Resors = Resors;