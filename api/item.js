var express = require('express');
var Item = require('../models/item');

var itemRouter = express.Router();

var addItem = function(req,res){
  console.log("Add item request. Date :" + new Date().toLocaleString());

  var reqName = req.query.itemname;
  var reqValue = req.query.itemvalue;
  var reqFolderid = req.query.folderid;

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
      res.sendStatus(200);
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

itemRouter.use('/add', addItem);

itemRouter.use('/get', getItem);

module.exports = itemRouter;
