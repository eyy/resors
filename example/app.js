var express = require('express'),
    http = require('http'),
    path = require('path'),
    models = require('./models');

var app = express();

app.set('site', 'resors');
app.set('port', 80);
app.set('mongo', 'mongodb://localhost/resors');
app.set('admin', { username: 'admin', password: 'admin'});

// dust
/*app.engine('dust', require('consolidate').dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));
require('dustjs-linkedin').optimizers.format = function(ctx, node) { return node };*/

app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('magical resors'));
app.use(express.cookieSession({cookie: { maxAge: 60 * 1000 * 20 }}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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

require('mongoose').connect(app.get('mongo'));
app.use('/api', require('../')(express, models));
app.get('/', function(req, res) {
    res.redirect('/api');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port'));
});