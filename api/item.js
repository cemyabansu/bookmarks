var express = require('express');
var Item = require('../models/item');
var mongoose = require('mongoose');

var itemRouter = express.Router();

var addItem = function(req,res){
  console.log("Add item request. Date :" + new Date().toLocaleString());

  var reqName = req.body.itemname;
  var reqValue = req.body.itemvalue;
  var reqFolderid = req.body.folderid;

  //TODO : check if folder exist
  if (!reqName || reqName === "" || !reqValue || reqValue === "" || !reqFolderid || reqFolderid === "") {
    console.log(reqName +" - "+ reqValue + " - " + reqFolderid);
    res.sendStatus(400);
    return;
  }

  var newItem = new Item({
    name : reqName,
    value : reqValue,
    folderid : mongoose.Types.ObjectId(reqFolderid)
  });

  newItem.save( function ( err, newItem ){
    if (!err) {
      res.status(200).json(newItem._id);
      console.log("New item added. item name : "+ newItem.name + ", value : " + newItem.value);
    }
    else {
      res.status(400).json(err.message);
      console.error('Error occured when trying to save the item to db. Error :' + err.message);
    }
  });
}

var getItem = function(req,res){
  console.log("Get item request. Date :" + Date.now());

  if (!req.query.itemid) {
    res.sendStatus(400);
    return;
  }

  Item.findOne({ _id: req.query.itemid }, function (err, returnedItem) {
      if(err === null && returnedItem !== null){
          res.status(200).json(returnedItem);
      }else{
          res.sendStatus(400);
          console.log("Item not found. Err :" + err.message);
      }
    });
}

var getAllItems = function(req,res){
  console.log("Get all items request. Date :" + Date.now());

  if (!req.query.folderid) {
    res.sendStatus(400);
    console.log("Bad request. Parameter missing.");
    return;
  }

  Item.find({ folderid: req.query.folderid }, function (err, returnedItems) {
      if(err === null && returnedItems !== null){
          res.status(200).json(returnedItems);
      }else{
          res.sendStatus(400);
          console.log("Error returned from db.");
      }
    });
}

var deleteItem = function(req,res){
  console.log("Delete item request. Date :" + Date.now());

  if (!req.query.itemid) {
    res.sendStatus(400);
    console.log("missing parameters. : " + res.query.itemid);
    return;
  }

  Item.remove({ _id: req.query.itemid }, function (err) {
      if(err === null){
        res.sendStatus(200);
      }else{
        console.log("Error occured : " + err);
        res.sendStatus(400);
      }
    });
}

itemRouter.post('/add', addItem);

itemRouter.use('/get', getItem);

itemRouter.get('/getall', getAllItems);

itemRouter.get('/delete', deleteItem)

module.exports = itemRouter;
