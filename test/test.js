var mongoose = require('mongoose'),
    express = require('express'),
    Resors = require('../'),
    MongooseResors = Resors.MongooseResors;

// mongoose
mongoose.connect('mongodb://localhost/resors-test');
var User = mongoose.model('users', {
    name: { type: String, required: true },
    email: String
});

// test
var app = express();
var r = new MongooseResors(User, User.resors);
r.routes(app);
console.log(r instanceof MongooseResors);
console.log(r instanceof Resors);