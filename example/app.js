var express = require('express'),
    http = require('http'),
    path = require('path'),
    models = require('./models'),
    mongoose = require('mongoose'),
    resors = require('../');

var app = express();

app.set('site', 'resors');
app.set('port', 80);
app.set('mongo', 'mongodb://localhost/resors');
app.set('admin', { username: 'admin', password: 'admin'});


app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('magical resors'));
app.use(express.cookieSession({cookie: { maxAge: 60 * 1000 * 20 }}));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// formage-admin
require('formage-admin').init(app, express, require('./models'), {
    title: app.get('site') + ' Admin'
});

// mock user
app.use(function(req, res, next) {
    req.user = { name: 'me', admin: true };
    next();
});

mongoose.connect(app.get('mongo'));

// resors middleware
// you can pass resources list ( see 'examples/index.js' )
// if is omitted, resors will look in mongoose models
app.use('/api', resors.middleware());

// with resource list
//app.use('/api', resors.middleware(require('./')));

app.get('/', function(req, res) {
    res.redirect('/api');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port'));
});