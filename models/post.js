const mongoose = require('mongoose');
const path = require('path');

const postSchema = mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    
    user : {
        type : mongoose.Schema.Types.ObjectId, //refers to the users unique object id
        ref : 'User'
    },

    //include the array of all the ids of all comments in the posts schema itself
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ],
    //including the array of all the ids of like on the post
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Like'
        }
    ],
}, {
    timestamps : true
});

const Post = mongoose.model('Post', postSchema); //creating the Post Schema
module.exports = Post;