const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    //comment belongs to a user
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    },
    //including the array of all the ids of like on the comment
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Like'
        }
    ],
}, {
    timestamps : true
});

const Comment = mongoose.model('Comment', commentSchema); //creating the Comment Schema

module.exports = Comment;