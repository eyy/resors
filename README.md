#Resors

> Simply write resource.

**Resors** writes REST resources for your mongoose models. It can be a one-liner, but there are planty of options you can set, and methods you can override, so you get exactly the resources you need.

### Quick Example
You would need an express server, and some mongoose models.
```js
// express
var app = require('express')();

// mongoose
var model = require('mongoose').model('users', {
    name: String,
    email: { type: String, required: true }
});

// resors!
app.use('/api', require('resors').middleware());

// run run run
require('http').createServer(app).listen(80);
```

That's it! On `http://localhost/api` you'd find a list of resources,
and in `http://localhost/api/users` your `users` resource.

### Options
By default, **Resors** only allow GET http method, but enabling other methods is easy, by adding an options object to the model. If you don't want the model having a **Resors**, set `model.resors = false`.
```js
models.resors = {
    allow: [ 'get', 'post', 'put', 'delete' ], // default: ['get']
    fields: ['name', 'email'],
    filtering: [ 'name', 'name.full' ],
    sorting: 'name',
    
    // run this before each request
    before: function(req, res, next) {
        var resors = req.resors;

        // authentication
        if (!req.user.admin)
            res.authenticated = false;

        // validation or sanitation (use mongoose if you can!)
        if (resors.method('put')) {
            if (!req.body.email)
                resors.errors.push(['email', 'Email is required.']);
        }

        next();
    },
    
    // Play with mongoose query on GET requests
    query: function(req, res, next) {
        var q = res.query;

        // authorization
        if (req.user && !req.user.admin) {
            q = q.where('name', req.user.name);
        }

        res.query = q;
        next();
    },
    
    // runs after every request
    after: function(req, res, next) {
        console.log('after', res.result);
        next();
    }
};
```

### Override
Inernally, **Resors** creates a `MongooseResors` instance for each, well, mongoose resource.
If you would like to override some function, you can do this:
```js
var r = model.resors = new MongooseResors(model, {
    // options, same as above
});

r.create = function(req, res, next) {
    req.body.cool_field = 'hi there';
    MongooseResors.fn.create(req, res, next);
};
```

### How does it works?
**Resors** is built on top of express.js, using connect middleware mechanism to function.
Each request falls through the following series of middlewares:
```
init          ...

before        can be set via options
              usage: authentication, validation
              vars: req.resors, req.authenticated

error check   ...

route         (index, show, create, update, delete)

query         can be set via options
              (runs only for `index` and `show`)
              usage: populate, authorization
              vars: res.query

exec          (executes res.query, doesn't runs for `create`)

after         can be set via options
              usage: post-production
              vars: res.err, res.result

finish        (send res.err or err.result)
```
Each middleware receives `req`, `res`, and `next` as params, and `this` is set to the `Resors` instance.
Therefore, `next()` will move to the next middleware, `this.finish(req, res)` will jump to the end,
and `res.json(false)` will, e.g., return a negative response.


Sponsors
---
<a id="stormlogo" href="http://www.jetbrains.com/webstorm/" alt="Smart IDE for web development with HTML Editor, CSS &amp; JavaScript support" title="Smart IDE for web development with HTML Editor, CSS &amp; JavaScript support">
  ![](http://i.imgur.com/ynQ6c.png)
</a>
