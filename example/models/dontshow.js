var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var schema = new mongoose.Schema({
    title: { type: String }
});
schema.methods.toString = function(){
    return this.title;
};
var model = module.exports = mongoose.model('dontshow', schema);

model.resors = false;