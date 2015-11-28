var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var relationship = require("mongoose-relationship");

var api = require('./api/api.js');
var router = require('./controllers/router');

mongoose.connect('mongodb://DbUser:Tt12345@ds035975.mongolab.com:35975/heroku_sxk4bdc2', function (error) {
    if (error) console.error(error);
    else console.log('Connected to mongodb.');
});

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', router.Index);

app.use('/api', api);

//If there is no proper response, show error page
app.get('*', router.Error);

var port = process.env.PORT || 8090;
app.listen(port);
