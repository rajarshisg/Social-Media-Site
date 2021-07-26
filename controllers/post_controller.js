const { query } = require("express");
const Post = require("../models/post");
const Like = require('../models/like');
const Comment = require("../models/comment");
const User = require("../models/user");
module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content : req.body.content,
            user : req.user._id,
        });

        let user = await User.findById(req.user._id);

        user.posts.push(post);
        user.save();
        if(req.xhr){
            //to send the users name we need to populate it
            post = await post.populate('user', 'name avatar').execPopulate();
            return res.status(200).json({
                data : {
                    post : post
                },
                message : 'Post created!'
            })

        }

        req.flash('success', 'Post published!');
        return res.redirect('back');
    } catch (err) {
        req.flash('error', 'Error in creating post!');
        return res.redirect('back');
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        if (post.user == req.user.id) {
            //Deleting the likes on the post
            await Like.deleteMany({likeable : post, onModel : 'Post'});
            //Deleting the likes on all the comments associated with the post
            await Like.deleteMany({_id : {$in: post.comments}});
            post.remove();
            await Comment.deleteMany({post: req.params.id });
            if(req.xhr){
                return res.status(200).json({
                    data : {
                        post_id : req.params.id
                    },
                    message : 'Post deleted successfully'
                });
            }
            req.flash('success', 'Post deleted successfully!');
            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized to delete the post!');
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in destroying the post');
        return res.redirect('back');
    }

}