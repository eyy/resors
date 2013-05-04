var testCase = require('nodeunit').testCase;

var mongoose = require('mongoose'),
    express = require('express'),
    Resors = require('../'),
    MongooseResors = Resors.MongooseResors;

// mongoose
mongoose.connect('mongodb://localhost/resors-test');
var users = mongoose.model('users', {
    name: { type: String, required: true },
    email: String
});
users.create({ name: 'Paul' });

// tests
module.exports = testCase({
    "0": function (test) {
        test.ok(true);
        test.done();
    },

    "simple mongoose model": function(test) {
        var app = express();
        var r = new MongooseResors(users, users.resors);
        r.routes(app);
        test.done();
    }
});
