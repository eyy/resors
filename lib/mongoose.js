var Resors = require('./resors'),
    extend = require('xtend'),
    util = require('util');

/*
 Mongoose Resors Class
 */
var MongooseResors = module.exports = function (model, options) {
    Resors.call(this, model.modelName, options);
    this.model = model;
    this.options.filtering || (this.options.filtering = Resors.helpers.paths(this.model));
};
util.inherits(MongooseResors, Resors);
MongooseResors.fn = MongooseResors.prototype;
MongooseResors.fn.query = function (q) {
    // fields
    if (this.options.fields)
        q = q.select(this.options.fields.join(' '));

    return q;
};
MongooseResors.fn.index = function (req, res, next) {
    res.query = this.query(this.model.find());

    // filtering
    // ?path=value&path=value
    // if path is the same will compile or query
    this.options.filtering.forEach(function (path) {
        if (path in req.query) {
            if (!~['limit', 'offset', 'sort', '_id'].indexOf(path)) {
                var val = req.query[path];
                if (Array.isArray(val)) {
                    var or = [];

                    val.forEach(function (v) {
                        var o = {};
                        o[path] = v;
                        or.push(o);
                    });

                    res.query.or(or);
                } else {
                    res.query.where(path, val);
                }
            }
        }
    });

    // offset
    if (req.query.offset)
        res.query.skip(req.query.offset);

    // limit
    var limit = req.query.limit || this.options.limit;
    if (limit)
        res.query.limit(limit);

    // sorting
    if (this.options.sort)
        res.query.sort(this.options.sort);

    var sort = req.query.sort;
    if (sort)
        res.query.sort(Array.isArray(sort) ? sort.join(' ') : sort);

    next();
};
MongooseResors.fn.show = function (req, res, next) {
    res.query = this.query(this.model.findById(req.params.id));
    next();
};
MongooseResors.fn.create = function (req, res, next) {
    this.model.create(req.body, function (err, result) {
        res.err = err;
        res.result = result;
        next();
    });
};
MongooseResors.fn.update = function (req, res, next) {
    delete req.body._id;
    res.query = this.query(this.model.findByIdAndUpdate(req.params.id, req.body));
    next();
};
MongooseResors.fn.destroy = function (req, res, next) {
    res.query = this.model.findByIdAndRemove(req.params.id);
    next();
};
MongooseResors.fn.exec = function (req, res, next) {
    res.query.exec(function (err, result) {
        delete res.query;
        res.err = err;
        res.result = result;
        next();
    });
};
