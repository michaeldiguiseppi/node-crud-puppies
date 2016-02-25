// *** main dependencies *** //
var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var swig          = require('swig');
var pg            = require('pg');


// *** database *** //
var connectionString = 'postgres://localhost:5432/pound';



// *** routes *** //
var routes = require('./routes/index.js');


// *** express instance *** //
var app = express();




// *** view engine *** //
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


// *** main routes *** //

// Return ALL puppies //

app.get('/api/puppies/:id?', function(req, res, next) {
  var id = req.params.id;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      res.status(500)
        .json({
          status: 'Error',
          message: 'Something bad happened'
        });
      done();
    }
    if (id) {
      var query = client.query('SELECT * FROM puppies WHERE id = '+id);
    } else {
      var query = client.query('SELECT * FROM puppies');
    }
    var puppyArr = [];

    query.on('row', function(row) {
        puppyArr.push(row);
    });

    query.on('end', function() {
        done();
        if (puppyArr.length > 0) {
          res.json(puppyArr);
        } else {
          res.json({status: 'Sorry', message: 'The Pound is Empty.  Go Home.'});
        }

        pg.end();
    });
  });
});

// insert one puppy //

app.post('/api/puppies', function(req, res, next) {

  console.log(req.body);
  var newPuppy = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      res.status(500)
        .json({
          status: 'Error',
          message: 'Something bad happened'
        });
      done();
    }
    var query = client.query("INSERT INTO puppies (name, breed, age, sex) VALUES ('"+newPuppy.name+"','"+newPuppy.breed+"', "+newPuppy.age+", '"+newPuppy.sex+"')");

    query.on('end', function() {
        done();
        res.json({status: 'Success', message: 'Inserted new Puppy into the pound!'});
        pg.end();
    });
  });
});

// delete a puppy //

app.delete('/api/puppy/:id', function(req, res, next) {
  var id = req.params.id;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      res.status(500)
        .json({
          status: 'Error',
          message: 'Something bad happened'
        });
      done();
    }

      var query = client.query('DELETE FROM puppies WHERE id = '+id);

    query.on('end', function() {
        done();
        res.json({status: 'Success', message: 'Killed Puppy!'});
        pg.end();
    });
  });
});

// update a puppy //

app.put('/api/puppy/:id', function(req, res, next) {
  var id = req.params.id;
  var column = req.body.column;
  var newVal = req.body.value;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      res.status(500)
        .json({
          status: 'Error',
          message: 'Something bad happened'
        });
      done();
    }

      var query = client.query("UPDATE puppies SET "+column+" = '"+newVal+"' WHERE id = "+id);

    query.on('end', function() {
        done();
        res.json({status: 'Success', message: 'Updated Puppy!'});
        pg.end();
    });
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
