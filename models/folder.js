var mongoose = require('mongoose');
var relationship = require("mongoose-relationship");
var Schema = mongoose.Schema;

var FolderSchema = new Schema({
        name      : String,
        userid    : {type: Schema.ObjectId, ref:"User", childPath:"folders"},
        items     : [{type:Schema.ObjectId, ref:"Item"}]
    });
FolderSchema.plugin(relationship, { relationshipPathName:'userid' });

module.exports = mongoose.model('Folder', FolderSchema);
