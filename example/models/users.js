var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var schema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true, trim: true, match: /^\w+$/ },
    email: String
});
schema.methods.toString = function(){
    return this.name;
};
schema.statics.checkName = function(value, cb){
    this.count().where('username', value).exec(function(err, count){
        cb(err, count === 0)
    })
};
var users = module.exports = mongoose.model('users', schema);


/*
    Resors
 */
users.resors = {
    allow: [ 'get', 'post', 'put', 'delete' ],
    fields: 'email',
    editable: 'email',  // TODO
    filtering: 'name',  // TODO
    sorting: 'name',    // TODO,
    before: function(req, res, next) {
        var resors = req.resors;

        // Authentication
        if (!req.user)
            return res.redirect('/login');

        // Authorization
        if (!req.user.admin)
            resors.allow = [ 'get' ];

        // Validation or sanitation (use mongoose if you can!)
        if (resors.method('put')) {
            if (!req.body.email)
                resors.errors.push(['email', 'Email is required.']);
        }

        next();
    },
    query: function(req, res, next) {
        var q = res.query;
//        q = q.select('name');

        // Authorization
        if (req.user && !req.user.admin) {
            q = q.where('name', req.user.name);
        }

        res.query = q;
        next();
    },
    after: function(req, res, next) {
//        console.log('after', res.result);
        next();
    }
};
