var Resors = require('./resors'),
    extend = require('xtend');

/*
 Mongoose Resors Class
 */
var MongooseResors = module.exports = function(model, options) {
    this.model = model;
    this.path = model.modelName;
    this.options = extend(Resors.defaults, options);
};
MongooseResors.fn = MongooseResors.prototype = new Resors;
MongooseResors.fn.constructor = MongooseResors;
MongooseResors.fn.query = function(q) {
    var o = this.options;

    if (o.fields)
        q = q.select(o.fields);

    return q;
};
MongooseResors.fn.index = function(req, res, next) {
    res.query = this.query(this.model.find());

    /*
        TODO:
            offset, limit
            filter
            sorting
     */

    next();
};
MongooseResors.fn.show = function(req, res, next) {
    res.query = this.query(this.model.findById(req.params.id));
    next();
};
MongooseResors.fn.create = function(req, res, next) {
    this.model.create(req.body, function(err, result) {
        res.err = err;
        res.result = result;
        next();
    });
};
MongooseResors.fn.update = function(req, res, next) {
    console.log(req.body);
    res.query = this.query(this.model.findByIdAndUpdate(req.params.id, req.body));
    next();
};
MongooseResors.fn.destroy = function(req, res, next) {
    res.query = this.model.findByIdAndRemove(req.params.id);
    next();
};
MongooseResors.fn.exec = function(req, res, next) {
    res.query.exec(function(err, result) {
        delete res.query;
        res.err = err;
        res.result = result;
        next();
    });
};
