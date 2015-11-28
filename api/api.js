var express = require('express');
var folder = require('./folder.js');
var item = require('./item.js');
var user = require('./user.js');

var api = express.Router();

api.use('/user',user);

api.use('/folder',folder);

api.use('/item', item);

module.exports = api;
