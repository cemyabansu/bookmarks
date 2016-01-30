var mongoose = require('mongoose');
var relationship = require("mongoose-relationship");
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
        folderid  : {type: Schema.ObjectId, ref:"Folder", childPath:"items"},
        name      : String,
        value     : String,
        createdon : {type: Date, default: Date.now}
    });
ItemSchema.plugin(relationship, { relationshipPathName:'folderid' });
module.exports = mongoose.model('Item', ItemSchema);
