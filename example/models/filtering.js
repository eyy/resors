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
var model = module.exports = mongoose.model('filtering', schema);

model.resors = {
    allow: [ 'get', 'post', 'put', 'delete' ]
};