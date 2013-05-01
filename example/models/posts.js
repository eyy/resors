var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var schema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    user: { type: Types.ObjectId, ref: 'users' }
});
schema.methods.toString = function(){
    return this.title;
};
var posts = module.exports = mongoose.model('posts', schema);


/*
    Resors
 */
posts.resors = {
    query: function(req, res, next) {
        res.query = res.query.populate('user');
        next();
    }
};