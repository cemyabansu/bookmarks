var express = require('express');
var User = require('../models/user');
var Item = require('../models/item');
var Folder = require('../models/folder');

var folderRouter = express.Router();

var addFolder = function(req,res){
  console.log("Add folder request. Date :" + Date.now());
  //getting folder name and password
  var reqUserId = req.body.userid;
  var reqFolderName = req.body.foldername;

  //controlling values
  if (!reqUserId || !reqFolderName || !reqUserId === "" || reqFolderName === "") {
    console.log("Request body : " + reqUserId + " - " + reqFolderName);
    res.sendStatus(400);
    return;
  }

  User.findOne({ _id: reqUserId }, function (err, returnedUser) {
      if(err === null && returnedUser !== null){
        console.log("User found : " + returnedUser._id);
        var user = returnedUser;
        var newFolder = new Folder({
          name : reqFolderName,
          userid : user._id
        });

        newFolder.save( function ( err, newFolder ){
          if(!err){
            res.status(200).json(newFolder._id);
            console.log("New folder added. folder name : "+ newFolder.name + ", userid : " + newFolder.userid);
          }
          else{
            res.status(400).json(err.message);
            console.error('Error occured when trying to save the user to db. Error :' + err.message);
          }
        });
      }else{
        res.status(400).json("User not found!");
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

var getFolders = function(req,res){
  console.log("Get all folders request. Date :" + Date.now());

  if (!req.query.userid) {
    res.sendStatus(400);
    return;
  }

  Folder.find({ userid: req.query.userid }, function (err, returnedFolders) {
      if(err === null && returnedFolders !== null){
          res.status(200).json(returnedFolders);
      }else{
          res.sendStatus(400);
      }
    });
}

var deleteFolder = function(req,res){
  console.log("Delete folder request. Date :" + Date.now());

  if (!req.query.folder_id) {
    res.sendStatus(400);
    console.log("missing parameters. : " + res.query.folder_id);
    return;
  }

  //deleting all child items
  Item.find({ folderid: req.query.folder_id }, function(err, items){
      if (err !== null) {
        return;
      }
      for (var i = 0; i < items.length; i++) {
        items[i].remove();
      }
  });

  Folder.remove({ _id: req.query.folder_id }, function (err) {
      if(err === null){
        res.sendStatus(200);
      }else{
        console.log("Error occured : " + err);
        res.sendStatus(400);
      }
    });
}

var UpdateFolder = function(req,res){
  console.log("Update folder request. Date :" + Date.now());

  var reqFolderId = req.body.folderid;
  var reqFolderName = req.body.foldername;

  //controlling values
  if (!reqFolderId || !reqFolderName || !reqFolderId === "" || reqFolderName === "") {
    console.log("Request body : " + reqFolderId + " - " + reqFolderName);
    res.sendStatus(400);
    return;
  }

  Folder.findOne({ _id: reqFolderId }, function (err, returnedFolder) {
      if(err === null && returnedFolder !== null){
        //change folder name
        returnedFolder.name = reqFolderName

        //save folder with changes
        returnedFolder.save(function(err){
          if (err) {
            res.sendStatus(400);
          }else {
            res.sendStatus(200);
          }
        });
      }else{
        res.sendStatus(400);
      }
    });
}

folderRouter.post('/add', addFolder);

folderRouter.use('/getall', getFolders);

folderRouter.use('/get', getFolder);

folderRouter.get('/delete', deleteFolder);

folderRouter.post('/update', UpdateFolder);

module.exports = folderRouter;
