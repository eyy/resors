#Resors

> Simply write resource.

Introduction
---

Do you want to REST your way to your mongoose models?
Well, **Resors** do exactly that right out of the box.

Synopsis
---

**Resors** operates ontop of Express so you need to create your express app first.

```js
var express = require('express'),
    app = express();
    
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router)
    
http.createServer(app).listen(80, function(){
    console.log('Server listening on port 80' );
});
```

Install Mongoose and write your models as you are usually do.
```js
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true }
})

var model = mongoose.model('users', schema);
```

Now add **Resors**.

```js
var Resors = require('resors');

app.use('/api', Resors.middleware());
```

And that's it! your REST server is on `http://localhost/api` see the list of resources.

**Resors** only allow GET http method out of the box, 
if you want to enable other methods just add to the model:
```js
model.resors = {
  allow = [ 'get', 'post', 'put', 'delete' ];
}
```
If you don't want the model having **Resors**, set `model.resors = false`.

Now you have a full CRUD application with REST :)

Check out `\example\` for more.

Resors middlewares partly-explained
---------------------------

**Resors** is built on top of express.js, using connect middleware mechanism to function.
Each request follows a series of middlewares, as follows:

```
/*
init          X

before        usage: authentication, validation
              vars: req.resors, req.authenticated

error check   X

route         (index, show, create, update, delete)

query         (runs only for `index` and `show`)
              usage: populate, authorization
              vars: res.query

exec          (executes res.query, doesn't runs for `create`)

after         usage: post-production
              vars: res.err, res.result

finish        (send res.err or err.result)
*/
```

Each middleware receives `req`, `res`, and `next` as params, and `this` is set to the `Resors` instance.
Therefore, `next()` will move to the next middleware, `this.finish(req, res)` will jump to the movie end,
and `res.json(false)` will, e.g., return a negative response.


Sponsors
---
<a id="stormlogo" href="http://www.jetbrains.com/webstorm/" alt="Smart IDE for web development with HTML Editor, CSS &amp; JavaScript support" title="Smart IDE for web development with HTML Editor, CSS &amp; JavaScript support">
  ![](http://i.imgur.com/ynQ6c.png)
</a>
