const Follow = require('../models/follow');
const User = require('../models/user');

module.exports.toggleFollow = async function(req, res){
    try{
        let fromUser = await User.findById(req.user._id); //the user who sends the follow request
        let toUser = await User.findById(req.query.id); //the user who is to be followed
        //searching for an existing follow
        let existingFollow = await Follow.findOne({
            from_user : fromUser,
            to_user : toUser
        });
        if(existingFollow){
            //if follow already exists we need to unfollow
            fromUser.followed_people.pull(existingFollow._id);
            fromUser.save();
            existingFollow.remove();
        }else{
            let newFollow = await Follow.create({
                from_user : fromUser,
                to_user : toUser
            });
            newFollow = await newFollow.populate('user', 'name').execPopulate();
            fromUser.followed_people.push(newFollow);
            fromUser.save();
        }
        return res.redirect('back');
    }catch(err){
        console.log('Error  occured while liking',err);
    }
}