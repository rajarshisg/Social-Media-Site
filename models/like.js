const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    //this refers to the user id of the user who is liking the post/comment
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    //this refers to the object id which is liked (Post or Comment)
    likeable : {
        type : mongoose.Schema.ObjectId,
        required : true,
        refPath : 'onModel'
    },
    //this stores the object that is liked, it can be either Post or Comment
    onModel : {
        type : String,
        required : true,
        enum : ['Post', 'Comment'] //restricts the value to either Post or Comment only
    }
}, {
    timestamps : true
});

const Like = mongoose.model('Like', likeSchema); //creating the Like Schema
module.exports = Like;