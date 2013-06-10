var extend = require('xtend'),
    slice = [].slice;

/*
 A do-nothing middleware
 */
var middleware = function(req, res, next) {
    next();
};


/*
 Resors Class
 */
var Resors = module.exports = function(path, options) {
    this.path = path;
    this.options = extend(Resors.defaults, options);
};
Resors.fn = Resors.prototype;
Resors.fn.finish = function(req, res) {
    if (res.err) {
        if (res.err.path) {
            var errors = {};
            errors[res.err.path] = res.err;
            res.err = { errors: errors };
        }
        res.status(500).json(res.err);
    }
    else
        res.json(res.result);
};
Resors.fn.middlewares = function(route) {
    var self = this;

    return [
        function(req, res, next) {
            req.resors = extend({}, self.options, {
                method: function() {
                    return ~(slice.call(arguments)).indexOf(req.method.toLowerCase())
                },
                errors: []
            });
            next();
        },
        this.options.before,
        function(req, res, next) {
            var resors = req.resors;
            if (!~resors.allow.indexOf(req.method.toLowerCase()))
                return res.status(403).end('Forbidden.');

            if (false === res.authenticated)
                return res.status(401).end('Unauthorized.');

            if (resors.errors.length)
                return res.status(500).json({
                    errors: resors.errors.reduce(function(seed, err) { seed[err[0]] = { message: err[1] }; return seed; }, {})
                });

            if (resors.method('post'))
                res.status(201);

            next();
        },
        this[route] || function(req, res) {
            res.status(404).end('No such route.');
        },
        (~[ 'index', 'show' ].indexOf(route) ? this.options.query : middleware),
        ('create' != route ? this.exec : middleware),
        this.options.after,
        this.finish
    ].map(function(m) { return m ? m.bind(self) : middleware });
};
Resors.fn.routes = function(app) {
    var path = this.path;

    app.get('/' + path,             this.middlewares('index'));
    app.get('/' + path + '/:id',    this.middlewares('show'));
    app.post('/' + path + '',       this.middlewares('create'));
    app.put('/' + path + '/:id',    this.middlewares('update'));
    app.delete('/' + path + '/:id', this.middlewares('destroy'));
};



/*
 Resors defaults
 */
Resors.defaults = {
    allow: [ 'get' ],
    before: middleware,
    query: middleware,
    after: middleware,
    limit: 20
};

Resors.helpers = {
    paths: function(model) {
        return Object.keys(model.schema.paths).filter(function(path) {
            return path !== '_id';
        });
    }
};