var express = require('express');
var User = require('../models/user');
var Folder = require('../models/folder');

var folderRouter = express.Router();

var addFolder = function(req,res){
  console.log("Add folder request. Date :" + Date.now());

  //getting folder name and password
  var reqUserName = req.query.username;
  var reqFolderName = req.query.foldername;

  //controlling values
  if (!reqUserName || !reqFolderName || !reqUserName === "" || reqFolderName === "") {
    res.sendStatus(400);
    return;
  }

  User.findOne({ username: reqUserName }, function (err, returnedUser) {
      if(err === null && returnedUser !== null){
        console.log("User found : " + returnedUser._id);
        var user = returnedUser;
        var newFolder = new Folder({
          name : reqFolderName,
          userid : user._id
        });

        newFolder.save( function ( err, newFolder ){
          if(!err){
            res.sendStatus(200);
            console.log("New folder added. folder name : "+ newFolder.name + ", userid : " + newFolder.userid);
          }
          else{
            res.status(400).json(err.message);
            console.error('Error occured when trying to save the user to db. Error :' + err.message);
          }
        });
      }else{
        console.log("User not found!");
      }
    });
}

var getFolder = function(req,res){
  console.log("Get folder request. Date :" + Date.now());

  if (!req.query.folderid) {
    res.sendStatus(400);
    return;
  }

  Folder.findOne({ _id: req.query.folderid }, function (err, returnedFolder) {
      if(err === null && returnedFolder !== null){
          res.status(200).json(returnedFolder);
      }else{
          res.sendStatus(400);
      }
    });
}

folderRouter.use('/add', addFolder);

folderRouter.use('/get', getFolder);

module.exports = folderRouter;
