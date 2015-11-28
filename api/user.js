var express = require('express');
var User = require('../models/user');

var userHandler = express.Router();

var addUser = function(req,res){
  console.log("New user request. Date :" + Date.now());

  //getting user name and password
  var reqUserName = req.query.username;
  var reqPassword = req.query.password;

  //controlling values
  if (!reqUserName || !reqPassword || !reqUserName === "" || reqPassword === "") {
    var emptyValuesError = {};
    emptyValuesError.code = 10000;
    emptyValuesError.message = "Username and Password must contain data!";
    res.status(404).json(emptyValuesError);
    return;
  }

  //creating new user
  var newUser = new User({
    username : reqUserName,
    password : reqPassword
  });
  console.log("New user request : "+ newUser.username + " : " + newUser.password);

  newUser.save( function ( err, newUser ){
    if(!err){
      res.status(200).json("OK");
      console.log("New user added. User name : "+ newUser.username);
    }
    else{
      if (err.code === 11000) {
        var duplicateError = {};
        duplicateError.code = 11000;
        duplicateError.message = "Username is already exist!";
        res.status(404).json(duplicateError);
        return;
      }
      res.status(404).json(err.message);
      console.error('Error occured when trying to save the user to db. Error :' + err.message);
    }
  });
}

var getUser = function(req,res){
  console.log("Get user request. Date :" + Date.now());
  var reqUserName = req.query.username;
  User.findOne({ username: reqUserName }, function (err, returnedUser) {
      if(err === null && returnedUser !== null){
          res.status(200).json(returnedUser);
      }else{
          res.sendStatus(400);
      }
    });
}


userHandler.use('/add', addUser);

userHandler.use('/get', getUser);

module.exports = userHandler;
