var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,   //linking the user and comment schema together
            ref:"User"   // The model which we are referencing
        },
        username:String
    }
});

module.exports = mongoose.model("Comment", commentSchema);