const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
    //refers to the user who followed another user
    from_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    //refers to the user who is being followed
    to_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});

const Follow = mongoose.model('Follow', followSchema);
module.exports = Follow;