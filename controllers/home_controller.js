const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function(req, res){
    try{
        //populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path : 'comments',
            populate : {
                path : 'user',
            },
            options : {
                sort : {'createdAt' : -1}
            }
        });
        let users = await User.find({});
        let curr_user;
        if(req.user){
            curr_user = await User.findById(req.user._id);

            curr_user = await curr_user.populate({
                path : 'friends',
            })
            .populate({
                path: 'chatRooms',
                populate: {
                    path: 'user'
                }
            })
            .execPopulate();
        }

        return res.render('home', {
            title: "Connecti | Home Page",
            posts : posts,
            all_users : users,
            current_user : curr_user
        });
    }catch(err){
        console.log('Error occured in home controller!');
        return;
    }
    
}