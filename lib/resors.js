var extend = require('xtend');

/*
 A do-nothing middleware
 */
var middleware = function(req, res, next) {
    next();
};


/*
 Resors Class
 */
var Resors = module.exports = function(model, options) {
    this.model = model;
    this.name = model.modelName;
    this.options = extend(Resors.defaults, options);

    Resors.register(this);
};
Resors.fn = Resors.prototype;
Resors.fn.index = function(req, res, next) {
    res.query = this.model.find();
    next();
};
Resors.fn.show = function(req, res, next) {
    res.query = this.model.findById(req.params.id);
    next();
};
Resors.fn.create = function(req, res, next) {
    this.model.create(req.body, function(err, result) {
        res.err = err;
        res.result = result;
        next();
    });
};
Resors.fn.update = function(req, res, next) {
    res.query = this.model.findByIdAndUpdate(req.params.id, req.body);
    next();
};
Resors.fn.destroy = function(req, res, next) {
    res.query = this.model.findByIdAndRemove(req.params.id);
    next();
};
Resors.fn.exec = function(req, res, next) {
    res.query.exec(function(err, result) {
        delete res.query;
        res.err = err;
        res.result = result;
        next();
    });
};
Resors.fn.finish = function(req, res) {
    if (res.err)
        res.status(400).json(res.err);
    else
        res.json(res.result);
};
Resors.fn.middlewares = function(route) {
    var self = this;

    return [
        function(req, res, next) {
            req.resors = extend({}, self.options, {
                validation: ~[ 'POST', 'PUT' ].indexOf(req.method),
                errors: []
            });
            next();
        },
        this.options.before,
        function(req, res, next) {
            var resors = req.resors;
            if (!~resors.allow.indexOf(req.method.toLowerCase()))
                return res.status(403).end('No permissions.');

            if (resors.errors.length)
                return res.status(400).json({
                    errors: resors.errors.reduce(function(seed, err) { seed[err[0]] = { message: err[1] }; return seed; }, {})
                });

            next();
        },
        this[route],
        (~[ 'index', 'show' ].indexOf(route) ? this.options.query : middleware),
        ('create' != route ? this.exec : middleware),
        this.options.after,
        this.finish
    ].map(function(m) { return m.bind(self) });
};
Resors.fn.routes = function(app) {
    var name = this.name;

    app.get('/' + name,             this.middlewares('index'));
    app.get('/' + name + '/:id',    this.middlewares('show'));
    app.post('/' + name + '',       this.middlewares('create'));
    app.put('/' + name + '/:id',    this.middlewares('update'));
    app.delete('/' + name + '/:id', this.middlewares('destroy'));
};


/*
 Resors Registry
 */
var resources = {};
Resors.register = function(resource) {
    resources[resource.name] = resource;
};
Resors.fetch = function(model) {
    var name = model.modelName;

    if (resources[name])
        return resources[name];
    else
        return new Resors(model, model.resors);
};
Resors.defaults = {
    allow: [ 'get' ],
    before: middleware,
    query: middleware,
    after: middleware
};