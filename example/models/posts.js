var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types,
    MongooseResors = require('../../').MongooseResors;

var schema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    user: { type: Types.ObjectId, ref: 'users' }
});
schema.methods.toString = function(){
    return this.title;
};
var model = module.exports = mongoose.model('posts', schema);


/*
    Resors
 */
var r = model.resors = new MongooseResors(model, {
    query: function(req, res, next) {
        res.query = res.query.populate('user');
        next();
    }
});

r.index = function(req, res, next) {
    res.json('No.');
};