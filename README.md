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