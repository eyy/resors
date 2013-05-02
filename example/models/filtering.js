var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var schema = new mongoose.Schema({
    title: { type: String },
    name: { first : String, last: String },
    limit: String
});
schema.methods.toString = function(){
    return this.title;
};
var filtering = module.exports = mongoose.model('filtering', schema);

filtering.resors = {
    allow: [ 'get', 'post', 'put', 'delete' ]
};