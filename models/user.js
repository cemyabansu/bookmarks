var mongoose = require('mongoose');
var relationship = require("mongoose-relationship");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
        username  : {type: String, index: {unique: true}},
        password  : String,
        folders   : [{type:Schema.ObjectId, ref:"Folder"}]
    });

module.exports = mongoose.model('User', UserSchema);
