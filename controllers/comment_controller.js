const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post_id);
        if(post){
            let comment = await Comment.create({
                content : req.body.content, 
                post : req.body.post_id,
                user : req.user._id,
            });
            
            post.comments.push(comment);
            post.save();
            comment = await comment.populate('user').execPopulate();
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }
            req.flash('success', 'Comment added!');
            res.redirect('/');
        }
    }catch(err){
        console.log('Error in creating comment!');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            
            await Post.findByIdAndUpdate(postId, { $pull: {comments : req.params.id}});
            //await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            comment.remove();
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            return user.redirect('back');
        }
    }catch(err){
        console.log('Error in destroying the comment!');
    }
} 